import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const VERIFY_TOKEN = 'unitleads_meta_secure_webhook_2026';

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
          const token = process.env.META_ACCESS_TOKEN;
          if (!token) {
            console.error('META_ACCESS_TOKEN is missing');
            return;
          }

          // 1. Fetch Lead from Graph API
          const leadRes = await fetch(`https://graph.facebook.com/v19.0/${leadgenId}?fields=field_data,ad_name,campaign_name&access_token=${token}`);
          if (!leadRes.ok) {
            console.error('Failed to fetch lead from Meta:', await leadRes.text());
            continue;
          }

          const leadData = await leadRes.json();
          let email = '';
          let name = '';
          let phone = '';

          (leadData.field_data || []).forEach((field: any) => {
            const val = field.values[0];
            if (field.name.includes('email')) email = val;
            else if (field.name.includes('name')) name = val;
            else if (field.name.includes('phone')) phone = val;
          });

          // 2. Resolve TenantId Deterministically
          const pageId = change.value.page_id;
          if (!pageId) {
            console.error('Meta webhook payload missing page_id');
            continue;
          }

          const tenantsQuery = await adminDb.collection('tenants')
            .where('metaPageId', '==', pageId)
            .limit(1)
            .get();

          if (tenantsQuery.empty) {
            console.error(`No tenant found configured for Meta Page ID: ${pageId}`);
            continue;
          }
          const tenantId = tenantsQuery.docs[0].id;

          // 3. Save to CRM "leads" collection
          const newLead = {
            name,
            email,
            phone,
            campaignName: leadData.campaign_name || '',
            adName: leadData.ad_name || '',
            source: 'meta_ads',
            createdAt: FieldValue.serverTimestamp(),
            status: 'new',
            tenantId,
            metaLeadId: leadData.id,
            rawWebhookData: change.value
          };

          await adminDb.collection('leads').add(newLead);
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
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
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
    await adminDb.collection('webhook_events').add({
      payload: body,
      createdAt: FieldValue.serverTimestamp(),
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
