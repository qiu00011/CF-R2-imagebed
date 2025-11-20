export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  
  if (url.pathname === '/' || url.pathname === '/index.html') {
    const response = await next();
    if (response.headers.get('content-type')?.includes('text/html')) {
      let html = await response.text();
      html = html.replace('{{BACKGROUND_URL}}', env.BACKGROUND_URL || '');
      return new Response(html, {
        headers: response.headers
      });
    }
    return response;
  }
  
  // 检查认证Cookie
  const cookie = request.headers.get('Cookie');
  const authToken = cookie?.match(/auth_token=([^;]+)/)?.[1];
  
  if (authToken === env.PASSWORD) {
    return next();
  }
  
  return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
    status: 401,
    headers: { 'Content-Type': 'application/json' }
  });
}
