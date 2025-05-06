"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiChevronLeft, FiChevronRight, FiAward } from 'react-icons/fi';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Cloud Architect at TechSolutions',
    content: 'Cloud Certify helped me prepare and pass my GCP Professional Cloud Architect exam on the first attempt. The practice tests were incredibly close to the actual exam, and the detailed explanations for each question helped me understand the concepts thoroughly.',
    certification: 'Professional Cloud Architect',
    stars: 5,
  },
  {
    id: 2,
    name: 'Michael Chang',
    role: 'DevOps Engineer',
    content: 'I tried several platforms before finding Cloud Certify, and none came close to the quality of content provided here. The dashboard analytics helped me identify and focus on my weak areas. Passed my Associate Cloud Engineer certification with a score of 92%!',
    certification: 'Associate Cloud Engineer',
    stars: 5,
  },
  {
    id: 3,
    name: 'Priya Patel',
    role: 'Data Engineer',
    content: 'The specialized practice materials for Data Engineering were exceptional. The hands-on labs simulated real GCP environments, which gave me confidence working with actual tools. I couldn\'t have passed without Cloud Certify\'s resources.',
    certification: 'Professional Data Engineer',
    stars: 4,
  },
  {
    id: 4,
    name: 'James Wilson',
    role: 'Cloud Security Specialist',
    content: 'Security concepts can be challenging, but Cloud Certify broke them down in an approachable way. The detailed explanations on IAM, VPC Service Controls, and Security Command Center were invaluable for my Professional Cloud Security Engineer exam.',
    certification: 'Professional Cloud Security Engineer',
    stars: 5,
  },
];

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayTimeoutRef = useRef(null);
  
  // Auto-rotation functionality
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayTimeoutRef.current = setTimeout(() => {
        setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
      }, 5000); // Change every 5 seconds
    }
    
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, [currentSlide, isAutoPlaying]);
  
  // Pause auto-rotation when user interacts
  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    // Resume after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };
  
  const nextSlide = () => {
    pauseAutoPlay();
    setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    pauseAutoPlay();
    setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };
  
  const goToSlide = (index) => {
    pauseAutoPlay();
    setCurrentSlide(index);
  };
  
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
        
        <div className="max-w-4xl mx-auto relative">
          {/* Main testimonial container with fixed height for consistent button positioning */}
          <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Fixed-position navigation buttons */}
            <div className="absolute top-1/2 left-0 right-0 flex justify-between items-center px-4 -translate-y-1/2 z-20 pointer-events-none">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevSlide} 
                className="bg-white p-3 rounded-full shadow-md text-blue-600 hover:bg-blue-50 transition-all border border-gray-100 pointer-events-auto"
              >
                <FiChevronLeft size={20} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextSlide}
                className="bg-white p-3 rounded-full shadow-md text-blue-600 hover:bg-blue-50 transition-all border border-gray-100 pointer-events-auto"
              >
                <FiChevronRight size={20} />
              </motion.button>
            </div>
            
            {/* Testimonials slider */}
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 md:p-10"
                >
                  <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-center">
                    {/* Profile section */}
                    <div className="md:w-1/4 text-center">
                      <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xl font-bold mb-4">
                        {testimonials[currentSlide].name.charAt(0)}
                      </div>
                      <h4 className="font-bold text-lg text-gray-800">{testimonials[currentSlide].name}</h4>
                      <p className="text-gray-600 text-sm mb-3">{testimonials[currentSlide].role}</p>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <FiStar 
                            key={i}
                            className={`${i < testimonials[currentSlide].stars ? 'text-yellow-400 fill-current' : 'text-gray-300'} w-4 h-4`}
                          />
                        ))}
                      </div>
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs py-1 px-3 rounded-full inline-block">
                        {testimonials[currentSlide].certification}
                      </div>
                    </div>
                    
                    {/* Content section */}
                    <div className="md:w-3/4">
                      <div className="relative">
                        <svg className="text-blue-400/20 absolute -top-3 -left-3 w-8 h-8" viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.4 36C9.6 36 6.5 34.6667 4.1 32C1.76667 29.2667 0.6 25.9333 0.6 22C0.6 18.2667 1.76667 14.7333 4.1 11.4C6.5 8.06667 9.86667 4.8 14.2 1.6L19.5 6.4C16.7667 8.53333 14.6 10.5333 13 12.4C11.4667 14.2667 10.7 16.2 10.7 18.2C11.5 17.8 12.36 17.6 13.29 17.6C15.29 17.6 16.96 18.3333 18.3 19.8C19.64 21.2 20.31 23.0667 20.31 25.4C20.31 27.8 19.5767 29.7667 18.11 31.3C16.71 34.4333 14.2 36 13.4 36ZM34.1 36C30.3 36 27.2 34.6667 24.8 32C22.4667 29.2667 21.3 25.9333 21.3 22C21.3 18.2667 22.4667 14.7333 24.8 11.4C27.2 8.06667 30.5667 4.8 34.9 1.6L40.2 6.4C37.4667 8.53333 35.3 10.5333 33.7 12.4C32.1667 14.2667 31.4 16.2 31.4 18.2C32.2 17.8 33.06 17.6 33.99 17.6C35.99 17.6 37.66 18.3333 39 19.8C40.34 21.2 41.01 23.0667 41.01 25.4C41.01 27.8 40.2767 29.7667 38.81 31.3C37.41 34.4333 34.9 36 34.1 36Z" fill="currentColor"/>
                        </svg>
                        <p className="text-gray-700 text-lg leading-relaxed pl-4">
                          {testimonials[currentSlide].content}
                        </p>
                      </div>
                      
                      <div className="flex items-center mt-4 text-blue-600">
                        <FiAward className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">Verified Graduate</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
          {/* Simple indicator dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-blue-600 w-8' : 'bg-blue-200 w-2 hover:bg-blue-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
