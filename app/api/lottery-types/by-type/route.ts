import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET /api/lottery-types/by-type - 按类型获取彩种列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lotteryType = searchParams.get('type') // standard, vietnamese_traditional, blockchain

    let query = supabase
      .from('lottery_types')
      .select('*')
      .eq('is_active', true)
      .order('lottery_name', { ascending: true })

    if (lotteryType) {
      query = query.eq('lottery_type', lotteryType)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // 按类型分组
    const groupedData = data?.reduce((acc: any, lottery) => {
      const type = lottery.lottery_type || 'standard'
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push(lottery)
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      data: lotteryType ? data : groupedData,
      total: data?.length || 0,
      types: {
        standard: '标准彩票',
        vietnamese_traditional: '越南传统彩',
        blockchain: '区块链彩票'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

