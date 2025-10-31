'use client'

import { useState } from 'react'
import type { ComplexCode, EthereumCode, HongKongCode, ThaiGovCode, SuffixCode, Max3DCode, BaacCode, ZcvipCode } from '@/lib/types'

interface Props {
  code: string | ComplexCode | EthereumCode | HongKongCode | ThaiGovCode | SuffixCode | Max3DCode | BaacCode | ZcvipCode
  lotteryCode: string
}

export default function LotteryCodeDisplay({ code, lotteryCode }: Props) {
  const [isVietnameseExpanded, setIsVietnameseExpanded] = useState(false)
  // 简单字符串格式
  if (typeof code === 'string') {
    return (
      <div className="flex gap-2 flex-wrap">
        {code.split(',').map((num, idx) => (
          <span
            key={idx}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 text-white font-bold text-sm shadow-md"
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
            {complexCode.code.split(',').filter(n => n).map((num: string, idx: number) => (
              <span
                key={idx}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white font-bold text-sm shadow-md"
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

  // BAAC 泰国储蓄彩票 (最复杂，优先检测)
  if (complexCode.code0 || complexCode.code_last3_1) {
    const prizes = []
    if (complexCode.code) prizes.push({ label: '主号', key: 'code', size: 'large' })
    if (complexCode.code0) prizes.push({ label: '特等奖', key: 'code0', size: 'medium' })
    for (let i = 1; i <= 8; i++) {
      if (complexCode[`code${i}`]) prizes.push({ label: `${i}等奖`, key: `code${i}`, size: 'small' })
    }
    if (complexCode.code_last3) prizes.push({ label: '后3位', key: 'code_last3', size: 'tiny' })
    if (complexCode.code_last3_1) prizes.push({ label: '后3位(副)', key: 'code_last3_1', size: 'tiny' })
    if (complexCode.code_last4) prizes.push({ label: '后4位', key: 'code_last4', size: 'tiny' })

    const sizeClasses = {
      large: 'w-12 h-12 text-lg',
      medium: 'w-10 h-10 text-base',
      small: 'w-8 h-8 text-sm',
      tiny: 'w-7 h-7 text-xs'
    }

    return (
      <div className="space-y-2 p-3 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-lg">
        <div className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-2 text-center">
          🇹🇭 泰国BAAC储蓄彩票
        </div>
        <div className="grid grid-cols-2 gap-2">
          {prizes.map((prize) => (
            <div key={prize.key} className="bg-white dark:bg-gray-800 rounded-md p-2">
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1 text-center">
                {prize.label}
              </div>
              <div className="flex gap-1 justify-center flex-wrap">
                {(typeof complexCode[prize.key] === 'string' ? complexCode[prize.key] : '').split(',').filter(n => n).map((num: string, idx: number) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center justify-center ${sizeClasses[prize.size as keyof typeof sizeClasses]} rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 text-white font-bold shadow-sm`}
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // MAX3D 特殊多段式
  if (complexCode.code_1 || complexCode.code_sp) {
    return (
      <div className="space-y-2 p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
        <div className="text-xs font-bold text-purple-700 dark:text-purple-400 mb-2 text-center">
          🎲 MAX3D
        </div>
        {['code_1', 'code_2', 'code_3'].map((key, index) => (
          complexCode[key] && typeof complexCode[key] === 'string' && (
            <div key={key} className="bg-white dark:bg-gray-800 rounded-md p-2">
              <div className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-1 text-center">
                第{index + 1}组
              </div>
              <div className="flex gap-1.5 justify-center">
                {complexCode[key].split(',').filter((n: string) => n).map((num: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-sm shadow-md"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          )
        ))}
        {complexCode.code_sp && typeof complexCode.code_sp === 'string' && (
          <div className="bg-white dark:bg-gray-800 rounded-md p-2">
            <div className="text-xs font-bold text-pink-600 dark:text-pink-400 mb-1 text-center">
              ⭐ 特别号
            </div>
            <div className="flex gap-1.5 justify-center">
              {complexCode.code_sp.split(',').filter((n: string) => n).map((num: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-red-500 text-white font-bold text-base shadow-md border-2 border-pink-300"
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

  // 港式彩票格式 (检测: 有code和code1，但没有code2、code3等)
  if (complexCode.code && complexCode.code1 && !complexCode.code2 && !complexCode.code3 && !complexCode.code_hash) {
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
              {complexCode.code.split(',').filter(n => n).map((num: string, idx: number) => (
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
              {complexCode.code1.split(',').filter(n => n).map((num: string, idx: number) => (
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
                {complexCode[prize.key].split(',').filter(n => n).map((num: string, idx: number) => (
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

  // 带后缀号码的彩票格式
  if (complexCode.code && (complexCode.code_last2 || complexCode.code_last3 || complexCode.code_pre2 || complexCode.code_mid2)) {
    return (
      <div className="space-y-3 p-3 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-lg">
        <div className="text-xs font-bold text-teal-700 dark:text-teal-400 mb-2 text-center">
          🎯 带后缀彩票
        </div>
        {/* 主要号码 */}
        {typeof complexCode.code === 'string' && (
          <div>
            <div className="text-xs font-bold text-teal-700 dark:text-teal-400 mb-2">
              主要号码
            </div>
            <div className="flex gap-2 justify-center flex-wrap">
              {complexCode.code.split(',').filter(n => n).map((num: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 text-white font-bold text-base shadow-md"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* 辅助号码 */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          {complexCode.code_pre2 && (
            <div className="bg-white dark:bg-gray-800 rounded-md p-2 text-center">
              <div className="font-bold text-teal-600 dark:text-teal-400 mb-1">前2位</div>
              <div className="font-mono text-lg">{complexCode.code_pre2}</div>
            </div>
          )}
          {complexCode.code_mid2 && (
            <div className="bg-white dark:bg-gray-800 rounded-md p-2 text-center">
              <div className="font-bold text-teal-600 dark:text-teal-400 mb-1">中间2位</div>
              <div className="font-mono text-lg">{complexCode.code_mid2}</div>
            </div>
          )}
          {complexCode.code_last2 && (
            <div className="bg-white dark:bg-gray-800 rounded-md p-2 text-center">
              <div className="font-bold text-teal-600 dark:text-teal-400 mb-1">后2位</div>
              <div className="font-mono text-lg">{complexCode.code_last2}</div>
            </div>
          )}
          {complexCode.code_last3 && (
            <div className="bg-white dark:bg-gray-800 rounded-md p-2 text-center">
              <div className="font-bold text-teal-600 dark:text-teal-400 mb-1">后3位</div>
              <div className="font-mono text-lg">{complexCode.code_last3}</div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ZCVIP 特殊格式
  if (complexCode.code2 && (complexCode.code_last2 || complexCode.code_last3 || complexCode.code_last4)) {
    return (
      <div className="space-y-2 p-3 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg">
        <div className="text-xs font-bold text-indigo-700 dark:text-indigo-400 mb-2 text-center">
          💎 ZCVIP
        </div>
        <div className="grid grid-cols-2 gap-2">
          {complexCode.code && typeof complexCode.code === 'string' && (
            <div className="bg-white dark:bg-gray-800 rounded-md p-2">
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1 text-center">
                主号
              </div>
              <div className="flex gap-1 justify-center flex-wrap">
                {complexCode.code.split(',').filter(n => n).map((num: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold text-sm shadow-md"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          )}
          {complexCode.code2 && typeof complexCode.code2 === 'string' && (
            <div className="bg-white dark:bg-gray-800 rounded-md p-2">
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1 text-center">
                副号
              </div>
              <div className="flex gap-1 justify-center flex-wrap">
                {complexCode.code2.split(',').filter(n => n).map((num: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-sm shadow-md"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {complexCode.code_last2 && (
            <div className="bg-white dark:bg-gray-800 rounded-md p-2 text-center">
              <div className="font-bold text-indigo-600 dark:text-indigo-400 mb-1">后2位</div>
              <div className="font-mono text-base">{complexCode.code_last2}</div>
            </div>
          )}
          {complexCode.code_last3 && (
            <div className="bg-white dark:bg-gray-800 rounded-md p-2 text-center">
              <div className="font-bold text-indigo-600 dark:text-indigo-400 mb-1">后3位</div>
              <div className="font-mono text-base">{complexCode.code_last3}</div>
            </div>
          )}
          {complexCode.code_last4 && (
            <div className="bg-white dark:bg-gray-800 rounded-md p-2 text-center">
              <div className="font-bold text-indigo-600 dark:text-indigo-400 mb-1">后4位</div>
              <div className="font-mono text-base">{complexCode.code_last4}</div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // 越南传统彩格式 (完整版: 有code8；简化版: 有code7但没有code8)
  if (complexCode.code || complexCode.code1) {
    return (
      <div className="space-y-3">
        {/* 特别奖 - 和其他彩种保持一致的显示 */}
        <div className="flex items-center gap-3 flex-wrap">
          {complexCode.code && typeof complexCode.code === 'string' && (
            <div className="flex gap-2 flex-wrap">
              {complexCode.code.split(',').filter(n => n).map((num: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 text-white font-bold text-sm shadow-md"
                >
                  {num}
                </span>
              ))}
            </div>
          )}
          
          {/* 查看详情按钮 - 在号码右侧 */}
          <button
            onClick={() => setIsVietnameseExpanded(!isVietnameseExpanded)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>{isVietnameseExpanded ? '收起详情' : '查看详情'}</span>
            <span className="text-xs">{isVietnameseExpanded ? '▲' : '▼'}</span>
          </button>
        </div>

        {/* 其他奖项 - 展开时显示 */}
        {isVietnameseExpanded && (
          <div className="space-y-2 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-fadeIn">
            {/* 一等奖 */}
            {complexCode.code1 && typeof complexCode.code1 === 'string' && (
          <div className="bg-white dark:bg-gray-800 rounded-md p-2 shadow-sm">
            <div className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-2 text-center">
              🥇 一等奖
            </div>
            <div className="flex gap-1.5 justify-center flex-wrap">
              {complexCode.code1.split(',').filter((n: string) => n).map((num: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold text-sm shadow-md"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 二等奖 */}
        {complexCode.code2 && typeof complexCode.code2 === 'string' && (
          <div className="bg-white dark:bg-gray-800 rounded-md p-2 shadow-sm">
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2 text-center">
              🥈 二等奖
            </div>
            <div className="flex gap-1.5 justify-center flex-wrap">
              {complexCode.code2.split(',').filter((n: string) => n).map((num: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold text-sm shadow-md"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 三等奖 - 2组5位数 */}
        {complexCode.code3 && Array.isArray(complexCode.code3) && complexCode.code3.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-md p-2 shadow-sm">
            <div className="text-xs font-bold text-green-600 dark:text-green-400 mb-2 text-center">
              🥉 三等奖 (2组)
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              {complexCode.code3.map((codeStr: any, groupIdx: number) => (
                typeof codeStr === 'string' && (
                  <div 
                    key={groupIdx} 
                    className="flex gap-1 p-1.5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-md border border-green-200 dark:border-green-700"
                  >
                    {codeStr.split(',').filter((n: string) => n).map((num: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-br from-green-500 to-emerald-500 text-white font-bold text-xs shadow-sm"
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
          <div className="bg-white dark:bg-gray-800 rounded-md p-2 shadow-sm">
            <div className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-2 text-center">
              🎯 四等奖
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {complexCode.code4.map((codeStr: any, groupIdx: number) => (
                typeof codeStr === 'string' && (
                  <div key={groupIdx} className="flex gap-0.5 justify-center">
                    {codeStr.split(',').filter((n: string) => n).map((num: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-purple-400 to-pink-400 text-white font-bold text-xs shadow-sm"
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
          <div className="bg-white dark:bg-gray-800 rounded-md p-2 shadow-sm">
            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2 text-center">
              🎲 五等奖
            </div>
            <div className="flex gap-1 justify-center">
              {complexCode.code5.split(',').filter((n: string) => n).map((num: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-br from-indigo-400 to-purple-400 text-white font-bold text-xs shadow-sm"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 六等奖 - 3组4位数 */}
        {complexCode.code6 && Array.isArray(complexCode.code6) && complexCode.code6.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-md p-2 shadow-sm">
            <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mb-2 text-center">
              🎪 六等奖 (3组)
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              {complexCode.code6.map((codeStr: any, groupIdx: number) => (
                typeof codeStr === 'string' && (
                  <div 
                    key={groupIdx} 
                    className="flex gap-0.5 p-1.5 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-md border border-cyan-200 dark:border-cyan-700"
                  >
                    {codeStr.split(',').filter((n: string) => n).map((num: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-cyan-400 to-blue-400 text-white font-bold text-xs shadow-sm"
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
        <div className="grid grid-cols-2 gap-2">
          {complexCode.code7 && typeof complexCode.code7 === 'string' && (
            <div className="bg-white dark:bg-gray-800 rounded-md p-2 shadow-sm">
              <div className="text-xs font-bold text-teal-600 dark:text-teal-400 mb-2 text-center">
                🎨 七等奖
              </div>
              <div className="flex gap-0.5 justify-center">
                {complexCode.code7.split(',').filter((n: string) => n).map((num: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-teal-400 to-green-400 text-white font-bold text-xs shadow-sm"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {complexCode.code8 && typeof complexCode.code8 === 'string' && (
            <div className="bg-white dark:bg-gray-800 rounded-md p-2 shadow-sm">
              <div className="text-xs font-bold text-pink-600 dark:text-pink-400 mb-2 text-center">
                🎁 八等奖
              </div>
              <div className="flex gap-0.5 justify-center">
                {complexCode.code8.split(',').filter((n: string) => n).map((num: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-pink-400 to-rose-400 text-white font-bold text-xs shadow-sm"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          )}
            </div>
          </div>
        )}
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

