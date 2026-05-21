const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

console.log('--- ZeroAgenzia Casa: Startup Diagnostic ---');
console.log('Starting Next.js with environment:', process.env.NODE_ENV || 'production (default)');
console.log('Port configured:', port);
console.log('Current working directory:', process.cwd());

const nextDir = path.join(process.cwd(), '.next');
const hasNextBuild = fs.existsSync(nextDir);

if (!dev && !hasNextBuild) {
  console.warn('⚠️ WARNING: The compiled Next.js output directory (.next) was not found at:', nextDir);
  console.warn('To fix this, please run "npm run build" in Hostinger\'s console, SSH terminal, or package manager.');
}

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling request:', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
  .once('error', (err) => {
    console.error('HTTP server startup error:', err);
    process.exit(1);
  })
  .listen(port, () => {
    console.log(`🚀 ZeroAgenzia is live on http://${hostname}:${port}`);
    console.log('---------------------------------------------');
  });
}).catch((err) => {
  console.error('❌ Next.js preparation failed. If you are on Hostinger, please run: npm run build');
  console.error(err);
  
  // Safe fallback server to respond during build states rather than crashing or showing a generic 502/503 gateway error
  createServer((req, res) => {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Installazione in Corso - ZeroAgenzia</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              height: 100vh; 
              background: #f3f4f6; 
              margin: 0; 
              color: #1f2937;
            }
            .card { 
              background: white; 
              padding: 40px; 
              border-radius: 16px; 
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); 
              max-width: 500px; 
              width: 90%;
              text-align: center; 
              border: 1px solid #e5e7eb; 
            }
            h1 { 
              color: #111827; 
              margin-bottom: 12px; 
              font-size: 24px; 
              font-weight: 700;
            }
            p { 
              color: #4b5563; 
              font-size: 16px; 
              line-height: 1.6; 
              margin-bottom: 24px; 
            }
            .code-box { 
              background: #111827; 
              padding: 16px; 
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; 
              border-radius: 8px; 
              font-size: 14px; 
              color: #34d399; 
              text-align: left;
              box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
            }
            .btn {
              display: inline-block;
              margin-top: 24px;
              background-color: #2563eb;
              color: white;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: 600;
              text-decoration: none;
              transition: background-color 0.2s;
            }
            .btn:hover {
              background-color: #1d4ed8;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Configurazione di ZeroAgenzia</h1>
            <p>L'applicazione Node.js è attiva, ma la build di produzione di Next.js non è stata trovata o caricata.</p>
            <div class="code-box">
              # Per risolvere, accedi al terminale Hostinger (SSH) ed esegui:<br>
              <span style="color: #ffffff; font-weight: bold;">npm run build</span>
            </div>
            <p style="font-size: 13px; color: #9ca3af; margin-top: 16px; margin-bottom: 0;">
              Una volta completata la build con successo, riavvia l'applicazione dal pannello Hostinger.
            </p>
          </div>
        </body>
      </html>
    `);
  }).listen(port);
});
