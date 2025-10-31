import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

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

async function importLotteryTypes() {
  const filePath = path.join(process.cwd(), 'lottery_types.txt')
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n').filter(line => line.trim())

  // 跳过标题行
  const dataLines = lines.slice(1)

  const lotteryTypes = dataLines.map(line => {
    const parts = line.split('\t')
    if (parts.length < 4) return null

    return {
      lottery_name: parts[0],
      lottery_code: parts[1],
      example_format: parts[2],
      period_format: parts[3],
      is_active: true
    }
  }).filter(Boolean)

  console.log(`准备导入 ${lotteryTypes.length} 个彩种...`)

  // 批量插入
  const { data, error } = await supabase
    .from('lottery_types')
    .upsert(lotteryTypes, { 
      onConflict: 'lottery_code',
      ignoreDuplicates: false 
    })

  if (error) {
    console.error('导入失败:', error)
    process.exit(1)
  }

  console.log('✅ 彩种数据导入成功！')
  process.exit(0)
}

importLotteryTypes()

