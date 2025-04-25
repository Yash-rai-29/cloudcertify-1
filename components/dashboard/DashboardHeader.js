import { useState, useEffect, useRef } from 'react';
import { getDailyQuestion, trackUserActivity } from '../../utils/services/activityService';
import { FiChevronDown, FiBell, FiCalendar, FiFire } from 'react-icons/fi';
import QuestionModal from './QuestionModal';
import { showSuccess, showError } from '../../utils/toast';

/**
 * Dashboard Header component with improved functionality including streak display,
 * notifications, and profile dropdown
 * 
 * @param {Object} props - Component props
 * @param {Object} props.userData - User data from API
 * @param {Object} props.streak - User streak data
 * @param {Object} props.user - User object from auth context
 * @param {Function} props.onStreakUpdate - Handler for streak updates
 * @param {string} props.title - Page title
 */
export default function DashboardHeader({ 
  userData, 
  streak, 
  user,
  onStreakUpdate,
  title = 'Dashboard'
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [dailyQuestion, setDailyQuestion] = useState(null);
  const [questionAttempted, setQuestionAttempted] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    // Fetch daily question
    const fetchDailyQuestion = async () => {
      setLoading(true);
      try {
        const response = await getDailyQuestion();
        if (response.success) {
          setDailyQuestion(response.data.question);
          setQuestionAttempted(response.data.attempted || false);
        }
      } catch (error) {
        console.error('Error fetching daily question:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDailyQuestion();
    }
  }, [user]);

  // Close dropdown menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTakeQuestion = () => {
    if (questionAttempted) {
      showSuccess('You\'ve already answered today\'s question. Come back tomorrow!');
      return;
    }
    
    trackUserActivity('open_daily_question');
    setIsQuestionModalOpen(true);
  };

  const handleQuestionSuccess = (updatedStreak) => {
    setQuestionAttempted(true);
    if (onStreakUpdate && updatedStreak) {
      onStreakUpdate(updatedStreak);
    }

    // Show success message
    const streakMessage = updatedStreak?.current_streak > 1 
      ? `Your streak is now ${updatedStreak.current_streak} days!` 
      : 'Great job on your first daily question!';
      
    showSuccess(`Correct answer! ${streakMessage}`);
  };

  const handleQuestionError = (error) => {
    showError(error || 'There was a problem submitting your answer.');
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Title */}
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800">{title}</h1>

            {/* Right: User profile, streaks, and notifications */}
            <div className="flex items-center space-x-4">
              {/* Daily streak */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={handleTakeQuestion}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium shadow-sm 
                    ${questionAttempted 
                      ? 'bg-green-50 text-green-700 cursor-default'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                    }`}
                >
                  <FiFire className={`mr-1 ${questionAttempted ? 'text-green-500' : 'text-amber-500'}`} />
                  <span className="mr-1 font-semibold">
                    {streak?.current_streak || 0}
                  </span>
                  <span>
                    {questionAttempted ? 'Streak' : 'Take Question'}
                  </span>
                </button>
              </div>

              {/* Notifications dropdown */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
                  aria-label="Notifications"
                >
                  <FiBell size={20} className="text-gray-600" />
                </button>
                
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50 border">
                    <div className="px-4 py-2 border-b">
                      <h3 className="font-medium text-gray-800">Notifications</h3>
                    </div>
                    <div className="px-4 py-4 text-center text-gray-500">
                      No new notifications
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                  <FiChevronDown size={18} className="ml-1 text-gray-600" />
                </button>
                
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border">
                    <div className="px-4 py-2 border-b">
                      <div className="font-medium text-gray-800">
                        {user?.displayName || user?.email || 'User'}
                      </div>
                      {user?.email && (
                        <div className="text-xs text-gray-500 truncate">{user.email}</div>
                      )}
                    </div>
                    
                    <div className="px-4 py-2 border-b">
                      <div className="flex items-center">
                        <FiFire className="mr-2 text-amber-500" />
                        <span className="text-gray-500 text-sm">Current Streak: </span>
                        <span className="ml-1 font-medium text-gray-800">{streak?.current_streak || 0}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <FiCalendar className="mr-2 text-blue-500" />
                        <span className="text-gray-500 text-sm">Longest Streak: </span>
                        <span className="ml-1 font-medium text-gray-800">{streak?.longest_streak || 0}</span>
                      </div>
                    </div>
                    
                    <a 
                      href="/dashboard/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => trackUserActivity('header_view_profile')}
                    >
                      View Profile
                    </a>
                    <a 
                      href="/dashboard/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => trackUserActivity('header_view_settings')}
                    >
                      Settings
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Daily question modal */}
      {dailyQuestion && (
        <QuestionModal
          question={dailyQuestion}
          isOpen={isQuestionModalOpen}
          onClose={() => setIsQuestionModalOpen(false)}
          onSubmitSuccess={handleQuestionSuccess}
          onSubmitError={handleQuestionError}
        />
      )}
    </>
  );
}