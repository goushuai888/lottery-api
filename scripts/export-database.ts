#!/usr/bin/env tsx
/**
 * 数据库导出脚本
 * 
 * 功能：
 * - 导出 lottery_types（彩种信息）
 * - 导出 lottery_results（开奖记录）
 * - 生成元数据文件
 * - 支持增量导出和完整导出
 * 
 * 使用方法：
 * pnpm tsx scripts/export-database.ts [options]
 * 
 * 选项：
 * --full          完整导出（默认）
 * --incremental   增量导出（仅最近24小时）
 * --days=N        导出最近N天的数据
 * --lottery=CODE  只导出指定彩种
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// 解析命令行参数
const args = process.argv.slice(2)
const isIncremental = args.includes('--incremental')
const daysArg = args.find(arg => arg.startsWith('--days='))
const days = daysArg ? parseInt(daysArg.split('=')[1]) : null
const lotteryArg = args.find(arg => arg.startsWith('--lottery='))
const lotteryCode = lotteryArg ? lotteryArg.split('=')[1] : null

// 显示帮助信息（在初始化前检查）
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
数据库导出脚本

使用方法:
  pnpm tsx scripts/export-database.ts [options]

选项:
  --full                完整导出（默认）
  --incremental         增量导出（仅最近24小时）
  --days=N              导出最近N天的数据
  --lottery=CODE        只导出指定彩种
  --help, -h            显示帮助信息

示例:
  # 完整导出
  pnpm tsx scripts/export-database.ts

  # 导出最近24小时的数据
  pnpm tsx scripts/export-database.ts --incremental

  # 导出最近7天的数据
  pnpm tsx scripts/export-database.ts --days=7

  # 只导出 YN60 彩种
  pnpm tsx scripts/export-database.ts --lottery=YN60

  # 导出 YN60 最近3天的数据
  pnpm tsx scripts/export-database.ts --lottery=YN60 --days=3
`)
  process.exit(0)
}

// 初始化 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 错误: 缺少 Supabase 环境变量')
  console.error('请确保设置了以下环境变量:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  console.error('  - SUPABASE_SERVICE_ROLE_KEY 或 NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface ExportOptions {
  isIncremental: boolean
  days: number | null
  lotteryCode: string | null
}

interface ExportMetadata {
  export_time: string
  export_type: 'full' | 'incremental' | 'filtered'
  filters: {
    days?: number
    lottery_code?: string
    date_from?: string
    date_to?: string
  }
  database: {
    project_id: string
    region: string
  }
  statistics: {
    lottery_types_count: number
    lottery_results_count: number
    export_size_mb: number
  }
  files: string[]
}

/**
 * 格式化文件大小
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * 导出彩种信息
 */
async function exportLotteryTypes(lotteryCode: string | null) {
  console.log('📋 正在导出彩种信息...')
  
  let query = supabase
    .from('lottery_types')
    .select('*')
    .order('id')
  
  if (lotteryCode) {
    query = query.eq('lottery_code', lotteryCode)
  }
  
  const { data, error } = await query
  
  if (error) {
    throw new Error(`导出彩种信息失败: ${error.message}`)
  }
  
  console.log(`✅ 已导出 ${data?.length || 0} 个彩种`)
  return data || []
}

/**
 * 导出开奖记录
 */
async function exportLotteryResults(options: ExportOptions) {
  console.log('📊 正在导出开奖记录...')
  
  const batchSize = 5000
  let offset = 0
  const allResults: any[] = []
  
  // 构建查询
  let dateFilter = ''
  if (options.isIncremental) {
    dateFilter = 'NOW() - INTERVAL \'24 hours\''
  } else if (options.days) {
    dateFilter = `NOW() - INTERVAL '${options.days} days'`
  }
  
  while (true) {
    let query = supabase
      .from('lottery_results')
      .select('*')
      .order('id')
      .range(offset, offset + batchSize - 1)
    
    // 应用过滤条件
    if (options.lotteryCode) {
      query = query.eq('lottery_code', options.lotteryCode)
    }
    
    if (dateFilter) {
      // 注意：Supabase JS 客户端不支持直接使用 SQL 函数
      // 我们需要计算具体的日期
      const filterDate = new Date()
      if (options.isIncremental) {
        filterDate.setHours(filterDate.getHours() - 24)
      } else if (options.days) {
        filterDate.setDate(filterDate.getDate() - options.days)
      }
      query = query.gte('open_date', filterDate.toISOString())
    }
    
    const { data, error } = await query
    
    if (error) {
      throw new Error(`导出开奖记录失败: ${error.message}`)
    }
    
    if (!data || data.length === 0) break
    
    allResults.push(...data)
    offset += batchSize
    
    // 显示进度
    process.stdout.write(`\r   已导出 ${allResults.length} 条记录...`)
  }
  
  console.log('') // 换行
  console.log(`✅ 已导出 ${allResults.length} 条开奖记录`)
  return allResults
}

/**
 * 保存导出文件
 */
function saveExportFiles(
  lotteryTypes: any[],
  lotteryResults: any[],
  options: ExportOptions
): { files: string[]; totalSize: number } {
  // 创建导出目录
  const exportDir = path.join(process.cwd(), 'database-export')
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true })
  }
  
  // 生成时间戳
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]
  const timeStr = new Date().toISOString().replace(/[:.]/g, '-').split('T')[1].split('Z')[0]
  
  const files: string[] = []
  let totalSize = 0
  
  // 保存彩种信息
  const typesFilename = `lottery_types_${timestamp}_${timeStr}.json`
  const typesPath = path.join(exportDir, typesFilename)
  const typesContent = JSON.stringify(lotteryTypes, null, 2)
  fs.writeFileSync(typesPath, typesContent)
  files.push(typesFilename)
  totalSize += typesContent.length
  console.log(`📄 已保存: ${typesFilename} (${formatBytes(typesContent.length)})`)
  
  // 保存开奖记录
  const resultsFilename = `lottery_results_${timestamp}_${timeStr}.json`
  const resultsPath = path.join(exportDir, resultsFilename)
  const resultsContent = JSON.stringify(lotteryResults, null, 2)
  fs.writeFileSync(resultsPath, resultsContent)
  files.push(resultsFilename)
  totalSize += resultsContent.length
  console.log(`📄 已保存: ${resultsFilename} (${formatBytes(resultsContent.length)})`)
  
  return { files, totalSize }
}

/**
 * 生成元数据文件
 */
function saveMetadata(
  files: string[],
  lotteryTypes: any[],
  lotteryResults: any[],
  totalSize: number,
  options: ExportOptions
) {
  const exportDir = path.join(process.cwd(), 'database-export')
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]
  const timeStr = new Date().toISOString().replace(/[:.]/g, '-').split('T')[1].split('Z')[0]
  
  // 确定导出类型
  let exportType: 'full' | 'incremental' | 'filtered' = 'full'
  if (options.isIncremental || options.days) {
    exportType = 'incremental'
  } else if (options.lotteryCode) {
    exportType = 'filtered'
  }
  
  // 构建过滤条件信息
  const filters: any = {}
  if (options.days) {
    filters.days = options.days
    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - options.days)
    filters.date_from = fromDate.toISOString()
    filters.date_to = new Date().toISOString()
  } else if (options.isIncremental) {
    filters.days = 1
    const fromDate = new Date()
    fromDate.setHours(fromDate.getHours() - 24)
    filters.date_from = fromDate.toISOString()
    filters.date_to = new Date().toISOString()
  }
  if (options.lotteryCode) {
    filters.lottery_code = options.lotteryCode
  }
  
  const metadata: ExportMetadata = {
    export_time: new Date().toISOString(),
    export_type: exportType,
    filters,
    database: {
      project_id: 'ixqsqmftydqsibrjkuyc',
      region: 'ap-southeast-2'
    },
    statistics: {
      lottery_types_count: lotteryTypes.length,
      lottery_results_count: lotteryResults.length,
      export_size_mb: Math.round(totalSize / 1024 / 1024 * 100) / 100
    },
    files
  }
  
  const metadataFilename = `metadata_${timestamp}_${timeStr}.json`
  const metadataPath = path.join(exportDir, metadataFilename)
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2))
  console.log(`📋 已保存元数据: ${metadataFilename}`)
  
  return metadata
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始导出数据库...\n')
  
  // 显示导出配置
  console.log('📝 导出配置:')
  if (isIncremental) {
    console.log('   类型: 增量导出（最近24小时）')
  } else if (days) {
    console.log(`   类型: 增量导出（最近${days}天）`)
  } else {
    console.log('   类型: 完整导出')
  }
  if (lotteryCode) {
    console.log(`   彩种: ${lotteryCode}`)
  } else {
    console.log('   彩种: 全部')
  }
  console.log('')
  
  try {
    const options: ExportOptions = {
      isIncremental,
      days,
      lotteryCode
    }
    
    // 导出数据
    const lotteryTypes = await exportLotteryTypes(lotteryCode)
    const lotteryResults = await exportLotteryResults(options)
    
    console.log('')
    
    // 保存文件
    console.log('💾 正在保存文件...')
    const { files, totalSize } = saveExportFiles(lotteryTypes, lotteryResults, options)
    
    // 保存元数据
    const metadata = saveMetadata(files, lotteryTypes, lotteryResults, totalSize, options)
    
    console.log('')
    console.log('✅ 导出完成！')
    console.log('')
    console.log('📊 导出统计:')
    console.log(`   彩种数量: ${metadata.statistics.lottery_types_count}`)
    console.log(`   开奖记录: ${metadata.statistics.lottery_results_count}`)
    console.log(`   文件大小: ${metadata.statistics.export_size_mb} MB`)
    console.log(`   导出目录: ${path.join(process.cwd(), 'database-export')}`)
    console.log('')
    
    // 显示文件列表
    console.log('📁 导出文件:')
    files.forEach(file => console.log(`   - ${file}`))
    console.log(`   - metadata_${new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]}_${new Date().toISOString().replace(/[:.]/g, '-').split('T')[1].split('Z')[0]}.json`)
    
  } catch (error) {
    console.error('')
    console.error('❌ 导出失败:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

// 运行主函数
main()

