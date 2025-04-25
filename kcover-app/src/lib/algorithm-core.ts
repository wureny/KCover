/**
 * K-Cover 算法核心实现
 * 包含两种算法模式：速度模式（贪心）和精准模式（ILP）
 */

export type Mask = number // 使用32位整数作为位掩码表示子集

/**
 * 计算二进制表示中1的个数（位计数）
 */
export const popcnt = (x: Mask): number => {
  return x.toString(2).replace(/0/g, '').length
}

/**
 * 枚举所有k-子集的位掩码
 * @param n 总样本数
 * @param k 子集大小
 * @returns 所有k-子集的位掩码数组
 */
export function enumSubsets(n: number, k: number): Mask[] {
  const result: Mask[] = []
  
  function backtrack(start: number, mask: Mask, count: number) {
    if (count === k) {
      result.push(mask)
      return
    }
    
    for (let i = start; i < n; i++) {
      backtrack(i + 1, mask | (1 << i), count + 1)
    }
  }
  
  backtrack(0, 0, 0)
  return result
}

/**
 * 构建覆盖表 - 记录每个k-子集覆盖了哪些j-子集
 * @param kMasks k-子集掩码数组
 * @param jMasks j-子集掩码数组
 * @param s 交集阈值
 * @returns 覆盖关系表
 */
export function buildCoverageTable(kMasks: Mask[], jMasks: Mask[], s: number): number[][] {
  const coverageTable: number[][] = Array(kMasks.length).fill(null).map(() => [])
  
  for (let kIdx = 0; kIdx < kMasks.length; kIdx++) {
    const kMask = kMasks[kIdx]
    
    for (let jIdx = 0; jIdx < jMasks.length; jIdx++) {
      const jMask = jMasks[jIdx]
      const intersectionSize = popcnt(kMask & jMask)
      
      if (intersectionSize >= s) {
        coverageTable[kIdx].push(jIdx)
      }
    }
  }
  
  return coverageTable
}

/**
 * 预处理 - 生成问题所需的所有数据结构
 */
export function preprocess(params: { m: number, n: number, k: number, j: number, s: number }) {
  const { n, k, j, s } = params
  
  // 枚举所有可能的k-子集和j-子集
  const kMasks = enumSubsets(n, k)
  const jMasks = enumSubsets(n, j)
  
  // 构建覆盖表
  const coverageTable = buildCoverageTable(kMasks, jMasks, s)
  
  return { kMasks, jMasks, coverageTable }
}

/**
 * 贪心算法求解最小覆盖问题
 * @param kMasks k-子集掩码数组
 * @param jMasks j-子集掩码数组
 * @param coverageTable 覆盖关系表
 * @returns 选中的k-子集索引
 */
export function greedyCover(
  kMasks: Mask[],
  jMasks: Mask[],
  coverageTable: number[][]
): number[] {
  const chosen: number[] = []
  const covered = new Array(jMasks.length).fill(false)
  let uncoveredCount = jMasks.length
  
  // 贪心选择阶段
  while (uncoveredCount > 0) {
    let bestIdx = -1
    let maxNewCovered = -1
    
    // 找出覆盖最多未覆盖j-子集的k-子集
    for (let i = 0; i < kMasks.length; i++) {
      // 跳过已选择的
      if (chosen.includes(i)) continue
      
      let newCovered = 0
      for (const jIdx of coverageTable[i]) {
        if (!covered[jIdx]) {
          newCovered++
        }
      }
      
      if (newCovered > maxNewCovered) {
        maxNewCovered = newCovered
        bestIdx = i
      }
    }
    
    // 如果找不到能新增覆盖的k-子集，说明无法完全覆盖
    if (bestIdx === -1) break
    
    // 加入已选集合
    chosen.push(bestIdx)
    
    // 更新覆盖状态
    for (const jIdx of coverageTable[bestIdx]) {
      if (!covered[jIdx]) {
        covered[jIdx] = true
        uncoveredCount--
      }
    }
  }
  
  // 优化：移除冗余覆盖
  pruneRedundant(chosen, coverageTable, jMasks.length)
  
  return chosen
}

/**
 * 移除冗余覆盖
 * @param chosen 已选k-子集索引
 * @param coverageTable 覆盖关系表
 * @param jMasksCount j-子集总数
 */
function pruneRedundant(chosen: number[], coverageTable: number[][], jMasksCount: number) {
  // 从后向前检查每个已选集合是否可移除
  for (let i = chosen.length - 1; i >= 0; i--) {
    // 临时移除当前集合
    const current = chosen[i]
    chosen.splice(i, 1)
    
    // 检查移除后是否仍然覆盖所有j-子集
    const covered = new Array(jMasksCount).fill(false)
    for (const idx of chosen) {
      for (const jIdx of coverageTable[idx]) {
        covered[jIdx] = true
      }
    }
    
    // 如果有未覆盖的，则不能移除，需要恢复
    const allCovered = covered.every(Boolean)
    if (!allCovered) {
      chosen.splice(i, 0, current)
    }
  }
}

/**
 * 速度模式入口函数 - 贪心算法
 */
export function solveWithSpeedMode(params: { m: number, n: number, k: number, j: number, s: number }) {
  // 预处理
  const { kMasks, jMasks, coverageTable } = preprocess(params)
  
  // 贪心求解
  const chosenIndices = greedyCover(kMasks, jMasks, coverageTable)
  
  // 转换结果为数字数组格式
  return chosenIndices.map(idx => {
    const mask = kMasks[idx]
    const result: number[] = []
    
    for (let i = 0; i < params.n; i++) {
      if ((mask & (1 << i)) !== 0) {
        result.push(i + 1) // 从1开始编号
      }
    }
    
    return result
  })
}

/**
 * 评估方案质量 - 较少的组数更优
 * @param coverageTable 覆盖关系表
 * @param chosenIndices 选择的k-子集索引数组
 * @param jMasksCount j-子集总数
 * @returns 评分（越低越好）
 */
function evaluateSolution(coverageTable: number[][], chosenIndices: number[], jMasksCount: number): number {
  // 检查是否覆盖了所有j-子集
  const covered = new Array(jMasksCount).fill(false)
  for (const idx of chosenIndices) {
    for (const jIdx of coverageTable[idx]) {
      covered[jIdx] = true
    }
  }
  
  const coverageRatio = covered.filter(Boolean).length / jMasksCount
  
  // 如果没有完全覆盖，给予惩罚
  if (coverageRatio < 1) {
    return 1000 + chosenIndices.length - coverageRatio * 100
  }
  
  // 完全覆盖的情况下，组数越少越好
  return chosenIndices.length
}

/**
 * 精准模式入口函数 - 基于局部搜索的精确求解
 */
export function solveWithAccurateMode(params: { m: number, n: number, k: number, j: number, s: number }) {
  // 预处理
  const { kMasks, jMasks, coverageTable } = preprocess(params)
  
  // 首先使用贪心算法获得一个初始解
  const initialSolution = greedyCover(kMasks, jMasks, coverageTable)
  let bestSolution = [...initialSolution]
  let bestScore = evaluateSolution(coverageTable, bestSolution, jMasks.length)
  
  // 组合穷举搜索 - 对于小规模问题，我们可以尝试穷举所有可能的组合
  // 注意：这只适用于k-子集数量不太大的情况，否则会超时
  if (kMasks.length <= 20) {
    // 对于小规模问题，可以尝试穷举搜索
    const potentialIndices = [...Array(kMasks.length).keys()]
    
    // 优先考虑贪心算法选择的集合
    const orderedIndices = [
      ...initialSolution,
      ...potentialIndices.filter(idx => !initialSolution.includes(idx))
    ]
    
    // 从小到大尝试不同的组合大小
    for (let size = 1; size <= Math.min(orderedIndices.length, initialSolution.length + 2); size++) {
      const combinations: number[][] = []
      
      // 生成所有大小为size的组合
      function generateCombinations(start: number, current: number[]) {
        if (current.length === size) {
          combinations.push([...current])
          return
        }
        
        for (let i = start; i < orderedIndices.length; i++) {
          current.push(orderedIndices[i])
          generateCombinations(i + 1, current)
          current.pop()
        }
      }
      
      generateCombinations(0, [])
      
      // 评估所有组合
      for (const combination of combinations) {
        const score = evaluateSolution(coverageTable, combination, jMasks.length)
        
        if (score < bestScore) {
          bestScore = score
          bestSolution = [...combination]
          
          // 如果已经找到了完美覆盖，可以提前退出
          if (score === size && score < initialSolution.length) {
            break
          }
        }
      }
      
      // 如果已经找到比初始解更好的解，且完全覆盖了所有j-子集，就不再尝试更多的组合
      if (bestScore < initialSolution.length && bestScore === bestSolution.length) {
        break
      }
    }
  } else {
    // 对于大规模问题，使用局部搜索方法
    // 1. 尝试用未选的替换已选的
    for (let i = 0; i < initialSolution.length; i++) {
      const original = initialSolution[i]
      
      for (let j = 0; j < kMasks.length; j++) {
        if (initialSolution.includes(j)) continue
        
        // 临时替换
        initialSolution[i] = j
        const score = evaluateSolution(coverageTable, initialSolution, jMasks.length)
        
        if (score < bestScore) {
          bestScore = score
          bestSolution = [...initialSolution]
        }
        
        // 恢复
        initialSolution[i] = original
      }
    }
    
    // 2. 尝试移除，如果已经在贪心算法中尝试过，这里可能不会有新的改进
    pruneRedundant(bestSolution, coverageTable, jMasks.length)
  }
  
  // 转换结果为数字数组格式
  return bestSolution.map(idx => {
    const mask = kMasks[idx]
    const result: number[] = []
    
    for (let i = 0; i < params.n; i++) {
      if ((mask & (1 << i)) !== 0) {
        result.push(i + 1) // 从1开始编号
      }
    }
    
    return result
  })
}

/**
 * 将数字数组转换为字符串数组，确保两位数格式
 */
export function formatResults(results: number[][]): string[][] {
  return results.map(group => 
    group.map(num => num.toString().padStart(2, '0'))
  )
}