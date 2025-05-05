"use client"

import { useState, Suspense, useEffect } from 'react'
import { Tab } from '@headlessui/react'
import { ArrowPathIcon, BeakerIcon, BoltIcon, DocumentTextIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import InputPanel from '@/components/algorithm/input-panel'
import ResultPanel from '@/components/algorithm/result-panel'
import { useSearchParams } from 'next/navigation'
import { formatResults, solveWithAccurateMode, solveWithSpeedMode, solveWithWorker } from '@/lib/algorithm-core'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function AlgorithmContent() {
  const searchParams = useSearchParams()
  const initialMode = searchParams.get('mode') === 'accurate' ? 1 : 0
  
  const [selectedTabIndex, setSelectedTabIndex] = useState(initialMode)
  const [isCalculating, setIsCalculating] = useState(false)
  const [results, setResults] = useState<string[][]>([])
  const [formatString, setFormatString] = useState<string>("")
  const [dbEntries, setDbEntries] = useState<Array<{ id: string, results: string[][], params: any }>>([])
  const [runCounter, setRunCounter] = useState(1)
  
  // 使用Web Worker计算的状态
  const [useWorker, setUseWorker] = useState(true)
  
  // 错误状态
  const [error, setError] = useState<string | null>(null)

  const [params, setParams] = useState({
    m: 45, // Total number of samples
    n: 8,  // Number of randomly selected samples
    k: 6,  // Output group size
    j: 4,  // Subset size to be covered
    s: 4,  // Intersection threshold
    minGroups: 1, // Minimum number of k-groups required
  })

  // Load saved entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('kcover-db-entries')
    if (savedEntries) {
      try {
        setDbEntries(JSON.parse(savedEntries))
      } catch (e) {
        console.error('Failed to parse saved entries', e)
      }
    }
    
    // Get the last run counter
    const savedCounter = localStorage.getItem('kcover-run-counter')
    if (savedCounter) {
      setRunCounter(parseInt(savedCounter, 10))
    }
  }, [])

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('kcover-db-entries', JSON.stringify(dbEntries))
  }, [dbEntries])
  
  // Save run counter whenever it changes
  useEffect(() => {
    localStorage.setItem('kcover-run-counter', runCounter.toString())
  }, [runCounter])

  const handleParamsChange = (newParams: typeof params) => {
    setParams(newParams)
  }

  const generateFormatString = () => {
    const { m, n, k, j, s } = params
    const currentRunId = runCounter
    const resultCount = results.length
    return `${m}-${n}-${k}-${j}-${s}-${currentRunId}-${resultCount}`
  }

  const handleExecute = async () => {
    setIsCalculating(true)
    setError(null) // 重置错误状态
    
    try {
      const mode = selectedTabIndex === 0 ? 'speed' : 'accurate'
      let formattedResults: string[][]
      
      if (useWorker) {
        // 使用Web Worker异步计算
        formattedResults = await solveWithWorker(params, mode)
      } else {
        // 使用主线程计算
        let result: number[][]
        
        if (mode === 'speed') {
          result = solveWithSpeedMode(params)
        } else {
          result = solveWithAccurateMode(params)
        }
        
        // Format results
        formattedResults = formatResults(result)
      }
      
      setResults(formattedResults)
      
      // 在setResults后添加一个短暂延迟，确保results状态已更新
      setTimeout(() => {
        // 使用formattedResults.length而不是依赖state
        const { m, n, k, j, s, minGroups } = params
        const currentRunId = runCounter
        const newFormatString = `${m}-${n}-${k}-${j}-${s}-${currentRunId}-${formattedResults.length}`
        setFormatString(newFormatString)
        
        // 添加到控制台的说明
        console.log(`结果ID: ${newFormatString}`);
        console.log(`参数设置: m=${m}, n=${n}, k=${k}, j=${j}, s=${s}, minGroups=${minGroups}`);
        console.log(`找到${formattedResults.length}组结果`);
        
        // Increment run counter for next execution
        setRunCounter(prev => prev + 1)
      }, 10);
    } catch (error) {
      console.error('Error during calculation:', error)
      setError(error instanceof Error ? error.message : '计算过程中发生未知错误')
    } finally {
      setIsCalculating(false)
    }
  }

  const handleDelete = () => {
    setResults([])
    setFormatString("")
  }

  const handleStore = () => {
    if (results.length === 0 || !formatString) {
      alert('No results to store. Please execute the algorithm first.')
      return
    }
    
    // Create a new entry with a unique ID
    const newEntry = {
      id: formatString,
      results: results,
      params: params
    }
    
    // Add to stored entries
    setDbEntries(prev => [...prev, newEntry])
    
    alert(`Results stored successfully with ID: ${formatString}`)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">K-Cover Algorithm Demo</h1>
      
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
              <span>Speed Mode</span>
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
              <span>Accurate Mode</span>
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-6">
            <Tab.Panel>
              <div className="mb-4">
                <p className="text-slate-600 dark:text-slate-300">
                  Speed Mode uses a greedy algorithm to quickly find near-optimal solutions, suitable for large-scale data processing and scenarios with high speed requirements.
                </p>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="mb-4">
                <p className="text-slate-600 dark:text-slate-300">
                  Accurate Mode uses integer linear programming (ILP) method to guarantee optimal solutions, but takes longer to compute. Suitable for scenarios with high precision requirements.
                </p>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        <InputPanel params={params} onParamsChange={handleParamsChange} />
        
        <div className="mt-6 space-y-4">
          {/* Web Worker设置 */}
          <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-md">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="useWorker"
                checked={useWorker}
                onChange={() => setUseWorker(!useWorker)}
                className="mr-2"
                disabled={isCalculating}
              />
              <label htmlFor="useWorker" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                使用Web Worker后台计算 ({useWorker ? '开启' : '关闭'})
              </label>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              开启后，计算将在后台进行，不会阻塞用户界面。
              {!useWorker && <span className="text-yellow-500"> 警告：大规模计算可能导致页面无响应</span>}
            </p>
          </div>
          
          {/* 错误显示 */}
          {error && (
            <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-md">
              <h4 className="text-sm font-medium mb-1">计算出错：</h4>
              <p className="text-xs">{error}</p>
            </div>
          )}
          
          {/* Button group */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleExecute}
              disabled={isCalculating}
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCalculating ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <BeakerIcon className="h-5 w-5 mr-2" />
                  Execute
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleDelete}
              disabled={isCalculating || results.length === 0}
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              Delete
            </button>
            
            <button
              type="button"
              onClick={handleStore}
              disabled={isCalculating || results.length === 0}
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Store
            </button>
          </div>
          
          {/* Format string display */}
          {formatString && (
            <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Result Identifier:</h4>
              <div className="flex items-center">
                <code className="text-sm bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-600 font-mono">
                  {formatString}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(formatString)}
                  className="ml-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  title="Copy to clipboard"
                >
                  <DocumentTextIcon className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Format: m-n-k-j-s-run-resultCount
              </p>
            </div>
          )}
        </div>
      </div>

      {results.length > 0 && (
        <ResultPanel results={results} params={params} />
      )}
      
      {/* DB Entries section */}
      {dbEntries.length > 0 && (
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Stored Results</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Parameters</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Results</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {dbEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                      <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded font-mono">
                        {entry.id}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      m={entry.params.m}, n={entry.params.n}, k={entry.params.k}, j={entry.params.j}, s={entry.params.s}, minGroups={entry.params.minGroups}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {entry.results.length} sets
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => {
                          setParams(entry.params)
                          setResults(entry.results)
                          setFormatString(entry.id)
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                      >
                        Load
                      </button>
                      <button 
                        onClick={() => {
                          setDbEntries(prev => prev.filter(e => e.id !== entry.id))
                        }}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AlgorithmPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <AlgorithmContent />
    </Suspense>
  )
} 