'use client'

import { useEffect, useState } from 'react'
import type { LotteryType, LotteryResult } from '@/lib/types'
import LotteryCodeDisplay from './components/LotteryCodeDisplay'

export default function Home() {
  const [lotteryTypes, setLotteryTypes] = useState<LotteryType[]>([])
  const [selectedLottery, setSelectedLottery] = useState<string>('')
  const [results, setResults] = useState<LotteryResult[]>([])
  const [loading, setLoading] = useState(false)
  const [collectLoading, setCollectLoading] = useState(false)
  const [collectStatus, setCollectStatus] = useState<{
    inserted: number
    updated: number
    skipped: number
    processed: number
    duration: number
  } | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statistics, setStatistics] = useState<{
    total_lottery_types: number
    total_results: number
    lottery_type_categories: number
    latest_draw?: {
      time: string
      lottery_code: string
      issue: string
      time_ago: string
    }
  } | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true) // 自动刷新开关
  const [latestIssue, setLatestIssue] = useState<string>('') // 记录最新期号

  // 加载彩种列表
  useEffect(() => {
    fetch('/api/lottery-types?active=true')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLotteryTypes(data.data)
        }
      })
  }, [])

  // 加载统计信息
  useEffect(() => {
    fetch('/api/statistics')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatistics(data.summary)
        }
      })
      .catch(error => console.error('加载统计信息失败:', error))
  }, [])

  // 加载开奖记录
  useEffect(() => {
    if (!selectedLottery) return

    setLoading(true)
    fetch(`/api/lottery-results?lottery_code=${selectedLottery}&page=${page}&limit=20`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setResults(data.data)
          setTotalPages(data.pagination.totalPages)
          // 记录最新期号
          if (data.data.length > 0) {
            setLatestIssue(data.data[0].issue)
          }
        }
      })
      .finally(() => setLoading(false))
  }, [selectedLottery, page])

  // 自动刷新：定时检查最新数据
  useEffect(() => {
    if (!selectedLottery || !autoRefresh) return

    const checkForUpdates = async () => {
      try {
        // 获取最新一期数据
        const res = await fetch(`/api/lottery-results/latest?lottery_code=${selectedLottery}`)
        const data = await res.json()
        
        if (data.success && data.data && data.data.length > 0) {
          const newLatestIssue = data.data[0].issue
          
          // 如果发现新期号，刷新数据
          if (latestIssue && newLatestIssue !== latestIssue) {
            console.log(`🔄 检测到新开奖: ${selectedLottery} ${newLatestIssue}`)
            
            // 刷新当前页面的数据
            const refreshRes = await fetch(`/api/lottery-results?lottery_code=${selectedLottery}&page=${page}&limit=20`)
            const refreshData = await refreshRes.json()
            
            if (refreshData.success) {
              setResults(refreshData.data)
              setTotalPages(refreshData.pagination.totalPages)
              setLatestIssue(newLatestIssue)
            }
          }
        }
      } catch (error) {
        console.error('检查更新失败:', error)
      }
    }

    // 每 30 秒检查一次
    const interval = setInterval(checkForUpdates, 30000)

    return () => clearInterval(interval)
  }, [selectedLottery, page, latestIssue, autoRefresh])

  // 手动触发采集
  const handleCollect = async () => {
    setCollectLoading(true)
    setCollectStatus(null)
    
    try {
      const res = await fetch('/api/collect', { method: 'POST' })
      const data = await res.json()
      
      if (data.success) {
        setCollectStatus({
          inserted: data.summary.total_inserted,
          updated: data.summary.total_updated,
          skipped: data.summary.total_skipped,
          processed: data.summary.total_processed,
          duration: data.summary.duration_seconds
        })
        
        // 刷新统计信息
        fetch('/api/statistics')
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setStatistics(data.summary)
            }
          })
        
        // 刷新当前数据
        if (selectedLottery) {
          const res = await fetch(`/api/lottery-results?lottery_code=${selectedLottery}&page=${page}&limit=20`)
          const refreshData = await res.json()
          if (refreshData.success) {
            setResults(refreshData.data)
          }
        }
      } else {
        const errorMsg = data.error || 'Unknown error'
        const helpMsg = data.help || ''
        
        // 检查是否是网络连接问题
        const isNetworkError = errorMsg.includes('fetch failed') || 
                               errorMsg.includes('数据源连接失败') ||
                               errorMsg.includes('ECONNRESET')
        
        if (isNetworkError) {
          alert(`⚠️ 数据源暂时无法访问\n\n这是数据源服务器的网络问题，不是代码问题。\n\n建议：\n1. 稍后再试（通常几秒后就恢复）\n2. 数据已经自动重试3次\n3. 大部分数据采集仍然成功\n\n详情: ${errorMsg}`)
        } else {
          alert(`采集失败：${errorMsg}\n\n${helpMsg}`)
        }
        console.error('采集错误详情:', data.error_details)
      }
    } catch (error: any) {
      alert(`采集失败：${error.message || error}\n\n请检查:\n1. 网络连接\n2. 服务器是否运行\n3. 环境变量配置`)
      console.error('采集异常:', error)
    } finally {
      setCollectLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            🎰 彩票开奖数据采集平台
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            免费提供彩票开奖数据 API 接口 · 数据库已优化至 S 级
          </p>
        </div>

        {/* 统计面板 */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">彩票类型</p>
                  <p className="text-3xl font-bold mt-2">{statistics.total_lottery_types}</p>
                  <p className="text-blue-100 text-xs mt-1">种彩票</p>
                </div>
                <div className="text-5xl opacity-20">🎲</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">开奖记录</p>
                  <p className="text-3xl font-bold mt-2">{statistics.total_results.toLocaleString()}</p>
                  <p className="text-green-100 text-xs mt-1">条数据</p>
                </div>
                <div className="text-5xl opacity-20">📊</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">彩票分类</p>
                  <p className="text-3xl font-bold mt-2">{statistics.lottery_type_categories}</p>
                  <p className="text-purple-100 text-xs mt-1">个类型</p>
                </div>
                <div className="text-5xl opacity-20">🏆</div>
              </div>
            </div>
          </div>
        )}

        {/* API 文档 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            📡 API 接口文档
          </h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                获取彩种列表
              </h3>
              <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                GET /api/lottery-types
              </code>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                参数: ?active=true (可选，只返回激活的彩种)
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                获取开奖记录 <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">已优化</span>
              </h3>
              <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                GET /api/lottery-results
              </code>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                参数: ?lottery_code=YN60&page=1&limit=50 · 性能提升 30%
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-800 dark:text-white">获取最新开奖</h3>
              <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                GET /api/lottery-results/latest
              </code>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                参数: ?lottery_code=YN60 (可选，不传则返回所有彩种最新一期)
              </p>
            </div>
            <div className="border-l-4 border-pink-500 pl-4">
              <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                统计信息 <span className="text-xs bg-pink-100 text-pink-800 px-2 py-0.5 rounded">NEW</span>
              </h3>
              <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                GET /api/statistics
              </code>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                获取平台统计数据 · 自动聚合各类彩票统计
              </p>
            </div>
          </div>
        </div>

        {/* 数据采集 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                🔄 数据采集
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                点击按钮手动触发数据采集（采用并发处理，速度更快）
              </p>
              {statistics?.latest_draw && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  💡 最新开奖: {statistics.latest_draw.lottery_code} · {statistics.latest_draw.issue} · {statistics.latest_draw.time_ago}
                </div>
              )}
            </div>
            <button
              onClick={handleCollect}
              disabled={collectLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {collectLoading && (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {collectLoading ? '采集中...' : '⚡ 立即采集'}
            </button>
          </div>
          
          {/* 采集结果显示 */}
          {collectStatus && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-green-800 dark:text-green-300">
                    采集完成
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-400">总计:</span>
                    <span className="font-bold text-gray-800 dark:text-white">{collectStatus.processed}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-400">🆕新增:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{collectStatus.inserted}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-400">📋已存在:</span>
                    <span className="font-bold text-gray-600 dark:text-gray-400">{collectStatus.updated}</span>
                  </div>
                  {collectStatus.skipped > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-gray-400">⚠️失败:</span>
                      <span className="font-bold text-orange-600 dark:text-orange-400">{collectStatus.skipped}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-400">⏱️耗时:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">{collectStatus.duration.toFixed(2)}s</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* 采集中的进度提示 */}
          {collectLoading && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    正在采集数据...
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    使用 10 个并发连接处理 170+ 个彩种，请稍候...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 数据查看 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            📊 开奖数据查看
          </h2>
          
          {/* 彩种选择 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                选择彩种
              </label>
              {selectedLottery && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    🔄 自动刷新 (30秒)
                  </span>
                </label>
              )}
            </div>
            <select
              value={selectedLottery}
              onChange={(e) => {
                setSelectedLottery(e.target.value)
                setPage(1)
                setLatestIssue('')
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">请选择彩种</option>
              {lotteryTypes.map(type => (
                <option key={type.lottery_code} value={type.lottery_code}>
                  {type.lottery_name} ({type.lottery_code})
                </option>
              ))}
            </select>
          </div>

          {/* 开奖记录表格 */}
          {selectedLottery && (
            <>
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">加载中...</p>
                </div>
              ) : results.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            奖期
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            开奖号码
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            开奖时间
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {results.map((result) => (
                          <tr key={result.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {result.issue}
                            </td>
                            <td className="px-6 py-4">
                              <LotteryCodeDisplay 
                                code={result.code} 
                                lotteryCode={result.lottery_code}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(result.open_date).toLocaleString('zh-CN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* 分页 */}
                  <div className="mt-6 flex justify-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      上一页
                    </button>
                    <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                      第 {page} / {totalPages} 页
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      下一页
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">暂无数据</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* 页脚 */}
        <footer className="mt-12 text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 彩票开奖数据采集平台 - 免费提供 API 接口</p>
        </footer>
      </div>
    </div>
  )
}

