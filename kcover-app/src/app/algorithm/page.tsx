"use client"

import { useState } from 'react'
import { Tab } from '@headlessui/react'
import { ArrowPathIcon, BeakerIcon, BoltIcon } from '@heroicons/react/24/outline'
import InputPanel from '@/components/algorithm/input-panel'
import ResultPanel from '@/components/algorithm/result-panel'
import { useSearchParams } from 'next/navigation'
import { formatResults, solveWithAccurateMode, solveWithSpeedMode } from '@/lib/algorithm-core'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function AlgorithmPage() {
  const searchParams = useSearchParams()
  const initialMode = searchParams.get('mode') === 'accurate' ? 1 : 0
  
  const [selectedTabIndex, setSelectedTabIndex] = useState(initialMode)
  const [isCalculating, setIsCalculating] = useState(false)
  const [results, setResults] = useState<string[][]>([])
  const [params, setParams] = useState({
    m: 45, // 样本总数
    n: 8,  // 随机选择的样本数
    k: 6,  // 输出组大小
    j: 4,  // 需要覆盖的子集大小
    s: 4,  // 交集阈值
  })

  const handleParamsChange = (newParams: typeof params) => {
    setParams(newParams)
  }

  const handleCalculate = () => {
    setIsCalculating(true)

    // 使用setTimeout来避免UI阻塞
    setTimeout(() => {
      try {
        const mode = selectedTabIndex === 0 ? 'speed' : 'accurate'
        let result: number[][]

        if (mode === 'speed') {
          result = solveWithSpeedMode(params)
        } else {
          result = solveWithAccurateMode(params)
        }

        // 格式化结果
        const formattedResults = formatResults(result)
        setResults(formattedResults)
      } catch (error) {
        console.error('计算过程中出错:', error)
        alert('计算过程中出错，请检查参数设置或刷新页面重试')
      } finally {
        setIsCalculating(false)
      }
    }, 100)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">K-Cover 算法演示</h1>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-8">
        <Tab.Group selectedIndex={selectedTabIndex} onChange={setSelectedTabIndex}>
          <Tab.List className="flex space-x-1 rounded-xl bg-slate-100 dark:bg-slate-700 p-1">
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full py-2.5 text-sm font-medium leading-5 rounded-lg',
                  'flex items-center justify-center gap-2',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 ring-offset-2',
                  selected
                    ? 'bg-white dark:bg-slate-800 shadow text-blue-600 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-white/[0.12] hover:text-blue-600 dark:hover:text-blue-400'
                )
              }
            >
              <BoltIcon className="h-5 w-5" aria-hidden="true" />
              <span>速度模式</span>
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full py-2.5 text-sm font-medium leading-5 rounded-lg',
                  'flex items-center justify-center gap-2',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 ring-offset-2',
                  selected
                    ? 'bg-white dark:bg-slate-800 shadow text-blue-600 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-white/[0.12] hover:text-blue-600 dark:hover:text-blue-400'
                )
              }
            >
              <BeakerIcon className="h-5 w-5" aria-hidden="true" />
              <span>精准模式</span>
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-6">
            <Tab.Panel>
              <div className="mb-4">
                <p className="text-slate-600 dark:text-slate-300">
                  速度模式采用贪心算法，能快速求得近似最优解，适合大规模数据处理和对计算速度要求高的场景。
                </p>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="mb-4">
                <p className="text-slate-600 dark:text-slate-300">
                  精准模式采用整数线性规划（ILP）方法，能保证获得最优解，但计算时间较长，适合对精度要求高的场景。
                </p>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        <InputPanel params={params} onParamsChange={handleParamsChange} />
        
        <div className="mt-6">
          <button
            type="button"
            onClick={handleCalculate}
            disabled={isCalculating}
            className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCalculating ? (
              <>
                <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                计算中...
              </>
            ) : (
              '开始计算'
            )}
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <ResultPanel results={results} params={params} />
      )}
    </div>
  )
} 