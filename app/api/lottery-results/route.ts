import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET /api/lottery-results - 获取开奖记录（优化版 + 重试机制）
export async function GET(request: Request) {
  const startTime = Date.now()
  
  try {
    const { searchParams } = new URL(request.url)
    const lotteryCode = searchParams.get('lottery_code')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100) // 限制最大 100
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1) // 最小为 1
    const issue = searchParams.get('issue')

    // 验证参数
    if (isNaN(limit) || isNaN(page)) {
      return NextResponse.json(
        { success: false, error: 'Invalid pagination parameters' },
        { status: 400 }
      )
    }

    // 使用重试机制查询（最多3次）
    let data = null
    let count = null
    let lastError = null

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        // 构建查询
        let query = supabase
          .from('lottery_results')
          .select('*', { count: 'exact' })

        // 按彩种代码筛选（使用索引）
        if (lotteryCode) {
          query = query.eq('lottery_code', lotteryCode)
        }

        // 按奖期筛选
        if (issue) {
          query = query.eq('issue', issue)
        }

        // 按开奖时间降序（使用索引）
        query = query.order('open_date', { ascending: false })

        // 分页（优化范围查询）
        const from = (page - 1) * limit
        const to = from + limit - 1
        query = query.range(from, to)

        const result = await query

        if (!result.error) {
          data = result.data
          count = result.count
          if (attempt > 1) {
            console.log(`✅ 查询成功（第 ${attempt} 次尝试）`)
          }
          break
        } else {
          lastError = result.error
          if (attempt < 3) {
            console.warn(`⚠️  查询尝试 ${attempt}/3 失败: ${result.error.message}，等待后重试...`)
            await new Promise(resolve => setTimeout(resolve, attempt * 500))
          }
        }
      } catch (err: any) {
        lastError = err
        if (attempt < 3) {
          console.warn(`⚠️  查询尝试 ${attempt}/3 异常: ${err.message}，等待后重试...`)
          await new Promise(resolve => setTimeout(resolve, attempt * 500))
        }
      }
    }

    if (lastError && data === null) {
      console.error('查询开奖记录失败（已重试3次）:', lastError)
      return NextResponse.json(
        { 
          success: false, 
          error: lastError.message || '查询失败，请稍后再试',
          details: '数据库连接不稳定，已自动重试3次'
        },
        { status: 500 }
      )
    }

    const duration = Date.now() - startTime

    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasMore: ((page - 1) * limit + limit) < (count || 0)
      },
      performance: {
        query_time: `${duration}ms`,
        optimizations: ['使用索引查询', '优化的RLS策略', '自动重试机制']
      }
    })
  } catch (error: any) {
    console.error('开奖记录 API 错误:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

