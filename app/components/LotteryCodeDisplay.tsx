'use client'

import type { ComplexCode, EthereumCode, HongKongCode, ThaiGovCode, SuffixCode, Max3DCode, BaacCode, ZcvipCode } from '@/lib/types'
import { getZodiac, getBallColor, getColorClass, isLiuHeCai } from '@/lib/liuhecai-utils'

interface Props {
  code: string | ComplexCode | EthereumCode | HongKongCode | ThaiGovCode | SuffixCode | Max3DCode | BaacCode | ZcvipCode
  lotteryCode: string
}

export default function LotteryCodeDisplay({ code, lotteryCode }: Props) {
  // 简单字符串格式
  if (typeof code === 'string') {
    // 六合彩特殊显示（带生肖和颜色）- 6+1 格式（仿采集源）
    if (isLiuHeCai(lotteryCode)) {
      // 六合彩格式：8,47,10,39,5,19+45 （用+号分隔特码）
      const parts = code.split('+')
      const mainNumbersStr = parts[0] || ''
      const specialNumberStr = parts[1] || ''
      
      const mainNumbers = mainNumbersStr.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n))
      const specialNumberParsed = specialNumberStr ? parseInt(specialNumberStr.trim()) : null
      const specialNumber = specialNumberParsed && !isNaN(specialNumberParsed) ? specialNumberParsed : null
      
      return (
        <div className="flex items-center gap-3 flex-wrap">
          {/* 开奖号码（前6个）*/}
          {mainNumbers.map((num, idx) => {
            const color = getBallColor(num)
            const zodiac = getZodiac(num)
            const colorClass = getColorClass(color)
            
            return (
              <div
                key={idx}
                className={`inline-flex flex-col items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${colorClass} text-white font-bold shadow-lg`}
              >
                <div className="text-lg leading-tight">{num}</div>
                <div className="text-xs leading-tight">{zodiac}</div>
              </div>
            )
          })}
          
          {/* 加号分隔符 */}
          {specialNumber !== null && (
            <div className="text-3xl font-bold text-gray-600 dark:text-gray-400 mx-1">
              +
            </div>
          )}
          
          {/* 特别号码（第7个）*/}
          {specialNumber !== null && (() => {
            const color = getBallColor(specialNumber)
            const zodiac = getZodiac(specialNumber)
            const colorClass = getColorClass(color)
            
            return (
              <div
                className={`inline-flex flex-col items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${colorClass} text-white font-bold shadow-lg`}
              >
                <div className="text-lg leading-tight">{specialNumber}</div>
                <div className="text-xs leading-tight">{zodiac}</div>
              </div>
            )
          })()}
        </div>
      )
    }
    
    // 普通彩票显示
    return (
      <div className="flex gap-2 flex-wrap">
        {code.split(',').map((num, idx) => (
          <span
            key={idx}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-danger to-danger-dark text-white font-bold text-sm shadow-card"
          >
            {num}
          </span>
        ))}
      </div>
    )
  }

  // 复杂对象格式
  const complexCode = code as any

  // 以太坊彩票格式
  if (complexCode.code_hash) {
    return (
      <div className="space-y-2">
        {typeof complexCode.code === 'string' && (
          <div className="flex gap-2 flex-wrap">
            {complexCode.code.split(',').filter((n: string) => n).map((num: string, idx: number) => (
              <span
                key={idx}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white font-bold text-sm shadow-card"
              >
                {num}
              </span>
            ))}
          </div>
        )}
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div>区块: {complexCode.code_block}</div>
          <div className="truncate">哈希: {complexCode.code_hash}</div>
        </div>
      </div>
    )
  }

  // BAAC 泰国储蓄彩票 - 只显示主要奖项（与越南传统彩票类似）
  if (complexCode.code0 || complexCode.code_last3_1) {
    return (
      <div className="space-y-2 p-3 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-lg">
        <div className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-2 text-center">
          🇹🇭 泰国BAAC储蓄彩票
        </div>
        
        {/* 显示帝王玉套票系列头奖 */}
        {complexCode.code0 && typeof complexCode.code0 === 'string' && (
          <div className="bg-white dark:bg-gray-800 rounded-md p-2">
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1 text-center">
              帝王玉套票系列头奖
              </div>
              <div className="flex gap-1 justify-center flex-wrap">
              {complexCode.code0.split(',').filter((n: string) => n).map((num: string, idx: number) => (
                  <span
                    key={idx}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 text-white font-bold text-base shadow-sm"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
        )}
        
        {/* 显示一等奖 */}
        {complexCode.code && typeof complexCode.code === 'string' && (
          <div className="bg-white dark:bg-gray-800 rounded-md p-2">
            <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1 text-center">
              一等奖
            </div>
            <div className="flex gap-1 justify-center flex-wrap">
              {complexCode.code.split(',').filter((n: string) => n).map((num: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 text-white font-bold text-lg shadow-sm"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-xs text-center text-amber-600 dark:text-amber-400 mt-2">
          点击"查看详情"查看完整开奖信息
        </div>
      </div>
    )
  }

  // MAX3D 特殊多段式 - 只显示特别奖（详情由模态框展示）
  if (complexCode.code_1 || complexCode.code_sp) {
    return (
      <div className="space-y-2 p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
        <div className="text-xs font-bold text-purple-700 dark:text-purple-400 mb-2 text-center">
          🎲 MAX3D
        </div>
        
        {/* 只显示特别奖 */}
        {complexCode.code_sp && (
          <div className="bg-white dark:bg-gray-800 rounded-md p-2">
            <div className="text-xs font-bold text-pink-600 dark:text-pink-400 mb-1 text-center">
              特别奖
            </div>
            <div className="flex flex-col gap-1.5">
              {(Array.isArray(complexCode.code_sp) ? complexCode.code_sp : [complexCode.code_sp]).map((line: string, lineIdx: number) => (
                <div key={lineIdx} className="flex gap-1.5 justify-center">
                  {(typeof line === 'string' ? line : String(line)).split(',').filter((n: string) => n).map((num: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-red-500 text-white font-bold text-base shadow-md"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-xs text-center text-purple-600 dark:text-purple-400 mt-2">
          点击"查看详情"查看完整开奖信息
        </div>
      </div>
    )
  }

  // 港式彩票格式 (检测: 有code和code1，但没有code2、code3等)
  if (complexCode.code && complexCode.code1 && !complexCode.code2 && !complexCode.code3 && !complexCode.code_hash) {
    // 如果是六合彩（XGLHC或MOLHC），使用带生肖颜色的显示（仿采集源）
    if (isLiuHeCai(lotteryCode)) {
      // 处理 code 字段（可能包含+号分隔的特码）
      let mainNumbers: number[] = []
      let specialNumber: number | null = null
      
      if (typeof complexCode.code === 'string') {
        // 如果包含+号，说明特码在同一个字符串里
        if (complexCode.code.includes('+')) {
          const parts = complexCode.code.split('+')
          mainNumbers = parts[0].split(',').map((n: string) => parseInt(n.trim())).filter((n: number) => !isNaN(n))
          const specialParsed = parseInt(parts[1]?.trim() || '')
          specialNumber = !isNaN(specialParsed) ? specialParsed : null
        } else {
          // 否则，特码在 code1 字段
          mainNumbers = complexCode.code.split(',').map((n: string) => parseInt(n.trim())).filter((n: number) => !isNaN(n))
        }
      }
      
      // 处理 code1 字段（特码）
      if (!specialNumber && typeof complexCode.code1 === 'string' && complexCode.code1.trim()) {
        const specialParsed = parseInt(complexCode.code1.trim())
        specialNumber = !isNaN(specialParsed) ? specialParsed : null
      }
      
      return (
        <div className="flex items-center gap-3 flex-wrap">
          {/* 开奖号码（前6个）*/}
          {mainNumbers.map((num: number, idx: number) => {
            const color = getBallColor(num)
            const zodiac = getZodiac(num)
            const colorClass = getColorClass(color)
            
            return (
              <div
                key={idx}
                className={`inline-flex flex-col items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${colorClass} text-white font-bold shadow-lg`}
              >
                <div className="text-lg leading-tight">{num}</div>
                <div className="text-xs leading-tight">{zodiac}</div>
              </div>
            )
          })}
          
          {/* 加号分隔符 */}
          {specialNumber !== null && (
            <div className="text-3xl font-bold text-gray-600 dark:text-gray-400 mx-1">
              +
            </div>
          )}
          
          {/* 特别号码（第7个）*/}
          {specialNumber !== null && (() => {
            const color = getBallColor(specialNumber)
            const zodiac = getZodiac(specialNumber)
            const colorClass = getColorClass(color)
            
            return (
              <div
                className={`inline-flex flex-col items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${colorClass} text-white font-bold shadow-lg`}
              >
                <div className="text-lg leading-tight">{specialNumber}</div>
                <div className="text-xs leading-tight">{zodiac}</div>
              </div>
            )
          })()}
        </div>
      )
    }
    
    // 其他港式彩票（非六合彩）使用原来的显示
    return (
      <div className="space-y-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg">
        <div className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-2 text-center">
          🇭🇰 港式彩票
        </div>
        {/* 主要号码 */}
        {typeof complexCode.code === 'string' && (
          <div>
            <div className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-2">
              🎰 主要号码
            </div>
            <div className="flex gap-2 justify-center">
              {complexCode.code.split(',').filter((n: string) => n).map((num: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold text-lg shadow-md border-2 border-amber-300"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* 附加号码 */}
        {typeof complexCode.code1 === 'string' && (
          <div>
            <div className="text-xs font-bold text-orange-700 dark:text-orange-400 mb-2">
              ✨ 附加号码
            </div>
            <div className="flex gap-2 justify-center">
              {complexCode.code1.split(',').filter((n: string) => n).map((num: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-400 text-white font-bold text-base shadow-sm"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // 泰国政府彩票格式 (检测: 有code到code3，但没有code4)
  if (complexCode.code && complexCode.code1 && complexCode.code2 && complexCode.code3 && !complexCode.code4 && !complexCode.code_hash) {
    const prizes = [
      { label: '一等奖', key: 'code', color: 'from-yellow-500 to-amber-500' },
      { label: '二等奖', key: 'code1', color: 'from-amber-500 to-orange-500' },
      { label: '三等奖', key: 'code2', color: 'from-orange-500 to-red-400' },
      { label: '四等奖', key: 'code3', color: 'from-red-400 to-pink-400' }
    ]

    return (
      <div className="space-y-2 p-3 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-lg">
        <div className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-2 text-center">
          🇹🇭 泰国政府彩票
        </div>
        {prizes.map((prize, index) => (
          complexCode[prize.key] && typeof complexCode[prize.key] === 'string' && (
            <div key={prize.key} className="bg-white dark:bg-gray-800 rounded-md p-2">
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1 text-center">
                {prize.label}
              </div>
              <div className="flex gap-1.5 justify-center flex-wrap">
                {complexCode[prize.key].split(',').filter((n: string) => n).map((num: string, idx: number) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${prize.color} text-white font-bold text-sm shadow-md`}
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    )
  }

  // 带后缀号码的彩票格式（老挝VIP等）
  if (complexCode.code && (complexCode.code_last2 || complexCode.code_last3 || complexCode.code_last4 || complexCode.code_pre2 || complexCode.code_mid2)) {
    // 获取完整号码用于提取第2/3位
    const fullCode = typeof complexCode.code === 'string' ? complexCode.code.replace(/,/g, '') : ''
    const mid2Digits = fullCode.length >= 3 ? fullCode[1] + fullCode[2] : null // 提取第2和第3位
    
    return (
      <div className="space-y-3">
        {/* 主要开奖号码 */}
        {typeof complexCode.code === 'string' && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">开奖号码</p>
            <div className="flex gap-2">
              {complexCode.code.replace(/,/g, '').split('').map((num: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-primary dark:text-blue-300 font-bold text-lg shadow-sm"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* 后四位 */}
        {complexCode.code_last4 && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">后四位</p>
            <div className="flex gap-2">
              {complexCode.code_last4.split('').map((num: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-primary dark:text-blue-300 font-bold text-lg shadow-sm"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* 后三位 */}
        {complexCode.code_last3 && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">后三位</p>
            <div className="flex gap-2">
              {complexCode.code_last3.split('').map((num: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-primary dark:text-blue-300 font-bold text-lg shadow-sm"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* 后二位 */}
        {complexCode.code_last2 && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">后二位</p>
            <div className="flex gap-2">
              {complexCode.code_last2.split('').map((num: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-primary dark:text-blue-300 font-bold text-lg shadow-sm"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* 第2/3位 - 优先使用code_mid2，如果没有则从主号码提取 */}
        {(complexCode.code_mid2 || mid2Digits) && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">第2/3位</p>
            <div className="flex gap-2">
              {(complexCode.code_mid2 || mid2Digits || '').split('').map((num: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-primary dark:text-blue-300 font-bold text-lg shadow-sm"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* 前2位 */}
        {complexCode.code_pre2 && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">前2位</p>
            <div className="flex gap-2">
              {complexCode.code_pre2.split('').map((num: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-primary dark:text-blue-300 font-bold text-lg shadow-sm"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ZCVIP 特殊格式
  if (complexCode.code2 && (complexCode.code_last2 || complexCode.code_last3 || complexCode.code_last4)) {
    return (
      <div className="space-y-3">
        <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">
          💎 ZCVIP
        </div>
        
        {/* 主号 */}
        {complexCode.code && typeof complexCode.code === 'string' && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">主号</p>
            <div className="flex gap-2">
              {complexCode.code.replace(/,/g, '').split('').map((num: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 text-indigo-700 dark:text-indigo-300 font-bold text-lg shadow-sm"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* 副号 */}
        {complexCode.code2 && typeof complexCode.code2 === 'string' && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">副号</p>
            <div className="flex gap-2">
              {complexCode.code2.replace(/,/g, '').split('').map((num: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-purple-700 dark:text-purple-300 font-bold text-lg shadow-sm"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* 后四位 */}
        {complexCode.code_last4 && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">后四位</p>
            <div className="flex gap-2">
              {complexCode.code_last4.split('').map((num: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-primary dark:text-blue-300 font-bold text-lg shadow-sm"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* 后三位 */}
        {complexCode.code_last3 && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">后三位</p>
            <div className="flex gap-2">
              {complexCode.code_last3.split('').map((num: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-primary dark:text-blue-300 font-bold text-lg shadow-sm"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* 后二位 */}
        {complexCode.code_last2 && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">后二位</p>
            <div className="flex gap-2">
              {complexCode.code_last2.split('').map((num: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-primary dark:text-blue-300 font-bold text-lg shadow-sm"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // 越南传统彩格式 - 只显示特别奖号码（详情由模态框展示）
  if (complexCode.code || complexCode.code1) {
    return (
      <div className="flex gap-2 flex-wrap">
        {complexCode.code && typeof complexCode.code === 'string' && 
          complexCode.code.split(',').filter((n: string) => n).map((num: string, idx: number) => (
            <span
              key={idx}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 text-white font-bold text-sm shadow-md"
            >
              {num}
            </span>
          ))
        }
      </div>
    )
  }


  // 默认显示原始数据
  return (
    <div className="text-sm text-gray-600 dark:text-gray-400">
      {JSON.stringify(code)}
    </div>
  )
}

