import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
import { fetchResources } from '../../utils/services/resourcesService';
import useToast from '../../hooks/useToast';
import { useLoading } from '../../contexts/LoadingContext';
import useDebounce from '../../hooks/useDebounce';

/**
 * Resources page with filtering, likes, views, and infinite scroll
 */
export default function Resources() {
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [resources, setResources] = useState([]);
  const [certificationOptions, setCertificationOptions] = useState([
    { id: 'gcp-ace', name: 'Associate Cloud Engineer' },
    { id: 'gcp-pde', name: 'Professional Data Engineer' },
    { id: 'gcp-pca', name: 'Professional Cloud Architect' },
    { id: 'gcp-psec', name: 'Professional Cloud Security Engineer' },
    { id: 'gcp-pnw', name: 'Professional Cloud Network Engineer' }
  ]);
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
  const { startLoading, stopLoading } = useLoading();
  const observerRef = useRef();
  const debouncedSearch = useDebounce(filters.search, 500);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Watch for search term changes and reload resources
  useEffect(() => {
    if (initialLoadComplete) {
      loadResources(true);
    }
  }, [debouncedSearch]);

  // Initial data fetch
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load initial data
  const loadInitialData = async () => {
    startLoading();
    try {
      // Load resources immediately with static certification options
      await loadResources(true);
      setInitialLoadComplete(true);
    } catch (error) {
      console.error('Error during initial data loading:', error);
      toast.error('Failed to load resources. Please try again later.');
    } finally {
      stopLoading();
    }
  };

  // Fetch resources when filters change
  const loadResources = useCallback(async (reset = true) => {
    if (isLoading) return;
    
    setIsLoading(true);
    if (reset) {
      startLoading();
    }
    
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
        if (response.data.statistics) {
          setTotalCounts({
            total: response.data.statistics.total_resources || 0,
            likes: response.data.statistics.total_likes || 0,
            views: response.data.statistics.total_views || 0
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
        toast.error('Failed to load resources. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to load resources. Please try again later.');
    } finally {
      setIsLoading(false);
      if (reset) {
        stopLoading();
      }
    }
  }, [filters, nextCursor, isLoading, toast, startLoading, stopLoading]);

  // Load more resources for infinite scroll
  const loadMoreResources = useCallback(async () => {
    if (!hasMore || isLoading) return;
    await loadResources(false);
  }, [hasMore, isLoading, loadResources]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreResources();
        }
      },
      { threshold: 0.5 }
    );
    
    const currentObserver = observerRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }
    
    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [observerRef, hasMore, isLoading, loadMoreResources]);

  // Update a specific filter field
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));

    // Reset cursor when changing filters (except for search which is debounced)
    if (field !== 'search') {
      setNextCursor(null);
      loadResources(true);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
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
    loadResources(true);
  };

  // Toggle the visibility of the filter panel
  const toggleFilterPanel = () => {
    setShowFilters(prev => !prev);
  };

  // Toggle the view mode between grid and list
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  // Compute active filter count for UI
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.certification) count++;
    if (filters.resource_type) count++;
    if (filters.tag) count++;
    if (filters.search) count++;
    if (filters.sort_by !== 'created_at' || filters.sort_order !== 'desc') count++;
    return count;
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Learning Resources</h1>
            <p className="mt-1 text-sm text-gray-500">
              Browse curated resources to help you prepare for your cloud certification
            </p>
          </div>
          
          {/* Resource stats */}
          <div className="mt-4 sm:mt-0 flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <IconBook className="h-5 w-5 text-blue-500 mr-1.5" />
              <span>{totalCounts.total} Resources</span>
            </div>
            <div className="flex items-center">
              <IconHeart className="h-5 w-5 text-red-500 mr-1.5" />
              <span>{totalCounts.likes} Likes</span>
            </div>
            <div className="flex items-center">
              <IconEye className="h-5 w-5 text-gray-500 mr-1.5" />
              <span>{totalCounts.views} Views</span>
            </div>
          </div>
        </div>
        
        {/* Filters and controls */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-lg">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <IconSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="block w-full rounded-md border-gray-300 pl-10 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
                {filters.search && (
                  <button 
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    onClick={() => handleFilterChange('search', '')}
                  >
                    <IconX size={16} />
                  </button>
                )}
              </div>
              
              {/* Controls */}
              <div className="flex items-center space-x-2">
                {/* Filter toggle */}
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={toggleFilterPanel}
                  className={showFilters ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
                >
                  <IconFilter size={16} className="mr-1" />
                  <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="ml-1.5 bg-blue-100 text-blue-800 py-0.5 px-1.5 rounded-full text-xs">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
                
                {/* Sort button */}
                <div className="relative">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newOrder = filters.sort_order === 'desc' ? 'asc' : 'desc';
                      handleFilterChange('sort_order', newOrder);
                    }}
                  >
                    <IconArrowsSort size={16} className="mr-1" />
                    <span>{filters.sort_order === 'desc' ? 'Newest' : 'Oldest'}</span>
                  </Button>
                </div>
                
                {/* View mode toggle */}
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={toggleViewMode}
                >
                  {viewMode === 'grid' ? (
                    <IconLayoutList size={16} />
                  ) : (
                    <IconLayoutGrid size={16} />
                  )}
                </Button>
              </div>
            </div>
            
            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Certification filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certification
                    </label>
                    <select
                      className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:ring-blue-500"
                      value={filters.certification}
                      onChange={(e) => handleFilterChange('certification', e.target.value)}
                    >
                      <option value="">All Certifications</option>
                      {certificationOptions.map((cert) => (
                        <option key={cert.id} value={cert.id}>
                          {cert.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Resource type filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resource Type
                    </label>
                    <select
                      className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:ring-blue-500"
                      value={filters.resource_type}
                      onChange={(e) => handleFilterChange('resource_type', e.target.value)}
                    >
                      <option value="">All Types</option>
                      {resourceTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Tag filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tag
                    </label>
                    <select
                      className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:ring-blue-500"
                      value={filters.tag}
                      onChange={(e) => handleFilterChange('tag', e.target.value)}
                    >
                      <option value="">All Tags</option>
                      {tags.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Reset filters button */}
                {activeFilterCount > 0 && (
                  <div className="mt-4 flex justify-end">
                    <Button 
                      variant="text"
                      size="sm"
                      onClick={handleResetFilters}
                      className="text-red-600 hover:text-red-800"
                    >
                      <IconX size={16} className="mr-1" />
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Results */}
        <div>
          {resources.length > 0 ? (
            <div className="space-y-6">
              <ResourcesGrid resources={resources} viewMode={viewMode} />
              
              {/* Loading indicator / Load more */}
              {hasMore && (
                <div 
                  ref={observerRef}
                  className="flex justify-center py-8"
                >
                  {isLoading ? (
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                      <p className="mt-2 text-sm text-gray-500">Loading more resources...</p>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={loadMoreResources}
                    >
                      Load More Resources
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-gray-100 p-4 rounded-full">
                <IconCategory className="h-8 w-8 text-gray-400" />
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
                src="/images/google-cloud-logo.svg" 
                alt="Google Cloud"
                className="h-24 w-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

Resources.getLayout = getDashboardLayout;