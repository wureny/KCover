'use client'

import { useEffect, useState } from 'react'
import { solveWithSpeedMode, solveWithAccurateMode, formatResults, solveWithWorker } from '@/lib/algorithm-core'

export default function TestPage() {
  const [testResults, setTestResults] = useState<{
    params: string;
    resultCount: number;
    results: string[][];
    time: number;
    status: 'pending' | 'running' | 'completed' | 'error';
    error?: string;
  }[]>([])
  
  const [isLoading, setIsLoading] = useState(false)
  const [useWorker, setUseWorker] = useState(true)
  
  const runTest = async (params: { m: number, n: number, k: number, j: number, s: number, minGroups: number }, mode: 'speed' | 'accurate') => {
    const testId = `${params.m}-${params.n}-${params.k}-${params.j}-${params.s}-${params.minGroups} (${mode})`
    
    // 添加一个待处理的测试记录
    setTestResults(prev => [
      ...prev,
      {
        params: testId,
        resultCount: 0,
        results: [],
        time: 0,
        status: 'pending'
      }
    ])
    
    // 开始计算
    setTestResults(prev => 
      prev.map(item => 
        item.params === testId 
          ? { ...item, status: 'running' } 
          : item
      )
    )
    
    const startTime = performance.now()
    
    try {
      let formattedResults: string[][]
      
      if (useWorker) {
        // 使用Web Worker异步计算
        formattedResults = await solveWithWorker(params, mode)
      } else {
        // 使用主线程同步计算
        let result: number[][]
        if (mode === 'speed') {
          result = solveWithSpeedMode(params)
        } else {
          result = solveWithAccurateMode(params)
        }
        formattedResults = formatResults(result)
      }
      
      const endTime = performance.now()
      
      // 更新测试结果
      setTestResults(prev => 
        prev.map(item => 
          item.params === testId 
            ? { 
                ...item, 
                resultCount: formattedResults.length,
                results: formattedResults,
                time: endTime - startTime,
                status: 'completed'
              } 
            : item
        )
      )
    } catch (error) {
      console.error('测试失败', error)
      const endTime = performance.now()
      
      // 更新测试结果为错误状态
      setTestResults(prev => 
        prev.map(item => 
          item.params === testId 
            ? { 
                ...item, 
                time: endTime - startTime,
                status: 'error',
                error: error instanceof Error ? error.message : '未知错误'
              } 
            : item
        )
      )
    }
  }
  
  const runAllTests = async () => {
    // 清空之前的结果
    setTestResults([])
    setIsLoading(true)
    
    // 按顺序执行测试
    try {
      // 测试用例1: 45-8-6-4-4-1 (速度模式)
      await runTest({ m: 45, n: 8, k: 6, j: 4, s: 4, minGroups: 1 }, 'speed')
      
      // 测试用例2: 45-8-6-4-4-4 (速度模式)
      await runTest({ m: 45, n: 8, k: 6, j: 4, s: 4, minGroups: 4 }, 'speed')
      
      // 测试用例3: 45-8-6-6-5-1 (速度模式)
      await runTest({ m: 45, n: 8, k: 6, j: 6, s: 5, minGroups: 1 }, 'speed')
      
      // 测试用例4: 45-8-6-6-5-4 (速度模式)
      await runTest({ m: 45, n: 8, k: 6, j: 6, s: 5, minGroups: 4 }, 'speed')
      
      // 测试用例5: 45-8-6-6-5-1 (精确模式)
      await runTest({ m: 45, n: 8, k: 6, j: 6, s: 5, minGroups: 1 }, 'accurate')
      
      // 测试用例6: 45-8-6-6-5-4 (精确模式)
      await runTest({ m: 45, n: 8, k: 6, j: 6, s: 5, minGroups: 4 }, 'accurate')
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    // 自动运行所有测试
    runAllTests()
  }, [])
  
  // 状态颜色映射
  const statusColors = {
    pending: 'bg-gray-200',
    running: 'bg-yellow-200',
    completed: 'bg-green-200',
    error: 'bg-red-200'
  }
  
  // 状态文本映射
  const statusText = {
    pending: '等待中',
    running: '计算中',
    completed: '完成',
    error: '出错'
  }
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">K-Cover算法测试</h1>
      
      <div className="flex gap-4 mb-6">
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={runAllTests}
          disabled={isLoading}
        >
          {isLoading ? '测试中...' : '运行所有测试'}
        </button>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="useWorker"
            checked={useWorker}
            onChange={() => setUseWorker(!useWorker)}
            className="mr-2"
          />
          <label htmlFor="useWorker">
            使用Web Worker后台计算 ({useWorker ? '开启' : '关闭'})
          </label>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
          <thead>
            <tr className="bg-slate-200 dark:bg-slate-700">
              <th className="px-4 py-2 border">参数</th>
              <th className="px-4 py-2 border">状态</th>
              <th className="px-4 py-2 border">结果数量</th>
              <th className="px-4 py-2 border">耗时 (ms)</th>
              <th className="px-4 py-2 border">结果详情</th>
            </tr>
          </thead>
          <tbody>
            {testResults.map((test, index) => (
              <tr key={index} className={`border ${statusColors[test.status]}`}>
                <td className="px-4 py-2 border">{test.params}</td>
                <td className="px-4 py-2 border">
                  {statusText[test.status]}
                  {test.error && <div className="text-red-500 text-xs mt-1">{test.error}</div>}
                </td>
                <td className="px-4 py-2 border">{test.resultCount}</td>
                <td className="px-4 py-2 border">{test.time.toFixed(2)}</td>
                <td className="px-4 py-2 border">
                  {test.status === 'completed' && (
                    <details>
                      <summary>查看结果</summary>
                      <div className="mt-2">
                        {test.results.map((group, groupIndex) => (
                          <div key={groupIndex} className="mb-1">
                            {group.join(', ')}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 