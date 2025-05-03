import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconShare2, 
  IconArrowRight, 
  IconCalendar, 
  IconCheck, 
  IconX, 
  IconClock, 
  IconFileAnalytics, 
  IconArrowLeft,
  IconFilter,
  IconSearch,
  IconDownload,
  IconChevronDown,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconClipboard,
  IconChartPie,
  IconBulb,
  IconBooks
} from '@tabler/icons-react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

import { getDashboardLayout } from '../../../components/layouts/DashboardLayout';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { getTestAttemptDetails } from '../../../utils/services/testLibraryService';
import useToast from '../../../hooks/useToast';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function TestResults() {
  const router = useRouter();
  const { id: attemptId } = router.query;
  const { error, success } = useToast();
  
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [testResults, setTestResults] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [shareOpen, setShareOpen] = useState(false);
  const [topicExpanded, setTopicExpanded] = useState(false);
  
  // Load test results
  useEffect(() => {
    if (!attemptId) return;
    
    const fetchTestResults = async () => {
      setIsLoading(true);
      try {
        const response = await getTestAttemptDetails(attemptId);
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

  // Calculate topic performance
  const topicPerformance = useMemo(() => {
    if (!testResults?.attempted_questions) return {};
    
    const topicStats = {};
    
    testResults.attempted_questions.forEach(question => {
      // Split topics by comma and trim whitespace
      const topics = (question.topic || 'Uncategorized')
        .split(',')
        .map(topic => topic.trim());
      
      // Process each individual topic
      topics.forEach(topic => {
        if (!topicStats[topic]) {
          topicStats[topic] = { correct: 0, total: 0 };
        }
        
        topicStats[topic].total += 1;
        if (question.is_correct) {
          topicStats[topic].correct += 1;
        }
      });
    });
    
    // Calculate percentages
    Object.keys(topicStats).forEach(topic => {
      topicStats[topic].percentage = 
        (topicStats[topic].correct / topicStats[topic].total) * 100;
    });
    
    return topicStats;
  }, [testResults]);
  
  
  // Filtered questions based on tab and search
  const filteredQuestions = useMemo(() => {
    if (!testResults) return { displayed: [], total: 0 };
    
    const attempted = testResults.attempted_questions || [];
    const unattempted = testResults.unattempted_questions || [];
    
    let questions = [];
    
    if (activeTab === 'all') {
      questions = [...attempted, ...unattempted];
    } else if (activeTab === 'correct') {
      questions = attempted.filter(q => q.is_correct);
    } else if (activeTab === 'incorrect') {
      questions = attempted.filter(q => !q.is_correct);
    } else if (activeTab === 'unattempted') {
      questions = unattempted;
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      questions = questions.filter(q => 
        q.question_text.toLowerCase().includes(query) || 
        q.topic?.toLowerCase().includes(query)
      );
    }
    
    return { 
      displayed: questions,
      total: questions.length 
    };
  }, [testResults, activeTab, searchQuery]);
  
  // Chart data
  const chartData = useMemo(() => {
    if (!testResults) return null;
    
    const scoreData = {
      labels: ['Correct', 'Incorrect', 'Unattempted'],
      datasets: [
        {
          data: [
            testResults.correct_answers || 0,
            testResults.wrong_answers || 0,
            (testResults.unattempted_questions?.length || 0)
          ],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(148, 163, 184, 0.8)'
          ],
          borderColor: [
            'rgba(34, 197, 94, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(148, 163, 184, 1)'
          ],
          borderWidth: 1,
        },
      ],
    };
    
    const topicData = {
      labels: Object.keys(topicPerformance),
      datasets: [
        {
          label: 'Score by Topic (%)',
          data: Object.values(topicPerformance).map(t => t.percentage),
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        },
      ],
    };
    
    return { scoreData, topicData };
  }, [testResults, topicPerformance]);
  
  // Format helper functions
  const formatPercentage = (value) => {
    if (typeof value !== 'number') return '0';
    return Math.round(value * 100);
  };
  
  const formatTimeTaken = (seconds) => {
    if (!seconds) return '0s';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (minutes === 0) {
      return `${remainingSeconds}s`;
    } else if (remainingSeconds === 0) {
      return `${minutes}m`;
    } else {
      return `${minutes}m ${remainingSeconds}s`;
    }
  };
  
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    return format(new Date(timestamp * 1000), 'MMM d, yyyy h:mm a');
  };
  
  // Handle share results
  const handleShare = (platform = 'copy') => {
    const url = window.location.href;
    const shareText = `Check out my results for ${testResults.test_title}! I scored ${formatPercentage(testResults.score)}%`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        break;
      case 'native':
        if (navigator.share) {
          navigator.share({
            title: `${testResults.test_title} Results`,
            text: shareText,
            url: url,
          }).catch(err => console.error('Error sharing:', err));
        }
        break;
      case 'copy':
      default:
        navigator.clipboard.writeText(url).then(() => {
          success('Link copied to clipboard');
          setTimeout(() => setShareOpen(false), 1500);
        }).catch(err => {
          console.error('Error copying link:', err);
          error('Failed to copy link');
        });
    }
  };
  
  // Handle export as PDF
  const handleExportPDF = () => {
    // Implementation would go here - typically using a library like jsPDF
    success('Results will be downloaded as PDF');
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700">Loading your results...</h3>
          <p className="text-gray-500 mt-2">Just a moment while we analyze your performance</p>
        </div>
      </div>
    );
  }
  
  // Error or no test results
  if (!testResults) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <IconX className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Results Not Available</h2>
          <p className="text-gray-500 mb-6">We couldn't find the test results you're looking for. The test may have been deleted or you don't have access to it.</p>
          <Button 
            onClick={() => router.push('/dashboard/tests')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-all"
          >
            Return to Tests
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>{testResults.test_title} Results | Cloud Certify</title>
        <meta name="description" content={`Test results for ${testResults.test_title}`} />
      </Head>
      
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen pb-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Back button */}
          <button 
            onClick={() => router.push('/dashboard/tests')}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <IconArrowLeft size={18} className="mr-1" />
            <span>Back to Tests</span>
          </button>
          
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                    {testResults.test_title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-2 text-gray-500 mt-2">
                    <div className="flex items-center">
                      <IconCalendar size={16} className="mr-1" />
                      <span className="text-sm">{formatDate(testResults.end_time)}</span>
                    </div>
                    
                    <span className="text-gray-300">|</span>
                    
                    <div className="flex items-center">
                      <IconClock size={16} className="mr-1" />
                      <span className="text-sm">
                        {formatTimeTaken(testResults.total_time_taken)}
                      </span>
                    </div>

                    <span className="text-gray-300">|</span>
                    
                    <Badge 
                      className={`${
                        testResults.mode === 'practice' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-purple-100 text-purple-800'
                      } text-xs px-2.5 py-1 rounded-full`}
                    >
                      {testResults.mode === 'practice' ? 'Practice' : 'Exam'} Mode
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <div className="relative">
                    <Button
                      onClick={() => setShareOpen(!shareOpen)}
                      variant="outline"
                      className="border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg py-2 px-3 flex items-center"
                    >
                      <IconShare2 size={18} className="mr-1.5" />
                      Share
                    </Button>
                    
                    {/* Share dropdown */}
                    <AnimatePresence>
                      {shareOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-1 border border-gray-100"
                        >
                          <button 
                            onClick={() => handleShare('copy')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <IconClipboard size={16} className="mr-2" />
                            Copy Link
                          </button>
                          <button 
                            onClick={() => handleShare('twitter')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <IconBrandTwitter size={16} className="mr-2" />
                            Twitter
                          </button>
                          <button 
                            onClick={() => handleShare('linkedin')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <IconBrandLinkedin size={16} className="mr-2" />
                            LinkedIn
                          </button>
                          {navigator.share && (
                            <button 
                              onClick={() => handleShare('native')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <IconShare2 size={16} className="mr-2" />
                              Share...
                            </button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <Button
                    onClick={handleExportPDF}
                    variant="outline"
                    className="border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg py-2 px-3 flex items-center"
                  >
                    <IconDownload size={18} className="mr-1.5" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Score Summary Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Score Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden lg:col-span-1">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Overall Score</h2>
                
                <div className="flex flex-col items-center justify-center">
                  <div className="relative mb-2">
                    <div className="w-40 h-40 flex items-center justify-center">
                      {chartData && <Doughnut data={chartData.scoreData} options={{ cutout: '75%', plugins: { legend: { display: false } } }} />}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-4xl font-bold text-gray-800">{testResults.score}%</span>
                      <span className="text-sm text-gray-500 mt-1">Overall Score</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 w-full mt-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center w-8 h-8 mx-auto rounded-full bg-green-100">
                        <IconCheck size={16} className="text-green-600" />
                      </div>
                      <div className="mt-1 text-sm font-medium text-gray-700">{testResults.correct_answers}</div>
                      <div className="text-xs text-gray-500">Correct</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center w-8 h-8 mx-auto rounded-full bg-red-100">
                        <IconX size={16} className="text-red-600" />
                      </div>
                      <div className="mt-1 text-sm font-medium text-gray-700">{testResults.wrong_answers}</div>
                      <div className="text-xs text-gray-500">Incorrect</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center w-8 h-8 mx-auto rounded-full bg-gray-100">
                        <IconMinus size={16} className="text-gray-600" />
                      </div>
                      <div className="mt-1 text-sm font-medium text-gray-700">{testResults.unattempted_questions?.length || 0}</div>
                      <div className="text-xs text-gray-500">Skipped</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Test Details Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Details</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                      <IconFileAnalytics size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium text-gray-800">{testResults.category || 'General'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                      <IconClock size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time Taken</p>
                      <p className="font-medium text-gray-800">{formatTimeTaken(testResults.total_time_taken)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                      <IconBulb size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Difficulty</p>
                      <p className="font-medium text-gray-800 capitalize">{testResults.difficulty || 'Intermediate'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                      <IconChartPie size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Avg. Time per Question</p>
                      <p className="font-medium text-gray-800">{formatTimeTaken(testResults.avg_time_per_question)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Topic Performance Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Topic Performance</h2>
                  <button 
                    onClick={() => setTopicExpanded(!topicExpanded)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    {topicExpanded ? 'Show Chart' : 'Show Details'}
                    <IconChevronDown size={16} className={`ml-1 transform transition-transform ${topicExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                
                <AnimatePresence mode="wait">
                  {!topicExpanded ? (
                    <motion.div 
                      key="chart"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-[250px] flex items-center justify-center"
                    >
                      {chartData && Object.keys(topicPerformance).length > 0 ? (
                        <Bar 
                          data={chartData.topicData} 
                          options={{
                            indexAxis: 'y',
                            scales: {
                              x: {
                                beginAtZero: true,
                                max: 100,
                                title: {
                                  display: true,
                                  text: 'Score (%)'
                                }
                              }
                            },
                            plugins: {
                              legend: {
                                display: false
                              }
                            },
                            maintainAspectRatio: false
                          }} 
                        />
                      ) : (
                        <div className="text-center text-gray-500">
                          <IconBooks size={32} className="mx-auto mb-2 text-gray-400" />
                          <p>No topic data available</p>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="details"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3 max-h-[250px] overflow-y-auto pr-2"
                    >
                      {Object.keys(topicPerformance).length > 0 ? (
                        Object.entries(topicPerformance).map(([topic, data]) => (
                          <div key={topic} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium text-gray-700">{topic}</span>
                              <span className="text-sm font-semibold">
                                {data.correct}/{data.total} ({Math.round(data.percentage)}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="h-2.5 rounded-full" 
                                style={{ 
                                  width: `${data.percentage}%`,
                                  backgroundColor: data.percentage >= 70 ? '#22c55e' : data.percentage >= 40 ? '#f59e0b' : '#ef4444'
                                }}
                              ></div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-6">
                          <IconBooks size={32} className="mx-auto mb-2 text-gray-400" />
                          <p>No topic data available</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          {/* Questions Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                <h2 className="text-xl font-semibold text-gray-800">Questions Review</h2>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  {/* Search input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search questions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-48 pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    />
                    <IconSearch size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  
                  {/* Tab filter */}
                  <div className="flex rounded-lg overflow-hidden border border-gray-300">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-3 py-2 text-sm ${
                        activeTab === 'all' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setActiveTab('correct')}
                      className={`px-3 py-2 text-sm ${
                        activeTab === 'correct' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Correct
                    </button>
                    <button
                      onClick={() => setActiveTab('incorrect')}
                      className={`px-3 py-2 text-sm ${
                        activeTab === 'incorrect' 
                          ? 'bg-red-600 text-white' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Incorrect
                    </button>
                    <button
                      onClick={() => setActiveTab('unattempted')}
                      className={`px-3 py-2 text-sm ${
                        activeTab === 'unattempted' 
                          ? 'bg-gray-600 text-white' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Skipped
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Question count display */}
              <p className="text-sm text-gray-500 mb-4">
                Showing {filteredQuestions.total} {filteredQuestions.total === 1 ? 'question' : 'questions'}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
              
              {/* Questions list */}
              {filteredQuestions.displayed.length > 0 ? (
                <div className="space-y-4">
                  {filteredQuestions.displayed.map((question, index) => (
                    <QuestionCard 
                      key={question.question_id}
                      question={question}
                      number={index + 1}
                      isAttempted={'selected_option' in question}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <IconSearch size={40} className="mx-auto mb-3 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-700">No questions found</h3>
                  <p className="text-gray-500 mt-1">Try adjusting your filters or search terms</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Actions Section */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/dashboard/tests')}
              className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-lg"
            >
              <IconArrowLeft size={18} className="mr-1.5" />
              Back to Tests
            </Button>
            
            <Button
              size="lg"
              onClick={() => router.push(`/dashboard/tests?practice=${testResults.test_id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg"
            >
              Practice Again
              <IconArrowRight size={18} className="ml-1.5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

// Question Card Component
function QuestionCard({ question, number, isAttempted }) {
  const [expanded, setExpanded] = useState(false);
  
  const statusBadge = () => {
    if (!isAttempted) {
      return <Badge className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">Skipped</Badge>;
    }
    
    return question.is_correct ? 
      <Badge className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">Correct</Badge> : 
      <Badge className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded">Incorrect</Badge>;
  };
  
  return (
    <div className={`border rounded-lg overflow-hidden transition-all ${
      isAttempted 
        ? question.is_correct 
          ? 'border-green-200 bg-green-50' 
          : 'border-red-200 bg-red-50'
        : 'border-gray-200 bg-gray-50'
    }`}>
      <div 
        className={`p-4 cursor-pointer flex justify-between items-start`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <div className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white border text-xs flex items-center justify-center mr-3">
              {number}
            </span>
            <div>
  <div className="mb-1 flex items-center gap-2 flex-wrap">
    {statusBadge()}
    
    {question.topic && question.topic.split(',').map((topic, index) => (
      <Badge
        key={index}
        className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded"
      >
        {topic.trim()}
      </Badge>
    ))}
    
    {isAttempted && question.time_taken !== undefined && question.time_taken !== null && (
      <span className="text-xs text-gray-500 flex items-center">
        <IconClock size={12} className="mr-1" />
        {question.time_taken}s
      </span>
    )}
  </div>

  <div 
    className="text-gray-800 font-medium"
    dangerouslySetInnerHTML={{ __html: question.question_text }}
  />
</div>

          </div>
        </div>
        <IconChevronDown 
          size={20} 
          className={`text-gray-400 transform transition-transform flex-shrink-0 ml-3 ${expanded ? 'rotate-180' : ''}`} 
        />
      </div>
      
      {expanded && (
        <div className="border-t px-4 py-3 bg-white">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Options:</p>
            <div className="space-y-2 pl-3">
              {Object.entries(question.options).map(([key, value]) => {
                const isSelectedOption = isAttempted && 
                  (Array.isArray(question.selected_option) 
                    ? question.selected_option.includes(key)
                    : question.selected_option === key);
                    
                const isCorrectOption = question.correct_option === key || 
                  (Array.isArray(question.correct_option) && question.correct_option.includes(key));
                
                return (
                  <div 
                    key={key}
                    className={`flex items-start p-2 rounded ${
                      isCorrectOption 
                        ? 'bg-green-100' 
                        : isSelectedOption && !isCorrectOption 
                          ? 'bg-red-100' 
                          : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex-shrink-0 mr-2">
                      {isCorrectOption ? (
                        <IconCheck size={16} className="text-green-600 mt-0.5" />
                      ) : isSelectedOption ? (
                        <IconX size={16} className="text-red-600 mt-0.5" />
                      ) : (
                        <span className="w-4 h-4 block" />
                      )}
                    </div>
                    <span 
                      className={`text-sm ${
                        isCorrectOption 
                          ? 'text-green-800' 
                          : isSelectedOption && !isCorrectOption 
                            ? 'text-red-800' 
                            : 'text-gray-700'
                      }`}
                      dangerouslySetInnerHTML={{ __html: value }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          
          {question.explanation && (
            <div className="mt-3 bg-blue-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-1">Explanation:</p>
              <div 
                className="text-sm text-blue-700"
                dangerouslySetInnerHTML={{ __html: question.explanation }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Missing icon component (for skipped questions)
function IconMinus(props) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={props.size || 24} 
      height={props.size || 24} 
      viewBox="0 0 24 24" 
      strokeWidth="2" 
      stroke="currentColor" 
      fill="none" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M5 12l14 0"></path>
    </svg>
  );
}

TestResults.getLayout = getDashboardLayout;
