'use client'

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            📖 API 接口文档
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            彩票开奖数据 API · 免费使用 · 无需认证
          </p>
          <a 
            href="/"
            className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← 返回首页
          </a>
        </div>

        <div className="space-y-8">
          {/* API 概述 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              🎯 API 概述
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p><strong>基础 URL：</strong> <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">https://lottery.langne.com</code></p>
              <p><strong>支持格式：</strong> JSON</p>
              <p><strong>字符编码：</strong> UTF-8</p>
              <p><strong>访问限制：</strong> 无限制，完全免费</p>
              <p><strong>数据更新：</strong> 每分钟自动采集</p>
              <p><strong>支持彩种：</strong> 179 个彩种</p>
            </div>
          </div>

          {/* 端点列表 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              📋 API 端点
            </h2>
            
            {/* 1. 彩种列表 */}
            <div className="mb-8 border-b pb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                1️⃣ 获取彩种列表
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded mb-3">
                <code className="text-green-600 dark:text-green-400">GET /api/lottery-types</code>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-3">获取所有支持的彩种信息</p>
              
              <div className="mb-3">
                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">查询参数：</p>
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left">参数</th>
                      <th className="px-4 py-2 text-left">类型</th>
                      <th className="px-4 py-2 text-left">必填</th>
                      <th className="px-4 py-2 text-left">说明</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 dark:text-gray-300">
                    <tr className="border-t dark:border-gray-600">
                      <td className="px-4 py-2"><code>active</code></td>
                      <td className="px-4 py-2">boolean</td>
                      <td className="px-4 py-2">否</td>
                      <td className="px-4 py-2">是否只返回活跃彩种（默认: true）</td>
                    </tr>
                    <tr className="border-t dark:border-gray-600">
                      <td className="px-4 py-2"><code>type</code></td>
                      <td className="px-4 py-2">string</td>
                      <td className="px-4 py-2">否</td>
                      <td className="px-4 py-2">彩种类型筛选</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mb-3">
                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">响应示例：</p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-xs">
{`{
  "success": true,
  "data": [
    {
      "lottery_code": "CQSSC",
      "lottery_name": "重庆时时彩",
      "lottery_type": "standard",
      "is_active": true
    }
  ],
  "total": 179
}`}
                </pre>
              </div>

              <div className="mb-3">
                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">示例请求：</p>
                <pre className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded overflow-x-auto text-sm">
{`curl https://lottery.langne.com/api/lottery-types?active=true`}
                </pre>
              </div>
            </div>

            {/* 2. 开奖结果 */}
            <div className="mb-8 border-b pb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                2️⃣ 获取开奖结果
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded mb-3">
                <code className="text-green-600 dark:text-green-400">GET /api/lottery-results</code>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-3">获取指定彩种的开奖结果</p>
              
              <div className="mb-3">
                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">查询参数：</p>
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left">参数</th>
                      <th className="px-4 py-2 text-left">类型</th>
                      <th className="px-4 py-2 text-left">必填</th>
                      <th className="px-4 py-2 text-left">说明</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 dark:text-gray-300">
                    <tr className="border-t dark:border-gray-600">
                      <td className="px-4 py-2"><code>lottery_code</code></td>
                      <td className="px-4 py-2">string</td>
                      <td className="px-4 py-2">是</td>
                      <td className="px-4 py-2">彩种代码（如: CQSSC）</td>
                    </tr>
                    <tr className="border-t dark:border-gray-600">
                      <td className="px-4 py-2"><code>page</code></td>
                      <td className="px-4 py-2">number</td>
                      <td className="px-4 py-2">否</td>
                      <td className="px-4 py-2">页码（默认: 1）</td>
                    </tr>
                    <tr className="border-t dark:border-gray-600">
                      <td className="px-4 py-2"><code>limit</code></td>
                      <td className="px-4 py-2">number</td>
                      <td className="px-4 py-2">否</td>
                      <td className="px-4 py-2">每页条数（默认: 20，最大: 100）</td>
                    </tr>
                    <tr className="border-t dark:border-gray-600">
                      <td className="px-4 py-2"><code>date</code></td>
                      <td className="px-4 py-2">string</td>
                      <td className="px-4 py-2">否</td>
                      <td className="px-4 py-2">日期筛选（格式: YYYY-MM-DD）</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mb-3">
                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">响应示例：</p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-xs">
{`{
  "success": true,
  "data": [
    {
      "id": 12345,
      "lottery_code": "CQSSC",
      "issue": "20251031-100",
      "official_issue": "20251031100",
      "open_date": "2025-10-31 22:30:00",
      "code": "1,2,3,4,5",
      "created_at": "2025-10-31T22:30:05Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1000,
    "totalPages": 50
  }
}`}
                </pre>
              </div>

              <div className="mb-3">
                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">示例请求：</p>
                <pre className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded overflow-x-auto text-sm">
{`# 获取重庆时时彩最新 20 条数据
curl https://lottery.langne.com/api/lottery-results?lottery_code=CQSSC

# 获取第 2 页，每页 50 条
curl https://lottery.langne.com/api/lottery-results?lottery_code=CQSSC&page=2&limit=50

# 获取指定日期的数据
curl https://lottery.langne.com/api/lottery-results?lottery_code=CQSSC&date=2025-10-31`}
                </pre>
              </div>
            </div>

            {/* 3. 最新一期 */}
            <div className="mb-8 border-b pb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                3️⃣ 获取最新一期
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded mb-3">
                <code className="text-green-600 dark:text-green-400">GET /api/lottery-results/latest</code>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-3">获取指定彩种的最新一期开奖结果</p>
              
              <div className="mb-3">
                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">查询参数：</p>
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left">参数</th>
                      <th className="px-4 py-2 text-left">类型</th>
                      <th className="px-4 py-2 text-left">必填</th>
                      <th className="px-4 py-2 text-left">说明</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 dark:text-gray-300">
                    <tr className="border-t dark:border-gray-600">
                      <td className="px-4 py-2"><code>lottery_code</code></td>
                      <td className="px-4 py-2">string</td>
                      <td className="px-4 py-2">是</td>
                      <td className="px-4 py-2">彩种代码</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mb-3">
                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">示例请求：</p>
                <pre className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded overflow-x-auto text-sm">
{`curl https://lottery.langne.com/api/lottery-results/latest?lottery_code=CQSSC`}
                </pre>
              </div>
            </div>

            {/* 4. 统计信息 */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                4️⃣ 获取统计信息
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded mb-3">
                <code className="text-green-600 dark:text-green-400">GET /api/statistics</code>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-3">获取平台整体统计数据</p>

              <div className="mb-3">
                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">响应示例：</p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-xs">
{`{
  "success": true,
  "summary": {
    "total_lottery_types": 179,
    "total_results": 125000,
    "lottery_type_categories": 7,
    "latest_draw": {
      "time": "2025-10-31T22:30:00Z",
      "lottery_code": "CQSSC",
      "issue": "20251031-100",
      "time_ago": "2分钟前"
    }
  }
}`}
                </pre>
              </div>

              <div className="mb-3">
                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">示例请求：</p>
                <pre className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded overflow-x-auto text-sm">
{`curl https://lottery.langne.com/api/statistics`}
                </pre>
              </div>
            </div>
          </div>

          {/* 数据结构说明 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              📦 数据结构说明
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">开奖号码格式</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">不同彩种的号码格式有所不同：</p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li><strong>标准格式：</strong> 简单字符串（如: "1,2,3,4,5"）</li>
                  <li><strong>越南传统：</strong> JSON 对象，包含多个奖项</li>
                  <li><strong>区块链彩：</strong> 包含区块信息和哈希值</li>
                  <li><strong>香港六合彩：</strong> 包含生肖、五行等信息</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">彩种类型</h3>
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left">类型</th>
                      <th className="px-4 py-2 text-left">说明</th>
                      <th className="px-4 py-2 text-left">示例</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 dark:text-gray-300">
                    <tr className="border-t dark:border-gray-600">
                      <td className="px-4 py-2"><code>standard</code></td>
                      <td className="px-4 py-2">标准彩种</td>
                      <td className="px-4 py-2">重庆时时彩、北京赛车</td>
                    </tr>
                    <tr className="border-t dark:border-gray-600">
                      <td className="px-4 py-2"><code>vietnamese</code></td>
                      <td className="px-4 py-2">越南传统彩</td>
                      <td className="px-4 py-2">河内彩、胡志明彩</td>
                    </tr>
                    <tr className="border-t dark:border-gray-600">
                      <td className="px-4 py-2"><code>blockchain</code></td>
                      <td className="px-4 py-2">区块链彩</td>
                      <td className="px-4 py-2">以太坊3分彩、比特币5分彩</td>
                    </tr>
                    <tr className="border-t dark:border-gray-600">
                      <td className="px-4 py-2"><code>hong_kong_style</code></td>
                      <td className="px-4 py-2">香港风格</td>
                      <td className="px-4 py-2">香港六合彩</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 错误代码 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              ⚠️ 错误代码说明
            </h2>
            
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">HTTP 状态码</th>
                  <th className="px-4 py-2 text-left">说明</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 dark:text-gray-300">
                <tr className="border-t dark:border-gray-600">
                  <td className="px-4 py-2"><code>200</code></td>
                  <td className="px-4 py-2">请求成功</td>
                </tr>
                <tr className="border-t dark:border-gray-600">
                  <td className="px-4 py-2"><code>400</code></td>
                  <td className="px-4 py-2">请求参数错误</td>
                </tr>
                <tr className="border-t dark:border-gray-600">
                  <td className="px-4 py-2"><code>404</code></td>
                  <td className="px-4 py-2">资源不存在</td>
                </tr>
                <tr className="border-t dark:border-gray-600">
                  <td className="px-4 py-2"><code>500</code></td>
                  <td className="px-4 py-2">服务器内部错误</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-4">
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">错误响应格式：</p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-xs">
{`{
  "success": false,
  "error": "错误描述",
  "message": "详细错误信息"
}`}
              </pre>
            </div>
          </div>

          {/* 使用示例 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              💻 代码示例
            </h2>
            
            <div className="space-y-6">
              {/* JavaScript */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">JavaScript / Node.js</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
{`// 使用 fetch
const response = await fetch(
  'https://lottery.langne.com/api/lottery-results?lottery_code=CQSSC&limit=10'
);
const data = await response.json();
console.log(data);

// 使用 axios
const axios = require('axios');
const { data } = await axios.get(
  'https://lottery.langne.com/api/lottery-results',
  { params: { lottery_code: 'CQSSC', limit: 10 } }
);
console.log(data);`}
                </pre>
              </div>

              {/* Python */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Python</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
{`import requests

# 获取开奖数据
url = 'https://lottery.langne.com/api/lottery-results'
params = {'lottery_code': 'CQSSC', 'limit': 10}
response = requests.get(url, params=params)
data = response.json()
print(data)`}
                </pre>
              </div>

              {/* PHP */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">PHP</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
{`<?php
$url = 'https://lottery.langne.com/api/lottery-results?lottery_code=CQSSC&limit=10';
$response = file_get_contents($url);
$data = json_decode($response, true);
print_r($data);
?>`}
                </pre>
              </div>
            </div>
          </div>

          {/* 联系支持 */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              📞 技术支持
            </h2>
            <div className="text-gray-600 dark:text-gray-300 space-y-2">
              <p>✅ 完全免费，无需注册</p>
              <p>✅ 无访问限制，无需 API Key</p>
              <p>✅ 支持 CORS，可直接前端调用</p>
              <p>✅ 每分钟自动更新数据</p>
              <p className="mt-4">
                <strong>数据源：</strong> <a href="https://lottery.langne.com" className="text-blue-600 dark:text-blue-400 hover:underline">https://lottery.langne.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

