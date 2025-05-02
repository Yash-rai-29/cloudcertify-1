import { useState, useEffect } from 'react';
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
  IconBrandAzure
} from '@tabler/icons-react';
import { getDashboardLayout } from '../../components/layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import TestPagination from '../../components/tests/TestPagination';
import { getUserTestAttempts, getTestPerformanceAnalytics, resumeTestAttempt } from '../../utils/services/testLibraryService';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [analytics, setAnalytics] = useState(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [resumingAttempt, setResumingAttempt] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    mode: '',
    test_id: '',
    page_size: itemsPerPage
  });
  
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
  
  // Load test attempts
  useEffect(() => {
    const fetchTestHistory = async () => {
      setIsLoading(true);
      try {
        const response = await getUserTestAttempts({
          ...filters,
          cursor: currentPage > 1 ? nextCursor : undefined
        });
        
        if (response.success) {
          setTestHistory(response.data.attempts || []);
          setNextCursor(response.data.next_cursor || null);
          setTotalTests(response.data.total || testHistory.length || 0);
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
  }, [currentPage, filters, error]);
  
  // Load analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoadingAnalytics(true);
      try {
        const response = await getTestPerformanceAnalytics({
          period: 'all'
        });
        
        if (response.success) {
          setAnalytics(response.data);
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setIsLoadingAnalytics(false);
      }
    };
    
    fetchAnalytics();
  }, []);

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

  // Handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  // Handle search input
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      handleFilterChange('search', e.target.value);
    }
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      mode: '',
      test_id: '',
      page_size: itemsPerPage
    });
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
  
  // Format duration
  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  // Calculate performance metrics
  const getPerformanceMetrics = () => {
    if (!analytics) {
      return {
        averageScore: 0,
        testsCompleted: 0,
        passRate: 0,
        totalTime: 0
      };
    }
    
    return {
      averageScore: analytics.average_score || 0,
      testsCompleted: analytics.total_attempts || 0,
      passRate: analytics.pass_rate || 0,
      totalTime: analytics.total_time_spent || 0
    };
  };
  
  const metrics = getPerformanceMetrics();
  
  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status) count++;
    if (filters.mode) count++;
    if (filters.test_id) count++;
    return count;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
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
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-full">
              <IconReportAnalytics size={24} className="text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Average Score</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.averageScore}%</p>
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  metrics.averageScore >= 80 
                    ? 'bg-green-500' 
                    : metrics.averageScore >= 60 
                      ? 'bg-amber-500' 
                      : 'bg-red-500'
                }`}
                style={{ width: `${metrics.averageScore}%` }}
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
              <p className="text-sm text-gray-500">Tests Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.testsCompleted}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            {metrics.testsCompleted > 0 ? (
              <p>Keep up the good work! Regular practice improves your scores.</p>
            ) : (
              <p>Take your first test to start tracking your progress.</p>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-50 rounded-full">
              <IconCheck size={24} className="text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Pass Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.passRate}%</p>
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 bg-purple-500 rounded-full"
                style={{ width: `${metrics.passRate}%` }}
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
              <p className="text-sm text-gray-500">Total Time Spent</p>
              <p className="text-2xl font-semibold text-gray-900">{formatDuration(metrics.totalTime)}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            {metrics.totalTime > 0 ? (
              <p>You've been building your skills effectively!</p>
            ) : (
              <p>Track your time spent on practice tests.</p>
            )}
          </div>
        </div>
      </div>

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
                onKeyDown={handleSearch}
                defaultValue={filters.search}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select
                className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <select
                className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={filters.mode}
                onChange={(e) => handleFilterChange('mode', e.target.value)}
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
                              leftIcon={
                                attempt.score >= 70 
                                  ? <IconCheck size={14} /> 
                                  : <IconX size={14} />
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
        
        {/* Pagination */}
        {testHistory.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200">
            <TestPagination
              hasNextPage={!!nextCursor}
              hasPreviousPage={currentPage > 1}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              totalItems={totalTests}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

TestHistory.getLayout = getDashboardLayout;