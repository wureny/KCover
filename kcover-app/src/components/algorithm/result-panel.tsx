"use client"

import React, { useState } from 'react'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'

type Params = {
  m: number // Total number of samples
  n: number // Number of randomly selected samples
  k: number // Output set size
  j: number // Size of subset to be covered
  s: number // Intersection threshold
}

type ResultPanelProps = {
  results: string[][]
  params: Params
}

export default function ResultPanel({ results, params }: ResultPanelProps) {
  const [selectedResult, setSelectedResult] = useState<number | null>(null)

  const handleResultClick = (index: number) => {
    setSelectedResult(index === selectedResult ? null : index)
  }

  const handleDownload = () => {
    // Build download content
    const { m, n, k, j, s } = params
    const content = [
      `# K-Cover Algorithm Results`,
      `Parameters: m=${m}, n=${n}, k=${k}, j=${j}, s=${s}`,
      `Found ${results.length} result sets:`,
      '',
      ...results.map((group, idx) => `${idx + 1}. ${group.join(', ')}`),
    ].join('\n')

    // Create download link
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kcover-${m}-${n}-${k}-${j}-${s}-result.txt`
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Results</h2>
        <button
          onClick={handleDownload}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <ArrowDownTrayIcon className="w-5 h-5 mr-1" />
          Export Results
        </button>
      </div>

      <div className="mb-4">
        <p className="text-slate-600 dark:text-slate-300">
          Found <span className="font-semibold">{results.length}</span> sets meeting the criteria.
          Parameters: m={params.m}, n={params.n}, k={params.k}, j={params.j}, s={params.s}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((result, idx) => (
          <div
            key={idx}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedResult === idx
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
            onClick={() => handleResultClick(idx)}
          >
            <div className="font-medium mb-2">Set {idx + 1}</div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {result.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="bg-slate-200 dark:bg-slate-700 rounded px-2 py-1 text-center text-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 