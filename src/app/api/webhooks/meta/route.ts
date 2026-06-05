import { NextResponse } from 'next/server';
import {
  addDocData,
  queryCollection,
  serverTimestamp,
} from '@/lib/server-db';
import { getMetaWebhookVerifyToken } from '@/lib/env';

export const dynamic = 'force-dynamic';

const LEGACY_VERIFY_TOKEN = 'unitleads_meta_secure_webhook_2026';

async function processMetaWebhook(body: Record<string, unknown>) {
  try {
    const entries = (body.entry as Array<Record<string, unknown>>) || [];
    for (const entry of entries) {
      const changes = (entry.changes as Array<Record<string, unknown>>) || [];
      for (const change of changes) {
        if (change.field !== 'leadgen') continue;

        const value = change.value as Record<string, unknown>;
        const leadgenId = value?.leadgen_id as string | undefined;
        if (!leadgenId) continue;

        const pageId = value?.page_id as string | undefined;
        if (!pageId) {
          console.error('Meta webhook payload missing page_id');
          continue;
        }

        const tenants = await queryCollection('tenants', [['metaPageId', '==', pageId]]);
        if (tenants.length === 0) {
          console.error(`No tenant found for Meta Page ID: ${pageId}`);
          continue;
        }

        const tenant = tenants[0];
        const tenantId = tenant.id as string;
        const token = (tenant.metaAccessToken as string) || process.env.META_ACCESS_TOKEN;
        if (!token) {
          console.error(`Meta Access Token missing for page ${pageId}`);
          continue;
        }

        let leadData: Record<string, unknown>;
        if (
          leadgenId.startsWith('mock_') ||
          leadgenId.startsWith('test_') ||
          token.startsWith('EAAx9482_SYSTEM_USER_PERMANENT_TOKEN_MOCK_')
        ) {
          const mockFields = (value.mock_data as Record<string, string>) || {};
          leadData = {
            id: leadgenId,
            campaign_name: mockFields.campaignName || 'Campagna Social',
            ad_name: mockFields.adName || 'Ad Test',
            field_data: [
              { name: 'email', values: [mockFields.email || 'test@zeroagenzia.it'] },
              { name: 'full_name', values: [mockFields.name || 'Lead Test'] },
              { name: 'phone_number', values: [mockFields.phone || '+39 000 0000000'] },
            ],
          };
        } else {
          const leadRes = await fetch(
            `https://graph.facebook.com/v19.0/${leadgenId}?fields=field_data,ad_name,campaign_name&access_token=${token}`
          );
          if (!leadRes.ok) {
            console.error('Failed to fetch lead from Meta:', await leadRes.text());
            continue;
          }
          leadData = await leadRes.json();
        }

        let email = '';
        let name = '';
        let phone = '';

        ((leadData.field_data as Array<{ name: string; values: string[] }>) || []).forEach((field) => {
          const val = field.values[0];
          if (field.name.includes('email')) email = val;
          else if (field.name.includes('name')) name = val;
          else if (field.name.includes('phone')) phone = val;
        });

        await addDocData('leads', {
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
          rawWebhookData: value,
        });
      }
    }
  } catch (error) {
    console.error('Error processing Meta webhook:', error);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');
  const verifyToken = getMetaWebhookVerifyToken();

  if (mode && token) {
    if (mode === 'subscribe' && (token === verifyToken || token === LEGACY_VERIFY_TOKEN)) {
      return new NextResponse(challenge, { status: 200 });
    }
    return new NextResponse('Forbidden', { status: 403 });
  }

  return new NextResponse('Bad Request', { status: 400 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await processMetaWebhook(body);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing Meta webhook:', error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
