'use client'

import { useEffect } from 'react'
import type { BaacCode } from '@/lib/types'

interface BaacDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  code: BaacCode
  issue: string
}

export default function BaacDetailsModal({ isOpen, onClose, code, issue }: BaacDetailsModalProps) {
  // 按ESC键关闭
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

  const renderNumberGroup = (numbers: string | string[], title: string, size: 'large' | 'medium' | 'small' | 'tiny' = 'small') => {
    const sizeClasses = {
      large: 'w-12 h-12 text-lg',
      medium: 'w-10 h-10 text-base',
      small: 'w-8 h-8 text-sm',
      tiny: 'w-7 h-7 text-xs'
    }

    if (!numbers) return null

    return (
      <div className="mb-4">
        <h4 className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-2">{title}</h4>
        {Array.isArray(numbers) ? (
          // 数组：多组号码
          <div className="space-y-2">
            {numbers.map((group, idx) => (
              <div key={idx} className="flex gap-1.5 flex-wrap">
                {group.split(',').filter(n => n).map((num, numIdx) => (
                  <span
                    key={numIdx}
                    className={`inline-flex items-center justify-center ${sizeClasses[size]} rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 text-white font-bold shadow-sm`}
                  >
                    {num}
                  </span>
                ))}
              </div>
            ))}
          </div>
        ) : (
          // 字符串：单组号码
          <div className="flex gap-1.5 flex-wrap">
            {numbers.split(',').filter(n => n).map((num, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center justify-center ${sizeClasses[size]} rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 text-white font-bold shadow-sm`}
              >
                {num}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 遮罩层 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* 模态框内容 */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* 头部 */}
          <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-6 py-4 flex justify-between items-center z-10">
            <div>
              <h3 className="text-xl font-bold">🇹🇭 泰国BAAC储蓄彩票详情</h3>
              <p className="text-sm text-amber-100 mt-1">期号: {issue}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-amber-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 内容区域 */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="space-y-6">
              {/* 按照采集源的顺序显示 */}
              
              {/* 1. 帝王玉套票系列头奖 */}
              {code.code0 && renderNumberGroup(code.code0, '帝王玉套票系列头奖', 'medium')}
              
              {/* 2. 一等奖 */}
              {code.code && renderNumberGroup(code.code, '一等奖', 'large')}
              
              {/* 3. 二等奖 */}
              {code.code1 && renderNumberGroup(code.code1, `二等奖 ${Array.isArray(code.code1) ? `(${code.code1.length}组)` : ''}`, 'small')}
              
              {/* 4. 三等奖 */}
              {code.code2 && renderNumberGroup(code.code2, `三等奖 ${Array.isArray(code.code2) ? `(${code.code2.length}组)` : ''}`, 'small')}
              
              {/* 5. 四等奖 */}
              {code.code3 && renderNumberGroup(code.code3, `四等奖 ${Array.isArray(code.code3) ? `(${code.code3.length}组)` : ''}`, 'small')}
              
              {/* 6. 五等奖 */}
              {code.code4 && renderNumberGroup(code.code4, `五等奖 ${Array.isArray(code.code4) ? `(${code.code4.length}组)` : ''}`, 'tiny')}
              
              {/* 7. 最后4位奖 */}
              {code.code_last4 && renderNumberGroup(code.code_last4, '最后4位奖', 'tiny')}
              
              {/* 8. 最后3位奖 */}
              {code.code_last3 && renderNumberGroup(code.code_last3, `最后3位奖 ${Array.isArray(code.code_last3) ? `(${code.code_last3.length}组)` : ''}`, 'tiny')}
              
              {/* 9. 奖金后3位数 */}
              {code.code_last3_1 && renderNumberGroup(code.code_last3_1, '奖金后3位数', 'tiny')}
              
              {/* 10. 储蓄银行彩券礼品套装奖 */}
              {code.code5 && renderNumberGroup(code.code5, `储蓄银行彩券礼品套装奖 ${Array.isArray(code.code5) ? `(${code.code5.length}组)` : ''}`, 'tiny')}
              
              {/* 11. 储蓄银行彩券奖金、钱袋套装奖 */}
              {code.code6 && renderNumberGroup(code.code6, `储蓄银行彩券奖金、钱袋套装奖 ${Array.isArray(code.code6) ? `(${code.code6.length}组)` : ''}`, 'tiny')}
              
              {/* 12. 帝王玉套票最后4位数字 */}
              {code.code7 && renderNumberGroup(code.code7, '帝王玉套票最后4位数字', 'tiny')}
              
              {/* 13. 帝王玉套票最后3位数字 */}
              {code.code8 && renderNumberGroup(code.code8, '帝王玉套票最后3位数字', 'tiny')}
            </div>
          </div>

          {/* 底部 */}
          <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors shadow-md"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

