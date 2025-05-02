import React from 'react';
import Link from 'next/link';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { IconClock, IconUsers, IconChartBar, IconArrowRight } from '@tabler/icons-react';

/**
 * Test card component for the test library
 */
export default function TestCard({ test, onStartTest }) {
  // Function to get difficulty badge
  const getDifficultyBadge = (difficulty) => {
    if (!difficulty) return null;
    
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return <Badge variant="green">Beginner</Badge>;
      case 'intermediate':
        return <Badge variant="amber">Intermediate</Badge>;
      case 'expert':
        return <Badge variant="red">Expert</Badge>;
      default:
        return <Badge>{difficulty}</Badge>;
    }
  };

  // Format icons based on cloud provider
  const getCloudProviderIcon = (provider) => {
    if (!provider) return null;
    
    switch (provider.toLowerCase()) {
      case 'gcp':
        return (
          <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm p-1">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="#4285F4" d="M12 8.5v7l5.5-3.5z"/>
              <path fill="#EA4335" d="M12 8.5l-5.5 3.5 5.5 3.5z"/>
              <path fill="#FBBC05" d="M6.5 12l3-2.5-3-2.5z"/>
              <path fill="#34A853" d="M17.5 7V2L12 6.5z"/>
              <path fill="#1A73E8" d="M17.5 17v5L12 17.5z"/>
            </svg>
          </div>
        );
      case 'aws':
        return (
          <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm p-1">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="#FF9900" d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.128-1.036-.39-1.284-.272-.24-.775-.367-1.509-.367-.327 0-.659.04-.998.112-.338.072-.669.16-.99.272a2.66 2.66 0 0 1-.376.128.497.497 0 0 1-.128.024c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.621.621 0 0 1 .224-.167c.279-.144.614-.264 1.005-.368A4.76 4.76 0 0 1 6.23 5c.75 0 1.302.136 1.654.415.352.271.535.726.535 1.357v3.263h.344zm-3.24.639c.264 0 .535-.048.813-.144.279-.096.527-.271.734-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 5.997 5.997 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.87.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.32L7.586 6.247c-.048-.16-.08-.28-.104-.36-.016-.08-.024-.16-.024-.239 0-.24.127-.367.39-.367h.783c.151 0 .255.025.31.073.065.048.113.16.16.32l1.342 5.284 1.245-5.284c.04-.16.088-.272.152-.32a.549.549 0 0 1 .32-.073h.638c.152 0 .256.025.32.073.063.048.12.16.151.32l1.261 5.348 1.381-5.348c.048-.16.104-.272.16-.32a.573.573 0 0 1 .311-.073h.743c.263 0 .39.127.39.367 0 .072-.008.152-.024.24-.016.079-.048.199-.104.36l-1.923 4.89c-.048.16-.104.272-.168.32-.064.048-.16.08-.304.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.12-.16-.151-.32l-1.238-5.148-1.229 5.14c-.04.16-.088.272-.152.328-.064.056-.177.08-.328.08h-.687zm10.56.064c-.327 0-.643-.048-.941-.144-.3-.096-.534-.2-.695-.32-.096-.071-.16-.152-.2-.232a.55.55 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.047.016.12.048.2.08.271.12.566.215.878.296.319.08.63.12.942.12.5 0 .878-.088 1.157-.264.279-.176.415-.428.415-.75 0-.224-.071-.407-.216-.55-.143-.143-.415-.271-.813-.384l-1.157-.36c-.583-.175-1.014-.415-1.277-.717-.263-.311-.39-.67-.39-1.077 0-.311.07-.587.2-.83.127-.244.31-.455.535-.63.224-.176.486-.312.789-.415.295-.104.616-.151.982-.151.175 0 .35.008.535.032.191.024.367.056.535.096.167.04.327.088.471.144.151.056.27.12.367.184a.73.73 0 0 1 .215.224.533.533 0 0 1 .073.271v.375c0 .167-.064.255-.191.255a.864.864 0 0 1-.303-.096 3.717 3.717 0 0 0-1.676-.311c-.439 0-.79.071-1.045.223-.255.152-.383.375-.383.686 0 .216.08.399.24.55.159.152.454.28.877.384l1.134.358c.574.184.989.44 1.26.767.271.327.399.702.399 1.117 0 .324-.071.616-.216.886-.143.27-.335.495-.59.686-.248.191-.55.343-.877.447-.327.104-.7.16-1.094.16zM2 15.647V19.5h20v-3.853H2z"/>
            </svg>
          </div>
        );
      case 'azure':
        return (
          <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm p-1">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="#0078D4" d="M16.58 8.09l-4.95-7.66A.59.59 0 0 0 11 0H5.5a.45.45 0 0 0-.39.24.45.45 0 0 0 0 .48l11.67 20.47a.45.45 0 0 0 .4.24.53.53 0 0 0 .23 0 .44.44 0 0 0 .22-.38V8.89c0-.08 0-.08-.05-.8Z"/>
              <path fill="#0078D4" d="M14.77 9.35 8.8.77A.46.46 0 0 0 8.41.5H2.5a.46.46 0 0 0-.4.23.47.47 0 0 0 0 .49l9.58 16.18.73 1.33a.48.48 0 0 0 .4.24h6.53a.47.47 0 0 0 .4-.7.46.46 0 0 0 0-.48Z"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
            <IconChartBar size={24} className="text-gray-500" />
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
      {/* Card Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between">
          <div className="flex-1">
            <div className="flex space-x-2 mb-2">
              {getDifficultyBadge(test.difficulty)}
              {test.cloud_provider && (
                <Badge variant="blue">{test.cloud_provider}</Badge>
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 line-clamp-2">{test.title}</h3>
          </div>
          <div className="ml-4 flex-shrink-0">
            {getCloudProviderIcon(test.cloud_provider)}
          </div>
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-5 flex-1">
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {test.description || 'Test your knowledge with this certification practice test.'}
        </p>
        
        {/* Test Details */}
        <div className="flex items-center mt-4 text-sm text-gray-500">
          <div className="flex items-center mr-4">
            <IconClock size={16} className="mr-1 text-gray-400" />
            <span>{test.duration} min</span>
          </div>
          <div className="flex items-center">
            <IconUsers size={16} className="mr-1 text-gray-400" />
            <span>{test.total_questions} questions</span>
          </div>
        </div>
        
        {/* Topics */}
        {test.topic && test.topic.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-1">
              {test.topic.slice(0, 3).map((topic, index) => (
                <span key={index} className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                  {topic}
                </span>
              ))}
              {test.topic.length > 3 && (
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                  +{test.topic.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Card Footer */}
      <div className="p-5 border-t border-gray-100 mt-auto">
        <Button
          fullWidth
          variant="primary"
          onClick={() => onStartTest(test.id)}
          rightIcon={<IconArrowRight size={16} />}
        >
          Start Test
        </Button>
      </div>
    </div>
  );
}
