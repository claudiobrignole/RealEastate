import { NextRequest, NextResponse } from 'next/server';
import { getTenantId } from '@/lib/actions/auth';
import { updateTenantMetaConnection } from '@/lib/actions/tenants';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // State contains tenantId from our OAuth url

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const redirectError = (errorKey: string) => {
    return NextResponse.redirect(new URL(`/admin/settings?meta_error=${errorKey}`, baseUrl));
  };

  if (!code) {
    return redirectError('auth_cancelled');
  }

  try {
    // c) Exchange code for short-lived token
    const callbackUrl = `${baseUrl}/api/meta/callback`;
    const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&redirect_uri=${encodeURIComponent(callbackUrl)}&code=${code}`;

    const tokenResponse = await fetch(tokenUrl, { method: 'GET' });
    if (!tokenResponse.ok) {
      console.error('Meta token exchange failed:', await tokenResponse.text());
      return redirectError('token_exchange_failed');
    }

    const tokenData = await tokenResponse.json();
    const shortLivedToken = tokenData.access_token;
    if (!shortLivedToken) {
      return redirectError('token_exchange_failed');
    }

    // e) Get pages listed
    const accountsUrl = `https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token&access_token=${shortLivedToken}`;
    const accountsResponse = await fetch(accountsUrl, { method: 'GET' });
    if (!accountsResponse.ok) {
      console.error('Meta accounts fetch failed:', await accountsResponse.text());
      return redirectError('accounts_fetch_failed');
    }

    const accountsData = await accountsResponse.json();
    const pagesData = accountsData.data || [];

    if (pagesData.length === 0) {
      return redirectError('no_pages_found');
    }

    // f) Pick first page or matching state
    const selectedPage = pagesData.find((p: any) => p.id === state) || pagesData[0];
    const pageId = selectedPage.id;
    const pageAccessToken = selectedPage.access_token;

    // g) Call updateTenantMetaConnection
    const tenantId = state || (await getTenantId());
    if (!tenantId) {
       console.error('Tenant ID could not be identified');
       return redirectError('tenant_not_found');
    }

    const updateRes = await updateTenantMetaConnection(tenantId, {
      metaPageId: pageId,
      metaAccessToken: pageAccessToken,
    });

    if (!updateRes.success) {
      console.error('Failed to update tenant meta connection in database:', updateRes.error);
      return redirectError('db_update_failed');
    }

    // h) Redirect with success
    return NextResponse.redirect(new URL('/admin/settings?meta_success=true', baseUrl));

  } catch (error: any) {
    console.error('Error in Facebook OAuth callback:', error);
    return redirectError('unexpected_error');
  }
}
