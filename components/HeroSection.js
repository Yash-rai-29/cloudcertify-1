import { motion } from "framer-motion";
import {
  FiCheck,
  FiChevronRight,
  FiArrowRight,
  FiStar,
  FiShield,
  FiCloud,
} from "react-icons/fi";
import { useInView } from "react-intersection-observer";

const HeroSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const featureItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 8,
      },
    },
  };

  // Mock progress data
  const progressItems = [
    { title: "Design & Plan", progress: "92%", color: "bg-green-500" },
    {
      title: "Implementation & Migration",
      progress: "78%",
      color: "bg-blue-500",
    },
    { title: "Configure & Deploy", progress: "85%", color: "bg-indigo-500" },
    { title: "Security & Compliance", progress: "65%", color: "bg-orange-500" },
  ];

  return (
    <section className="relative pt-24 pb-20 md:pt-36 md:pb-32 overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 z-[-2]"></div>

      {/* Background shapes and blur effects */}
      <div className="absolute -top-48 -right-48 w-96 h-96 bg-blue-100 rounded-full opacity-60 blur-3xl z-[-1]"></div>
      <div className="absolute top-32 -left-24 w-80 h-80 bg-indigo-100 rounded-full opacity-60 blur-3xl z-[-1]"></div>
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-blue-200 rounded-full opacity-40 blur-3xl z-[-1]"></div>

      {/* Floating elements - subtle animations */}
      <motion.div
        className="absolute top-20 right-10 md:right-32 w-12 h-12 text-blue-600 opacity-20 hidden md:block"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <FiCloud size={48} />
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-10 w-8 h-8 text-indigo-600 opacity-20 hidden md:block"
        animate={{
          y: [0, 10, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <FiShield size={32} />
      </motion.div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center"
          ref={ref}
        >
          {/* Left side - Text content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="max-w-xl mx-auto lg:max-w-none lg:mx-0"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-block px-4 py-1.5 mb-6 bg-blue-100 text-blue-700 rounded-full text-sm font-medium shadow-sm transform hover:-translate-y-1 transition-transform duration-300"
            >
              <span className="mr-1">⭐</span> The #1 GCP Certification Platform
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight"
            >
              <span className="block mb-2">Master Google Cloud </span>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Ace the Certification
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
            >
              Comprehensive preparation resources, practice exams, and
              performance tracking to help you succeed in your GCP certification
              journey.
            </motion.p>

            {/* Feature list */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10"
            >
              {[
                "500+ Practice Questions",
                "Detailed Explanations",
                "Performance Analytics",
                "Study Scheduler",
                "Expert Support",
                "Certificate Showcase",
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={featureItemVariants}
                  className="flex items-center"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 shadow-sm">
                    <FiCheck size={14} />
                  </div>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.a
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                href="https://cloudcertify.web.app/" // Update if needed
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pulse text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl font-medium text-md shadow-lg transition-all"
              >
                Start For Free
              </motion.a>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
                }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3.5 rounded-xl font-medium text-md transition-all flex items-center justify-center"
              >
                Learn More <FiArrowRight className="ml-2" />
              </motion.button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex items-center text-sm text-gray-500"
            >
              <div className="flex -space-x-2 mr-3">
                {[1, 2, 3, 4].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full ring-2 ring-white bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-medium"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <FiStar
                      key={i}
                      className="text-yellow-400 fill-current"
                      size={14}
                    />
                  ))}
                  <span className="ml-1 font-medium text-gray-700">4.9/5</span>
                </div>
                <span>
                  Join <b className="text-blue-600">7,800+</b> successful cloud
                  professionals
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Dashboard Visualization */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative max-w-md mx-auto lg:max-w-none lg:mx-0"
          >
            {/* Floating card effect */}
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white p-3">
                {/* Browser-like tabs */}
                <div className="absolute top-0 left-0 w-full h-7 bg-gray-100 flex items-center px-3 rounded-t-xl">
                  <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="mx-auto bg-white/80 text-gray-500 text-xs px-4 py-0.5 rounded-md">
                    cloud-certify.app/dashboard
                  </div>
                </div>

                <div className="pt-10 px-2 pb-2">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl overflow-hidden shadow-inner">
                    <div className="p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg shadow-sm">
                          Professional Cloud Architect
                        </div>
                        <div className="text-green-600 font-medium flex items-center bg-green-50 px-3 py-1 rounded-lg text-sm shadow-sm">
                          <FiCheck className="mr-1.5" />
                          87% Success Rate
                        </div>
                      </div>

                      <div className="space-y-4 mb-5">
                        {progressItems.map((item, index) => (
                          <motion.div
                            key={index}
                            className="space-y-1.5"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{
                              delay: 0.7 + index * 0.2,
                              duration: 0.5,
                            }}
                          >
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{item.title}</span>
                              <span className="text-gray-600">
                                {item.progress}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                              <motion.div
                                className={`${item.color} h-2.5 rounded-full`}
                                initial={{ width: 0 }}
                                animate={{ width: item.progress }}
                                transition={{
                                  delay: 0.7 + index * 0.2,
                                  duration: 1.2,
                                  ease: "easeOut",
                                }}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                        <div className="text-sm font-medium mb-3 text-gray-700">
                          Next Study Session
                        </div>
                        <div className="flex flex-wrap justify-between items-center gap-3">
                          <div className="text-gray-800 font-medium">
                            Implementation & Migration Module
                          </div>
                          <motion.button
                            whileHover={{
                              scale: 1.05,
                              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm px-4 py-1.5 rounded-lg flex items-center"
                          >
                            Start <FiArrowRight className="ml-1.5" size={14} />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Decorative elements with animation */}
            <motion.div
              className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-100 rounded-full opacity-70 blur-xl z-[-1]"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 0.5, 0.7],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute -top-8 right-20 w-24 h-24 bg-blue-200 rounded-full opacity-60 blur-xl z-[-1]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 0.4, 0.6],
              }}
              transition={{
                duration: 7,
                delay: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute top-1/2 -left-12 w-28 h-28 bg-indigo-100 rounded-full opacity-60 blur-xl z-[-1]"
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.6, 0.3, 0.6],
              }}
              transition={{
                duration: 9,
                delay: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
