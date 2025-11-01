// 彩票图标组件
// 为每个彩票提供对应的图标或 emoji 标识

interface LotteryIconProps {
  lotteryCode: string
  lotteryName: string
  size?: 'sm' | 'md' | 'lg'
}

// 彩票代码到图标的映射
const LOTTERY_ICONS: Record<string, string> = {
  // 高频彩种
  'CQSSC': '🎰',      // 欢乐生肖
  'XJSSC': '🎲',      // 新疆时时彩
  'SHSSL': '🎯',      // 上海时时乐
  'TJSSC': '🎪',      // 天津时时彩
  'BJKL8': '🎱',      // 北京快乐8
  'BJPK10': '🏎️',     // 北京PK10
  'JSKS': '🎮',       // 江苏快三
  'JLK3': '🎲',       // 吉林快3
  'AHK3': '🎲',       // 安徽快3
  'HLK3': '🎲',       // 河南快3
  'HBK3': '🎲',       // 湖北快3
  'GXKS': '🎲',       // 广西快3
  'SH11X5': '🔢',     // 上海11选5
  'JS11X5': '🔢',     // 江苏11选5
  'SD11X5': '🔢',     // 山东11选5
  'GX11X5': '🔢',     // 广西11选5
  'AF11X5': '🔢',     // 安徽11选5
  'GD11X5': '🔢',     // 广东11选5
  'JX11X5': '🔢',     // 江西11选5
  'HB11X5': '🔢',     // 湖北11选5
  'LL11X5': '🔢',     // 辽宁11选5
  'YN11X5': '🔢',     // 云南11选5
  'HLJ11X5': '🔢',    // 黑龙江11选5
  'HNKL10': '🎊',     // 湖南快乐十分
  'TJKL10': '🎊',     // 天津快乐十分
  'GXKL10': '🎊',     // 广西快乐十分
  'GDKL10': '🎊',     // 广东快乐十分
  'SCKL12': '🎊',     // 四川快乐12
  'CQXYNC': '🌾',     // 重庆幸运农场
  'XYFT': '✈️',       // 皇家幸运飞艇
  'XIYFT': '✈️',      // 幸运飞艇
  'CQ5FC': '⏱️',      // 重庆五分彩
  'CQFFC': '⚡',      // 重庆分分彩
  'JDCQSSC': '🎰',    // 经典重庆时时彩

  // 低频彩种
  'XGLHC': '🇭🇰',     // 香港六合彩
  'MOLHC': '🇲🇴',     // 澳门六合彩
  'FC3D': '🎲',       // 福彩3D
  'TCPL3': '🎲',      // 体彩排列3
  'TCPL5': '🎲',      // 体彩排列5

  // 极速彩种
  'MCPK10': '🏁',     // 极速赛车
  'XGPK10': '🏎️',     // 香港PK10
  'CQSSC30S': '⚡',   // 多彩重庆30秒
  'TXFFC30S': '⚡',   // 多彩腾讯30秒
  'QQ30S': '🐧',      // QQ30秒

  // 境外彩种 - 澳洲系列
  'AZXY5': '🇦🇺',     // 澳洲幸运5
  'AZXY8': '🇦🇺',     // 澳洲幸运8
  'AZXY10': '🇦🇺',    // 澳洲幸运10
  'AZXY20': '🇦🇺',    // 澳洲幸运20

  // 境外彩种 - 泰国系列
  'TGFC': '🇹🇭',      // 泰国政府彩票
  'BAAC': '🇹🇭',      // 泰国BAAC储蓄彩票
  'TG11X5': '🇹🇭',    // 泰国11选5
  'TG11X5FFC': '🇹🇭', // 泰国分分11选5
  'TG300': '🇹🇭',     // 泰国300秒
  'TG60': '🇹🇭',      // 泰国60秒
  'TLZC': '🇹🇭',      // 泰国老挝彩票
  'TYKC': '🇹🇭',      // 泰国Yee Kee VIP
  'GSTH': '🇹🇭',      // 泰国股市彩票

  // 境外彩种 - 越南系列
  'HNC': '🇻🇳',       // 越南传统彩-河内
  'BNC': '🇻🇳',       // 越南传统彩-北宁
  'HFC': '🇻🇳',       // 越南传统彩-海防
  'NDC': '🇻🇳',       // 越南传统彩-南定
  'GNIC': '🇻🇳',      // 越南传统彩-广宁
  'TPC': '🇻🇳',       // 越南传统彩-太平
  'PDC': '🇻🇳',       // 越南传统彩-平定
  'XXC': '🇻🇳',       // 越南传统彩-岘港
  'DOLC': '🇻🇳',      // 越南传统彩-多乐
  'DNC': '🇻🇳',       // 越南传统彩-达农
  'JLC': '🇻🇳',       // 越南传统彩-嘉莱
  'QHC': '🇻🇳',       // 越南传统彩-庆和
  'KGC': '🇻🇳',       // 越南传统彩-昆嵩
  'LSC': '🇻🇳',       // 越南传统彩-宁顺
  'GPC': '🇻🇳',       // 越南传统彩-广平
  'GNC': '🇻🇳',       // 越南传统彩-广南
  'GYC': '🇻🇳',       // 越南传统彩-广义
  'GZC': '🇻🇳',       // 越南传统彩-广治
  'FAC': '🇻🇳',       // 越南传统彩-富安
  'SFC': '🇻🇳',       // 越南传统彩-承天顺化
  'FZMSC': '🇻🇳',     // 越南传统彩-胡志明市
  'AJC': '🇻🇳',       // 越南传统彩-安江
  'BLC': '🇻🇳',       // 越南传统彩-薄辽
  'BZC': '🇻🇳',       // 越南传统彩-槟椥
  'PYC': '🇻🇳',       // 越南传统彩-平阳
  'PFC': '🇻🇳',       // 越南传统彩-平福
  'PSC': '🇻🇳',       // 越南传统彩-平顺
  'JOC': '🇻🇳',       // 越南传统彩-金瓯
  'JYC': '🇻🇳',       // 越南传统彩-芹苴
  'DLC': '🇻🇳',       // 越南传统彩-大叻
  'TNC': '🇻🇳',       // 越南传统彩-同奈
  'TTC': '🇻🇳',       // 越南传统彩-同塔
  'HJC': '🇻🇳',       // 越南传统彩-后江
  'JJC': '🇻🇳',       // 越南传统彩-建江
  'LAC': '🇻🇳',       // 越南传统彩-隆安
  'SZC': '🇻🇳',       // 越南传统彩-溯庄
  'XLC': '🇻🇳',       // 越南传统彩-西宁
  'QJC': '🇻🇳',       // 越南传统彩-前江
  'CRC': '🇻🇳',       // 越南传统彩-茶荣
  'YLC': '🇻🇳',       // 越南传统彩-永隆
  'TDC': '🇻🇳',       // 越南传统彩-头顿
  'HN300': '🇻🇳',     // 河内五分彩
  'HN60': '🇻🇳',      // 河内分分彩
  'VNFFC': '🇻🇳',     // 越南极速1分彩
  'VNWFC': '🇻🇳',     // 越南极速5分彩
  'YNHN': '🇻🇳',      // 越南河内套彩
  'HNVIP': '🇻🇳',     // 河内VIP彩票
  'BFHN': '🇻🇳',      // 北方河内彩票
  'CQHN': '🇻🇳',      // 抽签河内彩票
  'ZCVIP': '🇱🇦',     // 老挝VIP彩票
  'XG60': '🇻🇳',      // 西贡分分彩
  'XG300': '🇻🇳',     // 西贡五分彩

  // 境外彩种 - 其他国家
  'RD120': '🇸🇪',     // 瑞典2分彩
  'RD60': '🇸🇪',      // 瑞典1分彩
  'YN60': '🇮🇩',      // 印尼分分彩
  'YN300': '🇮🇩',     // 印尼五分彩
  'YNPK10FFC': '🇮🇩', // 印尼分分PK10
  'YNPK10WFC': '🇮🇩', // 印尼五分PK10
  'RB60': '🇯🇵',      // 日本分分彩
  'JND30S': '🇨🇦',    // 加拿大30秒
  'JND11X5': '🇨🇦',   // 加拿大11选5
  'JND3D': '🇨🇦',     // 加拿大3D
  'MNG52': '🇲🇨',     // 摩纳哥Super 52
  'JSSM': '🐎',       // 急速赛马
  'YNMA': '🇲🇾',      // 马来西亚套彩
  'MEGA645FFC': '🎯', // MEGA6/45分分彩
  'MEGA6455FC': '🎯', // MEGA6/45五分彩
  'MAX3D': '🎲',      // MAX3D

  // 境外彩种 - 股市彩票系列
  'GSHKA': '🇭🇰',     // 香港股市彩票-早市
  'GSHKP': '🇭🇰',     // 香港股市彩票-午市
  'GSTW': '🇹🇼',      // 台湾股市彩票
  'GSJPA': '🇯🇵',     // 日本股市彩票-早市
  'GSJPP': '🇯🇵',     // 日本股市彩票-午市
  'GSKR': '🇰🇷',      // 韩国股市彩票
  'GSCNA': '🇨🇳',     // 中国股市彩票-早市
  'GSCNP': '🇨🇳',     // 中国股市彩票-午市
  'GSSG': '🇸🇬',      // 新加坡股市彩票
  'GSIN': '🇮🇳',      // 印度股市彩票
  'GSEG': '🇪🇬',      // 埃及股市彩票
  'GSRU': '🇷🇺',      // 俄罗斯股市彩票
  'GSDE': '🇩🇪',      // 德国股市彩票
  'GSUK': '🇬🇧',      // 英国股市彩票
  'GSUS': '🇺🇸',      // 美国股市彩票

  // 计算型彩种
  'TXFFC': '💬',      // 腾讯分分彩
  'QQFFC': '🐧',      // QQ分分彩
  'TX2FCS': '💬',     // 腾讯2分彩-双
  'TX2FCD': '💬',     // 腾讯2分彩-单
  'TX5FC': '💬',      // 腾讯5分彩
  'TXPK10': '💬',     // 腾讯PK10
  'QIQFFC': '🎮',     // 奇趣分分彩
  'BTCFFC': '₿',      // 比特币分分彩
  'BTC5FC': '₿',      // 比特币五分彩
  'ZFBFFC': '💰',     // 支付宝分分彩
  'ZFB5FC': '💰',     // 支付宝5分彩
  'BABTCFFC': '₿',    // 币安比特币分分彩
  'BABTC5FC': '₿',    // 币安比特币五分彩
  'BAETFFC': '⟠',     // 币安以太币分分彩
  'BAET5FC': '⟠',     // 币安以太币五分彩
  'OEBTCFFC': '₿',    // 欧易比特币分分彩
  'OEBTC5FC': '₿',    // 欧易比特币五分彩
  'OEETFFC': '⟠',     // 欧易以太币分分彩
  'OEET5FC': '⟠',     // 欧易以太币五分彩
  'HASHFFC': '#️⃣',    // 哈希分分彩
  'HASH3FC': '#️⃣',    // 哈希三分彩
  'HASH5FC': '#️⃣',    // 哈希五分彩
  'ETFFC': '⟠',       // 以太坊分分彩
  'ET3FC': '⟠',       // 以太坊3分彩
  'ET5FC': '⟠',       // 以太坊5分彩
  'NEWHASHFFC': '#️⃣', // 新哈希分分彩
  'NEWHASH3FC': '#️⃣', // 新哈希三分彩
  'NEWHASH5FC': '#️⃣', // 新哈希五分彩
  'TRX30S': '🌊',     // 波场30秒彩
}

// 根据彩票名称获取颜色渐变
function getGradientColors(lotteryCode: string): string {
  // 根据彩票代码生成一致的颜色
  const hash = lotteryCode.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const colorSchemes = [
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-red-400 to-red-600',
    'from-orange-400 to-orange-600',
    'from-yellow-400 to-yellow-600',
    'from-green-400 to-green-600',
    'from-teal-400 to-teal-600',
    'from-cyan-400 to-cyan-600',
    'from-indigo-400 to-indigo-600',
  ]
  return colorSchemes[hash % colorSchemes.length]
}

export default function LotteryIcon({ lotteryCode, lotteryName, size = 'md' }: LotteryIconProps) {
  const icon = LOTTERY_ICONS[lotteryCode]
  const gradient = getGradientColors(lotteryCode)
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-base',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl'
  }

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center text-white shadow-md`}>
      {icon || lotteryName.charAt(0)}
    </div>
  )
}

