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
    m: 45, // Total number of samples
    n: 8,  // Number of randomly selected samples
    k: 6,  // Output group size
    j: 4,  // Subset size to be covered
    s: 4,  // Intersection threshold
  })

  const handleParamsChange = (newParams: typeof params) => {
    setParams(newParams)
  }

  const handleCalculate = () => {
    setIsCalculating(true)

    // Using setTimeout to avoid UI blocking
    setTimeout(() => {
      try {
        const mode = selectedTabIndex === 0 ? 'speed' : 'accurate'
        let result: number[][]

        if (mode === 'speed') {
          result = solveWithSpeedMode(params)
        } else {
          result = solveWithAccurateMode(params)
        }

        // Format results
        const formattedResults = formatResults(result)
        setResults(formattedResults)
      } catch (error) {
        console.error('Error during calculation:', error)
        alert('Error during calculation. Please check parameter settings or refresh the page.')
      } finally {
        setIsCalculating(false)
      }
    }, 100)
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
                Calculating...
              </>
            ) : (
              'Start Calculation'
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