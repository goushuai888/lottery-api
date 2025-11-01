# 项目设置指南

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/goushuai888/lottery-api.git
cd lottery-api
```

### 2. 安装依赖
```bash
pnpm install
```

### 3. 配置环境变量

创建 `.env.local` 文件：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ixqsqmftydqsibrjkuyc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cXNxbWZ0eWRxc2licmprdXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4OTcwMjksImV4cCI6MjA3NzQ3MzAyOX0.qcOl3pPvnA-26zNfR6U17QM-DeH6CzI1Sdf9_C794VA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cXNxbWZ0eWRxc2licmprdXljIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTg5NzAyOSwiZXhwIjoyMDc3NDczMDI5fQ.errmrc7Pu0Ky124k3V6BlwWPrighrGRYTF3J-Uk_a5Y
```

**重要提示：** 
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 必须使用正确的 anon key
- 如果遇到 "Invalid API key" 错误，请检查这个 key 是否正确

### 4. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000

## 🔧 常见问题

### Q1: 遇到 "Invalid API key" 错误

**原因：** Supabase API key 不正确

**解决方案：**
1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择项目 `lottery`
3. 进入 **Settings** → **API**
4. 复制正确的 `anon` 和 `service_role` key
5. 更新 `.env.local` 文件
6. 重启开发服务器

### Q2: 图片加载很慢

**已解决：** 使用了 Next.js Image 组件和懒加载优化

- 首屏只加载可见图片（6-8张）
- 其他图片滚动时才加载
- 加载速度提升 60-75%

### Q3: 数据不更新

**已实现：** 自动刷新机制

- 统计数据每30秒自动刷新
- 最新开奖每30秒自动刷新
- 最新开奖每5秒自动轮播

## 📦 项目结构

```
lottery-api/
├── app/
│   ├── api/                    # API 路由
│   │   ├── lottery-types/      # 彩种相关API
│   │   ├── lottery-results/    # 开奖记录API
│   │   └── statistics/         # 统计数据API
│   ├── components/             # React 组件
│   │   ├── AnimatedNumber.tsx  # 数字动画组件
│   │   ├── LatestDraws.tsx     # 最新开奖轮播
│   │   ├── LotteryIcon.tsx     # 彩票图标组件
│   │   └── ...
│   └── page.tsx               # 首页
├── lib/
│   ├── supabase.ts            # Supabase 客户端
│   └── types.ts               # TypeScript 类型定义
├── scripts/
│   └── upload-lottery-images.ts # 图片上传脚本
├── public/                    # 静态资源
└── .env.local                 # 环境变量（需自行创建）
```

## 🎯 核心功能

### 1. 彩票分类浏览
- 高频彩种（37种）
- 低频彩种（5种）
- 极速彩种（5种）
- 境外彩种（93种）
- 计算型彩种（29种）

### 2. 实时统计
- 彩票类型数量（动画数字）
- 开奖记录总数（动画数字）
- 彩票分类数量（动画数字）
- 最新开奖轮播（自动切换）

### 3. 开奖记录查询
- 支持179种彩票查询
- 分页加载
- 智能刷新（检测新期号）
- 越南传统彩票详情展示

### 4. 性能优化
- 图片懒加载（Next.js Image）
- 数字动画效果
- 自动刷新机制
- 响应式布局

## 🚀 部署

### Vercel 部署（推荐）

1. 推送代码到 GitHub
2. 导入项目到 Vercel
3. 配置环境变量（复制 `.env.local` 内容）
4. 部署

### 环境变量配置

在 Vercel 项目设置中添加：

```
NEXT_PUBLIC_SUPABASE_URL=https://ixqsqmftydqsibrjkuyc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cXNxbWZ0eWRxc2licmprdXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4OTcwMjksImV4cCI6MjA3NzQ3MzAyOX0.qcOl3pPvnA-26zNfR6U17QM-DeH6CzI1Sdf9_C794VA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cXNxbWZ0eWRxc2licmprdXljIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTg5NzAyOSwiZXhwIjoyMDc3NDczMDI5fQ.errmrc7Pu0Ky124k3V6BlwWPrighrGRYTF3J-Uk_a5Y
```

## 📚 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据库**: Supabase (PostgreSQL)
- **部署**: Vercel
- **包管理**: pnpm

## 🎨 特色功能

### 数字动画
使用 `requestAnimationFrame` 实现平滑的数字递增动画，配合 `easeOutCubic` 缓动函数，提供自然流畅的视觉效果。

### 最新开奖轮播
自动轮播展示最新10条开奖记录，每5秒切换，每30秒刷新数据，配合 LIVE 动画标识，营造实时感。

### 图片优化
使用 Next.js Image 组件，实现懒加载、自动响应式、压缩优化，首屏加载时间减少 60-75%。

### 智能刷新
监测最新期号变化，自动刷新开奖数据，无需手动操作。

## 📞 支持

如有问题，请提交 [GitHub Issue](https://github.com/goushuai888/lottery-api/issues)

## 📄 许可证

MIT License

---

**最后更新**: 2025-11-01

