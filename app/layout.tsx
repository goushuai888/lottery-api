import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: '彩票开奖数据 API - 专业免费的彩票开奖数据服务平台',
  description: '提供179+种彩票的实时开奖数据API接口，包括高频彩、低频彩、极速彩、境外彩种等。完全免费，无需认证，RESTful API设计，实时更新开奖结果。',
  keywords: '彩票API,开奖数据,彩票开奖,免费API,RESTful API,实时数据',
  authors: [{ name: '彩票开奖数据平台' }],
  openGraph: {
    title: '彩票开奖数据 API - 专业免费的彩票开奖数据服务',
    description: '提供179+种彩票的实时开奖数据API接口，完全免费，无需认证',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}

