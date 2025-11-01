'use client'

import { useEffect, useState } from 'react'
import type { LotteryType, LotteryResult } from '@/lib/types'
import LotteryCodeDisplay from './components/LotteryCodeDisplay'
import VietnameseDetailsModal from './components/VietnameseDetailsModal'
import BaacDetailsModal from './components/BaacDetailsModal'
import Max3DDetailsModal from './components/Max3DDetailsModal'
import SuffixLotteryDetailsModal from './components/SuffixLotteryDetailsModal'
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
  
  // MAX3D彩票详情模态框
  const [max3dModalOpen, setMax3dModalOpen] = useState(false)
  const [max3dModalData, setMax3dModalData] = useState<{code: any, issue: string} | null>(null)
  
  // 带后缀彩票（老挝VIP、ZCVIP等）详情模态框
  const [suffixModalOpen, setSuffixModalOpen] = useState(false)
  const [suffixModalData, setSuffixModalData] = useState<{code: any, issue: string, lotteryCode: string} | null>(null)
  
  // 彩票分类相关状态
  const [activeCategory, setActiveCategory] = useState<string>('high_frequency')
  const [categorizedLotteries, setCategorizedLotteries] = useState<Record<string, any>>({})
  const [overseasSubcategory, setOverseasSubcategory] = useState<string>('all') // 境外彩种子分类
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

  // 加载分类彩种
  useEffect(() => {
    setCategoryLoading(true)
    
    // 如果是境外彩种且选择了非"全部"的子分类，则加载子分类数据
    if (activeCategory === 'overseas' && overseasSubcategory !== 'all') {
      fetch(`/api/lottery-types/overseas-subcategories?subcategory=${overseasSubcategory}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            // 更新境外彩种的数据
            setCategorizedLotteries(prev => ({
              ...prev,
              overseas: {
                name: '境外彩种',
                lotteries: data.data
              }
            }))
          }
        })
        .finally(() => setCategoryLoading(false))
    } else {
      // 加载所有分类
    fetch('/api/lottery-types/by-category')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategorizedLotteries(data.data)
        }
      })
      .finally(() => setCategoryLoading(false))
    }
  }, [activeCategory, overseasSubcategory])

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

    // 每15秒自动刷新统计数据
    const interval = setInterval(fetchStatistics, 15000)
    
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

    // 每 5 秒检查一次（更适合高频彩种）
    const interval = setInterval(checkForUpdates, 5000)

    return () => clearInterval(interval)
  }, [selectedLottery, page, latestIssue, autoRefresh])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* 装饰性背景元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-300/5 to-indigo-300/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero 区域 - 专业现代风格 */}
        <div className="text-center mb-16 animate-fadeIn">
          {/* 徽章 */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 rounded-full border border-blue-200/50 dark:border-blue-700/50 mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">实时数据 · 100% 免费</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              彩票开奖数据
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            专业的彩票开奖数据服务 · <span className="font-semibold text-blue-600 dark:text-blue-400">179</span> 个彩种 · 实时更新 · 完全免费
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a
              href="/api-docs"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transform"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>查看 API 文档</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#data-view"
              className="group inline-flex items-center gap-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:scale-105 transform shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>查看开奖数据</span>
            </a>
          </div>
        </div>

        {/* 统计面板 - 专业精美风格 */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 overflow-hidden">
              {/* 渐变背景 */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">彩票类型</p>
                  <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-1">
                    <AnimatedNumber value={statistics.total_lottery_types} />
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm">种彩票</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🎲</span>
                </div>
              </div>
            </div>
            
            <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 overflow-hidden">
              {/* 渐变背景 */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/10 dark:to-teal-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">开奖记录</p>
                  <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-1">
                    <AnimatedNumber value={statistics.total_results} duration={1500} />
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm">条数据</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📊</span>
                </div>
              </div>
            </div>
            
            <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:border-amber-300 dark:hover:border-amber-600 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 overflow-hidden">
              {/* 渐变背景 */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">彩票分类</p>
                  <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent mb-1">
                    <AnimatedNumber value={statistics.lottery_type_categories} />
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm">个类型</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🏆</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 彩票分类浏览 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 p-8 mb-10 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-2xl">🎲</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                彩票分类
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">浏览所有可用的彩票类型</p>
            </div>
          </div>

          {/* 分类标签 */}
          <div className="flex flex-wrap gap-3 mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
            <button
              onClick={() => setActiveCategory('high_frequency')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeCategory === 'high_frequency'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105'
              }`}
            >
              <span className="mr-2">⚡</span>
              高频彩种
            </button>
            <button
              onClick={() => setActiveCategory('low_frequency')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeCategory === 'low_frequency'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105'
              }`}
            >
              <span className="mr-2">🎯</span>
              低频彩种
            </button>
            <button
              onClick={() => setActiveCategory('super_speed')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeCategory === 'super_speed'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105'
              }`}
            >
              <span className="mr-2">🚀</span>
              极速彩种
            </button>
            <button
              onClick={() => {
                setActiveCategory('overseas')
                setOverseasSubcategory('all')
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeCategory === 'overseas'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105'
              }`}
            >
              <span className="mr-2">🌏</span>
              境外彩种
            </button>
            <button
              onClick={() => setActiveCategory('calculated')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeCategory === 'calculated'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105'
              }`}
            >
              <span className="mr-2">💻</span>
              计算型彩种
            </button>
          </div>

          {/* 境外彩种子分类 */}
          {activeCategory === 'overseas' && (
            <div className="flex flex-wrap gap-2 mt-4 p-5 bg-gradient-to-r from-gray-50 to-blue-50/50 dark:from-gray-700/50 dark:to-blue-900/20 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
              <button
                onClick={() => setOverseasSubcategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  overseasSubcategory === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 scale-105'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 hover:scale-105'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setOverseasSubcategory('vietnam')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  overseasSubcategory === 'vietnam'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 scale-105'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 hover:scale-105'
                }`}
              >
                🇻🇳 越南
              </button>
              <button
                onClick={() => setOverseasSubcategory('thailand')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  overseasSubcategory === 'thailand'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 scale-105'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 hover:scale-105'
                }`}
              >
                🇹🇭 泰国
              </button>
              <button
                onClick={() => setOverseasSubcategory('indonesia')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  overseasSubcategory === 'indonesia'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 scale-105'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 hover:scale-105'
                }`}
              >
                🇮🇩 印尼
              </button>
              <button
                onClick={() => setOverseasSubcategory('canada')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  overseasSubcategory === 'canada'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 scale-105'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 hover:scale-105'
                }`}
              >
                🇨🇦 加拿大
              </button>
              <button
                onClick={() => setOverseasSubcategory('other')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  overseasSubcategory === 'other'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 scale-105'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 hover:scale-105'
                }`}
              >
                🌍 其他
              </button>
            </div>
          )}

          {/* 彩票列表 */}
          {categoryLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-text-muted dark:text-gray-400">加载中...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {categorizedLotteries[activeCategory]?.lotteries?.map((lottery: LotteryType) => (
                <div
                  key={lottery.lottery_code}
                  className="group bg-white dark:bg-gray-800 rounded-xl p-5 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 hover:-translate-y-1"
                >
                  {/* 彩票图标和名称 */}
                  <div className="flex flex-col items-center text-center space-y-3 mb-3">
                    {/* 彩票图标 */}
                    <LotteryIcon 
                      lotteryCode={lottery.lottery_code}
                      lotteryName={lottery.lottery_name}
                      size="md"
                    />
                    {/* 彩票名称 */}
                    <div className="text-sm font-medium text-text-dark dark:text-white break-words w-full min-h-[2.5rem] flex items-center justify-center">
                      {lottery.lottery_name}
                    </div>
                  </div>

                  {/* 操作按钮 - 始终显示 */}
                  <div className="flex flex-col gap-2 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedLottery(lottery.lottery_code)
                        setPage(1)
                        setLatestIssue('')
                        // 滚动到数据查看区域
                        document.getElementById('data-view')?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-lg transition-all duration-300 shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40 hover:scale-105"
                    >
                      历史开奖
                    </button>
                    <a
                      href={`https://vip.manycai.com/Issue/history?lottername=${lottery.lottery_code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-white text-xs font-semibold rounded-lg transition-all duration-300 text-center border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:scale-105"
                    >
                      查看官网
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 分类统计 */}
          {!categoryLoading && categorizedLotteries[activeCategory] && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                当前分类共有 <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  {categorizedLotteries[activeCategory]?.lotteries?.length || 0}
                </span> 种彩票
              </p>
            </div>
          )}
        </div>

        {/* 数据查看 */}
        <div id="data-view" className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 p-8 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
          {selectedLottery ? (
            <>
              {/* 当前彩种标题 */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
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
                    className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105"
                  >
                    返回分类
                  </button>
                </div>
          </div>

          {/* 开奖记录表格 */}
              {loading ? (
                <div className="text-center py-16">
                  <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400"></div>
                  <p className="mt-6 text-gray-600 dark:text-gray-400 font-medium">加载中...</p>
                </div>
              ) : results.length > 0 ? (
                <>
                  <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-blue-50/50 dark:from-gray-700 dark:to-gray-800">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            奖期
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            开奖号码
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            开奖时间
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
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
                          
                          // 判断是否为带后缀彩票（老挝VIP、ZCVIP等）
                          const isSuffixLottery = typeof result.code === 'object' && result.code !== null && 
                            (result.code.code_last2 || result.code.code_last3 || result.code.code_last4 || 
                             result.code.code_pre2 || result.code.code_mid2 || result.code.code2)
                          
                          return (
                            <tr 
                              key={result.id} 
                              className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-gray-700/50 dark:hover:to-gray-800/50 transition-all duration-200 animate-flip-in"
                              style={{ 
                                animationDelay: `${index * 0.05}s`,
                                opacity: 0,
                                animationFillMode: 'forwards'
                              }}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                                {result.issue}
                              </td>
                              <td className="px-6 py-4">
                                <LotteryCodeDisplay 
                                  code={result.code} 
                                  lotteryCode={result.lottery_code}
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
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
                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-lg shadow-md shadow-blue-500/30 hover:shadow-lg transition-all duration-300 inline-flex items-center gap-1.5 hover:scale-105"
                                  >
                                    <span>查看详情</span>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-semibold rounded-lg shadow-md shadow-amber-500/30 hover:shadow-lg transition-all duration-300 inline-flex items-center gap-1.5 hover:scale-105"
                                  >
                                    <span>查看详情</span>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </button>
                                )}
                                
                                {/* MAX3D彩票详情按钮 */}
                                {result.lottery_code === 'MAX3D' && (
                                  <button
                                    onClick={() => {
                                      setMax3dModalData({code: result.code, issue: result.issue})
                                      setMax3dModalOpen(true)
                                    }}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-semibold rounded-lg shadow-md shadow-purple-500/30 hover:shadow-lg transition-all duration-300 inline-flex items-center gap-1.5 hover:scale-105"
                                  >
                                    <span>查看详情</span>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </button>
                                )}
                                
                                {/* 带后缀彩票详情按钮（老挝VIP、ZCVIP等） */}
                                {isSuffixLottery && (
                                  <button
                                    onClick={() => {
                                      setSuffixModalData({code: result.code, issue: result.issue, lotteryCode: result.lottery_code})
                                      setSuffixModalOpen(true)
                                    }}
                                    className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-xs font-semibold rounded-lg shadow-md shadow-teal-500/30 hover:shadow-lg transition-all duration-300 inline-flex items-center gap-1.5 hover:scale-105"
                                  >
                                    <span>查看详情</span>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <div className="mt-8 flex justify-center items-center gap-4">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-6 py-2.5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 font-semibold shadow-md hover:shadow-lg disabled:hover:shadow-md disabled:hover:scale-100 hover:scale-105"
                    >
                      上一页
                    </button>
                    <span className="px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700 font-semibold shadow-sm">
                      第 {page} / {totalPages} 页
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-6 py-2.5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 font-semibold shadow-md hover:shadow-lg disabled:hover:shadow-md disabled:hover:scale-100 hover:scale-105"
                    >
                      下一页
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">暂无数据</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center shadow-lg">
                <span className="text-5xl">🎲</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                请从上方分类中选择彩种
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                点击任意彩票图标即可查看开奖记录
              </p>
            </div>
          )}
        </div>

        {/* 页脚 */}
        <footer className="mt-16 mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © 2025 彩票开奖数据采集平台 - 免费提供 API 接口
            </p>
          </div>
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
      
      {/* MAX3D彩票详情模态框 */}
      {max3dModalOpen && max3dModalData && (
        <Max3DDetailsModal 
          isOpen={max3dModalOpen}
          onClose={() => setMax3dModalOpen(false)}
          code={max3dModalData.code}
          issue={max3dModalData.issue}
        />
      )}
      
      {/* 带后缀彩票详情模态框（老挝VIP、ZCVIP等） */}
      {suffixModalOpen && suffixModalData && (
        <SuffixLotteryDetailsModal 
          isOpen={suffixModalOpen}
          onClose={() => setSuffixModalOpen(false)}
          code={suffixModalData.code}
          issue={suffixModalData.issue}
          lotteryCode={suffixModalData.lotteryCode}
        />
      )}
    </div>
  )
}

