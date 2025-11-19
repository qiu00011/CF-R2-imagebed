export async function onRequestDelete(context) {
  const { request, env } = context;
  
  try {
    const { key } = await request.json();
    
    if (!key) {
      return new Response(JSON.stringify({ error: '没有指定文件' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    await env.MY_BUCKET.delete(key);
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
