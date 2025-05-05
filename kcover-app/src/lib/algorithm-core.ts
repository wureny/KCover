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
 * @param minGroups 最少k-组数量要求
 * @returns 覆盖关系表
 */
export function buildCoverageTable(kMasks: Mask[], jMasks: Mask[], s: number, minGroups: number): number[][] {
  const coverageTable: number[][] = Array(kMasks.length).fill(null).map(() => [])
  
  // 先为每个k-子集记录其覆盖的所有j-子集
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
  
  // 注意：不再需要根据minGroups过滤k-子集，因为minGroups参数表示最小组数要求
  // 算法应该确保至少找到minGroups个组，而不是过滤k-子集
  
  return coverageTable
}

/**
 * 预处理 - 生成问题所需的所有数据结构
 */
export function preprocess(params: { m: number, n: number, k: number, j: number, s: number, minGroups: number }) {
  const { n, k, j, s, minGroups } = params
  
  // 枚举所有可能的k-子集和j-子集
  const kMasks = enumSubsets(n, k)
  const jMasks = enumSubsets(n, j)
  
  // 构建覆盖表
  const coverageTable = buildCoverageTable(kMasks, jMasks, s, minGroups)
  
  return { kMasks, jMasks, coverageTable }
}

/**
 * 贪心算法求解最小覆盖问题
 * @param kMasks k-子集掩码数组
 * @param jMasks j-子集掩码数组
 * @param coverageTable 覆盖关系表
 * @param minGroups 最少需要的k-组数量
 * @returns 选中的k-子集索引
 */
export function greedyCover(
  kMasks: Mask[],
  jMasks: Mask[],
  coverageTable: number[][],
  minGroups: number = 1
): number[] {
  const chosen: number[] = []
  const covered = new Array(jMasks.length).fill(false)
  let uncoveredCount = jMasks.length
  
  // 第一阶段：贪心选择阶段 - 确保所有j-子集都被覆盖
  while (uncoveredCount > 0 && chosen.length < kMasks.length) {
    let bestIdx = -1
    let maxNewCovered = -1
    
    // 找出覆盖最多未覆盖j-子集的k-子集
    for (let i = 0; i < kMasks.length; i++) {
      // 跳过已选择的或覆盖表为空的
      if (chosen.includes(i) || coverageTable[i].length === 0) continue
      
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
  
  // 第二阶段：如果chosen小于minGroups，继续添加能力最强的k-组直到达到minGroups
  if (chosen.length < minGroups) {
    // 找出所有尚未选择但有效的k-组，按覆盖能力排序
    const remainingValidIndices = Array.from({ length: kMasks.length }, (_, i) => i)
      .filter(i => !chosen.includes(i) && coverageTable[i].length > 0)
      .sort((a, b) => coverageTable[b].length - coverageTable[a].length);
    
    // 添加覆盖能力最强的k-组，直到达到minGroups
    for (const idx of remainingValidIndices) {
      if (chosen.length >= minGroups) break;
      chosen.push(idx);
    }
  }
  
  // 第三阶段：如果minGroups大于1，寻找最优的额外组
  if (minGroups > 1) {
    // 已经有了基础覆盖组，现在我们需要一个能覆盖所有j-子集的最优解
    // 基于当前chosen，尝试找到覆盖所有j-子集的最优解
    
    // 统计每个j-子集被覆盖的次数
    const coverageCount = new Array(jMasks.length).fill(0);
    for (const idx of chosen) {
      for (const jIdx of coverageTable[idx]) {
        coverageCount[jIdx]++;
      }
    }
    
    // 找出所有有效的k-组（包括未选择的）
    const validKGroups = Array.from({ length: kMasks.length }, (_, i) => i)
      .filter(i => coverageTable[i].length > 0);
    
    // 尝试找到拥有独特覆盖能力的k-组
    const uniqueGroups = new Set(chosen);
    for (const kIdx of validKGroups) {
      if (uniqueGroups.has(kIdx)) continue;
      
      // 检查这个k-组是否有独特的覆盖能力
      let hasUniqueAbility = false;
      for (const jIdx of coverageTable[kIdx]) {
        if (coverageCount[jIdx] === 0) {
          hasUniqueAbility = true;
          break;
        }
      }
      
      if (hasUniqueAbility) {
        uniqueGroups.add(kIdx);
        // 更新覆盖计数
        for (const jIdx of coverageTable[kIdx]) {
          coverageCount[jIdx]++;
        }
      }
    }
    
    // 将独特组转换为数组
    const resultIndices = Array.from(uniqueGroups);
    
    // 如果结果仍小于minGroups，添加更多有用的组
    if (resultIndices.length < minGroups && validKGroups.length >= minGroups) {
      const remainingValidIndices = validKGroups
        .filter(i => !resultIndices.includes(i))
        .sort((a, b) => coverageTable[b].length - coverageTable[a].length);
      
      for (const idx of remainingValidIndices) {
        if (resultIndices.length >= minGroups) break;
        resultIndices.push(idx);
      }
    }
    
    return resultIndices;
  }
  
  // 如果minGroups为1，执行冗余移除以获得最小覆盖
  if (minGroups === 1) {
    pruneRedundant(chosen, coverageTable, jMasks.length);
  }
  
  return chosen;
}

/**
 * 移除冗余覆盖
 * @param chosen 已选k-子集索引
 * @param coverageTable 覆盖关系表
 * @param jMasksCount j-子集总数
 * @param minGroups 最少需要保留的组数
 */
function pruneRedundant(chosen: number[], coverageTable: number[][], jMasksCount: number, minGroups: number = 1) {
  // 如果选择的组数小于或等于最小要求，则不进行冗余移除
  if (chosen.length <= minGroups) return;
  
  // 从后向前检查每个已选集合是否可移除
  for (let i = chosen.length - 1; i >= 0 && chosen.length > minGroups; i--) {
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
 * @param params 算法参数对象，包含m、n、k、j、s和minGroups
 * @returns 选中的k-子集结果数组
 */
export function solveWithSpeedMode(params: { m: number, n: number, k: number, j: number, s: number, minGroups: number }) {
  // 预处理
  const { kMasks, jMasks, coverageTable } = preprocess(params)
  
  // 输出预处理信息，便于调试
  console.log(`预处理完成：找到${kMasks.length}个k-子集，${jMasks.length}个j-子集`);
  
  // 统计有效的k-子集数量（覆盖表非空的）
  const validKSubsets = coverageTable.filter(coveredIndices => coveredIndices.length > 0).length;
  console.log(`有效k-子集数量：${validKSubsets}/${kMasks.length}，最少需要${params.minGroups}个k-组`);
  
  // 贪心求解，传入minGroups参数
  const chosenIndices = greedyCover(kMasks, jMasks, coverageTable, params.minGroups)
  
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
 * 评估方案质量 - 较少的组数更优，但不能少于最小组数要求
 * @param coverageTable 覆盖关系表
 * @param chosenIndices 选择的k-子集索引数组
 * @param jMasksCount j-子集总数
 * @param minGroups 最少需要的k-组数量
 * @returns 评分（越低越好）
 */
function evaluateSolution(
  coverageTable: number[][], 
  chosenIndices: number[], 
  jMasksCount: number,
  minGroups: number = 1
): number {
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
  
  // 如果组数少于最小要求，也给予惩罚
  if (chosenIndices.length < minGroups) {
    return 500 + (minGroups - chosenIndices.length) * 100
  }
  
  // 完全覆盖的情况下，组数越少越好，但不能少于minGroups
  return chosenIndices.length
}

/**
 * 精准模式入口函数 - 基于局部搜索的精确求解
 * @param params 算法参数对象，包含m、n、k、j、s和minGroups
 * @returns 选中的k-子集结果数组
 */
export function solveWithAccurateMode(params: { m: number, n: number, k: number, j: number, s: number, minGroups: number }) {
  // 预处理
  const { kMasks, jMasks, coverageTable } = preprocess(params)
  
  // 输出预处理信息，便于调试
  console.log(`预处理完成：找到${kMasks.length}个k-子集，${jMasks.length}个j-子集`);
  
  // 统计有效的k-子集数量（覆盖表非空的）
  const validKSubsets = coverageTable.filter(coveredIndices => coveredIndices.length > 0).length;
  console.log(`有效k-子集数量：${validKSubsets}/${kMasks.length}，最少需要${params.minGroups}个k-组`);
  
  // 对于minGroups > 1的情况，使用改进的贪心算法
  if (params.minGroups > 1) {
    // 使用贪心算法，它已经被优化为同时考虑覆盖和最小组数
    const chosenIndices = greedyCover(kMasks, jMasks, coverageTable, params.minGroups)
    console.log(`精确求解：要求至少${params.minGroups}个k-组，找到${chosenIndices.length}个k-组的解决方案`);
    
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
  
  // 下面是minGroups=1的传统最小覆盖问题解决方案
  
  // 首先使用贪心算法获得一个初始解
  const initialSolution = greedyCover(kMasks, jMasks, coverageTable, 1)
  let bestSolution = [...initialSolution]
  let bestScore = evaluateSolution(coverageTable, bestSolution, jMasks.length, 1)
  
  const maxIterations = 1000
  const maxNoImprovement = 100
  let iterations = 0
  let noImprovementCount = 0
  
  while (iterations < maxIterations && noImprovementCount < maxNoImprovement) {
    iterations++
    
    // 1. 随机替换 - 以一定概率替换一个现有选择
    if (Math.random() < 0.5 && bestSolution.length > 1) {
      const newSolution = [...bestSolution]
      
      // 随机移除一个元素
      const removeIdx = Math.floor(Math.random() * newSolution.length)
      newSolution.splice(removeIdx, 1)
      
      // 随机添加一个未选择的元素
      const availableIndices = Array.from({ length: kMasks.length }, (_, i) => i)
        .filter(i => !newSolution.includes(i) && coverageTable[i].length > 0)
      
      if (availableIndices.length > 0) {
        const addIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)]
        newSolution.push(addIdx)
        
        const score = evaluateSolution(coverageTable, newSolution, jMasks.length, 1)
        
        if (score < bestScore) {
          bestSolution = newSolution
          bestScore = score
          noImprovementCount = 0
        } else {
          noImprovementCount++
        }
      }
    }
    
    // 2. 随机添加 - 以较小概率添加一个新选择
    else if (Math.random() < 0.3) {
      const newSolution = [...bestSolution]
      
      // 随机添加一个未选择的元素
      const availableIndices = Array.from({ length: kMasks.length }, (_, i) => i)
        .filter(i => !newSolution.includes(i) && coverageTable[i].length > 0)
      
      if (availableIndices.length > 0) {
        const addIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)]
        newSolution.push(addIdx)
        
        const score = evaluateSolution(coverageTable, newSolution, jMasks.length, 1)
        
        if (score < bestScore) {
          bestSolution = newSolution
          bestScore = score
          noImprovementCount = 0
        } else {
          noImprovementCount++
        }
      }
    }
    
    // 3. 随机交换 - 以一定概率交换两个选择
    else {
      const newSolution = [...bestSolution]
      
      // 随机选择一个要替换的元素
      const replaceIdx = Math.floor(Math.random() * newSolution.length)
      
      // 随机添加一个未选择的元素
      const availableIndices = Array.from({ length: kMasks.length }, (_, i) => i)
        .filter(i => !newSolution.includes(i) && coverageTable[i].length > 0)
      
      if (availableIndices.length > 0) {
        const addIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)]
        newSolution[replaceIdx] = addIdx
        
        const score = evaluateSolution(coverageTable, newSolution, jMasks.length, 1)
        
        if (score < bestScore) {
          bestSolution = newSolution
          bestScore = score
          noImprovementCount = 0
        } else {
          noImprovementCount++
        }
      }
    }
  }
  
  console.log(`精确求解完成：迭代${iterations}次，找到${bestSolution.length}个k-组的解决方案`);
  
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
 * 格式化结果 - 将数字数组转换为字符串数组
 */
export function formatResults(results: number[][]): string[][] {
  return results.map(group => 
    group.map(num => num.toString().padStart(2, '0'))
  )
}

/**
 * Web Worker支持函数 - 创建一个后台处理算法的worker
 * 用于避免主线程阻塞导致页面无响应
 */
export function createKCoverWorker() {
  // 检查浏览器是否支持Web Worker
  if (typeof window === 'undefined' || !window.Worker) {
    throw new Error('您的浏览器不支持Web Worker，无法在后台执行计算')
  }

  // 首先定义popcnt函数，确保它在Worker中可用
  const popcntFunction = `
    // 计算二进制表示中1的个数（位计数）
    const popcnt = (x) => {
      return x.toString(2).replace(/0/g, '').length;
    };
  `;

  // 创建一个Web Worker的代码字符串
  const workerCode = `
    ${popcntFunction}
    
    // Worker内部算法实现
    ${enumSubsets.toString()}
    ${buildCoverageTable.toString()}
    ${preprocess.toString()}
    ${greedyCover.toString()}
    ${pruneRedundant.toString()}
    ${solveWithSpeedMode.toString()}
    ${evaluateSolution.toString()}
    ${solveWithAccurateMode.toString()}
    ${formatResults.toString()}

    // 监听来自主线程的消息
    self.onmessage = function(e) {
      try {
        const { params, mode } = e.data;
        console.log('Worker收到计算请求:', params, mode);
        
        // 根据模式选择相应的算法
        let result;
        if (mode === 'speed') {
          result = solveWithSpeedMode(params);
        } else {
          result = solveWithAccurateMode(params);
        }
        
        // 格式化结果并发送回主线程
        const formattedResults = formatResults(result);
        self.postMessage({ 
          success: true, 
          results: formattedResults, 
          count: formattedResults.length 
        });
      } catch (error) {
        console.error('Worker计算出错:', error);
        self.postMessage({ 
          success: false, 
          error: error.message || '计算失败' 
        });
      }
    };
  `;

  // 创建一个Blob对象
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const workerUrl = URL.createObjectURL(blob);
  
  // 创建Worker实例
  const worker = new Worker(workerUrl);
  
  // 返回worker和销毁方法
  return {
    worker,
    terminate: () => {
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
    }
  };
}

/**
 * 使用Web Worker进行异步计算
 * @param params 算法参数
 * @param mode 算法模式
 * @returns Promise，解析为计算结果
 */
export function solveWithWorker(
  params: { m: number, n: number, k: number, j: number, s: number, minGroups: number },
  mode: 'speed' | 'accurate'
): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    try {
      const { worker, terminate } = createKCoverWorker();
      
      // 设置消息处理器
      worker.onmessage = (e) => {
        const response = e.data;
        terminate(); // 完成后终止worker
        
        if (response.success) {
          resolve(response.results);
        } else {
          reject(new Error(response.error || '计算失败'));
        }
      };
      
      // 设置错误处理
      worker.onerror = (e) => {
        terminate();
        reject(new Error(`Worker错误: ${e.message}`));
      };
      
      // 发送计算请求到worker
      worker.postMessage({ params, mode });
    } catch (error) {
      // 如果不支持Web Worker，回退到主线程计算
      console.warn('Web Worker创建失败，回退到主线程计算:', error);
      try {
        let result;
        if (mode === 'speed') {
          result = solveWithSpeedMode(params);
        } else {
          result = solveWithAccurateMode(params);
        }
        resolve(formatResults(result));
      } catch (fallbackError) {
        reject(fallbackError);
      }
    }
  });
}