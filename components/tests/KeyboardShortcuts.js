import { memo } from 'react';

/**
 * KeyboardShortcuts component - Displays keyboard shortcuts for test navigation
 */
const KeyboardShortcuts = () => {
  return (
    <div className="mt-4 bg-white rounded-lg shadow p-4">
      <div className="text-sm text-gray-600">
        <p className="font-medium mb-2">Keyboard shortcuts:</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center">
            <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs mr-2">←</span>
            <span>Previous question</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs mr-2">→</span>
            <span>Next question</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs mr-2">F</span>
            <span>Flag/unflag question</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs mr-2">1-4</span>
            <span>Select answer option</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(KeyboardShortcuts);
