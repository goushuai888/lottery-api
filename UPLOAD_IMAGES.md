# 彩票Logo图片上传到Supabase教程

## 📋 功能说明

这个脚本会自动：
1. 从官方采集源下载所有彩票Logo图片（92+张）
2. 上传到您的 Supabase Storage 存储桶
3. 生成公开访问URL映射文件
4. 图片永久保存，不会过期

## 🚀 使用步骤

### 1. 确保环境变量已配置

确保 `.env.local` 文件包含 Supabase 配置：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. 运行上传脚本

```bash
pnpm run upload-images
```

或

```bash
npm run upload-images
```

### 3. 脚本执行过程

脚本会：
- ✅ 检查并创建 `lottery-logos` 存储桶（如果不存在）
- 📥 下载所有92张彩票Logo图片到临时目录
- ☁️  上传到 Supabase Storage
- 🗑️  清理临时文件
- 💾 生成 `lottery-image-urls.json` 结果文件

### 4. 查看上传结果

脚本完成后会生成 `lottery-image-urls.json` 文件，包含所有上传成功的图片URL：

```json
{
  "CQSSC": "https://your-project.supabase.co/storage/v1/object/public/lottery-logos/CQSSC.png",
  "XJSSC": "https://your-project.supabase.co/storage/v1/object/public/lottery-logos/XJSSC.png",
  ...
}
```

## 🔧 更新组件使用 Supabase URL

上传完成后，需要更新 `LotteryIcon.tsx` 组件：

### 方案1: 直接替换 URL 前缀

修改 `app/components/LotteryIcon.tsx` 中的图片URL：

```typescript
// 将
src={`https://vip.manycai.com${imageUrl}`}

// 改为
src={`https://your-project.supabase.co/storage/v1/object/public/lottery-logos/${lotteryCode}${path.extname(imageUrl)}`}
```

### 方案2: 使用生成的 JSON 文件

1. 将 `lottery-image-urls.json` 导入到组件
2. 直接使用映射的完整URL

```typescript
import lotteryImageUrls from '../../lottery-image-urls.json'

// 在组件中
const imageUrl = lotteryImageUrls[lotteryCode]
if (imageUrl) {
  return <img src={imageUrl} alt={lotteryName} />
}
```

## 📦 Supabase Storage 设置

### Storage Bucket 配置

脚本会自动创建 `lottery-logos` 存储桶，配置如下：

- **Public**: `true` （公开访问）
- **File Size Limit**: 5MB
- **Allowed MIME Types**: `image/png`, `image/jpeg`, `image/jpg`

### 手动创建 Bucket（可选）

如果需要手动创建：

1. 登录 Supabase Dashboard
2. 进入 Storage
3. 创建新 Bucket: `lottery-logos`
4. 设置为 Public
5. 配置文件大小限制和允许的MIME类型

## 📊 上传统计

脚本会显示详细的上传统计：

```
📊 Upload Summary:
   Total: 92
   ✅ Success: 92
   ❌ Failed: 0

💾 Results saved to: /path/to/lottery-image-urls.json
```

## 🔍 故障排查

### 上传失败

如果某些图片上传失败：

1. 检查 Supabase 凭证是否正确
2. 确认 Storage API 已启用
3. 检查网络连接
4. 查看 Supabase Dashboard 的 Storage 配额

### 图片下载失败

如果下载失败：

1. 检查源网站是否可访问
2. 查看是否有网络限制
3. 可能需要添加 User-Agent 或代理

### Bucket 权限问题

确保 Bucket 的 RLS 策略允许公开读取：

```sql
-- 在 Supabase SQL Editor 中执行
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'lottery-logos' );
```

## 🎯 最佳实践

1. **定期备份**: 定期导出 `lottery-image-urls.json` 作为备份
2. **CDN加速**: 考虑在 Supabase Storage 前配置 CDN
3. **图片优化**: 可以先用工具压缩图片再上传
4. **版本管理**: 图片有更新时使用 `upsert: true` 覆盖

## 📝 注意事项

- 脚本会自动覆盖已存在的同名文件
- 临时文件会自动清理
- 建议在测试环境先运行一次
- 上传过程大约需要 1-2 分钟
- 确保有足够的 Supabase Storage 配额（免费版1GB）

## 🆘 需要帮助？

如果遇到问题：
1. 检查 `.env.local` 配置
2. 查看控制台错误信息
3. 确认 Supabase 项目状态
4. 检查 Storage 配额使用情况

