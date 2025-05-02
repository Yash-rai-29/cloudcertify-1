import React, { useState, useEffect } from 'react';
import { IconSearch, IconFilter, IconX, IconAdjustmentsHorizontal, IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import Button from '../ui/Button';

/**
 * Test filters component for the test library
 */
export default function TestFilters({ 
  filters, 
  onFilterChange, 
  onSearch, 
  onSortChange,
  cloudProviders,
  categories,
  difficulties,
  onReset
}) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [isOpen, setIsOpen] = useState(false);
  
  // Handle search input changes with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== filters.search) {
        onSearch(searchQuery);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, onSearch, filters.search]);
  
  // Get the active filter count (excluding sort and pagination params)
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.cloud_provider) count++;
    if (filters.difficulty) count++;
    if (filters.search) count++;
    return count;
  };
  
  const handleReset = () => {
    setSearchQuery('');
    onReset();
  };
  
  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Search and Filter Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconSearch size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tests..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => {
                  setSearchQuery('');
                  onSearch('');
                }}
              >
                <IconX size={16} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          
          {/* Filter Toggle Button */}
          <Button
            variant={isOpen ? "primary" : "outline"}
            className="sm:w-auto w-full flex-shrink-0 relative"
            onClick={toggleFilters}
          >
            <IconAdjustmentsHorizontal size={18} className="mr-2" />
            Filters
            {getActiveFilterCount() > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </Button>
          
          {/* Sort Dropdown */}
          <div className="w-full sm:w-auto flex-shrink-0">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={`${filters.sort_by || 'created_at'}-${filters.sort_order || 'desc'}`}
              onChange={(e) => {
                const [sort_by, sort_order] = e.target.value.split('-');
                onSortChange(sort_by, sort_order);
              }}
            >
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="total_questions-desc">Most Questions</option>
              <option value="duration-asc">Shortest Duration</option>
              <option value="duration-desc">Longest Duration</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Filter Panel (expandable) */}
      {isOpen && (
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cloud Provider Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cloud Provider
              </label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={filters.cloud_provider || ''}
                onChange={(e) => onFilterChange('cloud_provider', e.target.value)}
              >
                <option value="">All Providers</option>
                {cloudProviders.map((provider) => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={filters.category || ''}
                onChange={(e) => onFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={filters.difficulty || ''}
                onChange={(e) => onFilterChange('difficulty', e.target.value)}
              >
                <option value="">All Difficulties</option>
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Active Filters Display */}
          {getActiveFilterCount() > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Active filters:</span>
              
              {filters.cloud_provider && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Provider: {filters.cloud_provider}
                  <button
                    type="button"
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:text-blue-600 focus:outline-none"
                    onClick={() => onFilterChange('cloud_provider', '')}
                  >
                    <IconX size={12} />
                  </button>
                </span>
              )}
              
              {filters.category && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Category: {filters.category}
                  <button
                    type="button"
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-green-400 hover:text-green-600 focus:outline-none"
                    onClick={() => onFilterChange('category', '')}
                  >
                    <IconX size={12} />
                  </button>
                </span>
              )}
              
              {filters.difficulty && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Difficulty: {filters.difficulty}
                  <button
                    type="button"
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-purple-400 hover:text-purple-600 focus:outline-none"
                    onClick={() => onFilterChange('difficulty', '')}
                  >
                    <IconX size={12} />
                  </button>
                </span>
              )}
              
              {filters.search && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Search: "{filters.search}"
                  <button
                    type="button"
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={() => {
                      setSearchQuery('');
                      onSearch('');
                    }}
                  >
                    <IconX size={12} />
                  </button>
                </span>
              )}
              
              <button
                className="ml-auto text-sm text-red-600 hover:text-red-800 font-medium"
                onClick={handleReset}
              >
                Reset all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
