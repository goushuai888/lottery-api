'use client'

import { useEffect, useState } from 'react'
import type { LotteryType, LotteryResult } from '@/lib/types'
import LotteryCodeDisplay from './components/LotteryCodeDisplay'
import VietnameseDetailsModal from './components/VietnameseDetailsModal'
import BaacDetailsModal from './components/BaacDetailsModal'
import LotteryIcon from './components/LotteryIcon'
import AnimatedNumber from './components/AnimatedNumber'
import { formatOpenDate } from '@/lib/time-utils'

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
  
  // 越南传统彩票详情模态框
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<{code: any, issue: string} | null>(null)
  
  // BAAC彩票详情模态框
  const [baacModalOpen, setBaacModalOpen] = useState(false)
  const [baacModalData, setBaacModalData] = useState<{code: any, issue: string} | null>(null)
  
  // 彩票分类相关状态（改为按国家分类）
  const [activeCountry, setActiveCountry] = useState<string>('all') // all, vietnam, thailand, indonesia, canada, other
  const [groupedLotteries, setGroupedLotteries] = useState<Record<string, any>>({})
  const [categoryLoading, setCategoryLoading] = useState(true)

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

  // 加载按国家分组的彩种
  useEffect(() => {
    setCategoryLoading(true)
    fetch(`/api/lottery-types/grouped-by-country?country=${activeCountry}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setGroupedLotteries(data.data)
        }
      })
      .finally(() => setCategoryLoading(false))
  }, [activeCountry])

  // 加载统计信息
  useEffect(() => {
    const fetchStatistics = () => {
    fetch('/api/statistics')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatistics(data.summary)
        }
      })
      .catch(error => console.error('加载统计信息失败:', error))
    }

    // 初始加载
    fetchStatistics()

    // 每30秒自动刷新统计数据
    const interval = setInterval(fetchStatistics, 30000)
    
    return () => clearInterval(interval)
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
          <p className="text-xl text-text-muted dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            专业的彩票开奖数据服务 · 179 个彩种 · 实时更新 · 完全免费
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/api-docs"
              className="inline-flex items-center gap-2 bg-gradient-primary hover:opacity-90 text-white font-semibold px-8 py-4 rounded-lg transition-all shadow-card hover:shadow-lg hover:scale-105"
            >
              <span className="text-xl">📖</span>
              <span>查看 API 文档</span>
            </a>
            <a
              href="#data-view"
              className="inline-flex items-center gap-2 bg-bg-white dark:bg-gray-800 hover:bg-bg-light dark:hover:bg-gray-700 text-text-dark dark:text-white font-semibold px-8 py-4 rounded-lg transition-all shadow-card hover:shadow-lg border border-border dark:border-gray-700"
            >
              <span className="text-xl">📊</span>
              <span>查看开奖数据</span>
            </a>
          </div>
        </div>

        {/* 统计面板 */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-blue rounded-lg shadow-card p-6 text-white hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">彩票类型</p>
                  <p className="text-3xl font-bold mt-2">
                    <AnimatedNumber value={statistics.total_lottery_types} />
                  </p>
                  <p className="text-blue-100 text-xs mt-1">种彩票</p>
                </div>
                <div className="text-5xl opacity-20">🎲</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-card p-6 text-white hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">开奖记录</p>
                  <p className="text-3xl font-bold mt-2">
                    <AnimatedNumber value={statistics.total_results} duration={1500} />
                  </p>
                  <p className="text-emerald-100 text-xs mt-1">条数据</p>
                </div>
                <div className="text-5xl opacity-20">📊</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gold to-gold-light rounded-lg shadow-card p-6 text-white hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">彩票分类</p>
                  <p className="text-3xl font-bold mt-2">
                    <AnimatedNumber value={statistics.lottery_type_categories} />
                  </p>
                  <p className="text-amber-100 text-xs mt-1">个类型</p>
                </div>
                <div className="text-5xl opacity-20">🏆</div>
              </div>
            </div>
          </div>
        )}

        {/* 核心特性 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-bg-white dark:bg-gray-800 rounded-lg shadow-card p-6 hover:shadow-lg hover:border-primary transition-all border border-border-light">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-bold text-text-dark dark:text-white mb-2">
              实时更新
            </h3>
            <p className="text-text-muted dark:text-gray-300 text-sm">
              每分钟自动采集，数据实时同步，确保最新开奖信息
            </p>
          </div>

          <div className="bg-bg-white dark:bg-gray-800 rounded-lg shadow-card p-6 hover:shadow-lg hover:border-primary transition-all border border-border-light">
            <div className="text-4xl mb-4">🔓</div>
            <h3 className="text-lg font-bold text-text-dark dark:text-white mb-2">
              完全免费
            </h3>
            <p className="text-text-muted dark:text-gray-300 text-sm">
              无需注册，无需 API Key，无访问限制，完全开放使用
            </p>
          </div>

          <div className="bg-bg-white dark:bg-gray-800 rounded-lg shadow-card p-6 hover:shadow-lg hover:border-primary transition-all border border-border-light">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-bold text-text-dark dark:text-white mb-2">
              数据完整
            </h3>
            <p className="text-text-muted dark:text-gray-300 text-sm">
              179 个彩种全覆盖，智能补齐历史数据，零丢失
            </p>
          </div>

          <div className="bg-bg-white dark:bg-gray-800 rounded-lg shadow-card p-6 hover:shadow-lg hover:border-primary transition-all border border-border-light">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-lg font-bold text-text-dark dark:text-white mb-2">
              高性能
            </h3>
            <p className="text-text-muted dark:text-gray-300 text-sm">
              数据库 S 级优化，并发处理，响应速度快至毫秒级
            </p>
          </div>
        </div>

        {/* 彩票分类浏览 - 参考采集源网站样式 */}
        <div className="bg-bg-white dark:bg-gray-800 rounded-lg shadow-card p-6 mb-8 border border-border-light">
          <h2 className="text-2xl font-bold mb-6 text-text-dark dark:text-white">
            🎲 彩票分类
          </h2>

          {/* 国家分类导航 - 参考采集源网站 */}
          <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-border-divider dark:border-gray-700">
            <button
              onClick={() => setActiveCountry('all')}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                activeCountry === 'all'
                  ? 'bg-primary text-white shadow-card'
                  : 'bg-bg-light dark:bg-gray-700 text-text-secondary dark:text-gray-300 hover:bg-border-light dark:hover:bg-gray-600'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setActiveCountry('vietnam')}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                activeCountry === 'vietnam'
                  ? 'bg-primary text-white shadow-card'
                  : 'bg-bg-light dark:bg-gray-700 text-text-secondary dark:text-gray-300 hover:bg-border-light dark:hover:bg-gray-600'
              }`}
            >
              越南
            </button>
            <button
              onClick={() => setActiveCountry('thailand')}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                activeCountry === 'thailand'
                  ? 'bg-primary text-white shadow-card'
                  : 'bg-bg-light dark:bg-gray-700 text-text-secondary dark:text-gray-300 hover:bg-border-light dark:hover:bg-gray-600'
              }`}
            >
              泰国
            </button>
            <button
              onClick={() => setActiveCountry('indonesia')}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                activeCountry === 'indonesia'
                  ? 'bg-primary text-white shadow-card'
                  : 'bg-bg-light dark:bg-gray-700 text-text-secondary dark:text-gray-300 hover:bg-border-light dark:hover:bg-gray-600'
              }`}
            >
              印尼
            </button>
            <button
              onClick={() => setActiveCountry('canada')}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                activeCountry === 'canada'
                  ? 'bg-primary text-white shadow-card'
                  : 'bg-bg-light dark:bg-gray-700 text-text-secondary dark:text-gray-300 hover:bg-border-light dark:hover:bg-gray-600'
              }`}
            >
              加拿大
            </button>
            <button
              onClick={() => setActiveCountry('other')}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                activeCountry === 'other'
                  ? 'bg-primary text-white shadow-card'
                  : 'bg-bg-light dark:bg-gray-700 text-text-secondary dark:text-gray-300 hover:bg-border-light dark:hover:bg-gray-600'
              }`}
            >
              其他
            </button>
          </div>

          {/* 彩票列表 - 按子分类分组显示 */}
          {categoryLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-text-muted dark:text-gray-400">加载中...</p>
            </div>
          ) : (
            <div className="space-y-8" style={{ paddingTop: '20px' }}>
              {activeCountry === 'all' ? (
                // 显示所有国家分组
                Object.entries(groupedLotteries).map(([countryKey, countryData]: [string, any]) => (
                  <div key={countryKey} className="space-y-4">
                    <h3 className="text-lg font-bold text-text-dark dark:text-white border-b border-border-divider dark:border-gray-700 pb-2">
                      {countryData.name}
                    </h3>
                    {Object.entries(countryData.subcategories || {}).map(([subKey, subData]: [string, any]) => (
                      <div key={subKey} className="space-y-3">
                        <h4 className="text-md font-semibold text-text-secondary dark:text-gray-300">
                          {subData.name}
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {subData.lotteries?.map((lottery: LotteryType) => (
                            <div
                              key={lottery.lottery_code}
                              className="flex items-center gap-2 bg-bg-light dark:bg-gray-700/50 rounded-md px-4 py-2 hover:bg-border-light dark:hover:bg-gray-600 transition-colors"
                            >
                              <span className="text-sm font-medium text-text-dark dark:text-white">
                                {lottery.lottery_name}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedLottery(lottery.lottery_code)
                                  setPage(1)
                                  setLatestIssue('')
                                  document.getElementById('data-view')?.scrollIntoView({ behavior: 'smooth' })
                                }}
                                className="px-3 py-1 text-xs bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
                              >
                                历史开奖
                              </button>
                              <a
                                href={`https://vip.manycai.com/Issue/history?lottername=${lottery.lottery_code}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 text-xs bg-secondary hover:bg-secondary-dark text-white rounded-md transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                查看官网
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                // 显示单个国家的分组
                Object.entries(groupedLotteries).map(([subKey, subData]: [string, any]) => (
                  <div key={subKey} className="space-y-3">
                    <h4 className="text-md font-semibold text-text-secondary dark:text-gray-300">
                      {subData.name}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {subData.lotteries?.map((lottery: LotteryType) => (
                        <div
                          key={lottery.lottery_code}
                          className="flex items-center gap-2 bg-bg-light dark:bg-gray-700/50 rounded-md px-4 py-2 hover:bg-border-light dark:hover:bg-gray-600 transition-colors"
                        >
                          <span className="text-sm font-medium text-text-dark dark:text-white">
                            {lottery.lottery_name}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedLottery(lottery.lottery_code)
                              setPage(1)
                              setLatestIssue('')
                              document.getElementById('data-view')?.scrollIntoView({ behavior: 'smooth' })
                            }}
                            className="px-3 py-1 text-xs bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
                          >
                            历史开奖
                          </button>
                          <a
                            href={`https://vip.manycai.com/Issue/history?lottername=${lottery.lottery_code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 text-xs bg-secondary hover:bg-secondary-dark text-white rounded-md transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            查看官网
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 数据查看 */}
        <div id="data-view" className="bg-bg-white dark:bg-gray-800 rounded-lg shadow-card p-6 border border-border-light">
          {selectedLottery ? (
            <>
              {/* 当前彩种标题 */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-divider dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <LotteryIcon 
                    lotteryCode={selectedLottery}
                    lotteryName={lotteryTypes.find(t => t.lottery_code === selectedLottery)?.lottery_name || selectedLottery}
                    size="md"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-text-dark dark:text-white">
                      {lotteryTypes.find(t => t.lottery_code === selectedLottery)?.lottery_name || selectedLottery}
          </h2>
                    <p className="text-sm text-text-light dark:text-gray-400">
                      彩种代码: {selectedLottery}
                    </p>
                  </div>
                </div>
                
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
                          <span className="text-green-600">✓</span> 智能刷新
                        </span>
                      ) : (
                        '🔄 自动刷新'
                      )}
                    </span>
                  </label>
                  
                  {/* 返回按钮 */}
                  <button
                    onClick={() => {
                      setSelectedLottery('')
                      setResults([])
                      setPage(1)
                    }}
                    className="px-4 py-2 bg-text-muted hover:bg-text-secondary text-white text-sm font-medium rounded-md transition-colors"
                  >
                    返回分类
                  </button>
                </div>
          </div>

          {/* 开奖记录表格 */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="mt-4 text-text-muted dark:text-gray-400">加载中...</p>
                </div>
              ) : results.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-bg-light dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-text-muted dark:text-gray-300 uppercase tracking-wider">
                            奖期
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-text-muted dark:text-gray-300 uppercase tracking-wider">
                            开奖号码
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-text-muted dark:text-gray-300 uppercase tracking-wider">
                            开奖时间
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-text-muted dark:text-gray-300 uppercase tracking-wider">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-bg-white dark:bg-gray-800 divide-y divide-border-divider dark:divide-gray-700">
                        {results.map((result, index) => {
                          // 越南传统彩票代码列表
                          const VIETNAMESE_LOTTERY_CODES = [
                            'HNC', 'BNC', 'HFC', 'NDC', 'GNIC', 'TPC', 'PDC', 'XXC', 'DOLC', 'DNC',
                            'JLC', 'QHC', 'KGC', 'LSC', 'GPC', 'GNC', 'GYC', 'GZC', 'FAC', 'SFC',
                            'FZMSC', 'AJC', 'BLC', 'BZC', 'PYC', 'PFC', 'PSC', 'JOC', 'JYC', 'DLC',
                            'TNC', 'TTC', 'HJC', 'JJC', 'LAC', 'SZC', 'XLC', 'QJC', 'CRC', 'YLC', 'TDC'
                          ]
                          
                          // 判断是否为越南传统彩票
                          const isVietnameseLottery = VIETNAMESE_LOTTERY_CODES.includes(result.lottery_code)
                          
                          return (
                            <tr 
                              key={result.id} 
                              className="hover:bg-bg-light dark:hover:bg-gray-700 animate-flip-in"
                              style={{ 
                                animationDelay: `${index * 0.1}s`,
                                opacity: 0,
                                animationFillMode: 'forwards'
                              }}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-dark dark:text-white">
                                {result.issue}
                              </td>
                              <td className="px-6 py-4">
                                <LotteryCodeDisplay 
                                  code={result.code} 
                                  lotteryCode={result.lottery_code}
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-gray-400">
                                {formatOpenDate(result.open_date)}
                              </td>
                              <td className="px-6 py-4 text-center">
                                {/* 越南传统彩票详情按钮 */}
                                {isVietnameseLottery && (
                                  <button
                                    onClick={() => {
                                      setModalData({code: result.code, issue: result.issue})
                                      setModalOpen(true)
                                    }}
                                    className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-medium rounded-md shadow-soft transition-colors duration-200 inline-flex items-center gap-1"
                                  >
                                    <span>查看详情</span>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </button>
                                )}
                                
                                {/* BAAC彩票详情按钮 */}
                                {result.lottery_code === 'BAAC' && (
                                  <button
                                    onClick={() => {
                                      setBaacModalData({code: result.code, issue: result.issue})
                                      setBaacModalOpen(true)
                                    }}
                                    className="px-3 py-1.5 bg-gold hover:bg-gold/90 text-white text-xs font-medium rounded-md shadow-soft transition-colors duration-200 inline-flex items-center gap-1"
                                  >
                                    <span>查看详情</span>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </button>
                                )}
                              </td>
                            </tr>
                          )
                        })}
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
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎲</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                请从上方分类中选择彩种
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                点击任意彩票图标即可查看开奖记录
              </p>
            </div>
          )}
        </div>

        {/* 页脚 */}
        <footer className="mt-12 text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 彩票开奖数据采集平台 - 免费提供 API 接口</p>
        </footer>
      </div>

      {/* 越南传统彩票详情模态框 */}
      {modalData && (
        <VietnameseDetailsModal 
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          code={modalData.code}
          issue={modalData.issue}
        />
      )}
      
      {/* BAAC彩票详情模态框 */}
      {baacModalOpen && baacModalData && (
        <BaacDetailsModal 
          isOpen={baacModalOpen}
          onClose={() => setBaacModalOpen(false)}
          code={baacModalData.code}
          issue={baacModalData.issue}
        />
      )}
    </div>
  )
}

