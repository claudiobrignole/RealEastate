import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/firebase-server';
import { collection, query, where, getDocs, limit, addDoc, serverTimestamp } from 'firebase/firestore/lite';

export const dynamic = 'force-dynamic';

const VERIFY_TOKEN = 'zeroagenzia_meta_secure_webhook_2026';
const LEGACY_VERIFY_TOKEN = 'unitleads_meta_secure_webhook_2026';

async function processMetaWebhook(body: any) {
  try {
    const entries = body.entry || [];
    for (const entry of entries) {
      const changes = entry.changes || [];
      for (const change of changes) {
        if (change.field === 'leadgen') {
          const leadgenId = change.value.leadgen_id;
          if (!leadgenId) continue;

          console.log(`Processing Meta Leadgen ID: ${leadgenId}`);

          // 1. Resolve TenantId and Page-specific token Deterministically
          const pageId = change.value.page_id;
          if (!pageId) {
            console.error('Meta webhook payload missing page_id');
            continue;
          }

          const tenantsQuery = query(
            collection(serverDb, 'tenants'),
            where('metaPageId', '==', pageId),
            limit(1)
          );
          const tenantsSnapshot = await getDocs(tenantsQuery);

          if (tenantsSnapshot.empty) {
            console.error(`No tenant found configured for Meta Page ID: ${pageId}`);
            continue;
          }
          const tenantDoc = tenantsSnapshot.docs[0];
          const tenantId = tenantDoc.id;
          const tenantData = tenantDoc.data();

          const token = tenantData?.metaAccessToken || process.env.META_ACCESS_TOKEN;
          if (!token) {
            console.error(`Meta Access Token is missing for Page ID: ${pageId} (Tenant ID: ${tenantId})`);
            continue;
          }

          let leadData;
          if (leadgenId.startsWith('mock_') || leadgenId.startsWith('test_') || token.startsWith('EAAx9482_SYSTEM_USER_PERMANENT_TOKEN_MOCK_')) {
            // Simulated Lead generated from the admin developer console
            const mockFields = change.value.mock_data || {};
            leadData = {
              id: leadgenId,
              campaign_name: mockFields.campaignName || 'Campagna Social Luxury Villa',
              ad_name: mockFields.adName || 'Ad 1 - Vista Lago Splendida',
              field_data: [
                { name: 'email', values: [mockFields.email || 'test-lead@unitleads.it'] },
                { name: 'full_name', values: [mockFields.name || 'Mario Rossi (Test)'] },
                { name: 'phone_number', values: [mockFields.phone || '+39 347 1122334'] }
              ]
            };
          } else {
            // 2. Fetch Lead from Graph API
            const leadRes = await fetch(`https://graph.facebook.com/v19.0/${leadgenId}?fields=field_data,ad_name,campaign_name&access_token=${token}`);
            if (!leadRes.ok) {
              console.error('Failed to fetch lead from Meta:', await leadRes.text());
              continue;
            }
            leadData = await leadRes.json();
          }

          let email = '';
          let name = '';
          let phone = '';

          (leadData.field_data || []).forEach((field: any) => {
            const val = field.values[0];
            if (field.name.includes('email')) email = val;
            else if (field.name.includes('name')) name = val;
            else if (field.name.includes('phone')) phone = val;
          });

          // 3. Save to CRM "leads" collection
          const newLead = {
            name,
            email,
            phone,
            campaignName: leadData.campaign_name || '',
            adName: leadData.ad_name || '',
            source: 'meta_ads',
            createdAt: serverTimestamp(),
            status: 'new',
            tenantId,
            metaLeadId: leadData.id,
            rawWebhookData: change.value
          };

          await addDoc(collection(serverDb, 'leads'), newLead);
          console.log(`Successfully mapped and saved Meta lead: ${leadData.id}`);
        }
      }
    }
  } catch (error) {
    console.error('Error processing Meta webhook background task:', error);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode && token) {
    if (mode === 'subscribe' && (token === VERIFY_TOKEN || token === LEGACY_VERIFY_TOKEN)) {
      return new NextResponse(challenge, { status: 200 });
    } else {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  return new NextResponse('Bad Request', { status: 400 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Store the raw webhook event
    await addDoc(collection(serverDb, 'webhook_events'), {
      payload: body,
      createdAt: serverTimestamp(),
      source: 'meta'
    });

    // Start background processing without awaiting to respond quickly to Meta
    processMetaWebhook(body).catch((err) => {
      console.error('Unhandled error in processMetaWebhook:', err);
    });

    // Acknowledge receipt to Meta quickly to avoid timeouts
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing Meta webhook:', error);
    // Still return 200 so Meta doesn't keep retrying malformed payloads
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
