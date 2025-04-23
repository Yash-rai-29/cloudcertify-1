import { useState, useEffect } from 'react';
import { IconSearch, IconFilter, IconCertificate, IconBookmark } from '@tabler/icons-react';
import { getDashboardLayout } from '../../components/layouts/DashboardLayout';
import Section from '../../components/dashboard/Section';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getTestLibrary } from '../../utils/services/dashboardService';

/**
 * Test Library page
 */
export default function TestLibrary() {
  const [isLoading, setIsLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [totalTests, setTotalTests] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;

  // GCP certification types
  const certificationTypes = [
    'Cloud Engineer',
    'Cloud Architect',
    'Data Engineer',
    'DevOps Engineer',
    'Security Engineer',
    'Network Engineer',
    'Cloud Developer',
    'Machine Learning Engineer'
  ];

  useEffect(() => {
    const fetchTests = async () => {
      setIsLoading(true);
      try {
        const response = await getTestLibrary(currentPage, pageSize);
        if (response.success) {
          setTests(response.data.tests || []);
          setTotalTests(response.data.total || 0);
          setTotalPages(Math.ceil((response.data.total || 0) / pageSize));
        }
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
  }, [currentPage]);

  const handleStartTest = (testId) => {
    window.location.href = `/dashboard/tests/${testId}`;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Function to get difficulty badge color
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return <Badge variant="green">Beginner</Badge>;
      case 'intermediate':
        return <Badge variant="amber">Intermediate</Badge>;
      case 'advanced':
        return <Badge variant="red">Advanced</Badge>;
      default:
        return <Badge>{difficulty}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* Page Header */}
      <div className="py-6 md:py-8 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Test Library</h1>
            <p className="mt-1 text-sm text-gray-500">Browse and take practice tests to prepare for your GCP certification</p>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500">{totalTests} tests available</p>
          </div>
        </div>
      </div>

      {/* GCP Certification Types */}
      <Section 
        title="GCP Certification Types"
        description="Choose a certification to prepare for"
        className="mt-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {certificationTypes.map((cert, index) => (
            <div 
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start">
                <div className="p-2 bg-blue-50 rounded">
                  <IconCertificate size={24} className="text-blue-500" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">
                    {cert}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Certification
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Test Grid */}
      <Section 
        title="All Practice Tests"
        description="Select a test to start practicing"
        className="mt-8"
      >
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test) => (
                <div 
                  key={test.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900">{test.title}</h3>
                      <IconBookmark 
                        size={20} 
                        className="text-gray-400 hover:text-blue-500 cursor-pointer" 
                      />
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-2">
                      <Badge variant="blue">{test.category}</Badge>
                      {getDifficultyBadge(test.difficulty)}
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-sm text-gray-500">
                        {test.questions_count} questions • {test.estimated_time} minutes
                      </p>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex -space-x-1">
                          {Array(Math.min(3, test.times_taken || 0)).fill(0).map((_, i) => (
                            <div key={i} className="h-6 w-6 rounded-full bg-gray-200 border border-white flex items-center justify-center text-xs">
                              👤
                            </div>
                          ))}
                        </div>
                        <p className="ml-2 text-xs text-gray-500">
                          {test.times_taken || 0} {test.times_taken === 1 ? 'person' : 'people'} took this test
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {test.average_score || 0}% avg
                      </span>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Button
                        fullWidth
                        onClick={() => handleStartTest(test.id)}
                      >
                        Start Test
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
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

TestLibrary.getLayout = getDashboardLayout;