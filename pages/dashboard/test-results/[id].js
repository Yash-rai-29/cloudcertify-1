import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  IconExclamationCircle, 
  IconLoader2, 
  IconArrowLeft, 
  IconCheck,
  IconX,
  IconInfoCircle,
  IconDownload,
  IconShare,
  IconPrinter
} from '@tabler/icons-react';
import { getDashboardLayout } from '../../../components/layouts/DashboardLayout';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { getTestAttempt } from '../../../utils/services/testLibraryService';
import useToast from '../../../hooks/useToast';

/**
 * Test results page to display detailed test attempt results
 */
export default function TestResults() {
  const router = useRouter();
  const { id: attemptId } = router.query;
  const { error } = useToast();
  
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [testResults, setTestResults] = useState(null);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  
  // Load test results
  useEffect(() => {
    if (!attemptId) return;
    
    const fetchTestResults = async () => {
      setIsLoading(true);
      try {
        const response = await getTestAttempt(attemptId);
        if (response.success) {
          setTestResults(response.data);
        } else {
          error('Failed to load test results');
          router.push('/dashboard/tests');
        }
      } catch (err) {
        console.error('Error loading test results:', err);
        error('An error occurred while loading the test results');
        router.push('/dashboard/tests');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTestResults();
  }, [attemptId, router, error]);
  
  const handleGoBack = () => {
    router.push('/dashboard/history');
  };
  
  const toggleShowAllQuestions = () => {
    setShowAllQuestions(prev => !prev);
  };
  
  // Tabs for the results page
  const tabs = [
    { name: 'Results Summary', content: 'summary' },
    { name: 'Question Analysis', content: 'questions' },
    { name: 'Topic Breakdown', content: 'topics' },
  ];
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  // Calculate time taken in minutes and seconds
  const formatTimeTaken = (seconds) => {
    if (!seconds) return '0m 0s';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <IconLoader2 size={40} className="animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Loading Results...</h2>
          <p className="text-gray-500 mt-2">Please wait while we load your test results</p>
        </div>
      </div>
    );
  }
  
  // Render error state if no results found
  if (!testResults) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <IconExclamationCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Results Not Found</h2>
          <p className="text-gray-500 mb-6">We couldn't find the test results you're looking for.</p>
          <Button variant="primary" onClick={handleGoBack}>
            Go Back to Test History
          </Button>
        </div>
      </div>
    );
  }
  
  // Render test results
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* Header */}
      <div className="py-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                className="mr-2" 
                onClick={handleGoBack}
              >
                <IconArrowLeft size={20} />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">{testResults.test.title} Results</h1>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Completed on {formatDate(testResults.completed_at)}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <Badge 
              variant={testResults.test.mode === 'practice' ? 'blue' : 'purple'}
              size="md"
            >
              {testResults.test.mode === 'practice' ? 'Practice Mode' : 'Exam Mode'}
            </Badge>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                leftIcon={<IconPrinter size={16} />}
                onClick={() => window.print()}
              >
                Print
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                leftIcon={<IconDownload size={16} />}
              >
                Download PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                leftIcon={<IconShare size={16} />}
              >
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab, index) => (
              <button
                key={tab.name}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTabIndex === index
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
                onClick={() => setActiveTabIndex(index)}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="mt-6">
        {/* Results Summary Tab */}
        {activeTabIndex === 0 && (
          <div>
            {/* Score Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Performance Summary</h2>
                <p className="text-sm text-gray-500 mt-1">
                  A summary of your test performance
                </p>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-12">
                  {/* Score Circle */}
                  <div className="mb-6 md:mb-0 flex-shrink-0">
                    <div className="relative inline-flex">
                      <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-blue-600">
                              {testResults.score || 0}%
                            </p>
                            <p className="text-sm text-gray-500">
                              {testResults.score >= 70 ? 'Passed' : 'Failed'}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Conditionally show pass/fail badge */}
                      <div className="absolute -top-2 -right-2">
                        {testResults.score >= 70 ? (
                          <div className="bg-green-500 text-white text-xs rounded-full w-10 h-10 flex items-center justify-center font-medium">
                            PASS
                          </div>
                        ) : (
                          <div className="bg-red-500 text-white text-xs rounded-full w-10 h-10 flex items-center justify-center font-medium">
                            FAIL
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Statistics */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Correct Answers</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {testResults.correct_answers || 0}/{testResults.total_questions || 0}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Time Taken</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatTimeTaken(testResults.time_taken)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Completion</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {testResults.answered_questions || 0}/{testResults.total_questions || 0}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Passing Score Info */}
                <div className="mt-6 flex items-start bg-blue-50 p-4 rounded-lg">
                  <IconInfoCircle className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">About the test scoring</h4>
                    <p className="mt-1 text-sm text-blue-700">
                      The passing score for this test is 70%. 
                      {testResults.score >= 70 
                        ? ' Congratulations on passing this test! You can now claim your certificate.'
                        : ' Keep practicing, and you\'ll pass the test next time.'}
                    </p>
                    
                    {testResults.score >= 70 && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="mt-3"
                      >
                        Claim Certificate
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Top Strengths and Areas to Improve */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Top Strengths</h3>
                </div>
                <div className="p-6">
                  {testResults.topics && testResults.topics
                    .filter(topic => topic.score >= 70)
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3)
                    .map((topic, index) => (
                      <div key={index} className="mb-4 last:mb-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">{topic.name}</span>
                          <span className="text-sm text-gray-500">{topic.score}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full" 
                            style={{ width: `${topic.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  
                  {(!testResults.topics || testResults.topics.filter(topic => topic.score >= 70).length === 0) && (
                    <p className="text-gray-500 text-sm">
                      No strength areas identified. Keep practicing!
                    </p>
                  )}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Areas to Improve</h3>
                </div>
                <div className="p-6">
                  {testResults.topics && testResults.topics
                    .filter(topic => topic.score < 70)
                    .sort((a, b) => a.score - b.score)
                    .slice(0, 3)
                    .map((topic, index) => (
                      <div key={index} className="mb-4 last:mb-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">{topic.name}</span>
                          <span className="text-sm text-gray-500">{topic.score}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-500 rounded-full" 
                            style={{ width: `${topic.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  
                  {(!testResults.topics || testResults.topics.filter(topic => topic.score < 70).length === 0) && (
                    <p className="text-gray-500 text-sm">
                      Great job! You didn't have any significant weak areas.
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Recommendations */}
            <div className="mt-6 bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Recommended Next Steps</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testResults.recommendations && testResults.recommendations.map((recommendation, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <h4 className="font-medium text-gray-900 mb-2">{recommendation.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{recommendation.description}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        href={recommendation.link}
                      >
                        {recommendation.action_text || 'View Resource'}
                      </Button>
                    </div>
                  ))}
                  
                  {(!testResults.recommendations || testResults.recommendations.length === 0) && (
                    <div className="col-span-full">
                      <p className="text-gray-500 text-sm">No specific recommendations at this time.</p>
                      <Button 
                        variant="outline" 
                        className="mt-3"
                        href="/dashboard/resources"
                      >
                        Browse All Resources
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Question Analysis Tab */}
        {activeTabIndex === 1 && (
          <div>
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Question Analysis</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Review your answers and see the correct solutions
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={toggleShowAllQuestions}
                >
                  {showAllQuestions ? 'Show Incorrect Only' : 'Show All Questions'}
                </Button>
              </div>
              
              <div className="divide-y divide-gray-200">
                {testResults.questions && 
                  (showAllQuestions
                    ? testResults.questions
                    : testResults.questions.filter(q => !q.is_correct)
                  ).map((question, index) => (
                    <div key={index} className="p-6">
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                          question.is_correct 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {question.is_correct ? <IconCheck size={16} /> : <IconX size={16} />}
                        </div>
                        <div className="ml-3 flex-1">
                          <h3 className="text-base font-medium text-gray-900">
                            {question.question_text}
                          </h3>
                          
                          {/* Question details */}
                          <div className="mt-3 space-y-3">
                            {question.options && question.options.map((option, optIndex) => {
                              const isSelected = Array.isArray(question.user_answer)
                                ? question.user_answer.includes(option.id)
                                : question.user_answer === option.id;
                                
                              const isCorrect = Array.isArray(question.correct_answer)
                                ? question.correct_answer.includes(option.id)
                                : question.correct_answer === option.id;
                                
                              return (
                                <div 
                                  key={optIndex}
                                  className={`flex items-start p-3 border rounded-md ${
                                    isSelected && isCorrect
                                      ? 'bg-green-50 border-green-200'
                                      : isSelected && !isCorrect
                                        ? 'bg-red-50 border-red-200'
                                        : !isSelected && isCorrect
                                          ? 'bg-blue-50 border-blue-200'
                                          : 'border-gray-200'
                                  }`}
                                >
                                  <div className={`flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-sm mr-3 ${
                                    isSelected
                                      ? isCorrect
                                        ? 'bg-green-500 text-white'
                                        : 'bg-red-500 text-white'
                                      : isCorrect
                                        ? 'bg-blue-100 text-blue-600 border border-blue-300'
                                        : 'border border-gray-300'
                                  }`}>
                                    {isSelected && (isCorrect ? <IconCheck size={12} /> : <IconX size={12} />)}
                                    {!isSelected && isCorrect && <IconCheck size={12} />}
                                  </div>
                                  <div className="flex-1">
                                    <p className={`${
                                      isCorrect
                                        ? 'text-gray-900 font-medium'
                                        : 'text-gray-700'
                                    }`}>
                                      {option.text}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          
                          {/* Explanation */}
                          {question.explanation && (
                            <div className="mt-4 bg-gray-50 p-3 rounded-md">
                              <h4 className="text-sm font-medium text-gray-900 mb-1">Explanation</h4>
                              <p className="text-sm text-gray-700">
                                {question.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                }
                
                {/* Empty state */}
                {(!testResults.questions || testResults.questions.length === 0 || 
                  (!showAllQuestions && testResults.questions.filter(q => !q.is_correct).length === 0)) && (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">
                      {!showAllQuestions 
                        ? 'You answered all questions correctly! No incorrect answers to show.'
                        : 'No questions available for this test attempt.'}
                    </p>
                    {!showAllQuestions && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="mt-3"
                        onClick={toggleShowAllQuestions}
                      >
                        Show All Questions
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Topic Breakdown Tab */}
        {activeTabIndex === 2 && (
          <div>
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Topic Breakdown</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Performance analysis by subject area
                </p>
              </div>
              
              <div className="p-6">
                {testResults.topics && testResults.topics.length > 0 ? (
                  <div className="space-y-6">
                    {testResults.topics.map((topic, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="text-sm font-medium text-gray-900">{topic.name}</h3>
                          <span className={`text-sm font-medium ${
                            topic.score >= 70 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {topic.score}%
                          </span>
                        </div>
                        
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
                          <div 
                            className={`h-full rounded-full ${
                              topic.score >= 70 ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${topic.score}%` }}
                          ></div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
                          <div>
                            <span className="font-medium">Correct: </span>
                            {topic.correct_count}/{topic.total_count} ({Math.round((topic.correct_count / topic.total_count) * 100)}%)
                          </div>
                          <div>
                            <span className="font-medium">Weight: </span>
                            {topic.weight}%
                          </div>
                          <div>
                            <span className="font-medium">Impact: </span>
                            {topic.impact}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No topic breakdown available for this test.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Topic Recommendations */}
            {testResults.topics && testResults.topics.length > 0 && (
              <div className="mt-6 bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Recommended Resources by Topic</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {testResults.topics
                      .filter(topic => topic.score < 70)
                      .sort((a, b) => a.score - b.score)
                      .map((topic, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">{topic.name}</h4>
                          <p className="text-sm text-gray-600 mb-4">
                            Focus on improving your knowledge of {topic.name.toLowerCase()} concepts to boost your overall score.
                          </p>
                          
                          {topic.resources && topic.resources.length > 0 ? (
                            <div className="space-y-2">
                              {topic.resources.map((resource, i) => (
                                <div key={i} className="flex items-start">
                                  <div className="flex-shrink-0 h-5 w-5 text-blue-500">
                                    <IconInfoCircle size={20} />
                                  </div>
                                  <div className="ml-2">
                                    <Link href={resource.link} className="text-sm text-blue-600 hover:underline">
                                      {resource.title}
                                    </Link>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              href={`/dashboard/resources?search=${encodeURIComponent(topic.name)}`}
                            >
                              Find Resources
                            </Button>
                          )}
                        </div>
                      ))}
                    
                    {testResults.topics.filter(topic => topic.score < 70).length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-gray-500 text-sm">
                          Great job! You performed well across all topics.
                        </p>
                        <Button 
                          variant="primary"
                          className="mt-3"
                          href="/dashboard/tests"
                        >
                          Try Another Test
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

TestResults.getLayout = getDashboardLayout;
