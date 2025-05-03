import { 
  IconInfoCircle, 
  IconCertificate,
  IconCalendarStats,
  IconNotebook,
  IconBooks,
  IconUser,
  IconHeart
} from '@tabler/icons-react';

/**
 * About CloudCertify Section - Contains only the About Us content
 */
export default function AboutCloudCertifySection() {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
      {/* Header with background gradient */}
      <div className="px-6 py-8 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <IconInfoCircle className="mr-3" size={24} />
              About CloudCertify
            </h2>
            <p className="text-sm text-gray-600">
              Your modern companion for cloud certification preparation with daily practice, 
              simulated exams, and performance tracking
            </p>
          </div>
          {/* <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              <IconCertificate className="text-white" size={40} />
            </div>
          </div> */}
        </div>
      </div>
      
      <div className="p-6">
        <div className="prose prose-blue max-w-none">
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                CloudCertify is a modern certification preparation platform designed to help individuals 
                master Google Cloud Platform (GCP) certifications with confidence. The platform delivers an engaging, 
                user-friendly experience that supports daily practice, full-length test simulations, and access 
                to curated learning materials tailored to certification success.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                <p className="text-blue-700 font-medium">
                  Founded in 2025 by Yash Rai and Harsh Porwal, CloudCertify was created to address the real 
                  challenges candidates face when preparing for cloud certifications-such as lack of consistency, 
                  outdated materials, and limited performance tracking.
                </p>
              </div>
              
              <p className="text-gray-600">
                With CloudCertify, users are encouraged to stay committed through daily quizzes that maintain 
                preparation streaks, simulated exams that closely mimic real test environments, and comprehensive 
                insights into their progress.
              </p>
            </div>
            
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-gray-50 p-5 rounded-xl">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Platform Focus</h4>
                <ul className="space-y-3">
                  <FeatureItem 
                    icon={<IconCalendarStats size={20} className="text-orange-500" />}
                    title="Daily Practice"
                    description="Build consistent study habits with daily quizzes and maintain streaks"
                  />
                  <FeatureItem 
                    icon={<IconNotebook size={20} className="text-purple-500" />}
                    title="Exam Simulation"
                    description="Experience real exam conditions with our test engine"
                  />
                  <FeatureItem 
                    icon={<IconBooks size={20} className="text-green-500" />}
                    title="Curated Resources"
                    description="Access quality learning materials selected by experts"
                  />
                </ul>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-4">Our Vision</h3>
          <p className="text-gray-600">
            While CloudCertify currently focuses on GCP certifications, the platform is built with scalability 
            in mind and will soon expand to include certifications from other major cloud providers such as 
            AWS and Azure. Our mission is to become the go-to platform for cloud certification aspirants worldwide.
          </p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <ValueCard
              title="Excellence"
              description="We deliver high-quality content and experiences that match certification requirements"
              icon={<IconCertificate size={24} className="text-blue-500" />}
            />
            <ValueCard
              title="Accessibility"
              description="Cloud certifications should be achievable for everyone regardless of background"
              icon={<IconUser size={24} className="text-blue-500" />}
            />
            <ValueCard
              title="Community"
              description="We believe in the power of community-driven learning and knowledge sharing"
              icon={<IconHeart size={24} className="text-blue-500" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, description }) {
  return (
    <li className="flex gap-3">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div>
        <h5 className="text-lg font-medium text-gray-900">{title}</h5>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </li>
  );
}

function ValueCard({ title, description, icon }) {
  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-3">
        {icon}
        <h4 className="text-lg font-medium text-gray-900 ml-2">{title}</h4>
      </div>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
