export interface LotteryType {
  id: number
  lottery_code: string
  lottery_name: string
  period_format: string | null
  example_format: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface LotteryResult {
  id: number
  lottery_code: string
  issue: string
  official_issue: string | null
  open_date: string
  code: string | ComplexCode | EthereumCode | HongKongCode | ThaiGovCode | SuffixCode | Max3DCode | BaacCode | ZcvipCode | any
  created_at: string
}

// 越南传统彩等复杂格式
export interface ComplexCode {
  code?: string
  code1?: string
  code2?: string
  code3?: string[]
  code4?: string[]
  code5?: string
  code6?: string[]
  code7?: string
  code8?: string
}

// 以太坊彩票格式
export interface EthereumCode {
  code?: string
  code_block?: string
  code_hash?: string
}

// 港式彩票 (Hong Kong Style)
export interface HongKongCode {
  code?: string    // 主号码
  code1?: string   // 附加号码
}

// 泰国政府彩票 (Thai Government)
export interface ThaiGovCode {
  code?: string
  code1?: string
  code2?: string
  code3?: string
}

// 带后缀号码的彩票
export interface SuffixCode {
  code?: string
  code_last2?: string
  code_last3?: string
  code_pre2?: string
  code_mid2?: string
}

// MAX3D 特殊格式
export interface Max3DCode {
  code_1?: string
  code_2?: string
  code_3?: string
  code_sp?: string
}

// BAAC 泰国储蓄彩票 (最复杂)
export interface BaacCode {
  code?: string
  code0?: string
  code1?: string
  code2?: string
  code3?: string
  code4?: string
  code5?: string
  code6?: string
  code7?: string
  code8?: string
  code_last3?: string
  code_last3_1?: string
  code_last4?: string
}

// ZCVIP 特殊格式
export interface ZcvipCode {
  code?: string
  code2?: string
  code_last2?: string
  code_last3?: string
  code_last4?: string
}

export interface DataSourceItem {
  issue: string
  opendate: string
  code: string | ComplexCode | EthereumCode | HongKongCode | ThaiGovCode | SuffixCode | Max3DCode | BaacCode | ZcvipCode | any
  lotterycode: string
  officialissue: string
}

export interface DataSourceResponse {
  [key: string]: DataSourceItem[]
}

