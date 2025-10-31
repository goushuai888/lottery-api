import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET /api/lottery-results/latest - 获取所有彩种的最新一期开奖记录
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lotteryCode = searchParams.get('lottery_code')

    if (lotteryCode) {
      // 获取指定彩种的最新一期
      const { data, error } = await supabase
        .from('lottery_results')
        .select('*')
        .eq('lottery_code', lotteryCode)
        .order('open_date', { ascending: false })
        .limit(1)
        .single()

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        data
      })
    } else {
      // 获取所有彩种的最新一期
      const { data: allResults, error } = await supabase
        .from('lottery_results')
        .select('*')
        .order('open_date', { ascending: false })

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }

      // 按彩种分组，取每个彩种的最新一期
      const latestResults = new Map()
      allResults?.forEach(result => {
        if (!latestResults.has(result.lottery_code)) {
          latestResults.set(result.lottery_code, result)
        }
      })

      return NextResponse.json({
        success: true,
        data: Array.from(latestResults.values())
      })
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

