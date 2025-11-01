# 📊 数据库概览总结

> **最后更新**: 2025-11-01 (通过 Supabase MCP 自动生成)

## 🎯 快速概览

| 指标 | 数值 | 说明 |
|------|------|------|
| 📦 **总数据量** | **28 MB** | 适中，易于迁移 |
| 🎲 **彩种数量** | **179个** | 涵盖多种彩票类型 |
| 📈 **开奖记录** | **62,085+条** | 持续增长中 |
| 🗄️ **数据表** | **2个主表** | 简洁清晰 |
| 👁️ **视图** | **9个** | 针对不同彩种优化 |
| 🔐 **索引** | **9个** | 高性能查询 |
| ⚡ **迁移难度** | **⭐ 简单** | 10分钟可完成 |

---

## 📋 数据表结构

### 表1: `lottery_types` (彩种信息)

```
┌─────────────────┬──────────────┬─────────────────────────────┐
│ 字段             │ 类型          │ 说明                         │
├─────────────────┼──────────────┼─────────────────────────────┤
│ id              │ integer      │ 主键，自增                    │
│ lottery_code    │ varchar      │ 彩种代码（唯一）✨            │
│ lottery_name    │ varchar      │ 彩种名称                      │
│ lottery_type    │ varchar      │ 彩种类型                      │
│ period_format   │ varchar      │ 期号格式                      │
│ example_format  │ varchar      │ 示例格式                      │
│ is_active       │ boolean      │ 是否启用                      │
│ prize_structure │ jsonb        │ 奖项结构（JSON）🎁            │
│ created_at      │ timestamptz  │ 创建时间                      │
│ updated_at      │ timestamptz  │ 更新时间                      │
└─────────────────┴──────────────┴─────────────────────────────┘

📊 记录数: 179
💾 大小: 128 KB
```

### 表2: `lottery_results` (开奖记录)

```
┌─────────────────┬──────────────┬─────────────────────────────┐
│ 字段             │ 类型          │ 说明                         │
├─────────────────┼──────────────┼─────────────────────────────┤
│ id              │ integer      │ 主键，自增                    │
│ lottery_code    │ varchar      │ 彩种代码                      │
│ issue           │ varchar      │ 奖期号码                      │
│ official_issue  │ varchar      │ 官方奖期号码                   │
│ open_date       │ timestamptz  │ 开奖时间 ⏰                   │
│ code            │ jsonb        │ 开奖号码（支持复杂结构）🎰     │
│ created_at      │ timestamptz  │ 记录创建时间                   │
└─────────────────┴──────────────┴─────────────────────────────┘

📊 记录数: 62,085+ (持续增长)
💾 大小: 28 MB
🔄 增长速率: ~1,440条/天 (YN60: 每分钟1条)
```

---

## 🎨 彩种类型分布

```
标准彩票 (standard)                 ████████████████████ 99个  (55.3%)
越南传统彩 (vietnamese_traditional) ████████████ 41个         (22.9%)
区块链彩票 (blockchain)             ██████ 20个              (11.2%)
港式彩票 (hong_kong_style)          ███ 11个                (6.1%)
后缀号码彩 (suffix_numbers)         █ 4个                   (2.2%)
特殊多段式 (special_multi)          █ 3个                   (1.7%)
泰国政府彩 (thai_government)        █ 1个                   (0.6%)
```

### 热门彩种示例

| 类型 | 代码示例 | 开奖频率 | 数据格式 |
|------|---------|---------|---------|
| 🔥 **印尼60秒** | `YN60` | 每分钟 | 简单字符串 |
| 🎲 **越南传统** | `BLC`, `BZC` | 每周 | 复杂对象（13个奖项） |
| ⛓️ **以太坊彩** | `ET3FC`, `ET5FC` | 3-5分钟 | 含区块链信息 |
| 🇭🇰 **六合彩** | `XGLHC`, `MOLHC` | 每周 | 6+1格式 |
| 🇹🇭 **BAAC** | `BAAC` | 每月 | 13级奖项 |

---

## 🔐 索引与约束

### 主键索引 (2个)
```sql
✅ lottery_types.id
✅ lottery_results.id
```

### 唯一约束 (2个)
```sql
🔑 lottery_types.lottery_code
🔑 lottery_results.(lottery_code, issue)  -- 防止重复开奖
```

### 性能索引 (5个)
```sql
⚡ idx_lottery_results_code              -- 按彩种查询
⚡ idx_lottery_results_issue             -- 按期号查询
⚡ idx_lottery_results_open_date         -- 按日期查询
⚡ idx_lottery_results_lottery_code_open_date  -- 组合查询
⚡ idx_lottery_types_lottery_type        -- 按类型查询
```

---

## 👁️ 数据库视图 (9个)

专用视图简化不同彩种的数据查询：

| 视图名称 | 用途 | 针对彩种 |
|---------|------|---------|
| `baac_lottery_results` | BAAC彩票展开视图 | BAAC |
| `ethereum_lottery_results` | 以太坊彩票视图 | ET3FC, ET5FC, ETFFC |
| `hongkong_lottery_results` | 六合彩视图 | XGLHC, MOLHC |
| `lottery_statistics` | 统计视图 | 全部 |
| `max3d_lottery_results` | MAX3D视图 | MAX3D |
| `suffix_lottery_results` | 后缀号码视图 | TLZC, TYKC 等 |
| `thai_government_lottery_results` | 泰国政府彩视图 | TGFC |
| `vietnamese_traditional_lottery_results` | 越南传统彩视图 | 41个越南彩种 |
| `zcvip_lottery_results` | ZCVIP视图 | ZCVIP |

---

## 🔄 迁移历史

数据库经过 4 次主要迁移：

```
2025-10-31 08:13:04  ├─ create_lottery_tables
                     │  └─ 创建初始表结构

2025-10-31 09:09:28  ├─ recreate_lottery_results_with_jsonb
                     │  └─ 重建表，使用JSONB存储复杂号码

2025-10-31 09:15:06  ├─ enable_rls_for_public_access
                     │  └─ 启用行级安全（RLS）公开访问

2025-10-31 09:23:09  └─ optimize_for_vietnamese_lottery
                        └─ 为越南彩票优化结构
```

---

## 💾 数据格式示例

### 1. 简单格式 (YN60, TG300等)
```json
{
  "code": "1,0,2,5,9"
}
```

### 2. 复杂格式 (越南传统彩)
```json
{
  "code": "12345",      // 特等奖
  "code1": "67890",     // 一等奖
  "code2": "11111",     // 二等奖
  "code3": ["22222", "33333"],  // 三等奖（多个）
  // ... 最多13个奖项
}
```

### 3. 区块链格式 (以太坊彩)
```json
{
  "code": "5,9,4,2,6",
  "code_block": "23702684",
  "code_hash": "0x331e3f6cfc7a9d6b083a7e4ac245fb7a..."
}
```

### 4. 六合彩格式 (XGLHC/MOLHC)
```json
{
  "code": "8,47,10,39,5,19+45"  // 6个正码 + 1个特码
}
```

### 5. BAAC泰国储蓄彩
```json
{
  "code": "123456",     // 一等奖
  "code0": "789012",    // 帝王玉套票头奖
  "code1": "345678,456789",  // 二等奖（多个）
  // ... 最多13级奖项
}
```

---

## 📈 数据增长趋势

### 当前统计 (2025-11-01)
```
彩种总数:     179个
开奖记录:     62,085条
数据库大小:   28 MB
日均增量:     ~1,440条 (主要来自YN60等高频彩种)
```

### 预计增长
| 时间范围 | 预计记录数 | 预计大小 |
|---------|-----------|---------|
| 1个月后 | ~105,000 | ~47 MB |
| 3个月后 | ~190,000 | ~85 MB |
| 6个月后 | ~320,000 | ~143 MB |
| 1年后 | ~590,000 | ~265 MB |

💡 **建议**: 
- 定期备份（每日增量 + 每周完整）
- 考虑归档1年前的数据
- 监控存储空间使用

---

## ⚡ 迁移便利性评估

### ✅ 优势
1. **数据量适中** (28 MB) - 传输快速
2. **标准SQL结构** - 主流数据库都支持
3. **JSONB灵活性** - 完美适配MongoDB等NoSQL
4. **清晰索引** - 性能优化到位
5. **完整文档** - 迁移步骤详尽

### 🎯 迁移评分

| 目标平台 | 难度 | 时间 | 兼容性 | 推荐度 |
|---------|------|------|--------|--------|
| **Supabase** (其他项目) | ⭐ | 10分钟 | 100% | ⭐⭐⭐⭐⭐ |
| **PostgreSQL** | ⭐⭐ | 30分钟 | 95% | ⭐⭐⭐⭐⭐ |
| **MySQL 8.0+** | ⭐⭐⭐ | 2小时 | 85% | ⭐⭐⭐⭐ |
| **MongoDB** | ⭐⭐⭐ | 2小时 | 90% | ⭐⭐⭐⭐ |
| **SQLite** | ⭐⭐⭐⭐ | 4小时 | 60% | ⭐⭐ |

---

## 🛠️ 可用工具

### 1. 数据导出工具
```bash
# 完整导出
pnpm tsx scripts/export-database.ts

# 增量导出（最近24小时）
pnpm tsx scripts/export-database.ts --incremental

# 导出特定彩种
pnpm tsx scripts/export-database.ts --lottery=YN60
```

📚 **详细说明**: [scripts/README.md](scripts/README.md)

### 2. 迁移指南
📖 **完整指南**: [DATABASE_EXPORT_GUIDE.md](DATABASE_EXPORT_GUIDE.md)
- SQL导出方案
- JSON导出方案
- CSV导出方案
- 跨平台迁移步骤

---

## 🎉 结论

### 迁移便利性: ⭐⭐⭐⭐⭐ (5/5)

**您的数据库非常适合迁移！**

✅ **优点**:
- 数据量适中，易于处理
- 标准化结构，兼容性强
- JSONB格式，灵活性高
- 完整工具和文档支持
- 清晰的索引和约束

⚠️ **注意**:
- JSONB字段在旧版MySQL中支持有限
- RLS策略需要在目标平台重新实现
- 时区处理需要注意（timestamptz）

🚀 **推荐方案**:
- **最简单**: 迁移到其他Supabase项目
- **最灵活**: 导出为JSON，支持任意平台
- **最稳妥**: SQL dump + 定期自动备份

---

## 📞 获取帮助

- 📖 [数据库导出指南](DATABASE_EXPORT_GUIDE.md)
- 📜 [脚本使用说明](scripts/README.md)
- 🔧 [项目主README](README.md)

---

**数据快照时间**: 2025-11-01 14:30:00 UTC
**工具版本**: Supabase MCP v1.0

