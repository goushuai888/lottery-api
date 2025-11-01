/**
 * 六合彩工具函数
 * 用于香港六合彩(XGLHC)和澳门六合彩(MOLHC)的号码显示
 */

// 生肖映射 (1-49号码对应的生肖，按2025年规则)
// 2025年是蛇年，生肖对应关系如下：
const ZODIAC_2025: Record<number, string> = {
  // 鼠（2, 14, 26, 38）
  2: '鼠', 14: '鼠', 26: '鼠', 38: '鼠',
  // 猪（1, 13, 25, 37, 49）
  1: '猪', 13: '猪', 25: '猪', 37: '猪', 49: '猪',
  // 狗（12, 24, 36, 48）
  12: '狗', 24: '狗', 36: '狗', 48: '狗',
  // 鸡（11, 23, 35, 47）
  11: '鸡', 23: '鸡', 35: '鸡', 47: '鸡',
  // 猴（10, 22, 34, 46）
  10: '猴', 22: '猴', 34: '猴', 46: '猴',
  // 羊（9, 21, 33, 45）
  9: '羊', 21: '羊', 33: '羊', 45: '羊',
  // 马（8, 20, 32, 44）
  8: '马', 20: '马', 32: '马', 44: '马',
  // 蛇（7, 19, 31, 43）
  7: '蛇', 19: '蛇', 31: '蛇', 43: '蛇',
  // 龙（6, 18, 30, 42）
  6: '龙', 18: '龙', 30: '龙', 42: '龙',
  // 兔（5, 17, 29, 41）
  5: '兔', 17: '兔', 29: '兔', 41: '兔',
  // 虎（4, 16, 28, 40）
  4: '虎', 16: '虎', 28: '虎', 40: '虎',
  // 牛（3, 15, 27, 39）
  3: '牛', 15: '牛', 27: '牛', 39: '牛',
}

// 实际数据的颜色映射规则（根据采集源HTML分析）
const BALL_COLORS_2025: Record<number, 'red' | 'blue' | 'green'> = {
  // 红波
  1: 'red', 2: 'red', 7: 'red', 8: 'red', 12: 'red', 13: 'red', 18: 'red', 19: 'red',
  23: 'red', 24: 'red', 29: 'red', 30: 'red', 34: 'red', 35: 'red', 40: 'red', 45: 'red', 46: 'red',
  // 蓝波
  3: 'blue', 4: 'blue', 9: 'blue', 10: 'blue', 14: 'blue', 15: 'blue', 20: 'blue', 25: 'blue',
  26: 'blue', 31: 'blue', 36: 'blue', 37: 'blue', 41: 'blue', 42: 'blue', 47: 'blue', 48: 'blue',
  // 绿波
  5: 'green', 6: 'green', 11: 'green', 16: 'green', 17: 'green', 21: 'green', 22: 'green',
  27: 'green', 28: 'green', 32: 'green', 33: 'green', 38: 'green', 39: 'green', 43: 'green', 44: 'green', 49: 'green',
}

/**
 * 获取号码的生肖
 */
export function getZodiac(num: number): string {
  return ZODIAC_2025[num] || ''
}

/**
 * 获取号码的颜色
 */
export function getBallColor(num: number): 'red' | 'blue' | 'green' {
  return BALL_COLORS_2025[num] || 'red'
}

/**
 * 获取颜色对应的CSS类名
 */
export function getColorClass(color: 'red' | 'blue' | 'green'): string {
  const colorMap = {
    red: 'from-red-500 to-red-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
  }
  return colorMap[color]
}

/**
 * 获取颜色对应的中文名称
 */
export function getColorName(color: 'red' | 'blue' | 'green'): string {
  const nameMap = {
    red: '红',
    blue: '蓝',
    green: '绿',
  }
  return nameMap[color]
}

/**
 * 判断是否为六合彩彩种
 */
export function isLiuHeCai(lotteryCode: string): boolean {
  return ['XGLHC', 'MOLHC'].includes(lotteryCode)
}

