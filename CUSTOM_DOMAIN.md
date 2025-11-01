# 自定义域名配置指南

## 🌐 配置自定义存储域名

现在支持通过环境变量配置自定义域名，无需修改代码！

### 方式1：使用 Supabase 自定义域名

#### 步骤：

1. **登录 Supabase Dashboard**
   - 访问：https://supabase.com/dashboard
   - 选择项目：`lottery`

2. **配置自定义域名**
   - 进入 **Settings** → **Custom Domains**
   - 点击 **Add Custom Domain**
   - 输入您的域名（如：`api.yourdomain.com`）

3. **配置DNS记录**
   按照Supabase提供的指引添加DNS记录：
   ```
   Type: CNAME
   Name: api (或您的子域名)
   Value: ixqsqmftydqsibrjkuyc.supabase.co
   ```

4. **等待验证和SSL证书**
   - DNS生效时间：5-30分钟
   - SSL证书自动颁发：1-24小时

5. **更新环境变量**
   编辑 `.env.local` 文件，添加：
   ```bash
   # 自定义存储域名
   NEXT_PUBLIC_STORAGE_URL=https://api.yourdomain.com/storage/v1/object/public
   ```

6. **重启应用**
   ```bash
   pnpm dev
   ```

### 方式2：使用 Cloudflare CDN（推荐）

使用Cloudflare可以获得更好的全球访问速度和缓存控制。

#### 步骤：

1. **登录 Cloudflare**
   - 添加您的域名到Cloudflare
   - 更新域名的NS记录

2. **创建Worker脚本**
   ```javascript
   // Cloudflare Worker 代理脚本
   export default {
     async fetch(request) {
       const url = new URL(request.url);
       
       // 将请求转发到 Supabase Storage
       const supabaseUrl = 'https://ixqsqmftydqsibrjkuyc.supabase.co';
       const targetUrl = supabaseUrl + url.pathname;
       
       // 转发请求
       const response = await fetch(targetUrl, {
         method: request.method,
         headers: request.headers,
       });
       
       // 添加缓存头
       const newResponse = new Response(response.body, response);
       newResponse.headers.set('Cache-Control', 'public, max-age=31536000');
       newResponse.headers.set('Access-Control-Allow-Origin', '*');
       
       return newResponse;
     }
   };
   ```

3. **配置路由**
   - Route: `cdn.yourdomain.com/storage/*`
   - Worker: 上面创建的worker

4. **更新环境变量**
   ```bash
   NEXT_PUBLIC_STORAGE_URL=https://cdn.yourdomain.com/storage/v1/object/public
   ```

### 方式3：使用Nginx反向代理

如果您有自己的服务器，可以使用Nginx：

```nginx
server {
    listen 80;
    server_name cdn.yourdomain.com;
    
    location /storage/ {
        proxy_pass https://ixqsqmftydqsibrjkuyc.supabase.co/storage/;
        proxy_set_header Host ixqsqmftydqsibrjkuyc.supabase.co;
        proxy_ssl_server_name on;
        
        # 缓存配置
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000";
        add_header Access-Control-Allow-Origin *;
    }
}
```

## 🔧 环境变量配置

在 `.env.local` 文件中添加：

```bash
# 自定义存储域名（可选）
# 如果不设置，将使用默认的 Supabase 域名
NEXT_PUBLIC_STORAGE_URL=https://your-custom-domain.com/storage/v1/object/public

# 或者使用CDN
NEXT_PUBLIC_STORAGE_URL=https://cdn.yourdomain.com/storage/v1/object/public
```

## 📝 域名示例

配置后，图片URL会变成：

**默认（不配置环境变量）：**
```
https://ixqsqmftydqsibrjkuyc.supabase.co/storage/v1/object/public/lottery-logos/CQSSC.png
```

**配置自定义域名后：**
```
https://api.yourdomain.com/storage/v1/object/public/lottery-logos/CQSSC.png
```

**使用CDN后：**
```
https://cdn.yourdomain.com/storage/v1/object/public/lottery-logos/CQSSC.png
```

## ✅ 验证配置

1. 重启开发服务器：
   ```bash
   pnpm dev
   ```

2. 检查浏览器控制台的图片URL

3. 测试图片是否正常加载

## 🚀 性能优化建议

### 1. 启用CDN缓存
- 设置长期缓存：`Cache-Control: public, max-age=31536000`
- 图片资源基本不变，可以永久缓存

### 2. 使用图片优化服务
配合Cloudflare的图片优化：
```
https://cdn.yourdomain.com/cdn-cgi/image/width=100,quality=85/storage/v1/object/public/lottery-logos/CQSSC.png
```

### 3. 启用HTTP/2
确保您的CDN或服务器支持HTTP/2，提升并发加载速度

### 4. 配置CORS
如果使用自定义域名，确保配置了正确的CORS头：
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, HEAD, OPTIONS
```

## 🔍 故障排查

### 问题1：图片无法加载
- 检查DNS是否生效：`nslookup your-domain.com`
- 检查SSL证书是否有效
- 检查CORS配置

### 问题2：图片加载很慢
- 启用CDN缓存
- 使用地理位置更近的CDN节点
- 压缩图片大小

### 问题3：环境变量不生效
- 确保变量名以 `NEXT_PUBLIC_` 开头
- 重启开发服务器
- 清除 `.next` 缓存：`rm -rf .next`

## 📞 推荐配置

**生产环境推荐：**
```bash
# 使用Cloudflare CDN + 自定义域名
NEXT_PUBLIC_STORAGE_URL=https://cdn.lottery-api.com/storage/v1/object/public
```

**开发环境：**
```bash
# 直接使用Supabase域名
# 不设置此变量，使用默认值即可
```

## 🎯 快速配置（推荐流程）

1. ✅ 注册Cloudflare账号（免费）
2. ✅ 添加域名到Cloudflare
3. ✅ 创建Worker代理Supabase Storage
4. ✅ 配置路由：`cdn.yourdomain.com/storage/*`
5. ✅ 更新 `.env.local` 环境变量
6. ✅ 重启应用测试

**完成！** 🎊 您的彩票Logo将通过自定义域名+CDN加速访问！

