import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// 计算时间差
function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins}分钟前`
  if (diffHours < 24) return `${diffHours}小时前`
  if (diffDays < 7) return `${diffDays}天前`
  return date.toLocaleDateString('zh-CN')
}

// GET /api/statistics - 获取彩票统计信息（使用优化视图）
export async function GET(request: Request) {
  try {
    // 使用优化后的统计视图
    const { data, error } = await supabase
      .from('lottery_statistics')
      .select('*')
      .order('lottery_count', { ascending: false })

    if (error) {
      console.error('查询统计信息失败:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    // 查询最新开奖时间
    const { data: latestData } = await supabase
      .from('lottery_results')
      .select('open_date, lottery_code, issue')
      .order('open_date', { ascending: false })
      .limit(1)
      .single()

    // 计算总体统计
    const summary = {
      total_lottery_types: data?.reduce((sum, item) => sum + (item.lottery_count || 0), 0) || 0,
      total_results: data?.reduce((sum, item) => sum + (item.total_results || 0), 0) || 0,
      lottery_type_categories: 5, // 固定5个分类：高频、低频、极速、境外、计算型
      latest_draw: latestData ? {
        time: latestData.open_date,
        lottery_code: latestData.lottery_code,
        issue: latestData.issue,
        time_ago: getTimeAgo(new Date(latestData.open_date))
      } : null
    }

    return NextResponse.json({
      success: true,
      summary,
      data: data || [],
      note: '使用优化视图查询，自动聚合统计'
    })
  } catch (error: any) {
    console.error('统计 API 错误:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
