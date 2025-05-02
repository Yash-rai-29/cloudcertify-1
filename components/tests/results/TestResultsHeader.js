import { IconShare2, IconCalendar } from '@tabler/icons-react';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';

/**
 * Test Results Header Component
 * Displays test title, date, and sharing options
 */
const TestResultsHeader = ({ testResults, formatDate, onShare }) => {
  if (!testResults) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <div className="flex items-center mb-2">
            <h1 className="text-2xl font-bold text-gray-900 mr-3">
              {testResults.test_title || 'Test Results'}
            </h1>
            <Badge variant={testResults.mode === 'practice' ? 'blue' : 'purple'}>
              {testResults.mode || 'Practice'} Mode
            </Badge>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <IconCalendar size={16} className="mr-1" />
            {formatDate(testResults.completed_at || testResults.start_time)}
          </div>
        </div>
        
        <Button
          variant="outline"
          leftIcon={<IconShare2 size={16} />}
          onClick={onShare}
          className="mt-3 md:mt-0"
        >
          Share Results
        </Button>
      </div>
    </div>
  );
};

export default TestResultsHeader;