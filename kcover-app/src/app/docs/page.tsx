"use client"

import React from 'react'

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">文档说明</h1>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">项目概述</h2>
        <p className="mb-4 text-slate-600 dark:text-slate-300">
          K-Cover 是一个最优样本选择系统，旨在解决最小集合覆盖问题。该系统能够从大数据集中提取一个尽可能小的样本子集，同时确保这个子集能够覆盖原始数据集的关键特征。
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          在大数据时代，选择具有代表性的最小样本集是数据挖掘、知识发现和机器学习中的重要任务。本系统提供了两种算法模式来解决这一问题：速度模式和精准模式。
        </p>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">参数说明</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">参数</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">描述</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">取值范围</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">m</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">样本总数</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">45-54</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">n</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">随机选择的样本数</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">7-25, 且 n &lt; m</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">k</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">输出组大小</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">4-7, 且 k ≤ n</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">j</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">需要覆盖的子集大小</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">j ≤ k</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">s</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">交集阈值</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">3-7, 且 s ≤ j</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">算法说明</h2>
        
        <h3 className="text-lg font-semibold mt-6 mb-2">速度模式（贪心算法）</h3>
        <p className="mb-4 text-slate-600 dark:text-slate-300">
          采用贪心策略，在每一步选择能覆盖最多未覆盖子集的k-集合，并进行优化处理：
        </p>
        <ol className="list-decimal pl-5 mb-4 text-slate-600 dark:text-slate-300 space-y-2">
          <li>预处理阶段：枚举所有可能的k-子集和j-子集，构建覆盖关系</li>
          <li>贪心选择：每次选择能增加最多覆盖的子集</li>
          <li>优化阶段：去除冗余集合，尝试替换以减少总组数</li>
        </ol>
        <p className="text-slate-600 dark:text-slate-300">
          特点：计算速度快，适合大规模数据，能获得接近最优的结果
        </p>
        
        <h3 className="text-lg font-semibold mt-6 mb-2">精准模式（整数线性规划）</h3>
        <p className="mb-4 text-slate-600 dark:text-slate-300">
          使用整数线性规划（ILP）方法求解最小集合覆盖问题：
        </p>
        <ol className="list-decimal pl-5 mb-4 text-slate-600 dark:text-slate-300 space-y-2">
          <li>构建数学模型：最小化总选择集合数</li>
          <li>约束条件：每个j-子集至少被一个k-子集覆盖（覆盖元素数量≥s）</li>
          <li>使用求解算法寻找最优解</li>
        </ol>
        <p className="text-slate-600 dark:text-slate-300">
          特点：保证获得最优解或接近最优解，计算时间较长，适合对精度要求高的场景
        </p>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">使用说明</h2>
        <ol className="list-decimal pl-5 mb-4 text-slate-600 dark:text-slate-300 space-y-2">
          <li>选择算法模式：速度模式或精准模式</li>
          <li>设置参数：填写m、n、k、j、s的值</li>
          <li>点击"应用参数"按钮确认设置</li>
          <li>点击"开始计算"按钮执行算法</li>
          <li>查看结果：系统会展示找到的所有满足条件的k-集合</li>
          <li>可以点击"导出结果"按钮将结果保存为文本文件</li>
        </ol>
      </div>
    </div>
  )
} 