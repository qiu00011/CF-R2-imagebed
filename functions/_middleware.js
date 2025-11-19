export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  
  // 允许访问首页（用于加载登录页面）
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
  
  // 检查认证Cookie
  const cookie = request.headers.get('Cookie');
  const authToken = cookie?.match(/auth_token=([^;]+)/)?.[1];
  
  if (authToken === env.PASSWORD) {
    return next();
  }
  
  // 未认证返回401
  return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
    status: 401,
    headers: { 'Content-Type': 'application/json' }
  });
}
