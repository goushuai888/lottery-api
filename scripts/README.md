# 📜 数据库脚本使用说明

本目录包含用于数据库管理和维护的实用脚本。

## 📦 可用脚本

### 1. `export-database.ts` - 数据库导出工具

**功能**：
- ✅ 完整导出或增量导出数据库
- ✅ 支持按彩种过滤导出
- ✅ 支持按日期范围导出
- ✅ 自动生成元数据文件
- ✅ 支持大数据量分批处理（自动处理超过5000条记录）

**使用方法**：

```bash
# 查看帮助
pnpm tsx scripts/export-database.ts --help

# 完整导出所有数据
pnpm tsx scripts/export-database.ts

# 导出最近24小时的数据（增量备份）
pnpm tsx scripts/export-database.ts --incremental

# 导出最近7天的数据
pnpm tsx scripts/export-database.ts --days=7

# 只导出特定彩种（如 YN60）
pnpm tsx scripts/export-database.ts --lottery=YN60

# 组合使用：导出 YN60 最近3天的数据
pnpm tsx scripts/export-database.ts --lottery=YN60 --days=3
```

**导出文件位置**：
所有导出文件保存在 `/database-export/` 目录下，包含：
- `lottery_types_YYYY-MM-DD_HH-MM-SS.json` - 彩种信息
- `lottery_results_YYYY-MM-DD_HH-MM-SS.json` - 开奖记录
- `metadata_YYYY-MM-DD_HH-MM-SS.json` - 导出元数据

**元数据文件示例**：
```json
{
  "export_time": "2025-11-01T14:30:00.000Z",
  "export_type": "full",
  "filters": {},
  "database": {
    "project_id": "ixqsqmftydqsibrjkuyc",
    "region": "ap-southeast-2"
  },
  "statistics": {
    "lottery_types_count": 179,
    "lottery_results_count": 62085,
    "export_size_mb": 28.5
  },
  "files": [
    "lottery_types_2025-11-01_14-30-00.json",
    "lottery_results_2025-11-01_14-30-00.json"
  ]
}
```

---

## 🔧 环境变量要求

所有脚本都需要以下环境变量（在 `.env.local` 中配置）：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 可选：用于完整权限访问（推荐）
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## 📅 自动化备份方案

### 方案1: 使用 Cron（Linux/macOS）

创建备份脚本 `backup.sh`:

```bash
#!/bin/bash
cd /path/to/lottery-api
pnpm tsx scripts/export-database.ts --incremental
```

添加到 crontab:

```bash
# 每天凌晨2点执行增量备份
0 2 * * * /path/to/backup.sh

# 每周日凌晨3点执行完整备份
0 3 * * 0 cd /path/to/lottery-api && pnpm tsx scripts/export-database.ts
```

### 方案2: 使用 GitHub Actions

创建 `.github/workflows/backup.yml`:

```yaml
name: Database Backup

on:
  schedule:
    # 每天凌晨2点执行
    - cron: '0 2 * * *'
  workflow_dispatch: # 允许手动触发

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run backup
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
        run: pnpm tsx scripts/export-database.ts --incremental
      
      - name: Upload backup
        uses: actions/upload-artifact@v4
        with:
          name: database-backup-${{ github.run_number }}
          path: database-export/
          retention-days: 30
```

---

## 🗂️ 数据恢复

### 从 JSON 导入到新数据库

```typescript
// scripts/import-database.ts
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function importDatabase() {
  // 1. 读取导出文件
  const lotteryTypes = JSON.parse(
    fs.readFileSync('database-export/lottery_types_2025-11-01.json', 'utf-8')
  )
  const lotteryResults = JSON.parse(
    fs.readFileSync('database-export/lottery_results_2025-11-01.json', 'utf-8')
  )
  
  // 2. 导入彩种信息
  console.log('导入彩种信息...')
  const { error: typesError } = await supabase
    .from('lottery_types')
    .upsert(lotteryTypes)
  
  if (typesError) throw typesError
  
  // 3. 分批导入开奖记录
  console.log('导入开奖记录...')
  const batchSize = 1000
  for (let i = 0; i < lotteryResults.length; i += batchSize) {
    const batch = lotteryResults.slice(i, i + batchSize)
    const { error } = await supabase
      .from('lottery_results')
      .upsert(batch)
    
    if (error) throw error
    console.log(`已导入 ${i + batch.length} / ${lotteryResults.length}`)
  }
  
  console.log('✅ 导入完成')
}

importDatabase().catch(console.error)
```

---

## 📊 数据迁移到其他平台

详细的迁移指南请参考：[DATABASE_EXPORT_GUIDE.md](../DATABASE_EXPORT_GUIDE.md)

支持迁移到：
- ✅ 其他 Supabase 项目（完全兼容）
- ✅ PostgreSQL（95% 兼容）
- ✅ MySQL 8.0+（85% 兼容）
- ✅ MongoDB（90% 兼容）

---

## 🛠️ 故障排查

### 错误: "缺少 Supabase 环境变量"

**解决方案**：
确保在项目根目录创建了 `.env.local` 文件，并包含正确的环境变量。

### 错误: "导出失败: Row Level Security"

**解决方案**：
使用 `SUPABASE_SERVICE_ROLE_KEY` 而不是 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。Service Role Key 具有完整权限，可以绕过 RLS。

### 导出速度慢

**原因**：
大量数据需要时间处理。脚本会自动分批处理（每批5000条），并显示进度。

**优化建议**：
- 使用 `--incremental` 只导出最近数据
- 使用 `--lottery=CODE` 只导出特定彩种
- 使用 `--days=N` 限制日期范围

---

## 📞 需要帮助？

如有问题，请查看：
1. [DATABASE_EXPORT_GUIDE.md](../DATABASE_EXPORT_GUIDE.md) - 完整的数据库导出指南
2. 项目主 README.md
3. 或联系项目维护者

---

**最后更新**: 2025-11-01

