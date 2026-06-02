import { NextRequest, NextResponse } from 'next/server';
import { getTenantId } from '@/lib/actions/auth';
import { updateTenantMetaConnection } from '@/lib/actions/tenants';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // State contains tenantId from our OAuth url

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const redirectError = (errorKey: string) => {
    return new NextResponse(`
      <html>
        <head>
          <title>Autenticazione Fallita</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #fcfcfc; color: #333; text-align: center; }
            .card { max-width: 400px; padding: 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #eee; background: white; }
            h2 { color: #dc2626; margin-top: 0; }
            p { font-size: 14px; line-height: 1.5; color: #666; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>Errore nell'Integrazione</h2>
            <p>Si è verificato il seguente errore: <strong>${errorKey}</strong></p>
            <p>Questa finestra si chiuderà a breve...</p>
          </div>
          <script>
            try {
              if (window.opener) {
                window.opener.postMessage({ type: 'META_AUTH_ERROR', error: '${errorKey}' }, '*');
                setTimeout(() => window.close(), 1500);
              } else {
                window.location.href = '${baseUrl}/admin/settings?meta_error=${errorKey}';
              }
            } catch (e) {
              window.location.href = '${baseUrl}/admin/settings?meta_error=${errorKey}';
            }
          </script>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
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

    // h) Post message and close popup, or redirect as fallback
    return new NextResponse(`
      <html>
        <head>
          <title>Autenticazione Completata</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f6fdf9; color: #1e293b; text-align: center; }
            .card { max-width: 400px; padding: 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; background: white; }
            h2 { color: #16a34a; margin-top: 0; }
            p { font-size: 14px; line-height: 1.5; color: #475569; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>Connessione Completata!</h2>
            <p>L'integrazione di Facebook Lead Ads con <strong>HomeLeads</strong> è stata configurata ed attivata correttamente.</p>
            <p>Questa finestra si chiuderà a breve...</p>
          </div>
          <script>
            try {
              if (window.opener) {
                window.opener.postMessage({ type: 'META_AUTH_SUCCESS' }, '*');
                setTimeout(() => window.close(), 1500);
              } else {
                window.location.href = '${baseUrl}/admin/settings?meta_success=true';
              }
            } catch (e) {
              window.location.href = '${baseUrl}/admin/settings?meta_success=true';
            }
          </script>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });

  } catch (error: any) {
    console.error('Error in Facebook OAuth callback:', error);
    return redirectError('unexpected_error');
  }
}
