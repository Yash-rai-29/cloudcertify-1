import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Cloud Architect at TechSolutions',
    image: '/testimonials/sarah.jpg',
    content: 'Cloud Certify helped me prepare and pass my GCP Professional Cloud Architect exam on the first attempt. The practice tests were incredibly close to the actual exam, and the detailed explanations for each question helped me understand the concepts thoroughly.',
    certification: 'Professional Cloud Architect',
    stars: 5,
    company: 'TechSolutions Inc.',
  },
  {
    id: 2,
    name: 'Michael Chang',
    role: 'DevOps Engineer',
    image: '/testimonials/michael.jpg',
    content: 'I tried several platforms before finding Cloud Certify, and none came close to the quality of content provided here. The dashboard analytics helped me identify and focus on my weak areas. Passed my Associate Cloud Engineer certification with a score of 92%!',
    certification: 'Associate Cloud Engineer',
    stars: 5,
    company: 'InnovateTech',
  },
  {
    id: 3,
    name: 'Priya Patel',
    role: 'Data Engineer',
    image: '/testimonials/priya.jpg',
    content: 'The specialized practice materials for Data Engineering were exceptional. The hands-on labs simulated real GCP environments, which gave me confidence working with actual tools. I couldn\'t have passed without Cloud Certify\'s resources.',
    certification: 'Professional Data Engineer',
    stars: 4,
    company: 'DataStream Analytics',
  },
  {
    id: 4,
    name: 'James Wilson',
    role: 'Cloud Security Specialist',
    image: '/testimonials/james.jpg',
    content: 'Security concepts can be challenging, but Cloud Certify broke them down in an approachable way. The detailed explanations on IAM, VPC Service Controls, and Security Command Center were invaluable for my Professional Cloud Security Engineer exam.',
    certification: 'Professional Cloud Security Engineer',
    stars: 5,
    company: 'SecureCloud Solutions',
  },
];

const Testimonials = () => {
  // Initialize with null to avoid hydration mismatch
  const [currentSlide, setCurrentSlide] = useState(null);
  const [isClient, setIsClient] = useState(false);
  
  // Set initial state on client-side only
  useEffect(() => {
    setCurrentSlide(0);
    setIsClient(true);
  }, []);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };
  
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };
  
  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Success Stories
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Hear from our community of certified professionals who achieved success with Cloud Certify
          </motion.p>
        </div>
        
        <div className="max-w-5xl mx-auto relative">
          {/* Testimonial Slider */}
          <div className="overflow-hidden">
            <motion.div 
              className="flex transition-transform duration-500 ease-in-out"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{ transform: isClient ? `translateX(-${currentSlide * 100}%)` : 'translateX(0%)' }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0">
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-2">
                    <div className="bg-blue-50 rounded-xl p-8 md:p-12">
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/3">
                          <div className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full overflow-hidden bg-gray-200 mb-4">
                              {/* Placeholder for profile image */}
                              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-500 text-xl font-bold">
                                {testimonial.name.charAt(0)}
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <h4 className="font-bold text-lg">{testimonial.name}</h4>
                              <p className="text-gray-600 text-sm mb-2">{testimonial.role}</p>
                              <div className="flex justify-center mb-3">
                                {[...Array(5)].map((_, i) => (
                                  <FiStar 
                                    key={i}
                                    className={`${i < testimonial.stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <div className="bg-blue-600 text-white text-xs py-1 px-3 rounded-full inline-block">
                                {testimonial.certification}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="md:w-2/3">
                          <div className="h-full flex flex-col justify-between">
                            <div>
                              <svg className="text-blue-300 mb-4" width="45" height="36" viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.4 36C9.6 36 6.5 34.6667 4.1 32C1.76667 29.2667 0.6 25.9333 0.6 22C0.6 18.2667 1.76667 14.7333 4.1 11.4C6.5 8.06667 9.86667 4.8 14.2 1.6L19.5 6.4C16.7667 8.53333 14.6 10.5333 13 12.4C11.4667 14.2667 10.7 16.2 10.7 18.2C11.5 17.8 12.36 17.6 13.29 17.6C15.29 17.6 16.96 18.3333 18.3 19.8C19.64 21.2 20.31 23.0667 20.31 25.4C20.31 27.8 19.5767 29.7667 18.11 31.3C16.71 34.4333 14.2 36 13.4 36ZM34.1 36C30.3 36 27.2 34.6667 24.8 32C22.4667 29.2667 21.3 25.9333 21.3 22C21.3 18.2667 22.4667 14.7333 24.8 11.4C27.2 8.06667 30.5667 4.8 34.9 1.6L40.2 6.4C37.4667 8.53333 35.3 10.5333 33.7 12.4C32.1667 14.2667 31.4 16.2 31.4 18.2C32.2 17.8 33.06 17.6 33.99 17.6C35.99 17.6 37.66 18.3333 39 19.8C40.34 21.2 41.01 23.0667 41.01 25.4C41.01 27.8 40.2767 29.7667 38.81 31.3C37.41 34.4333 34.9 36 34.1 36Z" fill="currentColor"/>
                              </svg>
                              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                {testimonial.content}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm">
                              <div className="text-gray-500">
                                {testimonial.company}
                              </div>
                              <div className="flex items-center text-blue-600">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                </svg>
                                <span>Verified Graduate</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevSlide} 
              className="bg-white p-3 rounded-full shadow-md text-blue-600 hover:bg-blue-50 transition-all"
            >
              <FiChevronLeft size={24} />
            </motion.button>
            
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? 'bg-blue-600 w-6' : 'bg-blue-200'
                  }`}
                />
              ))}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextSlide}
              className="bg-white p-3 rounded-full shadow-md text-blue-600 hover:bg-blue-50 transition-all"
            >
              <FiChevronRight size={24} />
            </motion.button>
          </div>
        </div>
        
        {/* Certification Partners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h3 className="text-xl font-semibold mb-8">Trusted by professionals from</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {['Google', 'Amazon', 'Microsoft', 'IBM', 'Oracle'].map((company, index) => (
              <div key={index} className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
                <div className="h-8 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-500">{company}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;