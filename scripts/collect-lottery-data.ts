import { createClient } from '@supabase/supabase-js'
import type { DataSourceResponse, DataSourceItem } from '../lib/types'
import { config } from 'dotenv'
import * as path from 'path'

// 加载 .env.local 文件
config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl) {
  console.error('❌ 错误: NEXT_PUBLIC_SUPABASE_URL 未设置')
  process.exit(1)
}

if (!supabaseKey) {
  console.error('❌ 错误: SUPABASE_SERVICE_ROLE_KEY 或 NEXT_PUBLIC_SUPABASE_ANON_KEY 未设置')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const DATA_SOURCE_URL = process.env.DATA_SOURCE_URL || 'https://vip.manycai.com/K269046560ca208/p/10.json'

async function collectLotteryData() {
  try {
    console.log('🔄 开始采集开奖数据...')
    console.log('数据源:', DATA_SOURCE_URL)

    const response = await fetch(DATA_SOURCE_URL)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: DataSourceResponse = await response.json()
    console.log(`📥 获取到 ${Object.keys(data).length} 个彩种的数据`)

    let totalInserted = 0
    let totalSkipped = 0

    for (const [lotteryCode, results] of Object.entries(data)) {
      console.log(`\n处理彩种: ${lotteryCode}, 记录数: ${results.length}`)

      const records = results.map((item: any) => {
        // 处理 code 字段：保持原始格式（字符串或对象）
        let codeValue: any
        
        if (typeof item.code === 'string') {
          // 简单字符串格式，保持为字符串
          codeValue = item.code
        } else if (typeof item.code === 'object' && item.code !== null) {
          // 复杂对象格式（越南传统彩、以太坊彩等），保持为对象
          codeValue = item.code
        } else {
          // 默认转为字符串
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

      // 批量插入，忽略重复记录
      const { data: insertedData, error } = await supabase
        .from('lottery_results')
        .upsert(records, { 
          onConflict: 'lottery_code,issue',
          ignoreDuplicates: true 
        })
        .select()

      if (error) {
        console.error(`❌ ${lotteryCode} 插入失败:`, error.message)
        continue
      }

      const inserted = insertedData?.length || 0
      const skipped = records.length - inserted
      
      totalInserted += inserted
      totalSkipped += skipped

      console.log(`  ✅ 新增: ${inserted} 条, 跳过: ${skipped} 条`)
    }

    console.log('\n' + '='.repeat(50))
    console.log(`🎉 采集完成！`)
    console.log(`  总计新增: ${totalInserted} 条记录`)
    console.log(`  总计跳过: ${totalSkipped} 条记录（已存在）`)
    console.log('='.repeat(50))
    
  } catch (error) {
    console.error('❌ 采集失败:', error)
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  collectLotteryData()
}

export { collectLotteryData }

