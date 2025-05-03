import { 
    IconRocket, 
    IconHistory, 
    IconCalendarStats,
    IconNotebook,
    IconBooks,
    IconUser,
    IconInfoCircle
  } from '@tabler/icons-react';
  
  /**
   * Release Notes Section Component
   */
export default function ReleaseNotesSection() {
    return (
      <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
        {/* Header with background gradient */}
        <div className="px-6 py-8 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <IconRocket className="mr-3" size={24} />
                Release Notes
              </h2>
              <p className="text-sm text-gray-600">
                Track our journey as we build and improve CloudCertify
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-start mb-6">
            <div className="bg-blue-100 p-2 rounded-full mr-4">
              <IconRocket size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">CloudCertify v1.0.0</h3>
              <p className="text-sm text-gray-500">Released: May 1, 2025</p>
            </div>
          </div>
          
          <div className="relative pl-8 pb-1 before:content-[''] before:absolute before:left-3 before:top-0 before:h-full before:w-[2px] before:bg-blue-100">
            <ul className="space-y-6">
              <ReleaseItem 
                title="Daily Quiz Feature" 
                description="Introduced daily quizzes to help users build consistent study habits and maintain streaks"
                icon={<IconCalendarStats size={20} />}
              />
              <ReleaseItem 
                title="Test Library" 
                description="Added Test Library with filtering by certification (AWS, Azure, GCP, etc.) and test popularity"
                icon={<IconBooks size={20} />}
              />
              <ReleaseItem 
                title="Exam Screen" 
                description="Implemented Exam Screen with intuitive navigation, timer, and question panel layout"
                icon={<IconNotebook size={20} />}
              />
              <ReleaseItem 
                title="Test History" 
                description="Enabled Test History view with performance stats, score analysis, and attempt tracking"
                icon={<IconHistory size={20} />}
              />
              <ReleaseItem 
                title="Resources Hub" 
                description="Launched Resources hub with curated courses, PDFs, and articles for certification prep"
                icon={<IconBooks size={20} />}
              />
              <ReleaseItem 
                title="Profile Management" 
                description="Developed profile management and Settings screen with update and About Us section"
                icon={<IconUser size={20} />}
              />
            </ul>
          </div>
          
          <div className="mt-8 bg-blue-50 rounded-lg p-5 flex items-start">
            <IconInfoCircle size={20} className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-blue-700 text-sm">
              We're constantly working to improve CloudCertify based on user feedback. Have suggestions? 
              Let us know through the feedback form in your profile settings.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  function ReleaseItem({ title, description, icon }) {
    return (
      <li className="relative">
        <div className="absolute -left-[27px] bg-white rounded-full p-1 border-2 border-blue-100">
          <div className="bg-blue-500 text-white p-1 rounded-full flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div className="ml-6">
          <h4 className="text-lg font-medium text-gray-900 mb-1">{title}</h4>
          <p className="text-gray-600">{description}</p>
        </div>
      </li>
    );
  }
  