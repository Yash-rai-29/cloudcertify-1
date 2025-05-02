import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  IconCalendarEvent, 
  IconCheck, 
  IconX, 
  IconClockHour4, 
  IconSearch, 
  IconFilter, 
  IconChevronDown,
  IconLoader2,
  IconDownload,
  IconSortAscending,
  IconLayoutGrid,
  IconReportAnalytics,
  IconPlayerPlay,
  IconExternalLink,
  IconCertificate,
  IconBrandGoogle,
  IconBrandAws,
  IconBrandAzure,
  IconClock,
  IconBulb,
  IconTarget
} from '@tabler/icons-react';
import { getDashboardLayout } from '../../components/layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import TestPagination from '../../components/tests/TestPagination';
import { getUserTestAttempts, resumeTestAttempt, getUserStatistics } from '../../utils/services/testLibraryService';
import useToast from '../../hooks/useToast';

/**
 * Test History page - shows a log of all tests taken by the user with detailed analytics
 */
export default function TestHistory() {
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [testHistory, setTestHistory] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [totalTests, setTotalTests] = useState(0);
  const [itemsPerPage] = useState(10);
  const [userStats, setUserStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [resumingAttempt, setResumingAttempt] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    page_size: itemsPerPage
  });
  
  // Filter dropdowns
  const [searchInput, setSearchInput] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  
  // Reference to the scrollable container for infinite scrolling
  const containerRef = useRef(null);
  
  // Status options
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'in-progress', label: 'In Progress' }
  ];
  
  // Mode options
  const modeOptions = [
    { value: '', label: 'All Modes' },
    { value: 'practice', label: 'Practice' },
    { value: 'exam', label: 'Exam' }
  ];
  
  // Prepare query parameters by removing empty string values
  const prepareQueryParams = (params) => {
    const result = { ...params };
    
    // Remove empty string values to avoid validation issues
    Object.keys(result).forEach(key => {
      if (result[key] === '') {
        delete result[key];
      }
    });
    
    return result;
  };
  
  // Load initial test attempts
  useEffect(() => {
    const fetchTestHistory = async () => {
      setIsLoading(true);
      try {
        const queryParams = prepareQueryParams({
          ...filters,
          search: searchInput,
          status: selectedStatus,
          mode: selectedMode
        });
        
        const response = await getUserTestAttempts(queryParams);
        
        if (response.success) {
          setTestHistory(response.data.attempts || []);
          setNextCursor(response.data.next_cursor || null);
          setTotalTests(response.data.total || 0);
        } else {
          error('Failed to load test history');
        }
      } catch (err) {
        console.error('Error fetching test history:', err);
        error('An error occurred while loading your test history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestHistory();
  }, [filters, searchInput, selectedStatus, selectedMode, error]);
  
  // Load more test attempts when scrolling or clicking load more
  const loadMoreAttempts = useCallback(async () => {
    if (!nextCursor || isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      const queryParams = prepareQueryParams({
        ...filters,
        search: searchInput,
        status: selectedStatus,
        mode: selectedMode,
        cursor: nextCursor
      });
      
      const response = await getUserTestAttempts(queryParams);
      
      if (response.success) {
        setTestHistory(prev => [...prev, ...(response.data.attempts || [])]);
        setNextCursor(response.data.next_cursor || null);
      } else {
        error('Failed to load more test history');
      }
    } catch (err) {
      console.error('Error fetching more test history:', err);
      error('An error occurred while loading more of your test history');
    } finally {
      setIsLoadingMore(false);
    }
  }, [nextCursor, isLoadingMore, filters, searchInput, selectedStatus, selectedMode, error]);
  
  // Load user statistics
  useEffect(() => {
    const fetchUserStats = async () => {
      setIsLoadingStats(true);
      try {
        const response = await getUserStatistics();
        if (response.success) {
          setUserStats(response.data);
        } else {
          error('Failed to load user statistics');
        }
      } catch (err) {
        console.error('Error fetching user statistics:', err);
      } finally {
        setIsLoadingStats(false);
      }
    };
    
    fetchUserStats();
  }, [error]);

  // Handle viewing test details
  const handleViewDetails = (attemptId) => {
    window.location.href = `/dashboard/test-results/${attemptId}`;
  };
  
  // Handle resuming a test
  const handleResumeTest = async (attemptId) => {
    setResumingAttempt(attemptId);
    try {
      const response = await resumeTestAttempt(attemptId);
      if (response.success) {
        success('Resuming your test...');
        window.location.href = `/dashboard/test-attempt/${attemptId}`;
      } else {
        error('Failed to resume test');
      }
    } catch (err) {
      console.error('Error resuming test:', err);
      error('An error occurred while trying to resume your test');
    } finally {
      setResumingAttempt(null);
    }
  };

  // Handle search input
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      // Reset cursor when applying new search
      setNextCursor(null);
    }
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setSearchInput('');
    setSelectedStatus('');
    setSelectedMode('');
    setNextCursor(null);
  };
  
  // Format time string
  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  // Format duration as hours, minutes and seconds
  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (searchInput) count++;
    if (selectedStatus) count++;
    if (selectedMode) count++;
    return count;
  };
  
  // Handle scroll events for infinite scrolling
  const handleScroll = useCallback(() => {
    if (!containerRef.current || !nextCursor || isLoadingMore) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 200; // Load more when near bottom
    
    if (atBottom) {
      loadMoreAttempts();
    }
  }, [nextCursor, isLoadingMore, loadMoreAttempts]);
  
  // Setup scroll event listener
  useEffect(() => {
    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
      return () => currentRef.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <div 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 overflow-auto"
      ref={containerRef}
      style={{ maxHeight: 'calc(100vh - 64px)' }}
    >
      {/* Page Header */}
      <div className="py-6 md:py-8 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Test History</h1>
            <p className="mt-1 text-sm text-gray-500">
              Review your previous test attempts and track your progress
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              leftIcon={
                <IconDownload size={16} stroke={1.5} />
              }
            >
              Export History
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              href="/dashboard/tests"
            >
              Take a Test
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      {isLoadingStats ? (
        <div className="mt-8 flex justify-center">
          <IconLoader2 size={30} className="animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-full">
                <IconReportAnalytics size={24} className="text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Average Score</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {userStats?.avg_score.toFixed(2) || 0}%
                </p>
                <p className="text-xs text-gray-500">
                  Best Score: {userStats?.best_score.toFixed(2) || 0}%
                </p>
              </div>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    (userStats?.avg_score || 0) >= 80 
                      ? 'bg-green-500' 
                      : (userStats?.avg_score || 0) >= 60 
                        ? 'bg-amber-500' 
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${userStats?.avg_score || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-50 rounded-full">
                <IconCalendarEvent size={24} className="text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Tests Taken</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {userStats?.total_tests_attempted || 0}
                </p>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Practice</span>
                <span className="font-medium text-blue-600">
                  {userStats?.total_practice_tests || 0}
                </span>
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Exam</span>
                <span className="font-medium text-purple-600">
                  {userStats?.total_real_tests || 0}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-50 rounded-full">
                <IconTarget size={24} className="text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Accuracy Rate</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {userStats?.accuracy_rate.toFixed(2) || 0}%
                </p>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex text-xs text-gray-500 justify-between">
                <span>Attempted: {userStats?.total_questions_attempted || 0}</span>
                <span>Correct: {userStats?.total_correct_answers || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="h-2 bg-purple-500 rounded-full"
                  style={{ width: `${userStats?.accuracy_rate || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-amber-50 rounded-full">
                <IconClockHour4 size={24} className="text-amber-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Time Spent</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatDuration(userStats?.total_time_spent || 0)}
                </p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Avg. time per test:
                </span>
                <span className="font-medium">
                  {formatDuration(userStats?.avg_time_per_test || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters & History Table */}
      <div className="mt-8 bg-white rounded-lg shadow">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IconSearch size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tests by title..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchSubmit}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select
                className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <select
                className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
              >
                {modeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              {getActiveFilterCount() > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  Clear Filters ({getActiveFilterCount()})
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <IconLoader2 size={30} className="animate-spin text-blue-500 mr-2" />
            <span className="text-gray-600">Loading history...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mode
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testHistory.length > 0 ? (
                  testHistory.map((attempt) => {
                    const testData = attempt.test_data || {};
                    const isInProgress = attempt.status === 'in-progress';
                    const isCompleted = attempt.status === 'completed';
                    const progressPercent = isCompleted 
                      ? 100 
                      : Math.round((attempt.attempted_questions / attempt.total_questions) * 100) || 0;
                    
                    return (
                      <tr key={attempt.attempt_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-lg">
                              {testData.cloud_provider === 'GCP' ? (
                                <div className="w-6 h-6 text-blue-500">
                                  <IconBrandGoogle size={24} />
                                </div>
                              ) : testData.cloud_provider === 'AWS' ? (
                                <div className="w-6 h-6 text-orange-500">
                                  <IconBrandAws size={24} />
                                </div>
                              ) : testData.cloud_provider === 'Azure' ? (
                                <div className="w-6 h-6 text-blue-600">
                                  <IconBrandAzure size={24} />
                                </div>
                              ) : (
                                <IconCertificate size={24} className="text-gray-500" />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{testData.title}</div>
                              <div className="text-xs text-gray-500">
                                {testData.category} • {testData.difficulty}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatTime(attempt.start_time)}
                          </div>
                          {isCompleted && (
                            <div className="text-xs text-gray-500">
                              Completed {formatDuration(attempt.end_time - attempt.start_time)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isCompleted ? (
                            <Badge 
                              variant={
                                attempt.score >= 80 
                                  ? 'green' 
                                  : attempt.score >= 60 
                                    ? 'amber' 
                                    : 'red'
                              }
                            >
                              {attempt.score}%
                            </Badge>
                          ) : (
                            <span className="text-sm text-gray-500">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2 max-w-[100px]">
                              <div 
                                className="h-2 bg-blue-500 rounded-full" 
                                style={{ width: `${progressPercent}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">
                              {isCompleted 
                                ? 'Complete' 
                                : `${attempt.attempted_questions || 0}/${attempt.total_questions || 0}`}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={attempt.mode === 'practice' ? 'blue' : 'purple'}>
                            {attempt.mode === 'practice' ? 'Practice' : 'Exam'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isCompleted ? (
                            <Badge 
                              variant={attempt.score >= 70 ? 'green' : 'red'} 
                              leftIcon={
                                attempt.score >= 70 
                                  ? <IconCheck size={14} /> 
                                  : <IconX size={14} />
                              }
                            >
                              {attempt.score >= 70 ? 'Passed' : 'Failed'}
                            </Badge>
                          ) : (
                            <Badge variant="amber">In Progress</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {isCompleted ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetails(attempt.attempt_id)}
                              leftIcon={
                                <IconExternalLink size={16} stroke={1.5} />
                              }
                            >
                              View Details
                            </Button>
                          ) : (
                            <Button 
                              variant="primary" 
                              size="sm"
                              onClick={() => handleResumeTest(attempt.attempt_id)}
                              leftIcon={
                                <IconPlayerPlay size={16} stroke={1.5} />
                              }
                              isLoading={resumingAttempt === attempt.attempt_id}
                            >
                              Resume Test
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-sm text-gray-500">
                      <div className="flex flex-col items-center">
                        <IconCalendarEvent size={40} className="text-gray-300 mb-2" />
                        <p className="mb-2">You haven't taken any tests yet.</p>
                        <Button 
                          variant="primary" 
                          size="sm"
                          href="/dashboard/tests"
                        >
                          Start Practicing
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Load More instead of Pagination */}
        {nextCursor && !isLoading && (
          <div className="px-4 py-4 border-t border-gray-200 flex justify-center">
            <Button
              variant="outline"
              onClick={loadMoreAttempts}
              isLoading={isLoadingMore}
            >
              {isLoadingMore ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

TestHistory.getLayout = getDashboardLayout;