"use client"

import React, { useState, useEffect } from 'react'

interface InputPanelProps {
  params: {
    m: number // Total number of samples
    n: number // Number of randomly selected samples
    k: number // Output group size
    j: number // Subset size to be covered
    s: number // Intersection threshold
  }
  onParamsChange: (params: InputPanelProps['params']) => void
}

const InputPanel: React.FC<InputPanelProps> = ({ params, onParamsChange }) => {
  const [localParams, setLocalParams] = useState({ ...params })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Update local state when props change
  useEffect(() => {
    setLocalParams({ ...params })
  }, [params])

  // Validation rules
  const validate = (name: string, value: number): string => {
    switch (name) {
      case 'm':
        if (value < 10) return 'Must be at least 10'
        if (value > 100) return 'Must be at most 100'
        if (value < localParams.n) return `Must be greater than or equal to n (${localParams.n})`
        if (value < localParams.k) return `Must be greater than or equal to k (${localParams.k})`
        break
      case 'n':
        if (value < 1) return 'Must be at least 1'
        if (value > localParams.m) return `Must be less than or equal to m (${localParams.m})`
        break
      case 'k':
        if (value < 1) return 'Must be at least 1'
        if (value > localParams.m) return `Must be less than or equal to m (${localParams.m})`
        break
      case 'j':
        if (value < 1) return 'Must be at least 1'
        if (value > localParams.k) return `Must be less than or equal to k (${localParams.k})`
        break
      case 's':
        if (value < 1) return 'Must be at least 1'
        if (value > localParams.j) return `Must be less than or equal to j (${localParams.j})`
        break
    }
    return ''
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = parseInt(value, 10)
    
    // Update local state
    setLocalParams(prev => ({ ...prev, [name]: isNaN(numValue) ? '' : numValue }))
    
    // Validate and set error
    if (!isNaN(numValue)) {
      const error = validate(name, numValue)
      setErrors(prev => ({ ...prev, [name]: error }))
      
      // If valid, update parent component
      if (!error) {
        const newParams = { ...localParams, [name]: numValue }
        
        // Additional validation for interdependent parameters
        const newErrors: Record<string, string> = {}
        let isValid = true
        
        if (name === 'm') {
          if (newParams.n > numValue) {
            newErrors.n = `Must be less than or equal to m (${numValue})`
            isValid = false
          }
          if (newParams.k > numValue) {
            newErrors.k = `Must be less than or equal to m (${numValue})`
            isValid = false
          }
        }
        
        if (name === 'k') {
          if (newParams.j > numValue) {
            newErrors.j = `Must be less than or equal to k (${numValue})`
            isValid = false
          }
        }
        
        if (name === 'j') {
          if (newParams.s > numValue) {
            newErrors.s = `Must be less than or equal to j (${numValue})`
            isValid = false
          }
        }
        
        setErrors(prev => ({ ...prev, ...newErrors }))
        
        if (isValid) {
          onParamsChange(newParams)
        }
      }
    }
  }

  return (
    <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">
      <h3 className="text-lg font-medium mb-4">Parameter Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label htmlFor="m" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Total Sample Size (m)
            <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">[10-100]</span>
          </label>
          <input
            type="number"
            name="m"
            id="m"
            value={localParams.m}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm text-sm ${
              errors.m 
                ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' 
                : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white'
            }`}
            min="10"
            max="100"
          />
          {errors.m && <p className="mt-1 text-sm text-red-600">{errors.m}</p>}
        </div>
        
        <div>
          <label htmlFor="n" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Random Selection Size (n)
            <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">[1-m]</span>
          </label>
          <input
            type="number"
            name="n"
            id="n"
            value={localParams.n}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm text-sm ${
              errors.n 
                ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' 
                : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white'
            }`}
            min="1"
            max={localParams.m}
          />
          {errors.n && <p className="mt-1 text-sm text-red-600">{errors.n}</p>}
        </div>
        
        <div>
          <label htmlFor="k" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Output Group Size (k)
            <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">[1-m]</span>
          </label>
          <input
            type="number"
            name="k"
            id="k"
            value={localParams.k}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm text-sm ${
              errors.k 
                ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' 
                : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white'
            }`}
            min="1"
            max={localParams.m}
          />
          {errors.k && <p className="mt-1 text-sm text-red-600">{errors.k}</p>}
        </div>
        
        <div>
          <label htmlFor="j" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Subset Size (j)
            <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">[1-k]</span>
          </label>
          <input
            type="number"
            name="j"
            id="j"
            value={localParams.j}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm text-sm ${
              errors.j 
                ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' 
                : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white'
            }`}
            min="1"
            max={localParams.k}
          />
          {errors.j && <p className="mt-1 text-sm text-red-600">{errors.j}</p>}
        </div>
        
        <div>
          <label htmlFor="s" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Intersection Threshold (s)
            <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">[1-j]</span>
          </label>
          <input
            type="number"
            name="s"
            id="s"
            value={localParams.s}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm text-sm ${
              errors.s 
                ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' 
                : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white'
            }`}
            min="1"
            max={localParams.j}
          />
          {errors.s && <p className="mt-1 text-sm text-red-600">{errors.s}</p>}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
        <p><strong>Notes:</strong></p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li>All parameters must be positive integers</li>
          <li>Total Sample Size (m) must be greater than or equal to the Random Selection Size (n)</li>
          <li>Output Group Size (k) must not exceed Total Sample Size (m)</li>
          <li>Subset Size (j) must not exceed Output Group Size (k)</li>
          <li>Intersection Threshold (s) must not exceed Subset Size (j)</li>
        </ul>
      </div>
    </div>
  )
}

export default InputPanel 