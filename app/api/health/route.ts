import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET /api/health - 健康检查和环境变量验证
export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: [] as any[]
  }

  // 1. 检查环境变量
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    DATA_SOURCE_URL: !!process.env.DATA_SOURCE_URL
  }

  checks.checks.push({
    name: 'Environment Variables',
    status: Object.values(envVars).every(v => v) ? 'PASS' : 'FAIL',
    details: envVars
  })

  // 2. 检查 Supabase 连接
  try {
    const { data, error } = await supabaseAdmin
      .from('lottery_types')
      .select('count', { count: 'exact', head: true })

    checks.checks.push({
      name: 'Supabase Connection',
      status: error ? 'FAIL' : 'PASS',
      details: error ? { error: error.message } : { count: data }
    })
  } catch (error: any) {
    checks.checks.push({
      name: 'Supabase Connection',
      status: 'FAIL',
      details: { error: error.message }
    })
  }

  // 3. 检查数据源可访问性
  try {
    const dataSourceUrl = process.env.DATA_SOURCE_URL || 'https://vip.manycai.com/K269046560ca208/p/10.json'
    const response = await fetch(dataSourceUrl, {
      signal: AbortSignal.timeout(5000)
    })
    
    checks.checks.push({
      name: 'Data Source',
      status: response.ok ? 'PASS' : 'FAIL',
      details: { 
        url: dataSourceUrl,
        status: response.status,
        statusText: response.statusText
      }
    })
  } catch (error: any) {
    checks.checks.push({
      name: 'Data Source',
      status: 'FAIL',
      details: { error: error.message }
    })
  }

  // 计算总体状态
  const allPassed = checks.checks.every((check: any) => check.status === 'PASS')
  const hasFailures = checks.checks.some((check: any) => check.status === 'FAIL')

  return NextResponse.json({
    status: allPassed ? 'healthy' : (hasFailures ? 'unhealthy' : 'degraded'),
    ...checks,
    help: !allPassed ? {
      message: '系统检测到配置问题',
      steps: [
        '1. 复制 .env.example 为 .env.local',
        '2. 在 Supabase Dashboard 获取 service_role key',
        '3. 更新 .env.local 中的 SUPABASE_SERVICE_ROLE_KEY',
        '4. 重启开发服务器: pnpm dev'
      ]
    } : undefined
  }, {
    status: allPassed ? 200 : 503
  })
}

