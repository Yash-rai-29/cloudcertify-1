import { IconAlertCircle } from '@tabler/icons-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

/**
 * Confirmation modal shown when finishing a test
 */
const FinishTestModal = ({
  isOpen,
  onClose,
  onFinish,
  isSubmitting,
  mode,
  userAnswers,
  questionsLength
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isSubmitting && onClose()}
      title=""
      size="md"
    >
      <div className="p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <IconAlertCircle size={24} className="text-amber-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Are you sure you want to finish this test?
            </h3>
            <p className="text-gray-500 mb-4">
              {mode === 'exam' 
                ? 'You will not be able to return to the test after finishing. Your answers will be submitted and scored.'
                : 'Your progress will be saved and you\'ll be able to see your results.'}
            </p>
            
            {/* Show unanswered questions warning */}
            {Object.keys(userAnswers || {}).length < questionsLength && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">
                  <strong>Warning:</strong> You have {questionsLength - Object.keys(userAnswers || {}).length} unanswered questions.
                </p>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => !isSubmitting && onClose()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={onFinish}
                isLoading={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Finish Test'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FinishTestModal;
