import React from 'react';
import { FiBarChart2 } from 'react-icons/fi';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

/**
 * Get difficulty colors for badge
 */
const getDifficultyVariant = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'beginner': return 'green';
    case 'intermediate': return 'blue';
    case 'advanced': return 'purple';
    case 'expert': return 'red';
    default: return 'default';
  }
};

/**
 * Get recommendation type badge variant
 */
const getRecommendationVariant = (type) => {
  switch (type?.toLowerCase()) {
    case 'personalized': return 'indigo';
    case 'popular': return 'amber';
    case 'new': return 'emerald';
    default: return 'default';
  }
};

/**
 * Test Recommendation Card component
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Test title
 * @param {string} props.category - Test category
 * @param {string} props.difficulty - Test difficulty level
 * @param {string} props.recommendationType - Recommendation type
 * @param {number} props.popularityScore - Test popularity score
 * @param {function} props.onStartTest - Handler for starting test
 */
const TestRecommendationCard = ({
  title,
  category,
  difficulty,
  recommendationType,
  popularityScore,
  onStartTest,
  className = '',
  ...props
}) => {
  return (
    <div 
      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      {...props}
    >
      <h3 className="font-medium text-gray-800 mb-1">{title}</h3>
      
      <div className="flex flex-wrap items-center gap-2 mt-2 mb-3">
        <Badge variant="blue" size="sm">
          {category}
        </Badge>
        
        {difficulty && (
          <Badge variant={getDifficultyVariant(difficulty)} size="sm">
            {difficulty}
          </Badge>
        )}
        
        {recommendationType && (
          <Badge variant={getRecommendationVariant(recommendationType)} size="sm">
            {recommendationType}
          </Badge>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <FiBarChart2 size={14} />
            {popularityScore?.toFixed(1) || 'N/A'} popularity
          </span>
        </div>
        
        <Button
          variant="primary"
          size="sm"
          onClick={onStartTest}
        >
          Start Test
        </Button>
      </div>
    </div>
  );
};

export default TestRecommendationCard;