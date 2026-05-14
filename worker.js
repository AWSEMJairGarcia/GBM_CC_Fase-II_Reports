// Cloudflare Worker — CORS Proxy para Jira API
// Deploy en: https://workers.cloudflare.com
// 1. Crea cuenta gratis en Cloudflare
// 2. Ve a Workers & Pages > Create Worker
// 3. Pega este código y dale Deploy
// 4. Tu URL será algo como: https://jira-proxy.tu-usuario.workers.dev

export default {
  async fetch(request) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept',
          'Access-Control-Max-Age': '86400',
        }
      });
    }

    // Get target URL from query param
    const url = new URL(request.url);
    const target = url.searchParams.get('url');
    
    if (!target) {
      return new Response(JSON.stringify({error: 'Missing ?url= parameter'}), {
        status: 400,
        headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
      });
    }

    // Forward request to Jira
    const headers = new Headers();
    headers.set('Authorization', request.headers.get('Authorization') || '');
    headers.set('Content-Type', request.headers.get('Content-Type') || 'application/json');
    headers.set('Accept', 'application/json');

    const resp = await fetch(target, {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' ? await request.text() : undefined,
    });

    // Return response with CORS headers
    const responseHeaders = new Headers(resp.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Headers', 'Authorization, Content-Type, Accept');

    return new Response(resp.body, {
      status: resp.status,
      headers: responseHeaders
    });
  }
};
