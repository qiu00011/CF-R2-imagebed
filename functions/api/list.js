export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const prefix = url.searchParams.get('prefix') || '';
  
  try {
    const listed = await env.MY_BUCKET.list({
      prefix: prefix,
      delimiter: '/',
      limit: 1000
    });
    
    // 提取文件夹
    const folders = listed.delimitedPrefixes || [];
    
    // 提取图片文件
    const files = listed.objects
      .filter(obj => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(obj.key))
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
      truncated: listed.truncated
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
