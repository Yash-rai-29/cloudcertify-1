import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  IconBook, 
  IconExternalLink, 
  IconCategory, 
  IconFilter, 
  IconSearch, 
  IconX, 
  IconHeart, 
  IconEye,
  IconChevronRight,
  IconArrowsSort,
  IconAdjustments,
  IconLayoutGrid,
  IconLayoutList
} from '@tabler/icons-react';
import { getDashboardLayout } from '../../components/layouts/DashboardLayout';
import Section from '../../components/dashboard/Section';
import Button from '../../components/ui/Button';
import ResourcesFilterPanel from '../../components/resources/ResourcesFilterPanel';
import ResourcesGrid from '../../components/resources/ResourcesGrid';
import { fetchResources, getCertificationOptions } from '../../utils/services/resourcesService';
import useToast from '../../hooks/useToast';

/**
 * Resources page with filtering, likes, views, and infinite scroll
 */
export default function Resources() {
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const [certificationOptions, setCertificationOptions] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);
  const [tags, setTags] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filters, setFilters] = useState({
    certification: '',
    resource_type: '',
    tag: '',
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    limit: 9
  });
  const [totalCounts, setTotalCounts] = useState({
    total: 0,
    likes: 0,
    views: 0
  });

  const toast = useToast();

  // Initial data fetch
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const certOptions = await getCertificationOptions();
        if (certOptions.success) {
          setCertificationOptions(certOptions.data.certifications || []);
        }
      } catch (error) {
        console.error('Error fetching certification options:', error);
      }
    };

    loadInitialData();
  }, []);

  // Fetch resources when filters change
  useEffect(() => {
    const loadResources = async (reset = true) => {
      setIsLoading(true);
      
      try {
        // Create params object from filters
        const params = { ...filters };
        
        // Only add cursor for pagination (not on filter changes)
        if (!reset && nextCursor) {
          params.cursor = nextCursor;
        }
        
        // Remove empty filters
        Object.keys(params).forEach(key => {
          if (params[key] === '') {
            delete params[key];
          }
        });
        
        const response = await fetchResources(params);
        
        if (response.success) {
          // Set resources
          const newResources = response.data.resources || [];
          
          if (reset) {
            setResources(newResources);
          } else {
            setResources(prev => [...prev, ...newResources]);
          }
          
          // Update cursor for next page
          setNextCursor(response.data.next_cursor || null);
          
          // Check if there are more resources to load
          setHasMore(!!response.data.next_cursor);
          
          // Update total counts
          if (response.data.meta) {
            setTotalCounts({
              total: response.data.meta.total || 0,
              likes: response.data.meta.total_likes || 0,
              views: response.data.meta.total_views || 0
            });
          }
          
          // Extract and set resource types and tags
          if (reset) {
            // Only update these on initial load or filter reset
            const types = [...new Set(newResources.map(r => r.resource_type).filter(Boolean))];
            setResourceTypes(types);
            
            const allTags = newResources.flatMap(r => r.tags || []);
            const uniqueTags = [...new Set(allTags)];
            setTags(uniqueTags);
          }
        } else {
          toast.error('Failed to load resources');
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
        toast.error('An error occurred while fetching resources');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadResources(true);
  }, [filters, toast]);

  // Handle filter changes
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    // Reset cursor for new filter
    setNextCursor(null);
  }, []);

  // Reset all filters
  const handleResetFilters = useCallback(() => {
    setFilters({
      certification: '',
      resource_type: '',
      tag: '',
      search: '',
      sort_by: 'created_at',
      sort_order: 'desc',
      limit: 9
    });
    setNextCursor(null);
  }, []);

  // Load more resources (infinite scroll)
  const handleLoadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    const loadMoreResources = async () => {
      setIsLoading(true);
      
      try {
        // Create params object from filters
        const params = { ...filters };
        
        // Add cursor for pagination
        if (nextCursor) {
          params.cursor = nextCursor;
        }
        
        // Remove empty filters
        Object.keys(params).forEach(key => {
          if (params[key] === '') {
            delete params[key];
          }
        });
        
        const response = await fetchResources(params);
        
        if (response.success) {
          // Add new resources
          const newResources = response.data.resources || [];
          setResources(prev => [...prev, ...newResources]);
          
          // Update cursor for next page
          setNextCursor(response.data.next_cursor || null);
          
          // Check if there are more resources to load
          setHasMore(!!response.data.next_cursor);
        } else {
          toast.error('Failed to load more resources');
        }
      } catch (error) {
        console.error('Error fetching more resources:', error);
        toast.error('An error occurred while fetching more resources');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMoreResources();
  }, [filters, nextCursor, isLoading, hasMore, toast]);

  // Handle like toggle
  const handleLikeToggle = useCallback((resourceId, isLiked, likesCount) => {
    // Update resource in state
    setResources(prev => 
      prev.map(resource => 
        resource.id === resourceId 
          ? { ...resource, is_liked: isLiked, likes: likesCount }
          : resource
      )
    );
  }, []);

  // Get active filter count for badge
  const activeFilterCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      return value && key !== 'limit' && key !== 'sort_by' && key !== 'sort_order';
    }).length;
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* Page Header */}
      <div className="py-6 md:py-8 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <IconBook className="mr-2 text-blue-600" size={24} />
              Learning Resources
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Study materials for your GCP certification preparation
            </p>
            <div className="flex flex-wrap items-center mt-2 text-sm text-gray-500 gap-4">
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {totalCounts.total} resources
              </div>
              <div className="flex items-center">
                <IconEye size={16} className="mr-1 text-gray-400" />
                <span>{totalCounts.views} views</span>
              </div>
              <div className="flex items-center">
                <IconHeart size={16} className="mr-1 text-gray-400" />
                <span>{totalCounts.likes} likes</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-grow max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IconSearch size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search resources..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={showFilters ? "primary" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="relative"
              >
                <IconAdjustments size={16} className="mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              
              <div className="hidden sm:flex items-center border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                  title="Grid view"
                >
                  <IconLayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                  title="List view"
                >
                  <IconLayoutList size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Panel (desktop) */}
        <div className={`hidden lg:block`}>
          <div className="sticky top-8">
            <ResourcesFilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              certificationOptions={certificationOptions}
              resourceTypes={resourceTypes}
              tags={tags}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>
        
        {/* Filters Panel (mobile) */}
        {showFilters && (
          <div className="lg:hidden col-span-1 mb-6">
            <ResourcesFilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              certificationOptions={certificationOptions}
              resourceTypes={resourceTypes}
              tags={tags}
              onResetFilters={handleResetFilters}
            />
          </div>
        )}
        
        {/* Resources Grid */}
        <div className="lg:col-span-3">
          {/* Active filters display */}
          {activeFilterCount > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-700">Active filters:</span>
              
              {filters.certification && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {filters.certification}
                  <button 
                    onClick={() => handleFilterChange('certification', '')} 
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    <IconX size={14} />
                  </button>
                </span>
              )}
              
              {filters.resource_type && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {filters.resource_type}
                  <button 
                    onClick={() => handleFilterChange('resource_type', '')} 
                    className="ml-1 text-green-500 hover:text-green-700"
                  >
                    <IconX size={14} />
                  </button>
                </span>
              )}
              
              {filters.tag && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Tag: {filters.tag}
                  <button 
                    onClick={() => handleFilterChange('tag', '')} 
                    className="ml-1 text-purple-500 hover:text-purple-700"
                  >
                    <IconX size={14} />
                  </button>
                </span>
              )}
              
              {filters.search && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Search: "{filters.search}"
                  <button 
                    onClick={() => handleFilterChange('search', '')} 
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <IconX size={14} />
                  </button>
                </span>
              )}
              
              <button
                onClick={handleResetFilters}
                className="ml-auto text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Clear all
              </button>
            </div>
          )}
          
          {/* Sort options - only visible for list view */}
          {viewMode === 'list' && (
            <div className="mb-4 flex items-center justify-end">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Sort by:</span>
                <select
                  className="pl-3 pr-8 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={`${filters.sort_by}-${filters.sort_order}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    handleFilterChange('sort_by', sortBy);
                    handleFilterChange('sort_order', sortOrder);
                  }}
                >
                  <option value="created_at-desc">Newest first</option>
                  <option value="created_at-asc">Oldest first</option>
                  <option value="likes-desc">Most liked</option>
                  <option value="views-desc">Most viewed</option>
                </select>
              </div>
            </div>
          )}
          
          {/* Resources display */}
          <ResourcesGrid
            resources={resources}
            isLoading={isLoading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            onLikeToggle={handleLikeToggle}
            viewMode={viewMode}
          />
          
          {/* No results */}
          {!isLoading && resources.length === 0 && (
            <div className="py-12 text-center bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gray-100">
                <IconCategory size={32} className="text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No resources found</h3>
              <p className="mt-2 text-base text-gray-500 max-w-md mx-auto">
                {filters.search ? (
                  <>We couldn't find any resources matching "<span className="font-medium">{filters.search}</span>"</>
                ) : activeFilterCount > 0 ? (
                  <>No resources match your current filter criteria. Try adjusting your filters.</>
                ) : (
                  <>No resources are available at the moment. Check back later for updates.</>
                )}
              </p>
              {activeFilterCount > 0 && (
                <div className="mt-6">
                  <Button 
                    variant="outline"
                    onClick={handleResetFilters}
                  >
                    <IconX size={16} className="mr-2" />
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Official Documentation Section */}
      <Section 
        title="Official Google Documentation"
        description="Resources from Google's official documentation"
        className="mt-12"
      >
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg viewBox="0 0 24 24" width="24" height="24" className="mr-2">
                  <path fill="#4285F4" d="M12 8.5v7l5.5-3.5z"></path>
                  <path fill="#EA4335" d="M12 8.5l-5.5 3.5 5.5 3.5z"></path>
                  <path fill="#FBBC05" d="M6.5 12l3-2.5-3-2.5z"></path>
                  <path fill="#34A853" d="M17.5 7V2L12 6.5z"></path>
                  <path fill="#1A73E8" d="M17.5 17v5L12 17.5z"></path>
                </svg>
                Google Cloud Certification Resources
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Official resources from Google to help you prepare for your GCP certification exams
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button 
                  variant="outline"
                  size="sm" 
                  href="https://cloud.google.com/certification"
                  target="_blank"
                  rel="noopener noreferrer"
                  rightIcon={<IconExternalLink size={16} />}
                  className="bg-white hover:bg-gray-50"
                >
                  Certification Homepage
                </Button>
                <Button 
                  variant="outline"
                  size="sm" 
                  href="https://cloud.google.com/learn/certification/guides"
                  target="_blank"
                  rel="noopener noreferrer"
                  rightIcon={<IconExternalLink size={16} />}
                  className="bg-white hover:bg-gray-50"
                >
                  Exam Guides
                </Button>
                <Button 
                  variant="outline"
                  size="sm" 
                  href="https://www.cloudskillsboost.google/"
                  target="_blank"
                  rel="noopener noreferrer"
                  rightIcon={<IconExternalLink size={16} />}
                  className="bg-white hover:bg-gray-50"
                >
                  Cloud Skills Boost
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="/google-cloud-logo.svg" 
                alt="Google Cloud"
                className="h-24 w-auto"
              />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

Resources.getLayout = getDashboardLayout;