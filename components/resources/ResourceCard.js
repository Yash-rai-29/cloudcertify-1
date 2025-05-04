import { useState } from 'react';
import Link from 'next/link';
import { IconExternalLink, IconHeart, IconEye } from '@tabler/icons-react';
import Badge from '../ui/Badge';
import { toggleResourceLike, incrementResourceView } from '../../utils/services/resourcesService';

/**
 * Resource card component displaying a single learning resource
 */
export const ResourceCard = ({ resource, onLikeToggle }) => {
  const [isLiked, setIsLiked] = useState(resource.is_liked || false);
  const [likeCount, setLikeCount] = useState(resource.likes || 0);
  const [viewCount, setViewCount] = useState(resource.views || 0);
  const [isLoadingLike, setIsLoadingLike] = useState(false);

  const handleLikeToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoadingLike) return;
    
    setIsLoadingLike(true);
    
    try {
      const response = await toggleResourceLike(resource.id);
      
      if (response.success) {
        setIsLiked(response.data.is_liked);
        setLikeCount(response.data.likes);
        
        // Callback to update parent state if needed
        if (onLikeToggle) {
          onLikeToggle(resource.id, response.data.is_liked, response.data.likes);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoadingLike(false);
    }
  };

  const handleResourceOpen = async () => {
    try {
      const response = await incrementResourceView(resource.id);
      
      if (response.success) {
        setViewCount(response.data.views);
      }
    } catch (error) {
      console.error('Error incrementing view:', error);
    }
  };

  // Format created_at date
  const formattedDate = resource.created_at 
    ? formatDate(new Date(resource.created_at * 1000))
    : 'N/A';

  // Trim description if too long
  const trimmedDescription = resource.description && resource.description.length > 120
    ? `${resource.description.substring(0, 120)}...`
    : resource.description;

  // Handle resource type badge color
  const getResourceTypeBadge = (type) => {
    if (!type) return <Badge>Other</Badge>;
    
    switch (type.toLowerCase()) {
      case 'video':
        return <Badge variant="red">{type}</Badge>;
      case 'article':
        return <Badge variant="blue">{type}</Badge>;
      case 'tutorial':
        return <Badge variant="green">{type}</Badge>;
      case 'documentation':
        return <Badge variant="purple">{type}</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="h-full flex flex-col rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {resource.thumbnail && (
        <div className="h-48 overflow-hidden relative">
          <img 
            src={resource.thumbnail} 
            alt={resource.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/placeholder-resource.jpg';
            }}
          />
          {resource.certification && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
              {resource.certification}
            </div>
          )}
        </div>
      )}
      
      <div className="flex-1 p-5">
        <div className="flex justify-between items-start mb-2">
          {getResourceTypeBadge(resource.resource_type)}
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleLikeToggle}
              className={`flex items-center focus:outline-none ${isLoadingLike ? 'opacity-50' : ''}`}
              disabled={isLoadingLike}
            >
              <div className="transform active:scale-110 transition-transform">
                <IconHeart 
                  size={18} 
                  className={`${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
                />
              </div>
              <span className="ml-1 text-sm text-gray-500">{likeCount}</span>
            </button>
            <div className="flex items-center">
              <IconEye size={18} className="text-gray-400" />
              <span className="ml-1 text-sm text-gray-500">{viewCount}</span>
            </div>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{trimmedDescription}</p>
        
        <div className="mt-auto">
          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap mb-3 gap-1">
              {resource.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
              {resource.tags.length > 3 && (
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                  +{resource.tags.length - 3}
                </span>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-500">{formattedDate}</span>
            <Link
              href={resource.file_url || resource.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleResourceOpen}
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Open Resource
              <IconExternalLink size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format dates
function formatDate(date) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${month} ${day}, ${year}`;
}

export default ResourceCard;
