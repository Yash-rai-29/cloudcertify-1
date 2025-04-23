"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiChevronLeft, FiChevronRight, FiAward } from 'react-icons/fi';
import { GlowingBackground } from './ui/GlowingBackground';
import { TracingBeam } from './ui/TracingBeam';

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

const NewTestimonials = () => {
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
    <section id="testimonials" className="py-24 relative overflow-hidden bg-white">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute top-1/3 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />
      </div>

      <TracingBeam>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="inline-block px-4 py-1.5 mb-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 rounded-full text-sm font-medium border border-blue-200/50"
            >
              Success Stories
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700"
            >
              What Our Certified Users Say
              <motion.div
                className="absolute -bottom-3 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent rounded-full"
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                viewport={{ once: true }}
              />
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-gray-600 max-w-3xl mx-auto mt-6 text-lg"
            >
              Hear from our community of certified professionals who achieved success with
              Cloud Certify's personalized preparation platform
            </motion.p>
          </div>
          
          <div className="max-w-6xl mx-auto relative">
            {/* Testimonial Slider */}
            <GlowingBackground
              containerClassName="rounded-2xl overflow-hidden"
              glowColor="rgba(37, 99, 235, 0.3)"
              glowSize="400px"
            >
              <div className="overflow-hidden rounded-2xl">
                <motion.div 
                  className="flex transition-all duration-500 ease-in-out"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ transform: isClient ? `translateX(-${currentSlide * 100}%)` : 'translateX(0%)' }}
                >
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="w-full flex-shrink-0">
                      <div className="bg-white shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-br from-blue-50 to-white p-8 md:p-12">
                          <div className="flex flex-col md:flex-row gap-8">
                            <div className="md:w-1/3">
                              <motion.div 
                                className="bg-white rounded-xl p-6 shadow-md border border-blue-100"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                              >
                                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full overflow-hidden bg-gray-200 mb-4 border-2 border-blue-200">
                                  {/* Placeholder for profile image */}
                                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                                    {testimonial.name.charAt(0)}
                                  </div>
                                </div>
                                
                                <div className="text-center">
                                  <h4 className="font-bold text-lg text-gray-800">{testimonial.name}</h4>
                                  <p className="text-gray-600 text-sm mb-3">{testimonial.role}</p>
                                  <div className="flex justify-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                      <FiStar 
                                        key={i}
                                        className={`${i < testimonial.stars ? 'text-yellow-400 fill-current' : 'text-gray-300'} w-5 h-5`}
                                      />
                                    ))}
                                  </div>
                                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs py-1.5 px-4 rounded-full inline-block">
                                    {testimonial.certification}
                                  </div>
                                </div>
                              </motion.div>
                            </div>
                            
                            <div className="md:w-2/3">
                              <motion.div 
                                className="h-full flex flex-col justify-between"
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                viewport={{ once: true }}
                              >
                                <div>
                                  <svg className="text-blue-400 mb-6" width="45" height="36" viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.4 36C9.6 36 6.5 34.6667 4.1 32C1.76667 29.2667 0.6 25.9333 0.6 22C0.6 18.2667 1.76667 14.7333 4.1 11.4C6.5 8.06667 9.86667 4.8 14.2 1.6L19.5 6.4C16.7667 8.53333 14.6 10.5333 13 12.4C11.4667 14.2667 10.7 16.2 10.7 18.2C11.5 17.8 12.36 17.6 13.29 17.6C15.29 17.6 16.96 18.3333 18.3 19.8C19.64 21.2 20.31 23.0667 20.31 25.4C20.31 27.8 19.5767 29.7667 18.11 31.3C16.71 34.4333 14.2 36 13.4 36ZM34.1 36C30.3 36 27.2 34.6667 24.8 32C22.4667 29.2667 21.3 25.9333 21.3 22C21.3 18.2667 22.4667 14.7333 24.8 11.4C27.2 8.06667 30.5667 4.8 34.9 1.6L40.2 6.4C37.4667 8.53333 35.3 10.5333 33.7 12.4C32.1667 14.2667 31.4 16.2 31.4 18.2C32.2 17.8 33.06 17.6 33.99 17.6C35.99 17.6 37.66 18.3333 39 19.8C40.34 21.2 41.01 23.0667 41.01 25.4C41.01 27.8 40.2767 29.7667 38.81 31.3C37.41 34.4333 34.9 36 34.1 36Z" fill="currentColor"/>
                                  </svg>
                                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                    {testimonial.content}
                                  </p>
                                </div>
                                
                                <div className="flex items-center justify-between mt-4">
                                  <div className="text-gray-500 text-sm">
                                    {testimonial.company}
                                  </div>
                                  <div className="flex items-center text-blue-600">
                                    <FiAward className="w-4 h-4 mr-1" />
                                    <span className="text-sm font-medium">Verified Graduate</span>
                                  </div>
                                </div>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </GlowingBackground>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-10">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevSlide} 
                className="bg-white p-4 rounded-full shadow-lg text-blue-600 hover:bg-blue-50 transition-all border border-gray-100"
              >
                <FiChevronLeft size={24} />
              </motion.button>
              
              <div className="flex space-x-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-3 rounded-full transition-all ${
                      index === currentSlide ? 'bg-blue-600 w-10' : 'bg-blue-200 w-3'
                    }`}
                  />
                ))}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextSlide}
                className="bg-white p-4 rounded-full shadow-lg text-blue-600 hover:bg-blue-50 transition-all border border-gray-100"
              >
                <FiChevronRight size={24} />
              </motion.button>
            </div>
          </div>
          
          {/* Certification Partners */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-24 text-center"
          >
            <h3 className="text-xl font-semibold mb-8 text-gray-800">Trusted by professionals from</h3>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
              {['Google', 'Amazon', 'Microsoft', 'IBM', 'Oracle'].map((company, index) => (
                <motion.div 
                  key={index} 
                  className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <div className="h-8 flex items-center justify-center">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                      {company}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </TracingBeam>
    </section>
  );
};

export default NewTestimonials;