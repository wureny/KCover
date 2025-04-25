"use client"

import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl mb-4">
          <span className="block">K-Cover Algorithm Demo</span>
          <span className="block text-blue-600 dark:text-blue-400">Optimal Sample Selection System</span>
        </h1>
        <p className="max-w-2xl mx-auto mt-5 text-xl text-gray-500 dark:text-gray-300">
          Efficiently solving the minimum set cover problem, optimizing the accuracy and speed of sample selection
        </p>
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="bg-white dark:bg-slate-800 shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Accurate Mode</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-300">
                  <p>Using integer linear programming method to ensure optimal solutions, suitable for scenarios with high precision requirements.</p>
                </div>
                <div className="mt-5">
                  <Link 
                    href="/algorithm?mode=accurate" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Try It
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Speed Mode</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-300">
                  <p>Using greedy algorithm to quickly obtain near-optimal solutions, suitable for large-scale data and scenarios requiring quick response.</p>
                </div>
                <div className="mt-5">
                  <Link 
                    href="/algorithm" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Try It
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
