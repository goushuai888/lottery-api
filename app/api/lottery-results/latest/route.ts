import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')

    // 获取最新开奖记录（跨所有彩种）
    const { data, error } = await supabase
      .from('lottery_results')
      .select(`
        lottery_code,
        issue,
        open_code,
        open_date,
        lottery_types!inner(lottery_name)
      `)
      .order('open_date', { ascending: false })
      .limit(limit)

    if (error) throw error

    // 格式化数据
    const formattedData = data?.map(item => ({
      lottery_code: item.lottery_code,
      lottery_name: (item.lottery_types as any)?.lottery_name || item.lottery_code,
      issue: item.issue,
      open_code: item.open_code,
      open_date: item.open_date
    })) || []

    return NextResponse.json({
      success: true,
      data: formattedData,
      total: formattedData.length
    })

  } catch (error) {
    console.error('获取最新开奖失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '获取失败'
      },
      { status: 500 }
    )
  }
}
