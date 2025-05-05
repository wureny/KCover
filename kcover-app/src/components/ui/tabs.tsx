'use client'

import React from 'react'

type TabItem = {
  label: string
  value: string
}

type TabsProps = {
  items: TabItem[]
  selectedIndex: number
  onChange: (index: number) => void
}

export default function Tabs({ items, selectedIndex, onChange }: TabsProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px">
        {items.map((item, index) => (
          <li key={item.value} className="mr-2">
            <button
              onClick={() => onChange(index)}
              className={`inline-block p-4 rounded-t-lg ${
                selectedIndex === index
                  ? 'text-blue-600 dark:text-blue-500 border-b-2 border-blue-600 dark:border-blue-500'
                  : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 border-b-2 border-transparent'
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
} 