export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  
  // 为首页传递背景图片URL
  if (url.pathname === '/' || url.pathname === '/index.html') {
    const response = await next();
    if (response.headers.get('content-type')?.includes('text/html')) {
      let html = await response.text();
      html = html.replace('{{BACKGROUND_IMAGE}}', env.BACKGROUND_IMAGE || '');
      return new Response(html, {
        headers: response.headers
      });
    }
    return response;
  }
  
  // 跳过登录API
  if (url.pathname === '/api/login') {
    return next();
  }
  
  // 检查认证Cookie
  const cookie = request.headers.get('Cookie');
  const authToken = cookie?.match(/auth_token=([^;]+)/)?.[1];
  
  if (authToken === env.PASSWORD) {
    return next();
  }
  
  // 未认证，返回401
  if (!url.pathname.startsWith('/api/')) {
    return new Response('Unauthorized', { 
      status: 401,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
  
  return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
    status: 401,
    headers: { 'Content-Type': 'application/json' }
  });
}
