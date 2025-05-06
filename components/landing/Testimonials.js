"use client";
import { AnimatedTestimonials } from '../ui/animated-testimonials';

const testimonials = [
  {
    id: 1,
    quote: 'Cloud Certify helped me prepare and pass my GCP Professional Cloud Architect exam on the first attempt. The practice tests were incredibly close to the actual exam, and the detailed explanations for each question helped me understand the concepts thoroughly.',
    name: 'Harsh Porwal',
    designation: 'Flutter Developer',
    src: '/images/testimonials/harsh.jpg', // Replace with actual image paths
    certification: 'Professional Cloud Architect',
  },
  {
    id: 2,
    quote: 'I tried several platforms before finding Cloud Certify, and none came close to the quality of content provided here. The dashboard analytics helped me identify and focus on my weak areas. Passed my Associate Cloud Engineer certification with a score of 92%!',
    name: 'Michael Chang',
    designation: 'DevOps Engineer',
    src: '/images/testimonials/test.jpg',
    certification: 'Associate Cloud Engineer',
  },
  {
    id: 3,
    quote: 'The specialized practice materials for Data Engineering were exceptional. The hands-on labs simulated real GCP environments, which gave me confidence working with actual tools. I couldn\'t have passed without Cloud Certify\'s resources.',
    name: 'Yash Rai',
    designation: 'Data Engineer',
    src: '/images/testimonials/yash.jpg',
    certification: 'Professional Data Engineer',
  },
  {
    id: 4,
    quote: 'Security concepts can be challenging, but Cloud Certify broke them down in an approachable way. The detailed explanations on IAM, VPC Service Controls, and Security Command Center were invaluable for my Professional Cloud Security Engineer exam.',
    name: 'James Wilson',
    designation: 'Cloud Security Specialist',
    src: '/images/testimonials/test2.jpg',
    certification: 'Professional Cloud Security Engineer',
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-12 md:py-20 relative overflow-hidden bg-gradient-to-b from-white to-blue-50/20">
      {/* Simple background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 mb-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 rounded-full text-sm font-medium border border-blue-200/50">
            Success Stories
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
            What Our Certified Users Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from our community of certified professionals who achieved success
          </p>
        </div>
        
        {/* Using the shadcn AnimatedTestimonials component */}
        <AnimatedTestimonials 
          testimonials={testimonials} 
          autoplay={true}
        />
      </div>
    </section>
  );
};

export default Testimonials;
