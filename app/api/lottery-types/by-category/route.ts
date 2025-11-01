import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// 彩票分类映射（基于官方网站的5大类）
const LOTTERY_CATEGORIES = {
  high_frequency: {
    name: '高频彩种',
    codes: [
      'CQSSC', 'XJSSC', 'SHSSL', 'TJSSC', 'BJKL8', 'BJPK10', 'JSKS', 'JLK3', 
      'AHK3', 'HLK3', 'HBK3', 'SH11X5', 'JS11X5', 'SD11X5', 'GX11X5', 'AF11X5', 
      'GD11X5', 'JX11X5', 'HB11X5', 'LL11X5', 'YN11X5', 'HLJ11X5', 'HNKL10', 
      'TJKL10', 'GXKL10', 'GDKL10', 'SCKL12', 'CQXYNC', 'XYFT', 'GXKS', 'CQ5FC', 
      'CQFFC', 'JDCQSSC', 'XIYFT'
    ]
  },
  low_frequency: {
    name: '低频彩种',
    codes: ['XGLHC', 'FC3D', 'TCPL3', 'TCPL5', 'MOLHC']
  },
  super_speed: {
    name: '极速彩种',
    codes: ['MCPK10', 'XGPK10', 'CQSSC30S', 'TXFFC30S', 'QQ30S']
  },
  overseas: {
    name: '境外彩种',
    codes: [
      'AZXY8', 'AZXY20', 'AZXY5', 'AZXY10', 'TGFC', 'BAAC', 'TG11X5', 'TG11X5FFC',
      'HNC', 'BNC', 'HFC', 'NDC', 'GNIC', 'TPC', 'PDC', 'XXC', 'DOLC', 'DNC', 
      'JLC', 'QHC', 'KGC', 'LSC', 'GPC', 'GNC', 'GYC', 'GZC', 'FAC', 'SFC', 
      'FZMSC', 'AJC', 'BLC', 'BZC', 'PYC', 'PFC', 'PSC', 'JOC', 'JYC', 'DLC', 
      'TNC', 'TTC', 'HJC', 'JJC', 'LAC', 'SZC', 'XLC', 'QJC', 'CRC', 'YLC', 
      'TDC', 'HN300', 'HN60', 'RD120', 'RD60', 'TG300', 'TG60', 'YN60', 'YN300', 
      'XG60', 'XG300', 'RB60', 'TLZC', 'TYKC', 'VNFFC', 'VNWFC', 'JND30S', 
      'MNG52', 'JND11X5', 'JND3D', 'JSSM', 'YNPK10FFC', 'YNPK10WFC', 'GSHKA', 
      'GSHKP', 'GSTW', 'GSJPA', 'GSJPP', 'GSKR', 'GSCNA', 'GSCNP', 'GSSG', 
      'GSTH', 'GSIN', 'GSEG', 'GSRU', 'GSDE', 'GSUK', 'GSUS', 'MAX3D', 'YNHN', 
      'YNMA', 'MEGA645FFC', 'MEGA6455FC', 'HNVIP', 'BFHN', 'CQHN', 'ZCVIP'
    ]
  },
  calculated: {
    name: '计算型彩种',
    codes: [
      'TXFFC', 'QQFFC', 'TX2FCS', 'TX2FCD', 'TX5FC', 'TXPK10', 'QIQFFC', 'BTCFFC', 
      'ZFBFFC', 'ZFB5FC', 'BTC5FC', 'BABTCFFC', 'BABTC5FC', 'BAETFFC', 'BAET5FC', 
      'OEBTCFFC', 'OEBTC5FC', 'OEETFFC', 'OEET5FC', 'HASHFFC', 'HASH3FC', 'HASH5FC', 
      'ETFFC', 'NEWHASHFFC', 'NEWHASH3FC', 'NEWHASH5FC', 'TRX30S', 'ET3FC', 'ET5FC'
    ]
  }
}

// GET /api/lottery-types/by-category - 按5大类获取彩种
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') // high_frequency, low_frequency, super_speed, overseas, calculated
    
    // 获取所有激活的彩种
    const { data: allLotteries, error } = await supabase
      .from('lottery_types')
      .select('*')
      .eq('is_active', true)
      .order('lottery_name', { ascending: true })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // 如果指定了分类，只返回该分类
    if (category && LOTTERY_CATEGORIES[category as keyof typeof LOTTERY_CATEGORIES]) {
      const categoryInfo = LOTTERY_CATEGORIES[category as keyof typeof LOTTERY_CATEGORIES]
      const filtered = allLotteries?.filter(lottery => 
        categoryInfo.codes.includes(lottery.lottery_code)
      ) || []
      
      return NextResponse.json({
        success: true,
        category: category,
        category_name: categoryInfo.name,
        data: filtered,
        total: filtered.length
      })
    }

    // 否则返回所有分类的数据
    const categorizedData: Record<string, any> = {}
    
    for (const [key, categoryInfo] of Object.entries(LOTTERY_CATEGORIES)) {
      categorizedData[key] = {
        name: categoryInfo.name,
        lotteries: allLotteries?.filter(lottery => 
          categoryInfo.codes.includes(lottery.lottery_code)
        ) || []
      }
    }

    return NextResponse.json({
      success: true,
      data: categorizedData,
      categories: {
        high_frequency: '高频彩种',
        low_frequency: '低频彩种',
        super_speed: '极速彩种',
        overseas: '境外彩种',
        calculated: '计算型彩种'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

