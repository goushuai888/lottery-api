# 🗄️ 数据库导出与迁移指南

## 📊 数据库概览

### 项目信息
- **项目名称**: lottery
- **项目ID**: ixqsqmftydqsibrjkuyc
- **区域**: ap-southeast-2 (澳大利亚悉尼)
- **状态**: ACTIVE_HEALTHY ✅
- **PostgreSQL版本**: 17.6.1.032

### 数据统计
| 表名 | 记录数 | 存储大小 |
|------|--------|---------|
| `lottery_types` | 179 | 128 KB |
| `lottery_results` | 62,085+ | 28 MB |
| **总计** | **62,264+** | **~28 MB** |

---

## 📋 数据表结构

### 1. `lottery_types` - 彩种信息表

**用途**: 存储所有彩种的基本信息和配置

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | integer | 主键，自增 |
| `lottery_code` | varchar | 彩种代码（唯一） |
| `lottery_name` | varchar | 彩种名称 |
| `lottery_type` | varchar | 彩种类型 |
| `period_format` | varchar | 期号格式 |
| `example_format` | varchar | 示例格式 |
| `is_active` | boolean | 是否启用 |
| `prize_structure` | jsonb | 奖项结构（JSON） |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

**彩种类型分布**:
- `standard`: 99个（标准彩票）
- `vietnamese_traditional`: 41个（越南传统彩）
- `blockchain`: 20个（区块链彩票）
- `hong_kong_style`: 11个（港式彩票）
- `suffix_numbers`: 4个（后缀号码彩）
- `special_multi`: 3个（特殊多段式）
- `thai_government`: 1个（泰国政府彩）

### 2. `lottery_results` - 开奖记录表

**用途**: 存储所有彩种的开奖记录

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | integer | 主键，自增 |
| `lottery_code` | varchar | 彩种代码 |
| `issue` | varchar | 奖期号码 |
| `official_issue` | varchar | 官方奖期号码 |
| `open_date` | timestamptz | 开奖时间 |
| `code` | jsonb | 开奖号码（JSONB格式，支持复杂结构） |
| `created_at` | timestamptz | 记录创建时间 |

**数据格式示例**:

```json
// 简单格式（YN60等）
{
  "code": "1,0,2,5,9"
}

// 复杂格式（越南传统彩）
{
  "code": "12345",
  "code1": "67890",
  "code2": "11111",
  // ... 更多奖项
}

// 区块链格式（以太坊彩）
{
  "code": "1,2,3,4,5",
  "code_block": "23702684",
  "code_hash": "0x331e3f6cfc..."
}
```

---

## 🔐 索引与约束

### 主键
- `lottery_types.id` (PRIMARY KEY)
- `lottery_results.id` (PRIMARY KEY)

### 唯一约束
- `lottery_types.lottery_code` (UNIQUE)
- `lottery_results.(lottery_code, issue)` (UNIQUE) - 防止重复开奖记录

### 性能索引
```sql
-- lottery_results 表的优化索引
CREATE INDEX idx_lottery_results_code ON lottery_results (lottery_code);
CREATE INDEX idx_lottery_results_issue ON lottery_results (lottery_code, issue);
CREATE INDEX idx_lottery_results_open_date ON lottery_results (open_date DESC);
CREATE INDEX idx_lottery_results_lottery_code_open_date ON lottery_results (lottery_code, open_date DESC);

-- lottery_types 表的优化索引
CREATE INDEX idx_lottery_types_lottery_type ON lottery_types (lottery_type);
```

---

## 🗃️ 数据库视图（Views）

数据库包含 9 个专用视图，用于简化不同彩种的数据查询：

1. `baac_lottery_results` - BAAC 泰国储蓄彩票结果视图
2. `ethereum_lottery_results` - 以太坊彩票结果视图
3. `hongkong_lottery_results` - 香港六合彩结果视图
4. `lottery_statistics` - 彩票统计视图
5. `max3d_lottery_results` - MAX3D 彩票结果视图
6. `suffix_lottery_results` - 后缀号码彩票结果视图
7. `thai_government_lottery_results` - 泰国政府彩票结果视图
8. `vietnamese_traditional_lottery_results` - 越南传统彩票结果视图
9. `zcvip_lottery_results` - ZCVIP 彩票结果视图

---

## 🔄 数据库迁移历史

```sql
-- 1. 创建彩票表 (2025-10-31 08:13:04)
20251031081304_create_lottery_tables.sql

-- 2. 重建开奖记录表（改用JSONB） (2025-10-31 09:09:28)
20251031090928_recreate_lottery_results_with_jsonb.sql

-- 3. 启用RLS公开访问 (2025-10-31 09:15:06)
20251031091506_enable_rls_for_public_access.sql

-- 4. 为越南彩票优化 (2025-10-31 09:23:09)
20251031092309_optimize_for_vietnamese_lottery.sql
```

---

## 📦 数据导出方案

### 方案1: SQL 转储（推荐用于完整备份）

#### 优点
- ✅ 完整保留所有数据、索引、约束
- ✅ 跨平台兼容
- ✅ 易于版本控制
- ✅ 文件压缩率高

#### 导出命令

```bash
# 方法1: 使用 Supabase CLI
supabase db dump --project-ref ixqsqmftydqsibrjkuyc > lottery_backup.sql

# 方法2: 使用 pg_dump (如果有直接数据库访问权限)
pg_dump -h db.ixqsqmftydqsibrjkuyc.supabase.co \
  -U postgres \
  -d postgres \
  -F c \
  -f lottery_backup.dump

# 方法3: 只导出数据（不含结构）
pg_dump -h db.ixqsqmftydqsibrjkuyc.supabase.co \
  -U postgres \
  -d postgres \
  --data-only \
  -t lottery_types \
  -t lottery_results \
  > lottery_data_only.sql
```

#### 导入命令

```bash
# 方法1: 从 SQL 文件导入
psql -h new-database-host -U postgres -d postgres < lottery_backup.sql

# 方法2: 从 dump 文件导入
pg_restore -h new-database-host -U postgres -d postgres lottery_backup.dump
```

---

### 方案2: JSON 格式导出（推荐用于应用迁移）

#### 优点
- ✅ 易于编程处理
- ✅ 跨数据库平台（MySQL, MongoDB, etc.）
- ✅ 适合数据分析和处理

#### 导出脚本

创建 `scripts/export-database.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 需要 service_role 权限
)

async function exportDatabase() {
  console.log('🚀 开始导出数据库...')
  
  // 1. 导出彩种信息
  console.log('📋 导出 lottery_types...')
  const { data: lotteryTypes } = await supabase
    .from('lottery_types')
    .select('*')
    .order('id')
  
  // 2. 导出开奖记录（分批导出，避免内存溢出）
  console.log('📊 导出 lottery_results...')
  const batchSize = 5000
  let offset = 0
  const allResults = []
  
  while (true) {
    const { data, error } = await supabase
      .from('lottery_results')
      .select('*')
      .order('id')
      .range(offset, offset + batchSize - 1)
    
    if (error) throw error
    if (!data || data.length === 0) break
    
    allResults.push(...data)
    offset += batchSize
    console.log(`   已导出 ${allResults.length} 条记录...`)
  }
  
  // 3. 保存为 JSON 文件
  const exportDir = path.join(process.cwd(), 'database-export')
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true })
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  
  fs.writeFileSync(
    path.join(exportDir, `lottery_types_${timestamp}.json`),
    JSON.stringify(lotteryTypes, null, 2)
  )
  
  fs.writeFileSync(
    path.join(exportDir, `lottery_results_${timestamp}.json`),
    JSON.stringify(allResults, null, 2)
  )
  
  // 4. 生成元数据
  const metadata = {
    export_time: new Date().toISOString(),
    database: {
      project_id: 'ixqsqmftydqsibrjkuyc',
      region: 'ap-southeast-2',
      postgres_version: '17.6.1.032'
    },
    statistics: {
      lottery_types_count: lotteryTypes?.length || 0,
      lottery_results_count: allResults.length,
      total_size_mb: 28
    }
  }
  
  fs.writeFileSync(
    path.join(exportDir, `metadata_${timestamp}.json`),
    JSON.stringify(metadata, null, 2)
  )
  
  console.log('✅ 导出完成！')
  console.log(`📁 导出目录: ${exportDir}`)
  console.log(`📊 彩种数量: ${lotteryTypes?.length}`)
  console.log(`📊 开奖记录: ${allResults.length}`)
}

exportDatabase().catch(console.error)
```

运行导出：

```bash
tsx scripts/export-database.ts
```

---

### 方案3: CSV 格式导出（推荐用于数据分析）

#### 优点
- ✅ Excel 兼容
- ✅ 易于导入其他系统
- ✅ 文件小，压缩率高

#### 导出命令

```sql
-- 导出彩种信息
COPY lottery_types TO '/tmp/lottery_types.csv' WITH CSV HEADER;

-- 导出开奖记录（JSONB字段需要转换）
COPY (
  SELECT 
    id,
    lottery_code,
    issue,
    official_issue,
    open_date,
    code::text as code_json,
    created_at
  FROM lottery_results
) TO '/tmp/lottery_results.csv' WITH CSV HEADER;
```

---

## 🔄 迁移到其他数据库平台

### 迁移到 MySQL

```javascript
// 1. 导出 Supabase 数据为 JSON
// 2. 创建 MySQL 表结构
CREATE TABLE lottery_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lottery_code VARCHAR(50) UNIQUE,
  lottery_name VARCHAR(255),
  lottery_type VARCHAR(50),
  period_format VARCHAR(100),
  example_format VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  prize_structure JSON, -- MySQL 5.7.8+ 支持 JSON
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_lottery_type (lottery_type)
);

CREATE TABLE lottery_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lottery_code VARCHAR(50),
  issue VARCHAR(100),
  official_issue VARCHAR(100),
  open_date TIMESTAMP,
  code JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_lottery_issue (lottery_code, issue),
  INDEX idx_lottery_code (lottery_code),
  INDEX idx_open_date (open_date DESC),
  INDEX idx_lottery_code_open_date (lottery_code, open_date DESC)
);

// 3. 导入数据（使用 Node.js 脚本）
```

### 迁移到 MongoDB

```javascript
// 1. 导出 Supabase 数据为 JSON
// 2. 导入到 MongoDB

// lottery_types 集合
db.lottery_types.insertMany([...])

// lottery_results 集合
db.lottery_results.insertMany([...])

// 创建索引
db.lottery_types.createIndex({ lottery_code: 1 }, { unique: true })
db.lottery_types.createIndex({ lottery_type: 1 })

db.lottery_results.createIndex({ lottery_code: 1, issue: 1 }, { unique: true })
db.lottery_results.createIndex({ lottery_code: 1, open_date: -1 })
db.lottery_results.createIndex({ open_date: -1 })
```

### 迁移到其他 Supabase 项目

```bash
# 1. 从源项目导出
supabase db dump --project-ref ixqsqmftydqsibrjkuyc > backup.sql

# 2. 导入到新项目
supabase db push --project-ref NEW_PROJECT_ID < backup.sql
```

---

## 🛡️ 备份策略建议

### 自动备份方案

#### 1. 每日增量备份

```bash
#!/bin/bash
# daily-backup.sh

DATE=$(date +%Y%m%d)
BACKUP_DIR="/backups/lottery-api"

mkdir -p $BACKUP_DIR

# 导出最近24小时的数据
psql -h db.ixqsqmftydqsibrjkuyc.supabase.co \
  -U postgres \
  -d postgres \
  -c "COPY (
    SELECT * FROM lottery_results 
    WHERE created_at > NOW() - INTERVAL '24 hours'
  ) TO STDOUT WITH CSV HEADER" \
  > $BACKUP_DIR/incremental_$DATE.csv

# 压缩备份
gzip $BACKUP_DIR/incremental_$DATE.csv

# 删除30天前的备份
find $BACKUP_DIR -name "incremental_*.csv.gz" -mtime +30 -delete
```

#### 2. 每周完整备份

```bash
#!/bin/bash
# weekly-backup.sh

DATE=$(date +%Y%m%d)
BACKUP_DIR="/backups/lottery-api"

mkdir -p $BACKUP_DIR

# 完整数据库导出
pg_dump -h db.ixqsqmftydqsibrjkuyc.supabase.co \
  -U postgres \
  -d postgres \
  -F c \
  -f $BACKUP_DIR/full_backup_$DATE.dump

# 删除8周前的备份
find $BACKUP_DIR -name "full_backup_*.dump" -mtime +56 -delete
```

#### 3. 设置 Cron 定时任务

```bash
# 编辑 crontab
crontab -e

# 添加定时任务
# 每天凌晨2点执行增量备份
0 2 * * * /path/to/daily-backup.sh

# 每周日凌晨3点执行完整备份
0 3 * * 0 /path/to/weekly-backup.sh
```

---

## 📈 迁移难度评估

| 迁移目标 | 难度 | 时间估计 | 兼容性 | 备注 |
|---------|-----|---------|--------|------|
| 其他 Supabase 项目 | ⭐ | 10分钟 | 100% | 完全兼容 |
| PostgreSQL | ⭐⭐ | 30分钟 | 95% | 需要调整RLS策略 |
| MySQL 8.0+ | ⭐⭐⭐ | 2小时 | 85% | JSON支持良好 |
| MySQL 5.7 | ⭐⭐⭐⭐ | 4小时 | 70% | JSON支持有限 |
| MongoDB | ⭐⭐⭐ | 2小时 | 90% | NoSQL适合复杂结构 |
| SQLite | ⭐⭐⭐⭐ | 4小时 | 60% | JSON支持有限 |

---

## ✅ 迁移便利性总结

### 🟢 优势
1. **数据量适中**: 28 MB，易于传输和处理
2. **标准SQL**: PostgreSQL 语法，主流数据库都支持
3. **JSONB格式**: 灵活存储复杂数据，MongoDB完美兼容
4. **完整索引**: 性能优化到位，迁移后无需重新设计
5. **清晰结构**: 仅2个主表，9个视图，易于理解和维护
6. **完整迁移历史**: 4个migration文件，可重现数据库结构

### 🟡 注意事项
1. **JSONB字段**: 部分数据库（MySQL < 8.0, SQLite）JSON支持有限
2. **RLS策略**: Supabase特有功能，迁移时需要重新实现权限控制
3. **时区处理**: `timestamptz` 类型需要注意时区转换
4. **视图迁移**: 9个视图需要在新数据库中重新创建

### 🔵 推荐方案
- **最简单**: 迁移到其他 Supabase 项目（1-to-1复制）
- **最灵活**: 导出为 JSON，支持任意目标平台
- **最稳妥**: SQL dump + 定期备份

---

## 📞 后续支持

如需帮助执行具体的迁移操作，请告知：
1. 目标数据库平台（PostgreSQL, MySQL, MongoDB, etc.）
2. 迁移场景（备份、灾难恢复、平台切换）
3. 数据量需求（全量或增量）

我可以为您生成定制化的迁移脚本和详细步骤！🚀

