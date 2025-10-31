# 🎰 彩票开奖数据平台

免费提供彩票开奖数据 API 接口

## 快速开始

```bash
# 安装依赖
pnpm install

# 配置环境变量（.env.local）
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# 启动开发服务器
pnpm dev
```

访问 http://localhost:3000

## 部署到 Vercel

### 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

### 手动部署

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel --prod
```

### 环境变量配置

在 Vercel Dashboard 添加以下环境变量：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 自动定时采集

已配置每小时自动采集（见 `vercel.json`）

## API 接口

详见 [API_GUIDE.md](./API_GUIDE.md)

## 技术栈

- **框架**: Next.js 14 + TypeScript
- **数据库**: Supabase (PostgreSQL)
- **样式**: Tailwind CSS
- **数据源**: https://vip.manycai.com
- **部署**: Vercel

## 功能特性

- ✅ 支持 179 种彩票
- ✅ 自动数据采集（每小时）
- ✅ 免费 RESTful API
- ✅ 无访问限制
- ✅ 响应式设计
- ✅ 深色模式
