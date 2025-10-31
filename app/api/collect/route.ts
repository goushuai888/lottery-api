import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 设置最大执行时间为60秒

const DATA_SOURCE_URL = process.env.DATA_SOURCE_URL || 'https://vip.manycai.com/K269046560ca208/p/10.json'

// 并发控制：同时处理的彩种数量
const CONCURRENT_LIMIT = 10
// 单次批量插入的记录数上限
const BATCH_SIZE = 100

// 处理单个彩种的数据（优化统计准确性）
async function processLottery(lotteryCode: string, results: any[]) {
  if (!Array.isArray(results) || results.length === 0) {
    return {
      lottery_code: lotteryCode,
      success: true,
      inserted: 0,
      updated: 0,
      skipped: 0,
      total: 0
    }
  }

  try {
    const records = results.map((item: any) => {
      let codeValue: any
      
      if (typeof item.code === 'string') {
        codeValue = item.code
      } else if (typeof item.code === 'object' && item.code !== null) {
        codeValue = item.code
      } else {
        codeValue = String(item.code || '')
      }
      
      return {
        lottery_code: item.lotterycode,
        issue: item.issue,
        official_issue: item.officialissue || item.issue,
        open_date: item.opendate,
        code: codeValue
      }
    })

    // 先查询已存在的记录
    const existingIssues = new Set<string>()
    try {
      const { data: existing } = await supabaseAdmin
        .from('lottery_results')
        .select('issue')
        .eq('lottery_code', lotteryCode)
        .in('issue', records.map(r => r.issue))
      
      if (existing) {
        existing.forEach(item => existingIssues.add(item.issue))
      }
    } catch (error) {
      console.warn(`⚠️  ${lotteryCode} 查询已有记录失败，将全部尝试插入`)
    }

    // 分类：新增和更新
    const newRecords = records.filter(r => !existingIssues.has(r.issue))
    const updateRecords = records.filter(r => existingIssues.has(r.issue))

    let inserted = 0
    let updated = 0
    let failed = 0

    // 处理新增记录
    if (newRecords.length > 0) {
      const batches = []
      for (let i = 0; i < newRecords.length; i += BATCH_SIZE) {
        batches.push(newRecords.slice(i, i + BATCH_SIZE))
      }

      for (const batch of batches) {
        const { error, count } = await supabaseAdmin
          .from('lottery_results')
          .insert(batch)
          .select('id', { count: 'exact', head: true })
        
        if (!error && count !== null) {
          inserted += count
        } else if (error) {
          // 可能是并发导致的唯一约束冲突，计入更新
          updated += batch.length
        }
      }
    }

    // 处理更新记录（使用 upsert）
    if (updateRecords.length > 0) {
      const batches = []
      for (let i = 0; i < updateRecords.length; i += BATCH_SIZE) {
        batches.push(updateRecords.slice(i, i + BATCH_SIZE))
      }

      for (const batch of batches) {
        const { error } = await supabaseAdmin
          .from('lottery_results')
          .upsert(batch, { 
            onConflict: 'lottery_code,issue'
          })
        
        if (!error) {
          updated += batch.length
        } else {
          failed += batch.length
        }
      }
    }

    const skipped = records.length - inserted - updated - failed

    return {
      lottery_code: lotteryCode,
      success: true,
      inserted,
      updated,
      skipped: skipped > 0 ? skipped : 0,
      total: records.length
    }
  } catch (error: any) {
    console.error(`❌ ${lotteryCode} 处理失败:`, error.message)
    return {
      lottery_code: lotteryCode,
      success: false,
      error: error.message,
      inserted: 0,
      updated: 0,
      skipped: 0,
      total: results.length
    }
  }
}

// 并发控制函数
async function processConcurrently<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  limit: number
): Promise<R[]> {
  const results: R[] = []
  const executing: Promise<void>[] = []

  for (const item of items) {
    const promise = processor(item).then(result => {
      results.push(result)
    })

    executing.push(promise)

    if (executing.length >= limit) {
      await Promise.race(executing)
      executing.splice(
        executing.findIndex(p => p === promise),
        1
      )
    }
  }

  await Promise.all(executing)
  return results
}

// POST /api/collect - 手动触发采集
export async function POST(request: Request) {
  const startTime = Date.now()
  
  try {
    console.log('🔄 开始采集开奖数据...')
    
    // 检查 Supabase 连接（带重试）
    let dbConnected = false
    for (let i = 1; i <= 3; i++) {
      try {
        const { error: connectionError } = await supabaseAdmin
          .from('lottery_types')
          .select('count', { count: 'exact', head: true })
        
        if (!connectionError) {
          dbConnected = true
          console.log('✅ 数据库连接正常')
          break
        } else if (i < 3) {
          console.warn(`⚠️  数据库连接尝试 ${i}/3 失败，${i}秒后重试...`)
          await new Promise(resolve => setTimeout(resolve, i * 1000))
        }
      } catch (error: any) {
        if (i < 3) {
          console.warn(`⚠️  数据库连接尝试 ${i}/3 异常: ${error.message}，${i}秒后重试...`)
          await new Promise(resolve => setTimeout(resolve, i * 1000))
        }
      }
    }
    
    if (!dbConnected) {
      console.error('❌ 数据库连接失败（已重试3次）')
      throw new Error('数据库连接失败，请稍后再试')
    }

    // 使用重试机制获取数据源
    let response;
    let lastError;
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`📡 尝试获取数据源... (第 ${attempt}/${maxRetries} 次)`)
        response = await fetch(DATA_SOURCE_URL, {
          signal: AbortSignal.timeout(15000) // 15秒超时
        })
        
        if (response.ok) {
          console.log('✅ 数据源连接成功')
          break
        } else {
          throw new Error(`HTTP ${response.status}`)
        }
      } catch (error: any) {
        lastError = error
        console.warn(`⚠️  第 ${attempt} 次尝试失败: ${error.message}`)
        
        if (attempt < maxRetries) {
          const waitTime = attempt * 1000 // 递增等待时间：1s, 2s, 3s
          console.log(`⏳ 等待 ${waitTime}ms 后重试...`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
        }
      }
    }
    
    if (!response || !response.ok) {
      throw new Error(`数据源连接失败 (已重试 ${maxRetries} 次): ${lastError?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    
    if (!data || typeof data !== 'object') {
      throw new Error('数据源返回格式错误')
    }
    
    const lotteryCount = Object.keys(data).length
    console.log(`📥 获取到 ${lotteryCount} 个彩种的数据`)

    // 准备所有彩种数据
    const lotteryEntries = Object.entries(data).filter(
      ([_, results]) => Array.isArray(results)
    )
    
    if (lotteryEntries.length === 0) {
      throw new Error('数据源没有可处理的彩种数据')
    }

    // 并发处理所有彩种
    console.log(`⚡ 使用 ${CONCURRENT_LIMIT} 个并发连接处理数据...`)
    const details = await processConcurrently(
      lotteryEntries,
      ([lotteryCode, results]) => processLottery(lotteryCode as string, results as any[]),
      CONCURRENT_LIMIT
    )

    // 统计结果（精确统计）
    const totalInserted = details.reduce((sum, d) => sum + (d.inserted || 0), 0)
    const totalUpdated = details.reduce((sum, d) => sum + (d.updated || 0), 0)
    const totalSkipped = details.reduce((sum, d) => sum + (d.skipped || 0), 0)
    const totalProcessed = details.reduce((sum, d) => sum + (d.total || 0), 0)
    const successCount = details.filter(d => d.success).length
    const failCount = details.length - successCount

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)

    console.log(`✅ 采集完成！耗时: ${duration}秒`)
    console.log(`   处理: ${successCount}/${lotteryCount} 个彩种`)
    console.log(`   📊 统计: 🆕新开奖 ${totalInserted} 条 | 📋已存在 ${totalUpdated} 条 | ⚠️失败 ${totalSkipped} 条`)
    console.log(`   📦 总计: ${totalProcessed} 条数据`)
    if (totalUpdated > 0) {
      console.log(`   💡 提示: ${totalUpdated} 条数据之前已采集过（重复采集）`)
    }

    return NextResponse.json({
      success: true,
      message: '采集完成',
      summary: {
        total_inserted: totalInserted,
        total_updated: totalUpdated,
        total_skipped: totalSkipped,
        total_processed: totalProcessed,
        success_count: successCount,
        fail_count: failCount,
        duration_seconds: parseFloat(duration)
      },
      details
    })
  } catch (error: any) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.error('❌ 采集失败:', error)
    
    // 详细的错误信息
    const errorDetails = {
      message: error.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      name: error.name,
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Internal server error',
        error_details: errorDetails,
        duration_seconds: parseFloat(duration),
        help: '请检查：1) 环境变量配置 2) Supabase 连接 3) 数据源可访问性'
      },
      { status: 500 }
    )
  }
}

// GET /api/collect - 获取采集状态
export async function GET() {
  return NextResponse.json({
    success: true,
    message: '数据采集 API',
    endpoints: {
      collect: 'POST /api/collect - 手动触发数据采集'
    }
  })
}

