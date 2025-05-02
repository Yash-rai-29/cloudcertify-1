import React, { useState } from 'react';
import { IconSchool, IconClock, IconCheck, IconExternalLink, IconAward } from '@tabler/icons-react';
import Button from '../ui/Button';

/**
 * Test mode selector component for choosing between Practice and Exam modes
 */
export default function TestModeSelector({ test, onSelectMode, onCancel }) {
  const [selectedMode, setSelectedMode] = useState(null);
  
  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
  };
  
  const handleContinue = () => {
    if (selectedMode) {
      onSelectMode(selectedMode);
    }
  };
  
  if (!test) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">{test.title}</h2>
          {test.cloud_provider && (
            <div className="flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
              {test.cloud_provider}
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
          <div className="flex items-center">
            <IconClock size={16} className="mr-1 text-gray-400" />
            <span>{test.duration} minutes</span>
          </div>
          <div className="flex items-center">
            <IconAward size={16} className="mr-1 text-gray-400" />
            <span>{test.difficulty || 'Expert'} level</span>
          </div>
          <div className="flex items-center">
            <IconExternalLink size={16} className="mr-1 text-gray-400" />
            <span>Official certification prep</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="p-6 border-b border-gray-200">
        <p className="text-gray-600">
          Choose a mode to start the {test.title} certification test. Practice Mode lets you learn at your own
          pace with explanations, while Exam Mode simulates the real test environment.
        </p>
      </div>
      
      {/* Mode Selection */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Practice Mode */}
          <div 
            className={`border rounded-lg p-5 cursor-pointer transition-all ${
              selectedMode === 'practice' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/30'
            }`}
            onClick={() => handleModeSelect('practice')}
          >
            <div className="flex items-center mb-4">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                selectedMode === 'practice' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-blue-500'
              }`}>
                <IconSchool size={20} />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Practice Mode</h3>
              </div>
              {selectedMode === 'practice' && (
                <div className="ml-auto">
                  <IconCheck className="text-blue-500" size={20} />
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              Learn at your own pace with detailed explanations and feedback.
            </p>
            
            <ul className="space-y-2">
              {[
                'Immediate answer feedback',
                'Detailed explanations',
                'Hints available',
                'No time limit'
              ].map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <IconCheck size={16} className="mr-2 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Exam Mode */}
          <div 
            className={`border rounded-lg p-5 cursor-pointer transition-all ${
              selectedMode === 'exam' 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/30'
            }`}
            onClick={() => handleModeSelect('exam')}
          >
            <div className="flex items-center mb-4">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                selectedMode === 'exam' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-purple-500'
              }`}>
                <IconClock size={20} />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Exam Mode</h3>
              </div>
              {selectedMode === 'exam' && (
                <div className="ml-auto">
                  <IconCheck className="text-purple-500" size={20} />
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              Simulate the real certification exam experience.
            </p>
            
            <ul className="space-y-2">
              {[
                `Timed environment (${test.duration} minutes)`,
                'Results only after completion',
                'Flag questions for review',
                'Performance analytics'
              ].map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <IconCheck size={16} className="mr-2 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          disabled={!selectedMode}
          onClick={handleContinue}
        >
          {selectedMode ? `Start ${selectedMode === 'practice' ? 'Practice' : 'Exam'}` : 'Select a mode to continue'}
        </Button>
      </div>
    </div>
  );
}
