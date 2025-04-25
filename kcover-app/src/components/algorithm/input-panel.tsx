"use client"

import { useState, useEffect } from 'react'

type Params = {
  m: number // 样本总数
  n: number // 随机选择的样本数
  k: number // 输出组大小
  j: number // 需要覆盖的子集大小
  s: number // 交集阈值
}

type InputPanelProps = {
  params: Params
  onParamsChange: (params: Params) => void
}

export default function InputPanel({ params, onParamsChange }: InputPanelProps) {
  const [localParams, setLocalParams] = useState<Params>(params)
  const [errors, setErrors] = useState<Partial<Record<keyof Params, string>>>({})

  useEffect(() => {
    setLocalParams(params)
  }, [params])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = parseInt(value, 10)
    
    setLocalParams(prev => ({
      ...prev,
      [name]: isNaN(numValue) ? '' : numValue
    }))
  }

  const validateParams = () => {
    const newErrors: Partial<Record<keyof Params, string>> = {}
    
    // 基础验证
    if (localParams.m < 45 || localParams.m > 54) {
      newErrors.m = '样本总数应在 45-54 之间'
    }
    
    if (localParams.n < 7 || localParams.n > 25) {
      newErrors.n = '样本选择数应在 7-25 之间'
    }
    
    if (localParams.k < 4 || localParams.k > 7) {
      newErrors.k = '输出组大小应在 4-7 之间'
    }
    
    // 关系验证
    if (localParams.n >= localParams.m) {
      newErrors.n = '样本选择数应小于总样本数'
    }
    
    if (localParams.k > localParams.n) {
      newErrors.k = '输出组大小应小于或等于样本选择数'
    }
    
    if (localParams.j > localParams.k) {
      newErrors.j = '子集大小应小于或等于输出组大小'
    }
    
    if (localParams.s > localParams.j) {
      newErrors.s = '交集阈值不能大于子集大小'
    }
    
    if (localParams.s < 3 || localParams.s > 7) {
      newErrors.s = '交集阈值应在 3-7 之间'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateParams()) {
      onParamsChange(localParams)
    }
  }

  return (
    <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
      <h3 className="text-lg font-medium mb-4">参数设置</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label htmlFor="m" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            样本总数 (m)
          </label>
          <input
            type="number"
            name="m"
            id="m"
            value={localParams.m}
            onChange={handleChange}
            min={45}
            max={54}
            className={`block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 sm:text-sm ${
              errors.m ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.m && <p className="mt-1 text-sm text-red-500">{errors.m}</p>}
        </div>
        
        <div>
          <label htmlFor="n" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            样本选择数 (n)
          </label>
          <input
            type="number"
            name="n"
            id="n"
            value={localParams.n}
            onChange={handleChange}
            min={7}
            max={25}
            className={`block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 sm:text-sm ${
              errors.n ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.n && <p className="mt-1 text-sm text-red-500">{errors.n}</p>}
        </div>
        
        <div>
          <label htmlFor="k" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            输出组大小 (k)
          </label>
          <input
            type="number"
            name="k"
            id="k"
            value={localParams.k}
            onChange={handleChange}
            min={4}
            max={7}
            className={`block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 sm:text-sm ${
              errors.k ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.k && <p className="mt-1 text-sm text-red-500">{errors.k}</p>}
        </div>
        
        <div>
          <label htmlFor="j" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            子集大小 (j)
          </label>
          <input
            type="number"
            name="j"
            id="j"
            value={localParams.j}
            onChange={handleChange}
            min={3}
            className={`block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 sm:text-sm ${
              errors.j ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.j && <p className="mt-1 text-sm text-red-500">{errors.j}</p>}
        </div>
        
        <div>
          <label htmlFor="s" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            交集阈值 (s)
          </label>
          <input
            type="number"
            name="s"
            id="s"
            value={localParams.s}
            onChange={handleChange}
            min={3}
            max={7}
            className={`block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 sm:text-sm ${
              errors.s ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.s && <p className="mt-1 text-sm text-red-500">{errors.s}</p>}
        </div>
      </div>
      
      <div className="mt-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          应用参数
        </button>
      </div>
    </div>
  )
} 