// Cloudflare Worker — CORS Proxy for Jira API
// Deploy: wrangler publish

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders()
    });
  }

  // Get target URL from query parameter
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return new Response(
      JSON.stringify({ error: 'Missing required parameter: url' }),
      {
        status: 400,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
      }
    );
  }

  // Forward request to target
  const headers = new Headers();

  // Forward auth and content-type headers
  const authHeader = request.headers.get('Authorization');
  if (authHeader) {
    headers.set('Authorization', authHeader);
  }

  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');

  try {
    const response = await fetch(targetUrl, {
      method: request.method === 'OPTIONS' ? 'GET' : request.method,
      headers
    });

    // Create response with CORS headers
    const responseHeaders = new Headers(response.headers);
    Object.entries(corsHeaders()).forEach(([key, value]) => {
      responseHeaders.set(key, value);
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: `Proxy error: ${error.message}` }),
      {
        status: 502,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
      }
    );
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept',
    'Access-Control-Max-Age': '86400'
  };
}
