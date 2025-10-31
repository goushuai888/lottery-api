'use client'

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 头部导航 */}
        <div className="mb-8">
          <a 
            href="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-4"
          >
            ← 返回首页
          </a>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                API 接口文档
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                版本 1.0 · 更新时间：2025-10-31
              </p>
            </div>
            <div className="text-right">
              <div className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-lg">
                <span className="font-semibold">状态：</span> 
                <span className="ml-2">🟢 正常运行</span>
              </div>
            </div>
          </div>
        </div>

        {/* 快速导航 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            📑 快速导航
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a href="#overview" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">概述</a>
            <a href="#authentication" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">认证</a>
            <a href="#endpoints" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">接口端点</a>
            <a href="#responses" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">响应格式</a>
            <a href="#errors" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">错误处理</a>
            <a href="#rate-limits" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">速率限制</a>
            <a href="#examples" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">代码示例</a>
            <a href="#best-practices" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">最佳实践</a>
          </div>
        </div>

        <div className="space-y-8">
          {/* API 概述 */}
          <div id="overview" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span>🎯</span> API 概述
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
                <p className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                  关于本 API
                </p>
                <p className="text-sm">
                  彩票开奖数据 API 提供全面的彩票开奖信息查询服务，覆盖 179 个主流彩种，数据每分钟自动更新。
                  所有接口均采用 RESTful 设计规范，返回标准 JSON 格式数据。
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold mb-2">基础信息</p>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b dark:border-gray-700">
                        <td className="py-2 font-medium">基础 URL</td>
                        <td className="py-2"><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">https://lottery.langne.com</code></td>
                      </tr>
                      <tr className="border-b dark:border-gray-700">
                        <td className="py-2 font-medium">协议</td>
                        <td className="py-2">HTTPS (TLS 1.2+)</td>
                      </tr>
                      <tr className="border-b dark:border-gray-700">
                        <td className="py-2 font-medium">数据格式</td>
                        <td className="py-2">JSON</td>
                      </tr>
                      <tr className="border-b dark:border-gray-700">
                        <td className="py-2 font-medium">字符编码</td>
                        <td className="py-2">UTF-8</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <p className="font-semibold mb-2">服务特性</p>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b dark:border-gray-700">
                        <td className="py-2 font-medium">认证方式</td>
                        <td className="py-2">无需认证</td>
                      </tr>
                      <tr className="border-b dark:border-gray-700">
                        <td className="py-2 font-medium">访问限制</td>
                        <td className="py-2">无限制</td>
                      </tr>
                      <tr className="border-b dark:border-gray-700">
                        <td className="py-2 font-medium">CORS 支持</td>
                        <td className="py-2">✅ 完全支持</td>
                      </tr>
                      <tr className="border-b dark:border-gray-700">
                        <td className="py-2 font-medium">更新频率</td>
                        <td className="py-2">每分钟</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* 认证说明 */}
          <div id="authentication" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span>🔐</span> 认证与授权
            </h2>
            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded">
              <p className="font-semibold text-green-800 dark:text-green-300 mb-2">
                🎉 完全开放，无需认证
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                本 API 完全免费开放，无需注册账号，无需申请 API Key，无需任何认证流程。
                您可以直接在客户端代码中调用 API，支持跨域请求（CORS）。
              </p>
            </div>
          </div>

          {/* 接口端点 */}
          <div id="endpoints" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <span>📋</span> API 端点
            </h2>
            
            {/* 端点 1: 获取彩种列表 */}
            <div className="mb-10 pb-10 border-b dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  获取彩种列表
                </h3>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded text-sm font-mono">
                  GET
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-4">
                <code className="text-sm text-gray-800 dark:text-gray-200">
                  GET /api/lottery-types
                </code>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4">
                获取系统支持的所有彩种列表，包括彩种代码、名称、类型等基本信息。
              </p>

              {/* 请求参数 */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">请求参数（Query Parameters）</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border dark:border-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">参数名</th>
                        <th className="px-4 py-3 text-left font-semibold">类型</th>
                        <th className="px-4 py-3 text-left font-semibold">必填</th>
                        <th className="px-4 py-3 text-left font-semibold">默认值</th>
                        <th className="px-4 py-3 text-left font-semibold">说明</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 dark:text-gray-300">
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">active</code></td>
                        <td className="px-4 py-3">boolean</td>
                        <td className="px-4 py-3">否</td>
                        <td className="px-4 py-3"><code>true</code></td>
                        <td className="px-4 py-3">是否只返回活跃彩种</td>
                      </tr>
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">type</code></td>
                        <td className="px-4 py-3">string</td>
                        <td className="px-4 py-3">否</td>
                        <td className="px-4 py-3">-</td>
                        <td className="px-4 py-3">按类型筛选（standard/vietnamese/blockchain等）</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 请求示例 */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">请求示例</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">获取所有活跃彩种：</p>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
{`curl -X GET "https://lottery.langne.com/api/lottery-types?active=true" \\
  -H "Accept: application/json"`}
                    </pre>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">获取特定类型的彩种：</p>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
{`curl -X GET "https://lottery.langne.com/api/lottery-types?type=vietnamese" \\
  -H "Accept: application/json"`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* 响应示例 */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">响应示例（200 OK）</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
{`{
  "success": true,
  "data": [
    {
      "lottery_code": "CQSSC",
      "lottery_name": "重庆时时彩",
      "lottery_type": "standard",
      "is_active": true,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-10-31T12:00:00Z"
    },
    {
      "lottery_code": "HNFC",
      "lottery_name": "河内五分彩",
      "lottery_type": "vietnamese",
      "is_active": true,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-10-31T12:00:00Z"
    }
  ],
  "total": 179,
  "timestamp": "2025-10-31T14:30:00Z"
}`}
                </pre>
              </div>

              {/* 响应字段说明 */}
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">响应字段说明</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border dark:border-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">字段名</th>
                        <th className="px-4 py-3 text-left font-semibold">类型</th>
                        <th className="px-4 py-3 text-left font-semibold">说明</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 dark:text-gray-300">
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code>success</code></td>
                        <td className="px-4 py-3">boolean</td>
                        <td className="px-4 py-3">请求是否成功</td>
                      </tr>
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code>data</code></td>
                        <td className="px-4 py-3">array</td>
                        <td className="px-4 py-3">彩种数据数组</td>
                      </tr>
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code>data[].lottery_code</code></td>
                        <td className="px-4 py-3">string</td>
                        <td className="px-4 py-3">彩种唯一标识代码</td>
                      </tr>
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code>data[].lottery_name</code></td>
                        <td className="px-4 py-3">string</td>
                        <td className="px-4 py-3">彩种中文名称</td>
                      </tr>
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code>data[].lottery_type</code></td>
                        <td className="px-4 py-3">string</td>
                        <td className="px-4 py-3">彩种类型（standard/vietnamese/blockchain等）</td>
                      </tr>
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code>total</code></td>
                        <td className="px-4 py-3">number</td>
                        <td className="px-4 py-3">总彩种数量</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 端点 2: 获取开奖结果 */}
            <div className="mb-10 pb-10 border-b dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    获取开奖结果
                  </h3>
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded text-xs font-semibold">
                    核心接口
                  </span>
                </div>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded text-sm font-mono">
                  GET
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-4">
                <code className="text-sm text-gray-800 dark:text-gray-200">
                  GET /api/lottery-results
                </code>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4">
                获取指定彩种的历史开奖记录，支持分页查询和日期筛选。此接口已进行 S 级性能优化，响应时间 &lt; 100ms。
              </p>

              {/* 请求参数 */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">请求参数（Query Parameters）</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border dark:border-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">参数名</th>
                        <th className="px-4 py-3 text-left font-semibold">类型</th>
                        <th className="px-4 py-3 text-left font-semibold">必填</th>
                        <th className="px-4 py-3 text-left font-semibold">默认值</th>
                        <th className="px-4 py-3 text-left font-semibold">说明</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 dark:text-gray-300">
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">lottery_code</code></td>
                        <td className="px-4 py-3">string</td>
                        <td className="px-4 py-3"><span className="text-red-600 font-bold">是</span></td>
                        <td className="px-4 py-3">-</td>
                        <td className="px-4 py-3">彩种代码（如：CQSSC）</td>
                      </tr>
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">page</code></td>
                        <td className="px-4 py-3">integer</td>
                        <td className="px-4 py-3">否</td>
                        <td className="px-4 py-3">1</td>
                        <td className="px-4 py-3">页码，从 1 开始</td>
                      </tr>
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">limit</code></td>
                        <td className="px-4 py-3">integer</td>
                        <td className="px-4 py-3">否</td>
                        <td className="px-4 py-3">20</td>
                        <td className="px-4 py-3">每页条数，范围：1-100</td>
                      </tr>
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">date</code></td>
                        <td className="px-4 py-3">string</td>
                        <td className="px-4 py-3">否</td>
                        <td className="px-4 py-3">-</td>
                        <td className="px-4 py-3">日期筛选，格式：YYYY-MM-DD</td>
                      </tr>
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">start_date</code></td>
                        <td className="px-4 py-3">string</td>
                        <td className="px-4 py-3">否</td>
                        <td className="px-4 py-3">-</td>
                        <td className="px-4 py-3">开始日期，格式：YYYY-MM-DD</td>
                      </tr>
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">end_date</code></td>
                        <td className="px-4 py-3">string</td>
                        <td className="px-4 py-3">否</td>
                        <td className="px-4 py-3">-</td>
                        <td className="px-4 py-3">结束日期，格式：YYYY-MM-DD</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 请求示例 */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">请求示例</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">基础查询（获取重庆时时彩最新 20 条）：</p>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
{`curl -X GET "https://lottery.langne.com/api/lottery-results?lottery_code=CQSSC" \\
  -H "Accept: application/json"`}
                    </pre>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">分页查询（第 2 页，每页 50 条）：</p>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
{`curl -X GET "https://lottery.langne.com/api/lottery-results?lottery_code=CQSSC&page=2&limit=50" \\
  -H "Accept: application/json"`}
                    </pre>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">日期筛选（获取指定日期的数据）：</p>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
{`curl -X GET "https://lottery.langne.com/api/lottery-results?lottery_code=CQSSC&date=2025-10-31" \\
  -H "Accept: application/json"`}
                    </pre>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">日期范围查询：</p>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
{`curl -X GET "https://lottery.langne.com/api/lottery-results?lottery_code=CQSSC&start_date=2025-10-01&end_date=2025-10-31" \\
  -H "Accept: application/json"`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* 响应示例 */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">响应示例（200 OK）</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
{`{
  "success": true,
  "data": [
    {
      "id": 123456,
      "lottery_code": "CQSSC",
      "issue": "20251031-100",
      "official_issue": "20251031100",
      "open_date": "2025-10-31 22:30:00",
      "code": "1,2,3,4,5",
      "created_at": "2025-10-31T22:30:05Z",
      "updated_at": "2025-10-31T22:30:05Z"
    },
    {
      "id": 123455,
      "lottery_code": "CQSSC",
      "issue": "20251031-099",
      "official_issue": "20251031099",
      "open_date": "2025-10-31 22:20:00",
      "code": "5,4,3,2,1",
      "created_at": "2025-10-31T22:20:05Z",
      "updated_at": "2025-10-31T22:20:05Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1000,
    "totalPages": 50
  },
  "performance": {
    "query_time_ms": 45
  },
  "timestamp": "2025-10-31T22:35:00Z"
}`}
                </pre>
              </div>

              {/* 响应字段说明 */}
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">响应字段说明</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border dark:border-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">字段名</th>
                        <th className="px-4 py-3 text-left font-semibold">类型</th>
                        <th className="px-4 py-3 text-left font-semibold">说明</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 dark:text-gray-300">
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code>data[].id</code></td>
                        <td className="px-4 py-3">integer</td>
                        <td className="px-4 py-3">记录唯一 ID</td>
                      </tr>
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code>data[].lottery_code</code></td>
                        <td className="px-4 py-3">string</td>
                        <td className="px-4 py-3">彩种代码</td>
                      </tr>
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code>data[].issue</code></td>
                        <td className="px-4 py-3">string</td>
                        <td className="px-4 py-3">期号（统一格式）</td>
                      </tr>
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code>data[].official_issue</code></td>
                        <td className="px-4 py-3">string</td>
                        <td className="px-4 py-3">官方期号（原始格式）</td>
                      </tr>
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code>data[].open_date</code></td>
                        <td className="px-4 py-3">string</td>
                        <td className="px-4 py-3">开奖时间（本地时区）</td>
                      </tr>
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code>data[].code</code></td>
                        <td className="px-4 py-3">string/object</td>
                        <td className="px-4 py-3">开奖号码（格式因彩种类型而异）</td>
                      </tr>
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code>pagination</code></td>
                        <td className="px-4 py-3">object</td>
                        <td className="px-4 py-3">分页信息</td>
                      </tr>
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code>performance.query_time_ms</code></td>
                        <td className="px-4 py-3">integer</td>
                        <td className="px-4 py-3">查询耗时（毫秒）</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 端点 3: 获取最新一期 */}
            <div className="mb-10 pb-10 border-b dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  获取最新一期开奖
                </h3>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded text-sm font-mono">
                  GET
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-4">
                <code className="text-sm text-gray-800 dark:text-gray-200">
                  GET /api/lottery-results/latest
                </code>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4">
                快速获取指定彩种的最新一期开奖结果，适用于需要实时展示最新开奖的场景。
              </p>

              {/* 请求参数 */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">请求参数</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border dark:border-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">参数名</th>
                        <th className="px-4 py-3 text-left font-semibold">类型</th>
                        <th className="px-4 py-3 text-left font-semibold">必填</th>
                        <th className="px-4 py-3 text-left font-semibold">说明</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 dark:text-gray-300">
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">lottery_code</code></td>
                        <td className="px-4 py-3">string</td>
                        <td className="px-4 py-3"><span className="text-red-600 font-bold">是</span></td>
                        <td className="px-4 py-3">彩种代码</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 请求示例 */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">请求示例</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
{`curl -X GET "https://lottery.langne.com/api/lottery-results/latest?lottery_code=CQSSC" \\
  -H "Accept: application/json"`}
                </pre>
              </div>

              {/* 响应示例 */}
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">响应示例（200 OK）</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
{`{
  "success": true,
  "data": {
    "id": 123456,
    "lottery_code": "CQSSC",
    "issue": "20251031-100",
    "official_issue": "20251031100",
    "open_date": "2025-10-31 22:30:00",
    "code": "1,2,3,4,5",
    "created_at": "2025-10-31T22:30:05Z"
  },
  "timestamp": "2025-10-31T22:35:00Z"
}`}
                </pre>
              </div>
            </div>

            {/* 端点 4: 获取统计信息 */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  获取平台统计信息
                </h3>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded text-sm font-mono">
                  GET
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-4">
                <code className="text-sm text-gray-800 dark:text-gray-200">
                  GET /api/statistics
                </code>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4">
                获取平台整体统计数据，包括彩种数量、开奖记录总数、最新开奖信息等。
              </p>

              {/* 请求示例 */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">请求示例</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
{`curl -X GET "https://lottery.langne.com/api/statistics" \\
  -H "Accept: application/json"`}
                </pre>
              </div>

              {/* 响应示例 */}
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">响应示例（200 OK）</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
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
      "time_ago": "5分钟前"
    }
  },
  "timestamp": "2025-10-31T22:35:00Z"
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* 响应格式说明 */}
          <div id="responses" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span>📦</span> 响应格式规范
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">标准响应结构</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  所有 API 响应均采用统一的 JSON 格式，包含以下标准字段：
                </p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
{`{
  "success": boolean,        // 请求是否成功
  "data": object | array,    // 响应数据（成功时）
  "error": string,           // 错误信息（失败时）
  "message": string,         // 详细描述（可选）
  "timestamp": string        // 响应时间戳（ISO 8601格式）
}`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">开奖号码格式</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  不同类型的彩种，<code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">code</code> 字段的格式有所不同：
                </p>
                
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-sm mb-1">标准格式（standard）</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">适用于：重庆时时彩、北京赛车、11选5等</p>
                    <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
{`"code": "1,2,3,4,5"`}
                    </pre>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="font-semibold text-sm mb-1">越南传统格式（vietnamese）</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">适用于：河内彩、胡志明彩等</p>
                    <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
{`"code": {
  "first_prize": "12345",
  "second_prize": "67890",
  "special_prizes": ["11111", "22222"]
  // ... 更多奖项
}`}
                    </pre>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4">
                    <p className="font-semibold text-sm mb-1">区块链格式（blockchain）</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">适用于：以太坊彩、比特币彩等</p>
                    <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
{`"code": {
  "code": "1,2,3,4,5",
  "code_block": "23697768",
  "code_hash": "0xfac6573055cc28809..."
}`}
                    </pre>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">分页响应</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  支持分页的接口会额外返回 <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">pagination</code> 对象：
                </p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
{`"pagination": {
  "page": 1,           // 当前页码
  "limit": 20,         // 每页条数
  "total": 1000,       // 总记录数
  "totalPages": 50     // 总页数
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* 错误处理 */}
          <div id="errors" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span>⚠️</span> 错误处理
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3">HTTP 状态码</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border dark:border-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">状态码</th>
                        <th className="px-4 py-3 text-left font-semibold">说明</th>
                        <th className="px-4 py-3 text-left font-semibold">常见原因</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 dark:text-gray-300">
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code className="text-green-600 dark:text-green-400">200</code></td>
                        <td className="px-4 py-3">OK</td>
                        <td className="px-4 py-3">请求成功</td>
                      </tr>
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code className="text-orange-600 dark:text-orange-400">400</code></td>
                        <td className="px-4 py-3">Bad Request</td>
                        <td className="px-4 py-3">请求参数错误或缺失必填参数</td>
                      </tr>
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code className="text-orange-600 dark:text-orange-400">404</code></td>
                        <td className="px-4 py-3">Not Found</td>
                        <td className="px-4 py-3">请求的资源不存在（如彩种代码错误）</td>
                      </tr>
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code className="text-red-600 dark:text-red-400">500</code></td>
                        <td className="px-4 py-3">Internal Server Error</td>
                        <td className="px-4 py-3">服务器内部错误</td>
                      </tr>
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code className="text-red-600 dark:text-red-400">503</code></td>
                        <td className="px-4 py-3">Service Unavailable</td>
                        <td className="px-4 py-3">服务暂时不可用（维护中）</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3">错误响应格式</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
{`{
  "success": false,
  "error": "INVALID_LOTTERY_CODE",
  "message": "彩种代码不存在或格式错误",
  "details": {
    "lottery_code": "INVALID_CODE",
    "valid_codes_example": ["CQSSC", "HNFC", "BJPK10"]
  },
  "timestamp": "2025-10-31T22:35:00Z"
}`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3">常见错误代码</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border dark:border-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">错误代码</th>
                        <th className="px-4 py-3 text-left font-semibold">说明</th>
                        <th className="px-4 py-3 text-left font-semibold">解决方案</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 dark:text-gray-300">
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code>MISSING_PARAMETER</code></td>
                        <td className="px-4 py-3">缺少必填参数</td>
                        <td className="px-4 py-3">检查请求参数，补充缺失的必填字段</td>
                      </tr>
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code>INVALID_LOTTERY_CODE</code></td>
                        <td className="px-4 py-3">彩种代码无效</td>
                        <td className="px-4 py-3">先调用获取彩种列表接口确认有效代码</td>
                      </tr>
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code>INVALID_DATE_FORMAT</code></td>
                        <td className="px-4 py-3">日期格式错误</td>
                        <td className="px-4 py-3">使用 YYYY-MM-DD 格式</td>
                      </tr>
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code>INVALID_PAGE</code></td>
                        <td className="px-4 py-3">页码无效</td>
                        <td className="px-4 py-3">页码必须大于 0</td>
                      </tr>
                      <tr className="border-t dark:border-gray-700">
                        <td className="px-4 py-3"><code>LIMIT_EXCEEDED</code></td>
                        <td className="px-4 py-3">limit 参数超出范围</td>
                        <td className="px-4 py-3">limit 值应在 1-100 之间</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* 速率限制 */}
          <div id="rate-limits" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span>⏱️</span> 速率限制
            </h2>
            
            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded mb-4">
              <p className="font-semibold text-green-800 dark:text-green-300 mb-2">
                🎉 当前无速率限制
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                为了方便开发者使用，本 API 目前不设置速率限制。我们保留在必要时实施合理限制的权利，届时会提前通知。
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">使用建议</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>建议使用缓存机制，避免频繁请求相同的数据</li>
                <li>对于高频查询场景，建议缓存时间设置为 30-60 秒</li>
                <li>使用分页功能时，建议 limit 参数不超过 100</li>
                <li>避免在循环中进行 API 调用，建议批量处理</li>
              </ul>
            </div>
          </div>

          {/* 代码示例 */}
          <div id="examples" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <span>💻</span> 代码示例
            </h2>
            
            <div className="space-y-6">
              {/* JavaScript */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">JavaScript / Node.js</h3>
                  <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded text-xs">
                    推荐
                  </span>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// 使用 async/await
async function getLotteryResults(lotteryCode, page = 1, limit = 20) {
  try {
    const response = await fetch(
      \`https://lottery.langne.com/api/lottery-results?lottery_code=\${lotteryCode}&page=\${page}&limit=\${limit}\`
    );
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      console.log(\`获取到 \${data.data.length} 条记录\`);
      return data.data;
    } else {
      console.error('请求失败:', data.error);
      return null;
    }
  } catch (error) {
    console.error('网络错误:', error);
    return null;
  }
}

// 使用示例
getLotteryResults('CQSSC', 1, 50).then(results => {
  if (results) {
    results.forEach(item => {
      console.log(\`期号: \${item.issue}, 号码: \${item.code}\`);
    });
  }
});

// 使用 axios
const axios = require('axios');

axios.get('https://lottery.langne.com/api/lottery-results', {
  params: {
    lottery_code: 'CQSSC',
    page: 1,
    limit: 20
  }
})
.then(response => {
  const data = response.data;
  if (data.success) {
    console.log('数据:', data.data);
  }
})
.catch(error => {
  console.error('Error:', error);
});`}
                </pre>
              </div>

              {/* Python */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Python</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import requests
from typing import Optional, Dict, List

class LotteryAPI:
    BASE_URL = "https://lottery.langne.com"
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'Accept': 'application/json',
            'User-Agent': 'LotteryClient/1.0'
        })
    
    def get_lottery_types(self, active: bool = True) -> Optional[List[Dict]]:
        """获取彩种列表"""
        try:
            response = self.session.get(
                f"{self.BASE_URL}/api/lottery-types",
                params={'active': active}
            )
            response.raise_for_status()
            data = response.json()
            return data.get('data') if data.get('success') else None
        except requests.RequestException as e:
            print(f"请求失败: {e}")
            return None
    
    def get_lottery_results(
        self, 
        lottery_code: str, 
        page: int = 1, 
        limit: int = 20,
        date: Optional[str] = None
    ) -> Optional[Dict]:
        """获取开奖结果"""
        params = {
            'lottery_code': lottery_code,
            'page': page,
            'limit': limit
        }
        if date:
            params['date'] = date
        
        try:
            response = self.session.get(
                f"{self.BASE_URL}/api/lottery-results",
                params=params
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"请求失败: {e}")
            return None

# 使用示例
if __name__ == "__main__":
    api = LotteryAPI()
    
    # 获取彩种列表
    types = api.get_lottery_types()
    if types:
        print(f"共有 {len(types)} 个彩种")
    
    # 获取开奖结果
    results = api.get_lottery_results('CQSSC', page=1, limit=10)
    if results and results.get('success'):
        for item in results['data']:
            print(f"期号: {item['issue']}, 号码: {item['code']}")`}
                </pre>
              </div>

              {/* PHP */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">PHP</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`<?php

class LotteryAPI {
    private $baseUrl = 'https://lottery.langne.com';
    
    /**
     * 获取彩种列表
     */
    public function getLotteryTypes($active = true) {
        $url = $this->baseUrl . '/api/lottery-types';
        $params = ['active' => $active ? 'true' : 'false'];
        
        return $this->request($url, $params);
    }
    
    /**
     * 获取开奖结果
     */
    public function getLotteryResults($lotteryCode, $page = 1, $limit = 20, $date = null) {
        $url = $this->baseUrl . '/api/lottery-results';
        $params = [
            'lottery_code' => $lotteryCode,
            'page' => $page,
            'limit' => $limit
        ];
        
        if ($date) {
            $params['date'] = $date;
        }
        
        return $this->request($url, $params);
    }
    
    /**
     * 获取最新一期
     */
    public function getLatestResult($lotteryCode) {
        $url = $this->baseUrl . '/api/lottery-results/latest';
        $params = ['lottery_code' => $lotteryCode];
        
        return $this->request($url, $params);
    }
    
    /**
     * 发送请求
     */
    private function request($url, $params = []) {
        $fullUrl = $url . '?' . http_build_query($params);
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $fullUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Accept: application/json',
            'User-Agent: LotteryClient/1.0'
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200) {
            return ['success' => false, 'error' => 'HTTP Error: ' . $httpCode];
        }
        
        return json_decode($response, true);
    }
}

// 使用示例
$api = new LotteryAPI();

// 获取彩种列表
$types = $api->getLotteryTypes();
if ($types['success']) {
    echo "共有 " . count($types['data']) . " 个彩种\\n";
}

// 获取开奖结果
$results = $api->getLotteryResults('CQSSC', 1, 20);
if ($results['success']) {
    foreach ($results['data'] as $item) {
        echo "期号: {$item['issue']}, 号码: {$item['code']}\\n";
    }
}

// 获取最新一期
$latest = $api->getLatestResult('CQSSC');
if ($latest['success']) {
    echo "最新开奖: " . json_encode($latest['data'], JSON_UNESCAPED_UNICODE) . "\\n";
}
?>`}
                </pre>
              </div>

              {/* Java */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Java</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class LotteryAPI {
    private static final String BASE_URL = "https://lottery.langne.com";
    private final HttpClient client;
    private final Gson gson;
    
    public LotteryAPI() {
        this.client = HttpClient.newHttpClient();
        this.gson = new Gson();
    }
    
    /**
     * 获取开奖结果
     */
    public JsonObject getLotteryResults(String lotteryCode, int page, int limit) {
        String url = String.format(
            "%s/api/lottery-results?lottery_code=%s&page=%d&limit=%d",
            BASE_URL, lotteryCode, page, limit
        );
        
        try {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Accept", "application/json")
                .GET()
                .build();
            
            HttpResponse<String> response = client.send(
                request, 
                HttpResponse.BodyHandlers.ofString()
            );
            
            if (response.statusCode() == 200) {
                return gson.fromJson(response.body(), JsonObject.class);
            } else {
                System.err.println("HTTP Error: " + response.statusCode());
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
    /**
     * 使用示例
     */
    public static void main(String[] args) {
        LotteryAPI api = new LotteryAPI();
        JsonObject results = api.getLotteryResults("CQSSC", 1, 20);
        
        if (results != null && results.get("success").getAsBoolean()) {
            System.out.println("获取成功:");
            System.out.println(results.toString());
        }
    }
}`}
                </pre>
              </div>

              {/* Go */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Go</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`package main

import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
    "net/url"
)

const BaseURL = "https://lottery.langne.com"

type LotteryAPI struct {
    client *http.Client
}

type APIResponse struct {
    Success bool        \`json:"success"\`
    Data    interface{} \`json:"data"\`
    Error   string      \`json:"error,omitempty"\`
}

func NewLotteryAPI() *LotteryAPI {
    return &LotteryAPI{
        client: &http.Client{},
    }
}

// 获取开奖结果
func (api *LotteryAPI) GetLotteryResults(lotteryCode string, page, limit int) (*APIResponse, error) {
    params := url.Values{}
    params.Add("lottery_code", lotteryCode)
    params.Add("page", fmt.Sprintf("%d", page))
    params.Add("limit", fmt.Sprintf("%d", limit))
    
    apiURL := fmt.Sprintf("%s/api/lottery-results?%s", BaseURL, params.Encode())
    
    req, err := http.NewRequest("GET", apiURL, nil)
    if err != nil {
        return nil, err
    }
    
    req.Header.Set("Accept", "application/json")
    
    resp, err := api.client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()
    
    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        return nil, err
    }
    
    var result APIResponse
    err = json.Unmarshal(body, &result)
    if err != nil {
        return nil, err
    }
    
    return &result, nil
}

func main() {
    api := NewLotteryAPI()
    
    results, err := api.GetLotteryResults("CQSSC", 1, 20)
    if err != nil {
        fmt.Printf("Error: %v\\n", err)
        return
    }
    
    if results.Success {
        fmt.Println("获取成功:", results.Data)
    } else {
        fmt.Println("请求失败:", results.Error)
    }
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* 最佳实践 */}
          <div id="best-practices" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <span>✨</span> 最佳实践
            </h2>
            
            <div className="space-y-6">
              {/* 性能优化 */}
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <span>🚀</span> 性能优化建议
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span><strong>使用缓存：</strong>对于不频繁变化的数据（如彩种列表），建议在客户端缓存 24 小时</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span><strong>合理分页：</strong>单次请求的 limit 不宜过大，建议 20-50 之间，避免影响性能</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span><strong>并发控制：</strong>如需获取多个彩种数据，建议使用 Promise.all 或类似并发控制机制</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span><strong>数据更新频率：</strong>开奖结果建议每 1-2 分钟刷新一次即可</span>
                  </li>
                </ul>
              </div>

              {/* 错误处理 */}
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <span>⚠️</span> 错误处理建议
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span><strong>检查 success 字段：</strong>始终检查响应中的 success 字段，而不仅仅是 HTTP 状态码</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span><strong>实现重试机制：</strong>对于网络错误或 5xx 错误，建议实现指数退避的重试策略</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span><strong>优雅降级：</strong>API 请求失败时，应提供友好的错误提示，避免应用崩溃</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span><strong>日志记录：</strong>记录所有 API 请求和响应，便于排查问题</span>
                  </li>
                </ul>
              </div>

              {/* 安全建议 */}
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <span>🔒</span> 安全建议
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span><strong>使用 HTTPS：</strong>始终使用 HTTPS 协议访问 API</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span><strong>输入验证：</strong>在客户端验证用户输入，避免发送无效请求</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span><strong>避免暴露敏感信息：</strong>不要在前端代码或日志中暴露敏感业务逻辑</span>
                  </li>
                </ul>
              </div>

              {/* 开发建议 */}
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <span>💡</span> 开发建议
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span><strong>封装 API 客户端：</strong>建议将 API 调用封装成独立的客户端类或模块</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span><strong>类型定义：</strong>使用 TypeScript 或类似工具定义响应数据的类型</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span><strong>版本控制：</strong>虽然当前无需指定版本，但建议在代码中记录使用的 API 版本</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span><strong>单元测试：</strong>为 API 调用编写单元测试，确保代码质量</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 常见问题 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <span>❓</span> 常见问题（FAQ）
            </h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Q: API 是否完全免费？
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  A: 是的，本 API 完全免费，无任何隐藏费用，无需注册，无需 API Key，无访问限制。
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Q: 数据更新频率如何？
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  A: 系统每分钟自动采集一次数据，确保数据的实时性。对于分分彩等高频彩种，延迟通常在 10 秒以内。
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Q: 支持跨域请求吗？
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  A: 是的，API 完全支持 CORS（跨域资源共享），可以直接在前端 JavaScript 代码中调用。
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Q: 如何获取特定日期的开奖数据？
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  A: 使用 <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">date</code> 参数即可，
                  格式为 YYYY-MM-DD。例如：<code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">?lottery_code=CQSSC&date=2025-10-31</code>
                </p>
              </div>

              <div className="border-l-4 border-pink-500 pl-4">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Q: API 的响应速度如何？
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  A: API 已经过 S 级性能优化，通常响应时间在 50-100ms 之间。如遇到较慢响应，请检查网络环境。
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Q: 遇到错误怎么办？
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  A: 请先查看错误响应中的 error 和 message 字段。如果问题持续存在，请检查请求参数是否正确，
                  或参考本文档中的错误处理章节。
                </p>
              </div>
            </div>
          </div>

          {/* 联系与支持 */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              需要帮助？
            </h2>
            <p className="text-lg mb-6 text-blue-100">
              如果您在使用 API 过程中遇到任何问题，或有任何建议，欢迎与我们联系。
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">📧 技术支持</h3>
                <p className="text-sm text-blue-100">
                  邮箱: support@lottery.langne.com<br />
                  响应时间: 24小时内
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🌐 在线文档</h3>
                <p className="text-sm text-blue-100">
                  网站: https://lottery.langne.com<br />
                  持续更新中
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-blue-400">
              <p className="text-sm text-blue-100">
                ⭐ 本 API 由专业团队维护，保证 99.9% 的可用性
              </p>
            </div>
          </div>
        </div>

        {/* 返回顶部 */}
        <div className="text-center mt-12">
          <a 
            href="#"
            className="inline-block text-blue-600 dark:text-blue-400 hover:underline"
          >
            ↑ 返回顶部
          </a>
        </div>

        {/* 页脚 */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2025 彩票开奖数据 API 平台 · 版本 1.0 · 最后更新：2025-10-31</p>
        </div>
      </div>
    </div>
  )
}
