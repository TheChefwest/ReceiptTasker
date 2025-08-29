import React from 'react'
import { TASK_CATEGORIES } from '../utils/categories'

interface Props {
  searchQuery: string
  selectedCategory: string
  onSearchChange: (query: string) => void
  onCategoryChange: (category: string) => void
}

export default function SearchFilter({ 
  searchQuery, 
  selectedCategory, 
  onSearchChange, 
  onCategoryChange 
}: Props) {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 shadow p-4 space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Search & Filter</h3>
      
      {/* Search Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Search Tasks
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Location Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Filter by Location
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 text-sm"
        >
          <option value="all">🏠 All Locations</option>
          {TASK_CATEGORIES.map(category => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Active Filters Display */}
      {(searchQuery || selectedCategory !== 'all') && (
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs">
                Search: "{searchQuery}"
                <button
                  onClick={() => onSearchChange('')}
                  className="hover:text-blue-600 dark:hover:text-blue-200"
                >
                  ×
                </button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs">
                {TASK_CATEGORIES.find(cat => cat.id === selectedCategory)?.icon} {TASK_CATEGORIES.find(cat => cat.id === selectedCategory)?.name}
                <button
                  onClick={() => onCategoryChange('all')}
                  className="hover:text-green-600 dark:hover:text-green-200"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}