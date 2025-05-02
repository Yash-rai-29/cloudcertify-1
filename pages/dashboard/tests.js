import { useState, useEffect } from 'react';
import { IconLayoutGrid, IconList, IconInfoCircle, IconLoader2 } from '@tabler/icons-react';
import { getDashboardLayout } from '../../components/layouts/DashboardLayout';
import TestCard from '../../components/tests/TestCard';
import TestFilters from '../../components/tests/TestFilters';
import FeaturedTest from '../../components/tests/FeaturedTest';
import TestModeSelector from '../../components/tests/TestModeSelector';
import TestPagination from '../../components/tests/TestPagination';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { fetchTests, startTestAttempt } from '../../utils/services/testLibraryService';
import { useToast } from '../../hooks/useToast';

/**
 * Test Library page
 */
export default function TestLibrary() {
  // Toast notifications
  const toast = useToast();
  
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [featuredTest, setFeaturedTest] = useState(null);
  const [popularTest, setPopularTest] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [totalTests, setTotalTests] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showTestModeModal, setShowTestModeModal] = useState(false);
  const [startingTest, setStartingTest] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    cloud_provider: '',
    difficulty: '',
    status: '',
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
          ...filters,
          page: currentPage
        });
        
        if (response.success) {
          setTests(response.data.tests || []);
          setTotalTests(response.data.total || 0);
          
          // Set featured and popular tests if available
          if (response.data.featured && response.data.featured.length > 0) {
            setFeaturedTest(response.data.featured[0]);
          }
          
          if (response.data.popular && response.data.popular.length > 0) {
            setPopularTest(response.data.popular[0]);
          }
        } else {
          toast.error('Failed to load tests');
        }
      } catch (error) {
        console.error('Error fetching tests:', error);
        toast.error('An error occurred while loading tests');
      } finally {
        setIsLoading(false);
      }
    };

    loadTests();
  }, [filters, currentPage, toast]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      cursor: '', // Reset cursor when filters change
    }));
    setCurrentPage(1); // Reset to first page
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
    setCurrentPage(1); // Reset to first page
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: '',
      cloud_provider: '',
      difficulty: '',
      status: '',
      sort_by: 'created_at',
      sort_order: 'desc',
      cursor: '',
      limit: itemsPerPage
    });
    setCurrentPage(1);
  };

  // Handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle test start
  const handleStartTest = (testId) => {
    const test = tests.find(t => t.id === testId) || 
                 (featuredTest && featuredTest.id === testId ? featuredTest : null) ||
                 (popularTest && popularTest.id === testId ? popularTest : null);
                 
    if (test) {
      setSelectedTest(test);
      setShowTestModeModal(true);
    }
  };

  // Handle mode selection and start the test
  const handleModeSelection = async (mode) => {
    if (!selectedTest) return;
    
    setStartingTest(true);
    try {
      const response = await startTestAttempt(selectedTest.id, mode);
      if (response.success) {
        toast.success(`Starting ${mode} test: ${selectedTest.title}`);
        
        // Redirect to the test attempt page
        window.location.href = `/dashboard/test-attempt/${response.data.attempt_id}`;
      } else {
        toast.error('Failed to start test');
      }
    } catch (error) {
      console.error('Error starting test:', error);
      toast.error('An error occurred while starting the test');
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
              Browse and take practice tests to prepare for your cloud certification
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

      {/* Filters */}
      <div className="mt-6">
        <TestFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onSortChange={handleSortChange}
          cloudProviders={cloudProviders}
          categories={categories}
          difficulties={difficulties}
          onReset={handleResetFilters}
        />
      </div>

      {/* Featured and Popular Tests */}
      {(featuredTest || popularTest) && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredTest && (
            <FeaturedTest test={featuredTest} type="featured" onStartTest={handleStartTest} />
          )}
          {popularTest && (
            <FeaturedTest test={popularTest} type="popular" onStartTest={handleStartTest} />
          )}
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
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && tests.length > 0 && (
          <div className="mt-8">
            <TestPagination
              hasNextPage={currentPage * itemsPerPage < totalTests}
              hasPreviousPage={currentPage > 1}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              totalItems={totalTests}
              itemsPerPage={itemsPerPage}
            />
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