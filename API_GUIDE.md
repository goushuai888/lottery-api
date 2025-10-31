# 📡 彩票开奖数据 API

## 基础信息

- **本地地址**: `http://localhost:3000`
- **认证**: 无需认证，免费使用

---

## API 接口

### 1. 获取彩种列表

```bash
GET /api/lottery-types
```

**参数**:
- `active` (可选): 设置为 `true` 只返回激活的彩种

**示例**:
```bash
curl "http://localhost:3000/api/lottery-types?active=true"
```

**响应**:
```json
{
  "success": true,
  "data": [
    {
      "lottery_code": "CQSSC",
      "lottery_name": "重庆时时彩",
      "is_active": true
    }
  ],
  "total": 179
}
```

---

### 2. 获取开奖记录

```bash
GET /api/lottery-results
```

**参数**:
- `lottery_code` (可选): 彩种代码
- `issue` (可选): 指定奖期
- `page` (可选): 页码，默认 1
- `limit` (可选): 每页数量，默认 50，最大 100

**示例**:
```bash
# 获取重庆时时彩记录
curl "http://localhost:3000/api/lottery-results?lottery_code=CQSSC&limit=20"

# 获取指定奖期
curl "http://localhost:3000/api/lottery-results?lottery_code=CQSSC&issue=20251031-001"
```

**响应**:
```json
{
  "success": true,
  "data": [
    {
      "lottery_code": "CQSSC",
      "issue": "20251031-001",
      "open_date": "2025-10-31T16:00:00Z",
      "code": "1,2,3,4,5"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

### 3. 获取最新开奖

```bash
GET /api/lottery-results/latest
```

**参数**:
- `lottery_code` (可选): 彩种代码，不传则返回所有彩种最新一期

**示例**:
```bash
# 获取单个彩种最新开奖
curl "http://localhost:3000/api/lottery-results/latest?lottery_code=CQSSC"

# 获取所有彩种最新开奖
curl "http://localhost:3000/api/lottery-results/latest"
```

---

### 4. 获取统计信息

```bash
GET /api/statistics
```

**示例**:
```bash
curl "http://localhost:3000/api/statistics"
```

**响应**:
```json
{
  "success": true,
  "summary": {
    "total_lottery_types": 179,
    "total_results": 1819,
    "lottery_type_categories": 3,
    "latest_draw": {
      "time": "2025-10-31T16:00:00Z",
      "lottery_code": "CQSSC",
      "issue": "20251031-001",
      "time_ago": "15分钟前"
    }
  }
}
```

---

### 5. 按类型获取彩种

```bash
GET /api/lottery-types/by-type
```

**参数**:
- `type` (可选): `standard`（标准）、`vietnamese_traditional`（越南传统）、`blockchain`（区块链）

**示例**:
```bash
# 获取所有类型
curl "http://localhost:3000/api/lottery-types/by-type"

# 只获取越南传统彩
curl "http://localhost:3000/api/lottery-types/by-type?type=vietnamese_traditional"
```

---

## JavaScript 示例

```javascript
// 获取彩种列表
fetch('http://localhost:3000/api/lottery-types?active=true')
  .then(res => res.json())
  .then(data => console.log(data))

// 获取开奖记录
fetch('http://localhost:3000/api/lottery-results?lottery_code=CQSSC&limit=20')
  .then(res => res.json())
  .then(data => console.log(data))

// 获取最新开奖
fetch('http://localhost:3000/api/lottery-results/latest?lottery_code=CQSSC')
  .then(res => res.json())
  .then(data => console.log(data))
```

---

## Python 示例

```python
import requests

# 获取彩种列表
response = requests.get('http://localhost:3000/api/lottery-types?active=true')
data = response.json()

# 获取开奖记录
response = requests.get('http://localhost:3000/api/lottery-results', params={
    'lottery_code': 'CQSSC',
    'limit': 20
})
data = response.json()
```

---

## 数据格式说明

### 标准彩票（99种）
```json
{
  "code": "1,2,3,4,5"
}
```

### 越南传统彩（41种）
```json
{
  "code": "2,2,7,9,1,1",           // 特别奖
  "code1": "3,0,1,4,9",             // 一等奖
  "code2": "1,8,9,3,3",             // 二等奖
  "code3": ["8,9,9,6,1", "1,1,3,7,2"],  // 三等奖
  ...
}
```

### 区块链彩票（20种）
```json
{
  "code": "0,6,7,6,5",
  "code_block": "23696629",
  "code_hash": "0x3f9e..."
}
```

### 港式彩票（11种）
```json
{
  "code": "6,6,5",      // 主要号码
  "code1": "0,4"        // 附加号码
}
```

---

## 跨域配置

已默认配置 CORS，可在浏览器直接调用。

---

## 完整示例

```html
<!DOCTYPE html>
<html>
<head>
    <title>彩票查询</title>
</head>
<body>
    <h1>彩票开奖查询</h1>
    <select id="lottery"></select>
    <div id="results"></div>

    <script>
        const API = 'http://localhost:3000/api'
        
        // 加载彩种列表
        fetch(`${API}/lottery-types?active=true`)
            .then(res => res.json())
            .then(data => {
                const select = document.getElementById('lottery')
                data.data.forEach(lottery => {
                    const option = document.createElement('option')
                    option.value = lottery.lottery_code
                    option.textContent = lottery.lottery_name
                    select.appendChild(option)
                })
            })
        
        // 加载开奖结果
        function loadResults(code) {
            fetch(`${API}/lottery-results?lottery_code=${code}&limit=10`)
                .then(res => res.json())
                .then(data => {
                    const div = document.getElementById('results')
                    div.innerHTML = data.data.map(item => `
                        <div>
                            <strong>${item.issue}</strong>
                            <span>${item.code}</span>
                            <small>${new Date(item.open_date).toLocaleString()}</small>
                        </div>
                    `).join('')
                })
        }
    </script>
</body>
</html>
```

---

## 支持的彩种

- **标准彩票**（99种）: 时时彩、11选5、快3、PK10 等
- **越南传统彩**（41种）: 胡志明市、河内、安江 等
- **区块链彩票**（20种）: 以太坊、比特币、哈希 等
- **港式彩票**（11种）: 香港股市、北方河内 等
- **其他特殊**（8种）: MAX3D、BAAC、泰国政府彩 等

**总计**: 179 种彩票
