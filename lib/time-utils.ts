/**
 * 时间格式化工具函数
 * 
 * 问题背景：
 * - 数据源提供的时间是正确的本地时间（如：2025-11-01 15:30:00）
 * - 但在显示时被错误地加了8小时（显示为 23:30:00）
 * 
 * 原因：
 * - 数据库存储的时间字符串被 new Date() 解析为 UTC 时间
 * - toLocaleString() 将 UTC 转换为本地时间（UTC+8），导致加了8小时
 * 
 * 解决方案：
 * - 创建统一的时间格式化函数
 * - 正确处理时区，确保显示原始时间
 * - 不修改数据源，只修改显示逻辑
 */

/**
 * 格式化开奖时间（完整版）
 * @param dateString - 数据库中的时间字符串
 * @returns 格式化后的时间字符串（如：2025/11/1 15:30:00）
 */
export function formatOpenDate(dateString: string): string {
  if (!dateString) return ''
  
  try {
    // 方案1: 直接解析时间字符串，忽略时区
    // 假设数据库中的时间已经是正确的本地时间
    
    // 处理不同的时间格式
    // 支持: "2025-11-01 15:30:00", "2025-11-01T15:30:00", "2025-11-01T15:30:00+00:00"
    let cleanDateString = dateString.replace('T', ' ').split('+')[0].split('Z')[0].trim()
    
    // 使用本地时间解析（不进行时区转换）
    const parts = cleanDateString.split(/[- :]/)
    if (parts.length >= 6) {
      const year = parseInt(parts[0])
      const month = parseInt(parts[1]) - 1 // 月份从0开始
      const day = parseInt(parts[2])
      const hour = parseInt(parts[3])
      const minute = parseInt(parts[4])
      const second = parseInt(parts[5])
      
      // 创建本地时间对象（不进行时区转换）
      const date = new Date(year, month, day, hour, minute, second)
      
      // 格式化输出
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    }
    
    // 如果解析失败，尝试直接格式化原始字符串
    return cleanDateString.replace(/-/g, '/').replace(' ', ' ')
    
  } catch (error) {
    console.error('时间格式化失败:', error, dateString)
    return dateString
  }
}

/**
 * 格式化开奖时间（简短版 - 用于卡片显示）
 * @param dateString - 数据库中的时间字符串
 * @returns 格式化后的时间字符串（如：11/01 15:30）
 */
export function formatOpenDateShort(dateString: string): string {
  if (!dateString) return ''
  
  try {
    let cleanDateString = dateString.replace('T', ' ').split('+')[0].split('Z')[0].trim()
    const parts = cleanDateString.split(/[- :]/)
    
    if (parts.length >= 6) {
      const year = parseInt(parts[0])
      const month = parseInt(parts[1]) - 1
      const day = parseInt(parts[2])
      const hour = parseInt(parts[3])
      const minute = parseInt(parts[4])
      const second = parseInt(parts[5])
      
      const date = new Date(year, month, day, hour, minute, second)
      
      return date.toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
    
    return cleanDateString
  } catch (error) {
    console.error('时间格式化失败:', error, dateString)
    return dateString
  }
}

/**
 * 计算时间距离现在多久（相对时间）
 * @param dateString - 数据库中的时间字符串
 * @returns 相对时间描述（如：2小时前、1天前）
 */
export function getTimeAgo(dateString: string): string {
  if (!dateString) return ''
  
  try {
    let cleanDateString = dateString.replace('T', ' ').split('+')[0].split('Z')[0].trim()
    const parts = cleanDateString.split(/[- :]/)
    
    if (parts.length >= 6) {
      const year = parseInt(parts[0])
      const month = parseInt(parts[1]) - 1
      const day = parseInt(parts[2])
      const hour = parseInt(parts[3])
      const minute = parseInt(parts[4])
      const second = parseInt(parts[5])
      
      const date = new Date(year, month, day, hour, minute, second)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMinutes = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)
      
      if (diffMinutes < 1) return '刚刚'
      if (diffMinutes < 60) return `${diffMinutes}分钟前`
      if (diffHours < 24) return `${diffHours}小时前`
      if (diffDays < 7) return `${diffDays}天前`
      
      return date.toLocaleDateString('zh-CN')
    }
    
    return cleanDateString
  } catch (error) {
    console.error('相对时间计算失败:', error, dateString)
    return dateString
  }
}

/**
 * 格式化时间为 ISO 字符串（用于 API 响应）
 * @param dateString - 数据库中的时间字符串
 * @returns ISO 格式时间字符串
 */
export function toISOString(dateString: string): string {
  if (!dateString) return ''
  
  try {
    let cleanDateString = dateString.replace('T', ' ').split('+')[0].split('Z')[0].trim()
    const parts = cleanDateString.split(/[- :]/)
    
    if (parts.length >= 6) {
      const year = parseInt(parts[0])
      const month = parseInt(parts[1]) - 1
      const day = parseInt(parts[2])
      const hour = parseInt(parts[3])
      const minute = parseInt(parts[4])
      const second = parseInt(parts[5])
      
      const date = new Date(year, month, day, hour, minute, second)
      return date.toISOString()
    }
    
    return dateString
  } catch (error) {
    console.error('ISO时间转换失败:', error, dateString)
    return dateString
  }
}

