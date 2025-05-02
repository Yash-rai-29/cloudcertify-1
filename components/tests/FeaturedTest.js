import React from 'react';
import { IconClock, IconUsers, IconArrowRight, IconStar } from '@tabler/icons-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

/**
 * Featured test card for displaying in the test library
 */
export default function FeaturedTest({ test, type = 'featured', onStartTest }) {
  if (!test) return null;
  
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
  
  // Background gradient based on type (featured or popular)
  const getBackgroundClass = () => {
    return type === 'featured' 
      ? 'bg-gradient-to-r from-blue-600 to-indigo-700'
      : 'bg-gradient-to-r from-amber-500 to-orange-600';
  };
  
  // Badge label based on type
  const getTypeLabel = () => {
    return type === 'featured' ? 'Featured' : 'Most Popular';
  };

  // Icon based on type
  const getTypeIcon = () => {
    return type === 'featured' 
      ? <IconStar size={16} className="mr-1" />
      : <IconUsers size={16} className="mr-1" />;
  };
  
  return (
    <div className={`rounded-xl overflow-hidden shadow-md ${getBackgroundClass()}`}>
      <div className="p-6 text-white">
        {/* Badge */}
        <div className="mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white bg-opacity-25 text-white">
            {getTypeIcon()}
            {getTypeLabel()}
          </span>
        </div>
        
        {/* Title and Info */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">{test.title}</h2>
          <p className="text-white text-opacity-90 line-clamp-2">{test.description}</p>
        </div>
        
        {/* Details */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center text-white text-opacity-90">
            <IconClock size={18} className="mr-1" />
            <span>{test.duration} min</span>
          </div>
          <div className="flex items-center text-white text-opacity-90">
            <IconUsers size={18} className="mr-1" />
            <span>{test.total_questions} questions</span>
          </div>
          {test.difficulty && (
            <div className="flex items-center">
              {getDifficultyBadge(test.difficulty)}
            </div>
          )}
          {test.cloud_provider && (
            <div>
              <Badge variant="blue">{test.cloud_provider}</Badge>
            </div>
          )}
        </div>
        
        {/* Button */}
        <Button
          variant="white"
          className="w-full sm:w-auto"
          onClick={() => onStartTest(test.id)}
          rightIcon={<IconArrowRight size={16} />}
        >
          Start Preparation
        </Button>
      </div>
    </div>
  );
}
