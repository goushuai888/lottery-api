'use client'

import { useEffect, useState } from 'react'
import type { LotteryType, LotteryResult } from '@/lib/types'
import LotteryCodeDisplay from './components/LotteryCodeDisplay'

export default function Home() {
  const [lotteryTypes, setLotteryTypes] = useState<LotteryType[]>([])
  const [selectedLottery, setSelectedLottery] = useState<string>('')
  const [results, setResults] = useState<LotteryResult[]>([])
  const [loading, setLoading] = useState(false)
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
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null) // 上次检查时间
  const [isChecking, setIsChecking] = useState(false) // 是否正在检查

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

  // 自动刷新：智能检测新期号
  useEffect(() => {
    if (!selectedLottery || !autoRefresh) return

    const checkForUpdates = async () => {
      if (isChecking) return // 防止重复检查
      
      setIsChecking(true)
      setLastCheckTime(new Date())
      
      try {
        // 快速获取最新一期的期号（只取1条数据，性能更好）
        const res = await fetch(`/api/lottery-results?lottery_code=${selectedLottery}&page=1&limit=1`)
        const data = await res.json()
        
        if (data.success && data.data && data.data.length > 0) {
          const newLatestIssue = data.data[0].issue
          
          // 如果发现新期号，立即刷新数据
          if (latestIssue && newLatestIssue !== latestIssue) {
            console.log(`🎉 检测到新开奖: ${selectedLottery} 期号 ${newLatestIssue}（上期: ${latestIssue}）`)
            
            // 刷新当前页面的数据
            const refreshRes = await fetch(`/api/lottery-results?lottery_code=${selectedLottery}&page=${page}&limit=20`)
            const refreshData = await refreshRes.json()
            
            if (refreshData.success) {
              setResults(refreshData.data)
              setTotalPages(refreshData.pagination.totalPages)
              setLatestIssue(newLatestIssue)
              
              // 可选：播放提示音或显示通知
              console.log(`✅ 数据已更新，当前显示 ${refreshData.data.length} 条记录`)
            }
          } else if (!latestIssue) {
            // 首次加载，记录初始期号
            setLatestIssue(newLatestIssue)
          }
        }
      } catch (error) {
        console.error('检查更新失败:', error)
      } finally {
        setIsChecking(false)
      }
    }

    // 立即执行一次检查
    checkForUpdates()

    // 每 10 秒检查一次（更适合高频彩种）
    const interval = setInterval(checkForUpdates, 10000)

    return () => clearInterval(interval)
  }, [selectedLottery, page, latestIssue, autoRefresh])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Hero 区域 */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <span className="text-6xl mb-4 inline-block">🎰</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6">
            彩票开奖数据 API 平台
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            专业的彩票开奖数据服务 · 179 个彩种 · 实时更新 · 完全免费
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/api-docs"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <span className="text-xl">📖</span>
              <span>查看 API 文档</span>
            </a>
            <a
              href="#data-view"
              className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl border-2 border-gray-200 dark:border-gray-700"
            >
              <span className="text-xl">📊</span>
              <span>查看开奖数据</span>
            </a>
          </div>
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

        {/* 核心特性 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
              实时更新
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              每分钟自动采集，数据实时同步，确保最新开奖信息
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🔓</div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
              完全免费
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              无需注册，无需 API Key，无访问限制，完全开放使用
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
              数据完整
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              179 个彩种全覆盖，智能补齐历史数据，零丢失
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
              高性能
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              数据库 S 级优化，并发处理，响应速度快至毫秒级
            </p>
          </div>
        </div>

        {/* 数据查看 */}
        <div id="data-view" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
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
                <div className="flex items-center gap-3">
                  {/* 自动刷新状态 */}
                  {autoRefresh && lastCheckTime && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      {isChecking ? (
                        <>
                          <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                          检查中...
                        </>
                      ) : (
                        <>
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                          {new Date().getTime() - lastCheckTime.getTime() < 1000 
                            ? '刚刚检查' 
                            : `${Math.floor((new Date().getTime() - lastCheckTime.getTime()) / 1000)}秒前`}
                        </>
                      )}
                    </span>
                  )}
                  
                  {/* 自动刷新开关 */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {autoRefresh ? (
                        <span className="flex items-center gap-1">
                          <span className="text-green-600">✓</span> 智能刷新 (10秒)
                        </span>
                      ) : (
                        '🔄 自动刷新'
                      )}
                    </span>
                  </label>
                </div>
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

