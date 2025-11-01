import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// 境外彩种子分类（参考 vip.manycai.com）
const OVERSEAS_SUBCATEGORIES = {
  vietnam: {
    name: '越南',
    codes: [
      // 越南传统彩票（41种）
      'HNC', 'BNC', 'HFC', 'NDC', 'GNIC', 'TPC', 'PDC', 'XXC', 'DOLC', 'DNC',
      'JLC', 'QHC', 'KGC', 'LSC', 'GPC', 'GNC', 'GYC', 'GZC', 'FAC', 'SFC',
      'FZMSC', 'AJC', 'BLC', 'BZC', 'PYC', 'PFC', 'PSC', 'JOC', 'JYC', 'DLC',
      'TNC', 'TTC', 'HJC', 'JJC', 'LAC', 'SZC', 'XLC', 'QJC', 'CRC', 'YLC', 'TDC',
      // 越南快速彩
      'HN300', 'HN60', 'VNFFC', 'VNWFC', 'YNHN', 'YNMA', 'MEGA645FFC', 'MEGA6455FC',
      'HNVIP', 'BFHN', 'CQHN', 'ZCVIP'
    ]
  },
  thailand: {
    name: '泰国',
    codes: [
      'TGFC', 'BAAC', 'TG11X5', 'TG11X5FFC', 'TG300', 'TG60', 'TLZC', 'TYKC', 'GSTH'
    ]
  },
  indonesia: {
    name: '印尼',
    codes: [
      'YN60', 'YN300', 'YNPK10FFC', 'YNPK10WFC'
    ]
  },
  canada: {
    name: '加拿大',
    codes: [
      'JND30S', 'JND11X5', 'JND3D'
    ]
  },
  other: {
    name: '其他',
    codes: [
      // 澳洲
      'AZXY8', 'AZXY20', 'AZXY5', 'AZXY10',
      // 瑞典
      'RD120', 'RD60',
      // 日本
      'RB60',
      // 西贡
      'XG60', 'XG300',
      // 摩纳哥
      'MNG52',
      // 赛马
      'JSSM',
      // 股市彩票
      'GSHKA', 'GSHKP', 'GSTW', 'GSJPA', 'GSJPP', 'GSKR', 'GSCNA', 'GSCNP',
      'GSSG', 'GSIN', 'GSEG', 'GSRU', 'GSDE', 'GSUK', 'GSUS',
      // 特殊彩种
      'MAX3D'
    ]
  }
}

// 所有境外彩种代码（用于"全部"筛选）
const ALL_OVERSEAS_CODES = Object.values(OVERSEAS_SUBCATEGORIES).flatMap(cat => cat.codes)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const subcategory = searchParams.get('subcategory') // vietnam, thailand, indonesia, canada, other, 或 all

    // 获取所有境外彩种
    const { data: allLotteries, error } = await supabase
      .from('lottery_types')
      .select('*')
      .eq('is_active', true)
      .in('lottery_code', ALL_OVERSEAS_CODES)
      .order('lottery_name', { ascending: true })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // 如果指定了子分类
    if (subcategory && subcategory !== 'all') {
      if (OVERSEAS_SUBCATEGORIES[subcategory as keyof typeof OVERSEAS_SUBCATEGORIES]) {
        const subCategoryInfo = OVERSEAS_SUBCATEGORIES[subcategory as keyof typeof OVERSEAS_SUBCATEGORIES]
        const filtered = allLotteries?.filter(lottery =>
          subCategoryInfo.codes.includes(lottery.lottery_code)
        ) || []

        return NextResponse.json({
          success: true,
          subcategory: subcategory,
          name: subCategoryInfo.name,
          data: filtered
        })
      }
    }

    // 返回所有境外彩种（按子分类分组）
    const grouped = {
      all: {
        name: '全部',
        count: allLotteries?.length || 0,
        data: allLotteries || []
      },
      vietnam: {
        name: '越南',
        count: 0,
        data: [] as any[]
      },
      thailand: {
        name: '泰国',
        count: 0,
        data: [] as any[]
      },
      indonesia: {
        name: '印尼',
        count: 0,
        data: [] as any[]
      },
      canada: {
        name: '加拿大',
        count: 0,
        data: [] as any[]
      },
      other: {
        name: '其他',
        count: 0,
        data: [] as any[]
      }
    }

    // 分组
    allLotteries?.forEach(lottery => {
      for (const [key, category] of Object.entries(OVERSEAS_SUBCATEGORIES)) {
        if (category.codes.includes(lottery.lottery_code)) {
          grouped[key as keyof typeof grouped].data.push(lottery)
          grouped[key as keyof typeof grouped].count++
          break
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: grouped
    })
  } catch (error: any) {
    console.error('Error fetching overseas subcategories:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

