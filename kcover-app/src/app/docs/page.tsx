"use client"

import React from 'react'

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Documentation</h1>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Project Overview</h2>
        <p className="mb-4 text-slate-600 dark:text-slate-300">
          K-Cover is an optimal sample selection system designed to solve the minimum set cover problem. This system can extract a sample subset that is as small as possible from a large dataset, while ensuring that this subset covers the key features of the original dataset.
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          In the era of big data, selecting a representative minimum sample set is an important task in data mining, knowledge discovery, and machine learning. This system provides two algorithm modes to solve this problem: Speed Mode and Accurate Mode.
        </p>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Parameter Description</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Parameter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Range</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">m</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">Total number of samples</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">45-54</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">n</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">Number of randomly selected samples</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">7-25, and n &lt; m</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">k</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">Output group size</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">4-7, and k ≤ n</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">j</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">Subset size to be covered</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">j ≤ k</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">s</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">Intersection threshold</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">3-7, and s ≤ j</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Algorithm Description</h2>
        
        <h3 className="text-lg font-semibold mt-6 mb-2">Speed Mode (Greedy Algorithm)</h3>
        <p className="mb-4 text-slate-600 dark:text-slate-300">
          Using a greedy strategy, at each step select the k-set that covers the most uncovered subsets, and perform optimization processing:
        </p>
        <ol className="list-decimal pl-5 mb-4 text-slate-600 dark:text-slate-300 space-y-2">
          <li>Preprocessing phase: Enumerate all possible k-subsets and j-subsets, and build coverage relationships</li>
          <li>Greedy selection: Each time select the subset that adds the most coverage</li>
          <li>Optimization phase: Remove redundant sets, try substitution to reduce the total number of groups</li>
        </ol>
        <p className="text-slate-600 dark:text-slate-300">
          Features: Fast calculation speed, suitable for large-scale data, can obtain results close to optimal
        </p>
        
        <h3 className="text-lg font-semibold mt-6 mb-2">Accurate Mode (Integer Linear Programming)</h3>
        <p className="mb-4 text-slate-600 dark:text-slate-300">
          Using Integer Linear Programming (ILP) method to solve the minimum set cover problem:
        </p>
        <ol className="list-decimal pl-5 mb-4 text-slate-600 dark:text-slate-300 space-y-2">
          <li>Construct mathematical model: Minimize the total number of selected sets</li>
          <li>Constraints: Each j-subset is covered by at least one k-subset (number of covered elements ≥ s)</li>
          <li>Using solving algorithm to find the optimal solution</li>
        </ol>
        <p className="text-slate-600 dark:text-slate-300">
          Features: Guarantees optimal or near-optimal solutions, longer calculation time, suitable for scenarios with high precision requirements
        </p>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">User Guide</h2>
        <ol className="list-decimal pl-5 mb-4 text-slate-600 dark:text-slate-300 space-y-2">
          <li>Select algorithm mode: Speed Mode or Accurate Mode</li>
          <li>Set parameters: Fill in the values for m, n, k, j, s</li>
          <li>Click &quot;Apply Parameters&quot; button to confirm settings</li>
          <li>Click &quot;Start Calculation&quot; button to execute the algorithm</li>
          <li>View results: The system will display all k-sets that meet the conditions</li>
          <li>You can click the &quot;Export Results&quot; button to save the results as a text file</li>
        </ol>
      </div>
    </div>
  )
} 