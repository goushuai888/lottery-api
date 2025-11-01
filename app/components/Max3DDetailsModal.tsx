'use client'

import { useEffect } from 'react'

interface Max3DCode {
  code_1?: string[]
  code_2?: string[]
  code_3?: string[]
  code_sp?: string[]
}

interface Props {
  isOpen: boolean
  onClose: () => void
  code: Max3DCode
  issue: string
}

export default function Max3DDetailsModal({ isOpen, onClose, code, issue }: Props) {
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

  const renderNumberGroup = (numbers: string[] | undefined, label: string, bgColor: string) => {
    if (!numbers || numbers.length === 0) return null
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-bold text-purple-700 dark:text-purple-300 mb-3 text-center">
          {label}
        </h3>
        <div className="flex flex-col gap-3">
          {numbers.map((line: string, lineIdx: number) => (
            <div key={lineIdx} className="flex gap-2 justify-center">
              {line.split(',').filter(n => n).map((num: string, idx: number) => (
                <span
                  key={idx}
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${bgColor} text-white font-bold text-lg shadow-md`}
                >
                  {num}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">🎲 MAX3D</h2>
            <p className="text-purple-100 mt-1">奖期: {issue}</p>
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
          {/* 特别奖 */}
          {renderNumberGroup(code.code_sp, '特别奖', 'bg-gradient-to-br from-pink-500 to-red-500')}
          
          {/* 一等奖 */}
          {renderNumberGroup(code.code_1, '一等奖', 'bg-gradient-to-br from-purple-500 to-purple-600')}
          
          {/* 二等奖 */}
          {renderNumberGroup(code.code_2, '二等奖', 'bg-gradient-to-br from-indigo-500 to-indigo-600')}
          
          {/* 三等奖 */}
          {renderNumberGroup(code.code_3, '三等奖', 'bg-gradient-to-br from-blue-500 to-blue-600')}
        </div>

        {/* 底部关闭按钮 */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 p-4 rounded-b-2xl border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}

