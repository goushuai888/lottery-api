import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// 境外彩种按国家分组（参考采集源网站）
const COUNTRY_GROUPS = {
  all: {
    name: '全部',
    subcategories: {}
  },
  vietnam: {
    name: '越南',
    subcategories: {
      popular: {
        name: '热门彩种',
        codes: [
          'HNVIP', 'BFHN', 'CQHN', 'ZCVIP', 'HNC', 'BNC', 'HFC', 'NDC'
        ]
      },
      speed: {
        name: '极速彩种',
        codes: [
          'VNFFC', 'VNWFC', 'HN300', 'HN60', 'YNHN', 'YNMA'
        ]
      },
      traditional: {
        name: '越南传统彩票',
        codes: [
          'GNIC', 'TPC', 'PDC', 'XXC', 'DOLC', 'DNC', 'JLC', 'QHC', 'KGC', 
          'LSC', 'GPC', 'GNC', 'GYC', 'GZC', 'FAC', 'SFC', 'FZMSC', 'AJC', 
          'BLC', 'BZC', 'PYC', 'PFC', 'PSC', 'JOC', 'JYC', 'DLC', 'TNC', 
          'TTC', 'HJC', 'JJC', 'LAC', 'SZC', 'XLC', 'QJC', 'CRC', 'YLC', 'TDC'
        ]
      },
      mega: {
        name: 'MEGA系列',
        codes: [
          'MEGA645FFC', 'MEGA6455FC'
        ]
      }
    }
  },
  thailand: {
    name: '泰国',
    subcategories: {
      popular: {
        name: '热门彩种',
        codes: ['BAAC', 'TGFC']
      },
      speed: {
        name: '极速彩种',
        codes: ['TG300', 'TG60']
      },
      traditional: {
        name: '传统彩种',
        codes: ['TG11X5', 'TG11X5FFC', 'TLZC', 'TYKC', 'GSTH']
      }
    }
  },
  indonesia: {
    name: '印尼',
    subcategories: {
      speed: {
        name: '极速彩种',
        codes: ['YN60', 'YN300']
      },
      pk10: {
        name: 'PK10系列',
        codes: ['YNPK10FFC', 'YNPK10WFC']
      }
    }
  },
  canada: {
    name: '加拿大',
    subcategories: {
      speed: {
        name: '极速彩种',
        codes: ['JND30S']
      },
      traditional: {
        name: '传统彩种',
        codes: ['JND11X5', 'JND3D']
      }
    }
  },
  other: {
    name: '其他',
    subcategories: {
      australia: {
        name: '澳洲',
        codes: ['AZXY8', 'AZXY20', 'AZXY5', 'AZXY10']
      },
      sweden: {
        name: '瑞典',
        codes: ['RD120', 'RD60']
      },
      japan: {
        name: '日本',
        codes: ['RB60']
      },
      macau: {
        name: '澳门',
        codes: ['XG60', 'XG300']
      },
      monaco: {
        name: '摩纳哥',
        codes: ['MNG52']
      },
      horse: {
        name: '赛马',
        codes: ['JSSM']
      },
      stock: {
        name: '股市彩票',
        codes: [
          'GSHKA', 'GSHKP', 'GSTW', 'GSJPA', 'GSJPP', 'GSKR', 'GSCNA', 'GSCNP',
          'GSSG', 'GSIN', 'GSEG', 'GSRU', 'GSDE', 'GSUK', 'GSUS'
        ]
      },
      special: {
        name: '特殊彩种',
        codes: ['MAX3D']
      }
    }
  }
}

// 获取所有彩种代码
function getAllCodes(): string[] {
  const codes: string[] = []
  Object.values(COUNTRY_GROUPS).forEach(country => {
    if (country.subcategories) {
      Object.values(country.subcategories).forEach((sub: any) => {
        codes.push(...sub.codes)
      })
    }
  })
  // 去重并返回数组
  const uniqueCodes = Array.from(new Set(codes))
  return uniqueCodes
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country') || 'all' // all, vietnam, thailand, indonesia, canada, other

    // 获取所有激活的彩种
    const allCodes = getAllCodes()
    const { data: allLotteries, error } = await supabase
      .from('lottery_types')
      .select('*')
      .eq('is_active', true)
      .in('lottery_code', allCodes)
      .order('lottery_name', { ascending: true })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // 如果是"全部"，返回所有国家分组
    if (country === 'all') {
      const result: Record<string, any> = {}
      
      for (const [countryKey, countryInfo] of Object.entries(COUNTRY_GROUPS)) {
        if (countryKey === 'all') continue
        
        result[countryKey] = {
          name: countryInfo.name,
          subcategories: {} as Record<string, any>
        }
        
        // 按子分类分组
        for (const [subKey, subInfo] of Object.entries(countryInfo.subcategories)) {
          const lotteries = allLotteries?.filter(lottery => 
            (subInfo as any).codes.includes(lottery.lottery_code)
          ) || []
          
          if (lotteries.length > 0) {
            result[countryKey].subcategories[subKey] = {
              name: (subInfo as any).name,
              lotteries: lotteries
            }
          }
        }
      }
      
      return NextResponse.json({
        success: true,
        country: 'all',
        data: result
      })
    }

    // 如果指定了国家，只返回该国家的分组
    if (COUNTRY_GROUPS[country as keyof typeof COUNTRY_GROUPS]) {
      const countryInfo = COUNTRY_GROUPS[country as keyof typeof COUNTRY_GROUPS]
      const result: Record<string, any> = {}
      
      // 按子分类分组
      for (const [subKey, subInfo] of Object.entries(countryInfo.subcategories)) {
        const lotteries = allLotteries?.filter(lottery => 
          (subInfo as any).codes.includes(lottery.lottery_code)
        ) || []
        
        if (lotteries.length > 0) {
          result[subKey] = {
            name: (subInfo as any).name,
            lotteries: lotteries
          }
        }
      }
      
      return NextResponse.json({
        success: true,
        country: country,
        country_name: countryInfo.name,
        data: result
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid country parameter'
    }, { status: 400 })

  } catch (error: any) {
    console.error('Error fetching grouped lotteries:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

