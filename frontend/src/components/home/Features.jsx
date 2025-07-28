import { motion } from "framer-motion";
import { Video, MessageSquare, Star, Users, Calendar, Shield } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "HD Video Learning",
    description: "Crystal clear video calls with screen sharing and interactive whiteboards",
    gradient: "from-primary to-primary/70"
  },
  {
    icon: MessageSquare,
    title: "Real-time Chat",
    description: "Instant messaging with file sharing and code collaboration tools",
    gradient: "from-tertiary to-tertiary/70"
  },
  {
    icon: Star,
    title: "Smart Matching",
    description: "AI-powered mentor matching based on skills, availability, and ratings",
    gradient: "from-primary to-tertiary"
  },
  {
    icon: Users,
    title: "Global Community",
    description: "Connect with thousands of verified mentors and learners worldwide",
    gradient: "from-tertiary to-primary"
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description: "Book sessions that fit your timezone and availability preferences",
    gradient: "from-primary/80 to-tertiary/80"
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Protected transactions with escrow system and satisfaction guarantee",
    gradient: "from-tertiary/90 to-primary/90"
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
    <section className="py-20 bg-gradient-to-b from-background to-secondary/30 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-tertiary/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Title & Subtitle */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Next-Generation</span> Learning Platform
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Experience the future of education with cutting-edge technology designed to connect minds and transform learning
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants} className="group relative">
              <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50 h-full transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>

                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} p-0.5 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-foreground group-hover:text-primary transition-colors duration-300" />
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="relative">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Floating pulse effects */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                <div className="absolute top-1/2 -left-1 w-2 h-2 bg-tertiary/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse delay-200"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-tertiary p-0.5 rounded-full">
            <div className="bg-background rounded-full px-8 py-3">
              <span className="gradient-text font-semibold">
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
