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
    
    const fileName = file.name;
    
    // 修复：确保路径拼接正确
    let key;
    if (path && path !== '') {
      // 如果 path 已经以 / 结尾，就不再添加 /
      key = path.endsWith('/') ? `${path}${fileName}` : `${path}/${fileName}`;
    } else {
      // 根目录直接使用文件名
      key = fileName;
    }
    
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
