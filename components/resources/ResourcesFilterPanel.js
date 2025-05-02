import { useCallback } from 'react';
import { IconSearch, IconFilter, IconX } from '@tabler/icons-react';
import Button from '../ui/Button';

/**
 * Filter panel component for resources page
 */
export default function ResourcesFilterPanel({
  filters,
  onFilterChange,
  certificationOptions,
  resourceTypes,
  tags,
  onResetFilters,
}) {
  // Create a debounced version of search handler
  const debouncedSearchChange = useCallback(
    (value) => {
      const timeoutId = setTimeout(() => {
        onFilterChange('search', value);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    },
    [onFilterChange]
  );

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    debouncedSearchChange(value);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          
          {Object.values(filters).some(v => v) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <IconX size={16} className="mr-1" />
              Reset
            </Button>
          )}
        </div>
        
        {/* Search */}
        <div className="mb-6">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconSearch size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              id="search"
              placeholder="Search resources..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              defaultValue={filters.search || ''}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        {/* Certification */}
        <div className="mb-4">
          <label htmlFor="certification" className="block text-sm font-medium text-gray-700 mb-1">
            Certification
          </label>
          <select
            id="certification"
            className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={filters.certification || ''}
            onChange={(e) => onFilterChange('certification', e.target.value)}
          >
            <option value="">All Certifications</option>
            {certificationOptions.map((cert) => (
              <option key={cert.value} value={cert.value}>
                {cert.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Resource Type */}
        <div className="mb-4">
          <label htmlFor="resourceType" className="block text-sm font-medium text-gray-700 mb-1">
            Resource Type
          </label>
          <select
            id="resourceType"
            className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={filters.resource_type || ''}
            onChange={(e) => onFilterChange('resource_type', e.target.value)}
          >
            <option value="">All Types</option>
            {resourceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        
        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-4">
            <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-1">
              Tag
            </label>
            <select
              id="tag"
              className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filters.tag || ''}
              onChange={(e) => onFilterChange('tag', e.target.value)}
            >
              <option value="">All Tags</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* Sort By */}
        <div className="mb-4">
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            id="sortBy"
            className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={filters.sort_by || 'created_at'}
            onChange={(e) => onFilterChange('sort_by', e.target.value)}
          >
            <option value="created_at">Date Added</option>
            <option value="likes">Most Liked</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>
        
        {/* Sort Order */}
        <div className="mb-4">
          <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
            Sort Order
          </label>
          <select
            id="sortOrder"
            className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={filters.sort_order || 'desc'}
            onChange={(e) => onFilterChange('sort_order', e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
    </div>
  );
}
