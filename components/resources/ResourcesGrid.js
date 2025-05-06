import { useEffect, useRef, useState } from 'react';
import ResourceCard from './ResourceCard';
import { IconExternalLink, IconHeart, IconEye } from '@tabler/icons-react';
import { toggleResourceLike, incrementResourceView } from '../../utils/services/resourcesService';

/**
 * Grid layout for displaying resources with infinite scroll
 */
export default function ResourcesGrid({ 
  resources, 
  isLoading, 
  hasMore, 
  onLoadMore,
  onLikeToggle,
  viewMode = 'grid' // 'grid' or 'list'
}) {
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoading, hasMore, onLoadMore]);

  if (!resources.length && !isLoading) {
    return null; // Empty state is now handled in the parent component
  }

  // Helper function to format dates
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = new Date(timestamp * 1000);
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${month} ${day}, ${year}`;
  };

  // List View Component
  const ResourceListItem = ({ resource }) => {
    const [isLiked, setIsLiked] = useState(resource.is_liked || false);
    const [likeCount, setLikeCount] = useState(resource.likes || 0);
    const [viewCount, setViewCount] = useState(resource.views || 0);
    
    const handleLikeToggle = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
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
    
    // Truncate description to 100 characters
    const truncatedDescription = resource.description 
      ? resource.description.length > 100 
        ? `${resource.description.substring(0, 100)}...` 
        : resource.description
      : '';
      
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow p-4">
        <div className="flex flex-col sm:flex-row">
          {resource.thumbnail && (
            <div className="sm:w-48 h-32 md:h-32 sm:h-auto bg-gray-100 rounded-md overflow-hidden mr-0 sm:mr-4 mb-4 sm:mb-0 flex-shrink-0">
              <img 
                src={resource.thumbnail} 
                alt={resource.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/placeholder-resource.jpg';
                }}
              />
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {resource.resource_type && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {resource.resource_type}
                </span>
              )}
              
              {resource.certification && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {resource.certification}
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {resource.title}
            </h3>
            
            <p className="text-sm text-gray-500 mb-3">
              {truncatedDescription}
            </p>
            
            <div className="flex flex-wrap items-center justify-between gap-y-2">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <IconEye size={16} className="mr-1 text-gray-400" />
                  <span>{viewCount}</span>
                </div>
                
                <button 
                  onClick={handleLikeToggle}
                  className="flex items-center focus:outline-none"
                >
                  <IconHeart 
                    size={16} 
                    className={`mr-1 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
                  />
                  <span>{likeCount}</span>
                </button>
                
                <span className="text-xs text-gray-400">
                  {formatDate(resource.created_at)}
                </span>
              </div>
              <a
                href={resource.resource_type === 'pdf' ? resource.file_url : resource.link || '#'}
                target="_blank" 
                rel="noopener noreferrer"
                onClick={handleResourceOpen}
                className="inline-flex items-center py-1.5 px-3 text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                View Resource
                <IconExternalLink size={14} className="ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {viewMode === 'grid' ? (
        // Grid view
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <ResourceCard 
              key={resource.id} 
              resource={resource} 
              onLikeToggle={onLikeToggle}
            />
          ))}
          
          {/* Loading skeletons */}
          {isLoading && Array.from({ length: 3 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="h-96 rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-5">
                <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-4/6"></div>
                <div className="h-10 bg-gray-200 rounded mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List view
        <div className="flex flex-col space-y-4">
          {resources.map((resource) => (
            <ResourceListItem
              key={resource.id}
              resource={resource}
            />
          ))}
          
          {/* Loading skeletons for list view */}
          {isLoading && Array.from({ length: 3 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex">
                <div className="w-48 h-32 bg-gray-200 rounded-md mr-4"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
                  <div className="flex justify-between mt-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Infinite scroll trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center mt-6">
          {isLoading && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-blue-600"></div>
              <div className="w-4 h-4 rounded-full bg-blue-600"></div>
              <div className="w-4 h-4 rounded-full bg-blue-600"></div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
