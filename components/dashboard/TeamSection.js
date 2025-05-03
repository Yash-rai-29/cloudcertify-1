import { 
    IconHeart, 
    IconBrandGmail,
    IconUser
  } from '@tabler/icons-react';
  
  /**
   * Team Section Component
   */
export default function TeamSection() {
    return (
      <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
        {/* Header with background gradient */}
        <div className="px-6 py-8 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <IconHeart className="mr-3" size={24} />
                Our Team
              </h2>
              <p className="text-sm text-gray-600">
                Meet the passionate people behind CloudCertify
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Meet Our Founders</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <TeamMemberCard
              name="Yash Rai"
              role="Co-Founder"
              email="yashrai1224@gmail.com" 
              image="/founders/yash.jpg" 
            />
            <TeamMemberCard
              name="Harsh Porwal"
              role="Co-Founder"
              email="porwalharsh007@gmail.com"
              image="/founders/harsh.jpg"
            />
          </div>
{/*           
          <div className="bg-indigo-50 rounded-lg p-6 mt-8">
            <h4 className="text-lg font-medium text-gray-900 mb-3">Join Our Team</h4>
            <p className="text-gray-600 mb-4">
              We're looking for passionate individuals to join our mission of making cloud certification 
              preparation accessible and effective. If you're excited about cloud technologies and education,
              we'd love to hear from you.
            </p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              View Open Positions
            </button>
          </div> */}
        </div>
      </div>
    );
  }
  
  function TeamMemberCard({ name, role, email, image }) {
    // Fallback image for demo purposes
    const imageUrl = image || 'https://via.placeholder.com/150';
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
            {/* Use next/image if image path is provided, otherwise show a placeholder */}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              <IconUser size={40} />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-medium text-gray-900">{name}</h4>
            <p className="text-indigo-600 font-medium mb-3">{role}</p>
            
            <a 
              href={`mailto:${email}`} 
              className="inline-flex items-center text-gray-600 hover:text-gray-800 text-sm"
            >
              <IconBrandGmail size={16} className="mr-1" />
              {email}
            </a>
            
            <div className="mt-4 flex justify-center sm:justify-start gap-2">
              <button className="text-sm py-1.5 px-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
                Connect
              </button>
              <button className="text-sm py-1.5 px-3 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  