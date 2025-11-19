export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const prefix = url.searchParams.get('prefix') || '';
  
  try {
    // 列出R2中的对象
    const listed = await env.MY_BUCKET.list({
      prefix: prefix,
      delimiter: '/',
      limit: 1000
    });
    
    // 提取文件夹（delimitedPrefixes）
    const folders = (listed.delimitedPrefixes || []).map(f => f);
    
    // 提取图片文件
    const files = (listed.objects || [])
      .filter(obj => {
        // 排除文件夹本身（以/结尾的key）
        if (obj.key.endsWith('/')) return false;
        // 只保留图片格式
        return /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i.test(obj.key);
      })
      .map(obj => ({
        key: obj.key,
        name: obj.key.split('/').pop(),
        size: obj.size,
        uploaded: obj.uploaded,
        url: `${env.R2_CUSTOM_DOMAIN}/${obj.key}`
      }));
    
    return new Response(JSON.stringify({
      folders: folders,
      files: files,
      truncated: listed.truncated,
      prefix: prefix
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('List error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
