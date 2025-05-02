import { IconInfoCircle } from '@tabler/icons-react';

/**
 * Component displaying information about the Cloud Certify platform
 */
export default function AboutCloudCertifySection() {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <IconInfoCircle className="mr-2 text-blue-600" size={20} />
          About Cloud Certify
        </h3>
      </div>
      
      <div className="px-6 py-6">
        <div className="prose prose-blue max-w-none">
          <p className="text-gray-700">
            Cloud Certify is a comprehensive platform designed to help cloud professionals prepare for and
            succeed in their certification exams. Our mission is to provide high-quality practice tests,
            resources, and learning tools that align with the latest cloud certification requirements.
          </p>
          
          <h4 className="text-lg font-medium text-gray-900 mt-6 mb-3">Our Mission</h4>
          <p className="text-gray-700">
            To empower individuals in their cloud certification journey by providing 
            accessible, up-to-date, and industry-aligned preparation resources.
          </p>
          
          <h4 className="text-lg font-medium text-gray-900 mt-6 mb-3">Our Values</h4>
          <ul className="space-y-2 list-disc pl-5 text-gray-700">
            <li>
              <span className="font-medium">Excellence:</span> We strive to provide the highest quality content and user experience.
            </li>
            <li>
              <span className="font-medium">Relevance:</span> Our content is regularly updated to match the latest exam patterns and industry trends.
            </li>
            <li>
              <span className="font-medium">Accessibility:</span> Learning resources should be available to everyone, regardless of their background.
            </li>
            <li>
              <span className="font-medium">Community:</span> We believe in the power of community-driven learning and knowledge sharing.
            </li>
          </ul>
          
          <h4 className="text-lg font-medium text-gray-900 mt-6 mb-3">Get in Touch</h4>
          <p className="text-gray-700">
            For any questions, feedback, or support needs, please reach out to our team at{' '}
            <a href="mailto:support@cloudcertify.com" className="text-blue-600 hover:text-blue-800 no-underline hover:underline">
              support@cloudcertify.com
            </a>
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <IconInfoCircle className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Cloud Certify is constantly evolving. Have suggestions for new features? Let us know!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
