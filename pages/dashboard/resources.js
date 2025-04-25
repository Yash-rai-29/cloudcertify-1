import { useState, useEffect } from 'react';
import { IconBook, IconExternalLink, IconCategory, IconFilter, IconSearch } from '@tabler/icons-react';
import { getDashboardLayout } from '../../components/layouts/DashboardLayout';
import Section from '../../components/dashboard/Section';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getLearningResources } from '../../utils/services/dashboardService';

/**
 * Resources page
 */
export default function Resources() {
  const [isLoading, setIsLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Resource categories
  const categories = [
    'Getting Started',
    'Compute',
    'Storage',
    'Networking',
    'Security',
    'Database',
    'BigData',
    'AI & ML',
    'DevOps',
    'Architecture'
  ];

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        const response = await getLearningResources(selectedCategory);
        if (response.success) {
          setResources(response.data.resources || []);
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter resources based on search query
  const filteredResources = resources.filter(resource => 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to get resource type badge color
  const getResourceTypeBadge = (type) => {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* Page Header */}
      <div className="py-6 md:py-8 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Learning Resources</h1>
            <p className="mt-1 text-sm text-gray-500">Study materials for your GCP certification preparation</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IconSearch size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search resources..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <Section 
        title="Resource Categories"
        description="Filter resources by GCP service categories"
        className="mt-8"
      >
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </Section>

      {/* Resource Cards */}
      <Section 
        title={selectedCategory || "All Resources"}
        description="Learning materials to help you master GCP"
        className="mt-8"
      >
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.length > 0 ? (
              filteredResources.map((resource) => (
                <div 
                  key={resource.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {resource.image_url && (
                    <div className="h-40 bg-gray-200 overflow-hidden">
                      <img 
                        src={resource.image_url} 
                        alt={resource.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex space-x-2 mb-2">
                          {getResourceTypeBadge(resource.type)}
                          <Badge variant="blue">{resource.category}</Badge>
                        </div>
                        <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                      </div>
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                      {resource.description}
                    </p>
                    
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <IconBook size={16} className="mr-1" />
                      <span>{resource.estimated_time} min read</span>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Button
                        fullWidth
                        href={resource.url}
                        rightIcon={<IconExternalLink size={16} />}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open Resource
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 py-12 text-center">
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gray-100">
                  <IconCategory size={32} className="text-gray-400" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No resources found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery 
                    ? `No resources matching "${searchQuery}"`
                    : selectedCategory 
                      ? `No resources found in ${selectedCategory} category`
                      : 'No resources available at the moment'
                  }
                </p>
                {(searchQuery || selectedCategory) && (
                  <div className="mt-6">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory(null);
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Section>

      {/* Official Documentation Section */}
      <Section 
        title="Official Google Documentation"
        description="Resources from Google's official documentation"
        className="mt-12"
      >
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Google Cloud Certification Resources</h3>
              <p className="mt-1 text-sm text-gray-500">
                Official resources from Google to help you prepare for your GCP certification exams
              </p>
              <div className="mt-4 space-x-2">
                <Button 
                  variant="outline"
                  size="sm" 
                  href="https://cloud.google.com/certification"
                  target="_blank"
                  rel="noopener noreferrer"
                  rightIcon={<IconExternalLink size={16} />}
                >
                  Certification Homepage
                </Button>
                <Button 
                  variant="outline"
                  size="sm" 
                  href="https://cloud.google.com/learn/certification/guides"
                  target="_blank"
                  rel="noopener noreferrer"
                  rightIcon={<IconExternalLink size={16} />}
                >
                  Exam Guides
                </Button>
                <Button 
                  variant="outline"
                  size="sm" 
                  href="https://www.cloudskillsboost.google/"
                  target="_blank"
                  rel="noopener noreferrer"
                  rightIcon={<IconExternalLink size={16} />}
                >
                  Cloud Skills Boost
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="/google-cloud-logo.svg" 
                alt="Google Cloud"
                className="h-24 w-auto"
              />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

Resources.getLayout = getDashboardLayout;