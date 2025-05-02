import { motion } from "framer-motion";
import { useState } from "react";
import {
  FiTrendingUp,
  FiBarChart2,
  FiCalendar,
  FiClock,
  FiAward,
  FiAlertTriangle,
  FiCheckCircle,
  FiPieChart,
  FiActivity,
  FiArrowUp,
  FiArrowDown,
  FiSettings,
} from "react-icons/fi";

const PerformanceDashboard = () => {
  const [activeChartTab, setActiveChartTab] = useState("score");

  // Generate chart paths based on active tab
  const getChartPath = () => {
    switch (activeChartTab) {
      case "score":
        return "M0,120 C20,100 40,110 60,95 C80,80 100,90 120,70 C140,50 160,60 180,45 C200,30 220,40 240,35 C260,30 280,25 300,20";
      case "time":
        return "M0,40 C20,60 40,70 60,55 C80,40 100,60 120,80 C140,95 160,80 180,65 C200,50 220,60 240,55 C260,50 280,35 300,45";
      case "accuracy":
        return "M0,70 C20,60 40,50 60,65 C80,80 100,85 120,60 C140,40 160,50 180,70 C200,85 220,75 240,60 C260,50 280,60 300,40";
      default:
        return "M0,120 C20,100 40,110 60,95 C80,80 100,90 120,70 C140,50 160,60 180,45 C200,30 220,40 240,35 C260,30 280,25 300,20";
    }
  };

  // Get the gradient colors based on active tab
  const getGradientColors = () => {
    switch (activeChartTab) {
      case "score":
        return { start: "#2563eb", end: "#ffffff" };
      case "time":
        return { start: "#10b981", end: "#ffffff" };
      case "accuracy":
        return { start: "#8b5cf6", end: "#ffffff" };
      default:
        return { start: "#2563eb", end: "#ffffff" };
    }
  };

  const gradientColors = getGradientColors();
  const chartPath = getChartPath();

  return (
    <section
      id="performance-dashboard"
      className="md:py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-50 rounded-full opacity-50 blur-3xl -z-10"></div>
      <div className="absolute bottom-20 -left-40 w-96 h-96 bg-indigo-50 rounded-full opacity-50 blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            Powerful Performance Analytics
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed"
          >
            Track your progress in real-time and identify areas for improvement
            with detailed analytics and actionable insights
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="border-b border-gray-200 bg-gray-50 px-4 sm:px-6 md:px-8 py-4 md:py-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg md:text-xl font-semibold flex items-center">
                  <FiPieChart className="mr-2 text-blue-600" />
                  Your GCP Certification Dashboard
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Professional Cloud Architect
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm text-gray-500 flex items-center">
                  <FiActivity className="mr-1 text-green-500" /> Last updated:
                  Today
                </span>
                <div className="relative">
                  <select className="appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm">
                    <option>Last 30 days</option>
                    <option>Last 60 days</option>
                    <option>Last 90 days</option>
                    <option>All time</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8">
            {/* Performance Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              {[
                {
                  icon: FiBarChart2,
                  title: "Overall Score",
                  value: "78%",
                  change: "+5%",
                  changePositive: true,
                  color: "blue",
                },
                {
                  icon: FiCheckCircle,
                  title: "Tests Completed",
                  value: "12",
                  change: "+3",
                  changePositive: true,
                  color: "green",
                },
                {
                  icon: FiClock,
                  title: "Avg. Completion Time",
                  value: "68 min",
                  change: "-4 min",
                  changePositive: true,
                  color: "purple",
                },
                {
                  icon: FiAward,
                  title: "Performance Rank",
                  value: "Top 15%",
                  change: "+7%",
                  changePositive: true,
                  color: "orange",
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                  className="bg-white rounded-xl border border-gray-100 p-5 md:p-6 shadow-sm transition-all hover:border-gray-200"
                >
                  <div
                    className={`w-12 h-12 rounded-full bg-${stat.color}-100 flex items-center justify-center mb-4`}
                  >
                    <stat.icon className={`text-${stat.color}-600 text-xl`} />
                  </div>
                  <h4 className="text-gray-500 text-sm font-medium mb-2">
                    {stat.title}
                  </h4>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl md:text-3xl font-bold text-gray-800">
                      {stat.value}
                    </div>
                    <div
                      className={`flex items-center ${stat.changePositive ? "text-green-500" : "text-red-500"}`}
                    >
                      {stat.changePositive ? (
                        <FiArrowUp className="mr-1" />
                      ) : (
                        <FiArrowDown className="mr-1" />
                      )}
                      <span className="text-sm font-medium">{stat.change}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Skill Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 md:p-6"
              >
                <h3 className="text-lg font-semibold mb-6 flex items-center">
                  <FiBarChart2 className="mr-2 text-green-500" />
                  Skill Proficiency
                </h3>
                <div className="space-y-5">
                  {[
                    {
                      name: "Designing secure applications",
                      proficiency: 85,
                      color: "green",
                    },
                    {
                      name: "Managing GCP resources",
                      proficiency: 72,
                      color: "blue",
                    },
                    {
                      name: "Optimizing technical processes",
                      proficiency: 68,
                      color: "purple",
                    },
                    {
                      name: "Planning & configuring networks",
                      proficiency: 58,
                      color: "orange",
                    },
                    {
                      name: "Reliability & disaster recovery",
                      proficiency: 45,
                      color: "red",
                    },
                  ].map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {skill.name}
                        </span>
                        <span className="text-sm font-semibold text-gray-700">
                          {skill.proficiency}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                          viewport={{ once: true }}
                          className={`bg-gradient-to-r from-${skill.color}-500 to-${skill.color}-400 h-2.5 rounded-full`}
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 md:p-6"
              >
                <h3 className="text-lg font-semibold mb-5 flex items-center">
                  <FiSettings className="mr-2 text-orange-500" />
                  Improvement Areas
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: FiAlertTriangle,
                      color: "red",
                      title: "Reliability & Disaster Recovery",
                      description:
                        "Improve your knowledge of GCP reliability concepts and design principles",
                    },
                    {
                      icon: FiAlertTriangle,
                      color: "orange",
                      title: "Network Planning",
                      description:
                        "Focus on understanding VPC design and implementation scenarios",
                    },
                    {
                      icon: FiCheckCircle,
                      color: "green",
                      title: "Recommended Resources",
                      description:
                        "GCP official documentation on reliability engineering practices",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div
                        className={`w-10 h-10 rounded-full bg-${item.color}-100 flex-shrink-0 flex items-center justify-center mr-4`}
                      >
                        <item.icon className={`text-${item.color}-600`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1 text-gray-800">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PerformanceDashboard;
