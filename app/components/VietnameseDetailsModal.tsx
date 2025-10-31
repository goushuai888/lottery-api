'use client'

interface VietnameseDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  code: any
  issue: string
}

export default function VietnameseDetailsModal({ isOpen, onClose, code, issue }: VietnameseDetailsModalProps) {
  if (!isOpen) return null

  const complexCode = code as any

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">🇻🇳 越南传统彩票详情</h2>
            <p className="text-sm text-blue-100 mt-1">期号：{issue}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-3">
          {/* 特别奖 */}
          {complexCode.code && typeof complexCode.code === 'string' && (
            <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg p-4 shadow-sm">
              <div className="text-sm font-bold text-red-600 dark:text-red-400 mb-3">
                ⭐ 特别奖
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                {complexCode.code.split(',').filter((n: string) => n).map((num: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 text-white font-bold text-lg shadow-md border-2 border-red-300"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 一等奖 */}
          {complexCode.code1 && typeof complexCode.code1 === 'string' && (
            <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
              <div className="text-sm font-bold text-orange-600 dark:text-orange-400 mb-3">
                🥇 一等奖
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                {complexCode.code1.split(',').filter((n: string) => n).map((num: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold shadow-md"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 二等奖 */}
          {complexCode.code2 && typeof complexCode.code2 === 'string' && (
            <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
              <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-3">
                🥈 二等奖
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                {complexCode.code2.split(',').filter((n: string) => n).map((num: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold shadow-md"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 三等奖 */}
          {complexCode.code3 && Array.isArray(complexCode.code3) && complexCode.code3.length > 0 && (
            <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
              <div className="text-sm font-bold text-green-600 dark:text-green-400 mb-3">
                🥉 三等奖 (2组)
              </div>
              <div className="flex gap-4 justify-center flex-wrap">
                {complexCode.code3.map((codeStr: any, groupIdx: number) => (
                  typeof codeStr === 'string' && (
                    <div 
                      key={groupIdx} 
                      className="flex gap-1 p-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-md border border-green-200 dark:border-green-700"
                    >
                      {codeStr.split(',').filter((n: string) => n).map((num: string, idx: number) => (
                        <span
                          key={idx}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-green-500 to-emerald-500 text-white font-bold text-sm shadow-sm"
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* 四等奖 */}
          {complexCode.code4 && Array.isArray(complexCode.code4) && complexCode.code4.length > 0 && (
            <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
              <div className="text-sm font-bold text-purple-600 dark:text-purple-400 mb-3">
                🎯 四等奖 (7组)
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {complexCode.code4.map((codeStr: any, groupIdx: number) => (
                  typeof codeStr === 'string' && (
                    <div key={groupIdx} className="flex gap-1 justify-center">
                      {codeStr.split(',').filter((n: string) => n).map((num: string, idx: number) => (
                        <span
                          key={idx}
                          className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-br from-purple-400 to-pink-400 text-white font-bold text-xs shadow-sm"
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* 五等奖 */}
          {complexCode.code5 && typeof complexCode.code5 === 'string' && (
            <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
              <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-3">
                🎲 五等奖
              </div>
              <div className="flex gap-2 justify-center">
                {complexCode.code5.split(',').filter((n: string) => n).map((num: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-gradient-to-br from-indigo-400 to-purple-400 text-white font-bold shadow-sm"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 六等奖 */}
          {complexCode.code6 && Array.isArray(complexCode.code6) && complexCode.code6.length > 0 && (
            <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
              <div className="text-sm font-bold text-cyan-600 dark:text-cyan-400 mb-3">
                🎪 六等奖 (3组)
              </div>
              <div className="flex gap-4 justify-center flex-wrap">
                {complexCode.code6.map((codeStr: any, groupIdx: number) => (
                  typeof codeStr === 'string' && (
                    <div 
                      key={groupIdx} 
                      className="flex gap-1 p-2 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-md border border-cyan-200 dark:border-cyan-700"
                    >
                      {codeStr.split(',').filter((n: string) => n).map((num: string, idx: number) => (
                        <span
                          key={idx}
                          className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-br from-cyan-400 to-blue-400 text-white font-bold text-xs shadow-sm"
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* 七等奖和八等奖 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {complexCode.code7 && typeof complexCode.code7 === 'string' && (
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                <div className="text-sm font-bold text-teal-600 dark:text-teal-400 mb-3">
                  🎨 七等奖
                </div>
                <div className="flex gap-1 justify-center">
                  {complexCode.code7.split(',').filter((n: string) => n).map((num: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-teal-400 to-green-400 text-white font-bold text-sm shadow-sm"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {complexCode.code8 && typeof complexCode.code8 === 'string' && (
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                <div className="text-sm font-bold text-pink-600 dark:text-pink-400 mb-3">
                  🎁 八等奖
                </div>
                <div className="flex gap-1 justify-center">
                  {complexCode.code8.split(',').filter((n: string) => n).map((num: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-pink-400 to-rose-400 text-white font-bold text-sm shadow-sm"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 底部关闭按钮 */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700 px-6 py-4 rounded-b-xl border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}

