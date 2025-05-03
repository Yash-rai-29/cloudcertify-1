import { 
    IconCode, 
    IconServer, 
    IconDeviceMobile,
    IconBrandFirebase,
    IconBrandFlutter
  } from '@tabler/icons-react';
  
  /**
   * Tech Stack Section Component
   */
export default function TechStackSection() {
    return (
      <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
        {/* Header with background gradient */}
        <div className="px-6 py-8 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <IconCode className="mr-3" size={24} />
                Technology Stack
              </h2>
              <p className="text-sm text-gray-600">
                The modern technologies powering CloudCertify
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Our Technology Stack</h3>
          <p className="text-gray-600 mb-8">
            CloudCertify is built using modern technologies to ensure a seamless, responsive, and secure experience across all devices.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <IconServer size={24} className="text-blue-600 mr-3" />
                <h4 className="text-lg font-medium text-gray-900">Back-End</h4>
              </div>
              
              <div className="space-y-5">
                <TechItem
                  name="FastAPI"
                  description="High-performance API framework for blazing-fast endpoints"
                  icon="/tech/fastapi.svg"
                />
                <TechItem
                  name="Firebase"
                  description="Authentication, real-time database, and cloud services"
                  icon="/tech/firebase.svg"
                />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <IconDeviceMobile size={24} className="text-indigo-600 mr-3" />
                <h4 className="text-lg font-medium text-gray-900">Front-End</h4>
              </div>
              
              <div className="space-y-5">
                <TechItem
                  name="Flutter"
                  description="Cross-platform framework for seamless mobile and web experience"
                  icon="/tech/flutter.svg"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
            <h4 className="text-lg font-medium text-gray-900 mb-3">Made with ❤️</h4>
            <p className="text-gray-600 mb-4">
              Our platform is crafted with care and attention to detail. We continuously optimize for 
              performance, accessibility, and user experience to ensure you can focus on what matters most - 
              preparing for your certification.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">FastAPI</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">Firebase</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Flutter</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Cloud Services</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Responsive Design</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  function TechItem({ name, description, icon }) {
    // Fallback for demo purposes
    const iconUrl = icon || 'https://via.placeholder.com/40';
    
    return (
      <div className="flex items-start">
        <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center mr-4 flex-shrink-0">
          {/* This would be replaced with actual tech logos */}
          <div className="text-blue-500">
            {name === "FastAPI" && <IconServer size={24} />}
            {name === "Firebase" && <IconBrandFirebase size={24} />}
            {name === "Flutter" && <IconBrandFlutter size={24} />}
          </div>
        </div>
        <div>
          <h5 className="text-lg font-medium text-gray-900">{name}</h5>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    );
  }
  