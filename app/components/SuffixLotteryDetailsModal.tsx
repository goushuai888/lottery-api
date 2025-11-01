'use client'

import { useEffect } from 'react'

interface SuffixCode {
  code?: string
  code2?: string
  code_last2?: string
  code_last3?: string
  code_last4?: string
  code_pre2?: string
  code_mid2?: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  code: SuffixCode
  issue: string
  lotteryCode: string
}

export default function SuffixLotteryDetailsModal({ isOpen, onClose, code, issue, lotteryCode }: Props) {
  // ESC键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // 获取完整号码用于提取第2/3位
  const fullCode = typeof code.code === 'string' ? code.code.replace(/,/g, '') : ''
  const mid2Digits = fullCode.length >= 3 ? fullCode[1] + fullCode[2] : null

  // 判断是否为ZCVIP
  const isZCVIP = !!code.code2

  const renderNumberRow = (numbers: string | null | undefined, label: string, bgColor: string) => {
    if (!numbers) return null
    
    return (
      <div className="mb-6">
        <h3 className="text-base font-bold text-gray-700 dark:text-gray-300 mb-3 text-center">
          {label}
        </h3>
        <div className="flex gap-2 justify-center">
          {numbers.split('').map((num: string, idx: number) => (
            <span
              key={idx}
              className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${bgColor} text-white font-bold text-xl shadow-md`}
            >
              {num}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className={`sticky top-0 ${isZCVIP ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gradient-to-r from-teal-600 to-cyan-600'} text-white p-6 rounded-t-2xl flex justify-between items-center`}>
          <div>
            <h2 className="text-2xl font-bold">{isZCVIP ? '💎 ZCVIP' : '🇱🇦 老挝VIP'}</h2>
            <p className={`${isZCVIP ? 'text-indigo-100' : 'text-teal-100'} mt-1`}>奖期: {issue}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6">
          {/* ZCVIP特有：主号和副号 */}
          {isZCVIP && (
            <>
              {renderNumberRow(code.code?.replace(/,/g, ''), '主号', 'bg-gradient-to-br from-indigo-500 to-purple-500')}
              {renderNumberRow(code.code2?.replace(/,/g, ''), '副号', 'bg-gradient-to-br from-purple-500 to-pink-500')}
            </>
          )}
          
          {/* 普通带后缀彩票：开奖号码 */}
          {!isZCVIP && renderNumberRow(code.code?.replace(/,/g, ''), '开奖号码', 'bg-gradient-to-br from-teal-500 to-cyan-500')}
          
          {/* 后四位 */}
          {renderNumberRow(code.code_last4?.replace(/,/g, ''), '后四位', 'bg-gradient-to-br from-blue-500 to-blue-600')}
          
          {/* 后三位 */}
          {renderNumberRow(code.code_last3?.replace(/,/g, ''), '后三位', 'bg-gradient-to-br from-blue-400 to-blue-500')}
          
          {/* 后二位 */}
          {renderNumberRow(code.code_last2?.replace(/,/g, ''), '后二位', 'bg-gradient-to-br from-blue-300 to-blue-400')}
          
          {/* 第2/3位 */}
          {renderNumberRow((code.code_mid2 || mid2Digits)?.replace(/,/g, ''), '第2/3位', 'bg-gradient-to-br from-cyan-500 to-teal-500')}
          
          {/* 前2位 */}
          {renderNumberRow(code.code_pre2?.replace(/,/g, ''), '前2位', 'bg-gradient-to-br from-teal-400 to-green-400')}
        </div>

        {/* 底部关闭按钮 */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 p-4 rounded-b-2xl border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className={`w-full ${isZCVIP ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700' : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700'} text-white font-semibold py-3 rounded-lg transition-all shadow-lg`}
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}

