import { useState, useEffect, useRef } from 'react';
import { 
  IconLayoutGrid, 
  IconList, 
  IconInfoCircle, 
  IconLoader2,
  IconChevronLeft,
  IconChevronRight,
  IconSearch,
  IconSortAscending,
  IconClock,
  IconUsers,
  IconStar,
  IconCertificate,
  IconBrandGoogle,
  IconBrandAws,
  IconBrandAzure
} from '@tabler/icons-react';
import { getDashboardLayout } from '../../components/layouts/DashboardLayout';
import TestCard from '../../components/tests/TestCard';
import TestModeSelector from '../../components/tests/TestModeSelector';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { fetchTests, startTestAttempt } from '../../utils/services/testLibraryService';
import useToast from '../../hooks/useToast';
import { useRouter } from 'next/router';

/**
 * Test Library page
 */
export default function TestLibrary() {
  // Toast notifications
  const { success, error } = useToast();
  const router = useRouter();
  const carouselRef = useRef(null);
  
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [featuredTest, setFeaturedTest] = useState(null);
  const [popularTest, setPopularTest] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [totalTests, setTotalTests] = useState(0);
  const [itemsPerPage] = useState(12);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showTestModeModal, setShowTestModeModal] = useState(false);
  const [startingTest, setStartingTest] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeCarouselSlide, setActiveCarouselSlide] = useState(0);
  const [highlightedTests, setHighlightedTests] = useState([]);
  
  // Filter and sort state
  const [filters, setFilters] = useState({
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    cursor: '',
    limit: itemsPerPage
  });
  
  // Available filter options
  const cloudProviders = ['GCP', 'AWS', 'Azure', 'Oracle Cloud', 'IBM Cloud'];
  const categories = ['Cloud Engineer', 'Cloud Architect', 'Data Engineer', 'DevOps Engineer', 'Security Engineer'];
  const difficulties = ['Beginner', 'Intermediate', 'Expert'];

  // Fetch tests when filters or pagination changes
  useEffect(() => {
    const loadTests = async () => {
      setIsLoading(true);
      try {
        const response = await fetchTests({
          ...filters
        });
        
        if (response.success) {
          const { 
            tests = [], 
            total_count = 0, 
            next_cursor = null, 
            featured_test = null, 
            most_popular_test = null 
          } = response.data;
          
          setTests(tests);
          setTotalTests(total_count);
          setNextCursor(next_cursor);
          
          // Create highlighted tests array from featured and popular tests
          const highlights = [];
          
          if (featured_test) {
            highlights.push({
              ...featured_test,
              highlight_type: 'featured',
              badge_text: 'Featured Test',
              badge_color: 'bg-blue-100 text-blue-800'
            });
            setFeaturedTest(featured_test);
          }
          
          if (most_popular_test) {
            highlights.push({
              ...most_popular_test,
              highlight_type: 'popular',
              badge_text: 'Most Popular',
              badge_color: 'bg-purple-100 text-purple-800'
            });
            setPopularTest(most_popular_test);
          }
          
          setHighlightedTests(highlights);
        } else {
          error('Failed to load tests');
        }
      } catch (err) {
        console.error('Error fetching tests:', err);
        error('An error occurred while loading tests');
      } finally {
        setIsLoading(false);
      }
    };

    loadTests();
  }, [filters, error]);
  
  // Load more tests using cursor
  const loadMoreTests = async () => {
    if (!nextCursor || isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      const response = await fetchTests({
        ...filters,
        cursor: nextCursor
      });
      
      if (response.success) {
        const { tests: newTests = [], next_cursor = null } = response.data;
        
        // Append new tests to existing ones
        setTests(currentTests => [...currentTests, ...newTests]);
        setNextCursor(next_cursor);
      } else {
        error('Failed to load more tests');
      }
    } catch (err) {
      console.error('Error fetching more tests:', err);
      error('An error occurred while loading more tests');
    } finally {
      setIsLoadingMore(false);
    }
  };
  
  // Carousel navigation
  const navigateCarousel = (direction) => {
    if (highlightedTests.length <= 1) return;
    
    if (direction === 'next') {
      setActiveCarouselSlide((current) => 
        current === highlightedTests.length - 1 ? 0 : current + 1
      );
    } else {
      setActiveCarouselSlide((current) => 
        current === 0 ? highlightedTests.length - 1 : current - 1
      );
    }
  };

  // Handle search
  const handleSearch = (query) => {
    handleFilterChange('search', query);
  };

  // Handle sort changes
  const handleSortChange = (sortBy, sortOrder) => {
    setFilters(prev => ({
      ...prev,
      sort_by: sortBy,
      sort_order: sortOrder,
      cursor: '', // Reset cursor when sort changes
    }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      search: '',
      sort_by: 'popularity',
      sort_order: 'desc',
      cursor: '',
      limit: itemsPerPage
    });
  };

  // Handle test start
  const handleStartTest = (testId) => {
    const test = tests.find(t => t.id === testId) || 
                 featuredTest?.id === testId ? featuredTest : 
                 popularTest?.id === testId ? popularTest : null;
    
    if (test) {
      setSelectedTest(test);
      setShowTestModeModal(true);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      cursor: '', // Reset cursor when filters change
    }));
  };

  // Handle mode selection and start the test
  const handleModeSelection = async (mode) => {
    if (!selectedTest) return;
    
    setStartingTest(true);
    try {
      const response = await startTestAttempt(selectedTest.id, mode);
      if (response.success) {
        success(`Starting ${mode} test: ${selectedTest.title}`);
        
        // Directly navigate to the new take-test route
        window.location.href = `/dashboard/take-test/${response.data.attempt_id}?mode=${mode}`;
      } else {
        error('Failed to start test');
      }
    } catch (err) {
      console.error('Error starting test:', err);
      error('An error occurred while starting the test');
    } finally {
      setStartingTest(false);
      setShowTestModeModal(false);
    }
  };

  // Toggle view mode (grid/list)
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* Page Header */}
      <div className="py-6 md:py-8 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Test Library</h1>
            <p className="mt-1 text-sm text-gray-500">
              Browse our collection of certification practice tests and exam simulations
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <Button 
              variant="outline"
              size="sm"
              className="mr-2"
              onClick={toggleViewMode}
            >
              {viewMode === 'grid' ? (
                <><IconList size={16} className="mr-1" /> List View</>
              ) : (
                <><IconLayoutGrid size={16} className="mr-1" /> Grid View</>
              )}
            </Button>
            <span className="text-sm text-gray-500 ml-2">{totalTests} tests available</span>
          </div>
        </div>
      </div>

      {/* Search and Sort Section */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IconSearch size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search for tests by title, category, or topic..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e.target.value)}
              />
            </div>
          </div>
          
          {/* Sort Options */}
          <div className="w-full md:w-auto flex flex-col md:flex-row gap-2">
            {/* <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2 whitespace-nowrap">Sort by:</span>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={filters.sort_by}
                onChange={(e) => handleSortChange(e.target.value, filters.sort_order)}
              >
                <option value="created_at">Newest</option>
                <option value="title">Title</option>
                <option value="difficulty">Difficulty</option>
              </select>
            </div> */}
            
            <div className="flex items-center">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={filters.sort_order}
                onChange={(e) => handleSortChange(filters.sort_by, e.target.value)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            
            {filters.search && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleResetFilters}
                className="md:ml-2 whitespace-nowrap"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Featured and Popular Tests Carousel */}
      {highlightedTests.length > 0 && (
        <div className="mt-8 relative" ref={carouselRef}>
          <div className="overflow-hidden rounded-lg shadow-md">
            {highlightedTests.map((highlight, index) => (
              <div 
                key={highlight.id} 
                className={`transition-all duration-300 ease-in-out ${activeCarouselSlide === index ? 'block' : 'hidden'}`}
              >
                <div className="bg-gradient-to-r from-blue-50 to-white overflow-hidden rounded-lg p-6 border border-gray-100">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                      <div className="h-24 w-24 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center">
                        {highlight.cloud_provider === 'GCP' ? (
                          <IconBrandGoogle size={40} className="text-blue-500" />
                        ) : highlight.cloud_provider === 'AWS' ? (
                          <IconBrandAws size={40} className="text-orange-500" />
                        ) : highlight.cloud_provider === 'Azure' ? (
                          <IconBrandAzure size={40} className="text-blue-600" />
                        ) : (
                          <IconCertificate size={40} className="text-gray-500" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center mb-2">
                        <Badge className={highlight.badge_color}>
                          {highlight.badge_text}
                        </Badge>
                        <span className="ml-2 text-sm text-gray-500">
                          {highlight.cloud_provider} • {highlight.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{highlight.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{highlight.description}</p>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                        <div className="flex items-center text-sm text-gray-500">
                          <IconClock size={16} className="mr-1" />
                          {highlight.duration} minutes
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <IconUsers size={16} className="mr-1" />
                          {Math.floor(Math.random() * 10000)} attempts
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <IconStar size={16} className="mr-1" />
                          {highlight.difficulty}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:ml-4">
                      <Button 
                        variant="primary"
                        onClick={() => handleStartTest(highlight.id)}
                      >
                        Start Test
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Carousel Navigation */}
            {highlightedTests.length > 1 && (
              <>
                <button 
                  className="absolute top-1/2 transform -translate-y-1/2 left-2 bg-white rounded-full shadow-md p-2 hover:bg-gray-50 focus:outline-none"
                  onClick={() => navigateCarousel('prev')}
                >
                  <IconChevronLeft size={16} />
                </button>
                <button 
                  className="absolute top-1/2 transform -translate-y-1/2 right-2 bg-white rounded-full shadow-md p-2 hover:bg-gray-50 focus:outline-none"
                  onClick={() => navigateCarousel('next')}
                >
                  <IconChevronRight size={16} />
                </button>
                
                {/* Dot indicators */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {highlightedTests.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        activeCarouselSlide === index ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                      onClick={() => setActiveCarouselSlide(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Test Grid/List */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">All Tests</h2>
          <div className="flex items-center text-sm text-gray-500">
            <IconInfoCircle size={16} className="mr-1" />
            <span>Click on a test to start preparation</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <IconLoader2 size={30} className="animate-spin text-blue-500 mr-2" />
            <span className="text-gray-600">Loading tests...</span>
          </div>
        ) : tests.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-1">No tests found</h3>
            <p className="text-gray-500">
              Try adjusting your filters or search terms to find what you're looking for.
            </p>
            <Button variant="outline" className="mt-4" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className={`grid ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'grid-cols-1 gap-4'
          }`}>
            {tests.map((test) => (
              <TestCard 
                key={test.id} 
                test={test} 
                onStartTest={handleStartTest} 
                view={viewMode}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {nextCursor && !isLoading && (
          <div className="mt-8 flex justify-center">
            <Button 
              variant="outline"
              size="md"
              onClick={loadMoreTests}
              isLoading={isLoadingMore}
              className="px-6"
            >
              {isLoadingMore ? 'Loading...' : 'Load More Tests'}
            </Button>
          </div>
        )}
      </div>

      {/* Test Mode Selection Modal */}
      <Modal
        isOpen={showTestModeModal}
        onClose={() => !startingTest && setShowTestModeModal(false)}
        title=""
        size="lg"
      >
        <TestModeSelector
          test={selectedTest}
          onSelectMode={handleModeSelection}
          onCancel={() => !startingTest && setShowTestModeModal(false)}
        />
      </Modal>
    </div>
  );
}

TestLibrary.getLayout = getDashboardLayout;