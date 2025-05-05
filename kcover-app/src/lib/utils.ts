/**
 * 工具函数库
 */

/**
 * 生成格式化字符串，用于唯一标识一次算法执行结果
 * 格式：m-n-k-j-s-runId-resultCount
 */
export function generateFormatString(
  params: { m: number, n: number, k: number, j: number, s: number, minGroups: number },
  runId: number,
  resultCount: number
): string {
  const { m, n, k, j, s } = params
  return `${m}-${n}-${k}-${j}-${s}-${runId}-${resultCount}`
}

/**
 * 解析格式字符串，获取参数信息
 */
export function parseFormatString(formatString: string): {
  m: number;
  n: number;
  k: number;
  j: number;
  s: number;
  runId: number;
  resultCount: number;
} | null {
  const parts = formatString.split('-')
  if (parts.length !== 7) return null
  
  try {
    const [m, n, k, j, s, runId, resultCount] = parts.map(Number)
    if ([m, n, k, j, s, runId, resultCount].some(isNaN)) return null
    
    return { m, n, k, j, s, runId, resultCount }
  } catch (error) {
    console.error('Format string parse error:', error)
    return null
  }
}

/**
 * 格式化时间戳为可读格式
 */
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString()
}

/**
 * 检查浏览器是否支持Web Worker
 */
export function isWebWorkerSupported(): boolean {
  return typeof window !== 'undefined' && !!window.Worker
}

/**
 * 延迟执行函数，返回Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
} 