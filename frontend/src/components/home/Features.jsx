import { Video, MessageSquare, Calendar, Shield, Search, TrendingUp } from "lucide-react"; 
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const features = [
  {
    icon: Video,
    title: "HD Video Learning",
    description: "Crystal clear video calls with screen sharing and interactive whiteboards",
    gradient: "from-orange-500 to-orange-300"
  },
  {
    icon: MessageSquare,
    title: "Real-time Chat",
    description: "Instant messaging with file sharing and code collaboration tools",
    gradient: "from-blue-600 to-blue-400"
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description: "Book sessions that fit your timezone and availability preferences",
    gradient: "from-orange-500 to-blue-600"
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Protected transactions with escrow system and satisfaction guarantee",
    gradient: "from-blue-500 to-orange-400"
  },
  {
    icon: Search, 
    title: "Find Your Perfect Mentor",
    description: "Browse profiles, compare skills, and find the ideal teacher for your learning needs.",
    gradient: "from-green-500 to-teal-400" 
  },
  {
    icon: TrendingUp, 
    title: "Personalized Learning Paths",
    description: "Receive tailored guidance and track your progress with dedicated one-on-one mentorship.",
    gradient: "from-purple-500 to-pink-400" 
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const FutureFeatures = () => {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative background bubbles */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-orange-100 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-orange-500">
            Next-Generation Learning Platform
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience the future of education with cutting-edge technology designed to connect minds and transform learning.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants} className="group relative">
              <div className="relative bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-500 h-full">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>

                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} p-1 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="w-full h-full rounded-xl bg-white flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-gray-800 group-hover:text-orange-500 transition-colors duration-300" />
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="relative">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Floating animation dots */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                <div className="absolute top-1/2 -left-1 w-2 h-2 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse delay-200"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-blue-500 p-1 rounded-full">
            <div className="bg-white rounded-full px-8 py-3">
              <span className="text-orange-500 font-semibold text-lg">
                Ready to Transform Your Learning Journey?
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FutureFeatures;
