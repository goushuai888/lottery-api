'use client'

import { useEffect, useState } from 'react'
import LotteryCodeDisplay from './LotteryCodeDisplay'

interface LatestDraw {
  lottery_code: string
  lottery_name: string
  issue: string
  open_code: string
  open_date: string
}

export default function LatestDraws() {
  const [draws, setDraws] = useState<LatestDraw[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // 获取最新开奖记录
  const fetchLatestDraws = async () => {
    try {
      const response = await fetch('/api/lottery-results/latest?limit=10')
      const data = await response.json()
      if (data.success) {
        setDraws(data.data)
        setIsLoading(false)
      }
    } catch (error) {
      console.error('获取最新开奖失败:', error)
    }
  }

  // 初始加载
  useEffect(() => {
    fetchLatestDraws()
  }, [])

  // 定时刷新（每30秒）
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLatestDraws()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // 轮播切换（每5秒）
  useEffect(() => {
    if (draws.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % draws.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [draws.length])

  if (isLoading || draws.length === 0) {
    return (
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium">最新开奖</p>
            <p className="text-lg font-bold mt-2">加载中...</p>
          </div>
          <div className="text-5xl opacity-20">🎰</div>
        </div>
      </div>
    )
  }

  const currentDraw = draws[currentIndex]

  return (
    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white relative overflow-hidden">
      {/* 动画背景 */}
      <div className="absolute inset-0 bg-white opacity-5 animate-pulse"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-orange-100 text-sm font-medium">🎰 最新开奖</span>
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs animate-pulse">
              LIVE
            </span>
          </div>
          <div className="text-orange-100 text-xs">
            {currentIndex + 1} / {draws.length}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{currentDraw.lottery_name}</span>
            <span className="text-orange-100 text-sm">第 {currentDraw.issue} 期</span>
          </div>

          <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3">
            <LotteryCodeDisplay 
              code={currentDraw.open_code}
              lotteryCode={currentDraw.lottery_code}
            />
          </div>

          <div className="text-orange-100 text-xs">
            {new Date(currentDraw.open_date).toLocaleString('zh-CN', {
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>

        {/* 轮播指示器 */}
        {draws.length > 1 && (
          <div className="flex gap-1 mt-3 justify-center">
            {draws.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-6 bg-white'
                    : 'w-1 bg-white/30'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

