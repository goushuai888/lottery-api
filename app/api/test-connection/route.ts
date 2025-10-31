import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// 详细的连接测试 API
export async function GET() {
  const results: any[] = []
  
  // 测试 1: 环境变量
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  results.push({
    test: '环境变量检查',
    url_exists: !!supabaseUrl,
    url_value: supabaseUrl?.substring(0, 30) + '...',
    anon_key_exists: !!anonKey,
    anon_key_length: anonKey?.length || 0,
    service_key_exists: !!serviceKey,
    service_key_length: serviceKey?.length || 0,
    service_key_preview: serviceKey ? serviceKey.substring(0, 50) + '...' : 'NOT SET'
  })
  
  if (!supabaseUrl || !anonKey || !serviceKey) {
    return NextResponse.json({
      success: false,
      error: '环境变量缺失',
      results
    }, { status: 500 })
  }
  
  // 测试 2: 使用 ANON KEY 连接
  try {
    const clientAnon = createClient(supabaseUrl, anonKey)
    const { data, error } = await clientAnon
      .from('lottery_types')
      .select('lottery_code')
      .limit(1)
    
    results.push({
      test: 'ANON KEY 连接测试',
      success: !error,
      error: error?.message || null,
      data_count: data?.length || 0
    })
  } catch (error: any) {
    results.push({
      test: 'ANON KEY 连接测试',
      success: false,
      error: error.message,
      exception: true
    })
  }
  
  // 测试 3: 使用 SERVICE ROLE KEY 连接
  try {
    const clientService = createClient(supabaseUrl, serviceKey)
    const { data, error } = await clientService
      .from('lottery_types')
      .select('lottery_code')
      .limit(1)
    
    results.push({
      test: 'SERVICE ROLE KEY 连接测试',
      success: !error,
      error: error?.message || null,
      data_count: data?.length || 0
    })
  } catch (error: any) {
    results.push({
      test: 'SERVICE ROLE KEY 连接测试',
      success: false,
      error: error.message,
      exception: true
    })
  }
  
  // 测试 4: 尝试插入操作（测试权限）
  try {
    const clientService = createClient(supabaseUrl, serviceKey)
    const testRecord = {
      lottery_code: 'TEST_' + Date.now(),
      issue: 'test123',
      official_issue: 'test123',
      open_date: new Date().toISOString(),
      code: '1,2,3,4,5'
    }
    
    const { error } = await clientService
      .from('lottery_results')
      .insert(testRecord)
      .select()
    
    if (!error) {
      // 删除测试记录
      await clientService
        .from('lottery_results')
        .delete()
        .eq('lottery_code', testRecord.lottery_code)
    }
    
    results.push({
      test: 'SERVICE ROLE KEY 写入权限测试',
      success: !error,
      error: error?.message || null
    })
  } catch (error: any) {
    results.push({
      test: 'SERVICE ROLE KEY 写入权限测试',
      success: false,
      error: error.message,
      exception: true
    })
  }
  
  const allSuccess = results.every(r => r.success !== false)
  
  return NextResponse.json({
    success: allSuccess,
    timestamp: new Date().toISOString(),
    results,
    summary: {
      total_tests: results.length,
      passed: results.filter(r => r.success === true).length,
      failed: results.filter(r => r.success === false).length
    }
  })
}

