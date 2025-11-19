export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const path = formData.get('path') || '';
    
    if (!file) {
      return new Response(JSON.stringify({ error: '没有文件' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 生成文件路径
    const fileName = file.name;
    const key = path ? `${path}/${fileName}` : fileName;
    
    // 上传到R2
    await env.MY_BUCKET.put(key, file.stream(), {
      httpMetadata: {
        contentType: file.type
      }
    });
    
    return new Response(JSON.stringify({
      success: true,
      key: key,
      url: `${env.R2_CUSTOM_DOMAIN}/${key}`
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
