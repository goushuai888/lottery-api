'use client'

import { useEffect, useState, useRef } from 'react'

interface AnimatedNumberProps {
  value: number
  duration?: number // 动画持续时间（毫秒）
  className?: string
}

export default function AnimatedNumber({ value, duration = 1000, className = '' }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [isAnimating, setIsAnimating] = useState(false)
  const previousValue = useRef(value)

  useEffect(() => {
    if (previousValue.current === value) return

    setIsAnimating(true)
    const startValue = previousValue.current
    const endValue = value
    const startTime = Date.now()
    
    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      
      // 使用缓动函数（easeOutCubic）
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeProgress)
      
      setDisplayValue(currentValue)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(endValue)
        previousValue.current = endValue
        setIsAnimating(false)
      }
    }
    
    requestAnimationFrame(animate)
  }, [value, duration])

  return (
    <span className={`${className} ${isAnimating ? 'text-blue-500 transition-colors' : ''}`}>
      {displayValue.toLocaleString()}
    </span>
  )
}

