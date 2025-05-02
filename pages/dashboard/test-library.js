import { useState } from 'react';
import { getDashboardLayout } from '../../components/layouts/DashboardLayout';
import { FiBookOpen, FiClock, FiHelpCircle, FiStar } from 'react-icons/fi';

// Test categories and certification types
const certifications = [
  {
    id: 'associate-cloud-engineer',
    name: 'Associate Cloud Engineer',
    description: 'Deploy applications, monitor operations, and manage enterprise solutions',
    icon: <FiBookOpen className="text-blue-500" size={20} />,
    tests: [
      {
        id: 'ace-pt1',
        title: 'Practice Test 1',
        questions: 50,
        duration: 120,
        difficulty: 'Intermediate',
        topics: ['Cloud Fundamentals', 'Compute Services', 'Storage Solutions', 'Networking']
      },
      {
        id: 'ace-pt2',
        title: 'Practice Test 2',
        questions: 50,
        duration: 120,
        difficulty: 'Intermediate',
        topics: ['IAM', 'Security', 'Containers', 'App Engine', 'Monitoring']
      },
      {
        id: 'ace-mini1',
        title: 'Mini Test: Compute',
        questions: 15,
        duration: 30,
        difficulty: 'Beginner',
        topics: ['Compute Engine', 'Kubernetes Engine', 'App Engine']
      },
      {
        id: 'ace-mini2',
        title: 'Mini Test: Storage',
        questions: 15,
        duration: 30,
        difficulty: 'Beginner',
        topics: ['Cloud Storage', 'Cloud SQL', 'Datastore', 'Bigtable']
      }
    ]
  },
  {
    id: 'professional-cloud-architect',
    name: 'Professional Cloud Architect',
    description: 'Design, develop, and manage robust, secure, scalable, highly available, and dynamic solutions',
    icon: <FiStar className="text-indigo-500" size={20} />,
    tests: [
      {
        id: 'pca-pt1',
        title: 'Practice Test 1',
        questions: 60,
        duration: 150,
        difficulty: 'Advanced',
        topics: ['Cloud Architecture', 'Security & Compliance', 'Reliability', 'Cost Optimization']
      },
      {
        id: 'pca-pt2',
        title: 'Practice Test 2',
        questions: 60,
        duration: 150,
        difficulty: 'Advanced',
        topics: ['System Design', 'Migration Planning', 'Operations', 'Case Studies']
      },
      {
        id: 'pca-mini1',
        title: 'Mini Test: Architecture',
        questions: 20,
        duration: 40,
        difficulty: 'Intermediate',
        topics: ['High Availability', 'Scalability', 'Hybrid Network Design']
      }
    ]
  },
  {
    id: 'professional-data-engineer',
    name: 'Professional Data Engineer',
    description: 'Design and build data processing systems with a focus on security, reliability, fault-tolerance, scalability, fidelity, and efficiency',
    icon: <FiHelpCircle className="text-emerald-500" size={20} />,
    tests: [
      {
        id: 'pde-pt1',
        title: 'Practice Test 1',
        questions: 55,
        duration: 140,
        difficulty: 'Advanced',
        topics: ['Data Processing', 'ML Models', 'Data Warehousing', 'BigQuery']
      },
      {
        id: 'pde-mini1',
        title: 'Mini Test: BigQuery',
        questions: 20,
        duration: 40,
        difficulty: 'Intermediate',
        topics: ['BigQuery Optimization', 'SQL Functions', 'Performance']
      }
    ]
  },
  {
    id: 'professional-cloud-developer',
    name: 'Professional Cloud Developer',
    description: 'Build and deploy scalable, highly available, and reliable applications using Google Cloud technologies',
    icon: <FiClock className="text-amber-500" size={20} />,
    tests: [
      {
        id: 'pcd-pt1',
        title: 'Practice Test 1',
        questions: 55,
        duration: 140,
        difficulty: 'Advanced',
        topics: ['App Development', 'Containerization', 'CI/CD', 'API Design']
      },
      {
        id: 'pcd-mini1',
        title: 'Mini Test: CI/CD',
        questions: 20,
        duration: 40,
        difficulty: 'Intermediate',
        topics: ['Cloud Build', 'Container Registry', 'Deployment Strategies']
      }
    ]
  }
];

// Difficulty badges mapping
const difficultyBadges = {
  'Beginner': 'bg-green-100 text-green-800',
  'Intermediate': 'bg-blue-100 text-blue-800',
  'Advanced': 'bg-purple-100 text-purple-800'
};

export default function TestLibrary() {
  // We're not implementing filtering or searching functionality
  // as per your request to remove interactive elements
  
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Test Library</h1>
        <p className="mt-1 text-gray-600">
          Practice tests and quizzes to help you prepare for GCP certification exams
        </p>
      </div>

      {/* Test library content */}
      <div className="space-y-10">
        {certifications.map((certification) => (
          <div key={certification.id} className="space-y-4">
            {/* Certification heading */}
            <div className="flex items-center gap-2">
              <div className="bg-gray-100 p-2 rounded-lg">
                {certification.icon}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{certification.name}</h2>
                <p className="text-sm text-gray-600">{certification.description}</p>
              </div>
            </div>

            {/* Tests grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {certification.tests.map((test) => (
                <div 
                  key={test.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{test.title}</h3>
                    
                    {/* Test specs */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-28">Questions:</span>
                        <span className="font-medium text-gray-800">{test.questions}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-28">Duration:</span>
                        <span className="font-medium text-gray-800">{test.duration} mins</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-28">Difficulty:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyBadges[test.difficulty]}`}>
                          {test.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    {/* Topics */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Topics covered:</h4>
                      <div className="flex flex-wrap gap-2">
                        {test.topics.map((topic, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Start test button */}
                    <div className="mt-5">
                      <button
                        className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Start Test
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Use the DashboardLayout for this page
TestLibrary.getLayout = getDashboardLayout;