import { useState, useEffect } from 'react';
import { IconCalendarEvent, IconCheck, IconX, IconClockHour4 } from '@tabler/icons-react';
import { getDashboardLayout } from '../../components/layouts/DashboardLayout';
import Section from '../../components/dashboard/Section';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getTestHistory, formatDate } from '../../utils/services/dashboardService';

/**
 * Test History page
 */
export default function TestHistory() {
  const [isLoading, setIsLoading] = useState(true);
  const [testHistory, setTestHistory] = useState([]);
  const [totalTests, setTotalTests] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchTestHistory = async () => {
      setIsLoading(true);
      try {
        const response = await getTestHistory(currentPage, pageSize);
        if (response.success) {
          setTestHistory(response.data.tests || []);
          setTotalTests(response.data.total || 0);
          setTotalPages(Math.ceil((response.data.total || 0) / pageSize));
        }
      } catch (error) {
        console.error('Error fetching test history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestHistory();
  }, [currentPage]);

  const handleViewDetails = (testId) => {
    window.location.href = `/dashboard/tests/${testId}/result`;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Function to get score badge color
  const getScoreBadge = (score) => {
    if (score >= 80) {
      return <Badge variant="green">{score}%</Badge>;
    } else if (score >= 60) {
      return <Badge variant="amber">{score}%</Badge>;
    } else {
      return <Badge variant="red">{score}%</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* Page Header */}
      <div className="py-6 md:py-8 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Test History</h1>
            <p className="mt-1 text-sm text-gray-500">Review your previous test attempts and track your improvement</p>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500">{totalTests} tests completed</p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <Section 
        title="Your Test Stats"
        description="Overview of your test performance"
        className="mt-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded">
                <IconCheck size={24} className="text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">Average Score</p>
                <p className="text-xl font-semibold">{
                  testHistory.length > 0 
                    ? Math.round(testHistory.reduce((acc, test) => acc + test.score, 0) / testHistory.length) 
                    : 0
                }%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded">
                <IconCalendarEvent size={24} className="text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">Tests Completed</p>
                <p className="text-xl font-semibold">{totalTests}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-50 rounded">
                <IconClockHour4 size={24} className="text-purple-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">Study Time</p>
                <p className="text-xl font-semibold">{
                  testHistory.length > 0 
                    ? testHistory.reduce((acc, test) => acc + (test.duration_minutes || 0), 0) 
                    : 0
                } min</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Test History Table */}
      <Section 
        title="Test Attempts"
        description="Your previous test performances"
        className="mt-8"
      >
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="mt-4 bg-white border border-gray-200 rounded-lg overflow-hidden">
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
                        Time Spent
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
                      testHistory.map((test) => (
                        <tr key={test.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{test.test_title}</div>
                            <div className="text-sm text-gray-500">{test.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(test.timestamp)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getScoreBadge(test.score)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {test.duration_minutes} minutes
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {test.passed ? (
                              <Badge variant="green" leftIcon={<IconCheck size={14} />}>Passed</Badge>
                            ) : (
                              <Badge variant="red" leftIcon={<IconX size={14} />}>Failed</Badge>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetails(test.id)}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-500">
                          You haven't taken any tests yet. Start practicing to see your history!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </Button>
                </nav>
              </div>
            )}
          </>
        )}
      </Section>
    </div>
  );
}

TestHistory.getLayout = getDashboardLayout;