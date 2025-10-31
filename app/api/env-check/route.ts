import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// 诊断 API - 检查环境变量是否正确加载
export async function GET() {
  const envCheck = {
    NEXT_PUBLIC_SUPABASE_URL: {
      exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      value: process.env.NEXT_PUBLIC_SUPABASE_URL ? 
        `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30)}...` : 
        'NOT SET',
      length: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0
    },
    NEXT_PUBLIC_SUPABASE_ANON_KEY: {
      exists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
        `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 30)}...` : 
        'NOT SET',
      length: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0
    },
    SUPABASE_SERVICE_ROLE_KEY: {
      exists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      value: process.env.SUPABASE_SERVICE_ROLE_KEY ? 
        `${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 30)}...` : 
        'NOT SET',
      length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0
    },
    all_env_keys: Object.keys(process.env).filter(key => 
      key.includes('SUPABASE')
    )
  }

  return NextResponse.json({
    success: true,
    environment: process.env.NODE_ENV,
    vercel_env: process.env.VERCEL_ENV,
    timestamp: new Date().toISOString(),
    env_check: envCheck,
    diagnosis: {
      ready_for_production: 
        envCheck.NEXT_PUBLIC_SUPABASE_URL.exists &&
        envCheck.NEXT_PUBLIC_SUPABASE_ANON_KEY.exists &&
        envCheck.SUPABASE_SERVICE_ROLE_KEY.exists,
      missing_vars: [
        !envCheck.NEXT_PUBLIC_SUPABASE_URL.exists && 'NEXT_PUBLIC_SUPABASE_URL',
        !envCheck.NEXT_PUBLIC_SUPABASE_ANON_KEY.exists && 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        !envCheck.SUPABASE_SERVICE_ROLE_KEY.exists && 'SUPABASE_SERVICE_ROLE_KEY'
      ].filter(Boolean)
    }
  })
}

