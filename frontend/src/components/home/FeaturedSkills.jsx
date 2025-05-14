import { useState } from "react";
import SkillGrid from "../skills/SkillGrid"; // Assuming SkillGrid is correctly imported
import { mockSkills } from "@/data/mockData"; // Assuming mockData is correctly imported
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence

const FeaturedSkills = () => {
  const [visibleSkills, setVisibleSkills] = useState(mockSkills.slice(0, 4));
  const [showingAll, setShowingAll] = useState(false);

  const handleShowMore = () => {
    if (showingAll) {
      setVisibleSkills(mockSkills.slice(0, 4));
      setShowingAll(false);
    } else {
      setVisibleSkills(mockSkills);
      setShowingAll(true);
    }
  };

  // Animation variants for the section entrance
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Animation variants for the heading and paragraph
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    // Use motion.section for potential entrance animation
    <motion.section
      className="py-32 container mx-auto px-8"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible" // Trigger animation when section scrolls into view
      viewport={{ once: true, amount: 0.1 }} // Adjust viewport settings as needed
    >
      <div className="text-center mb-20">
        <motion.h2
          className="text-5xl font-bold mb-8 text-gray-900 tracking-tight"
          variants={textVariants}
        >
          Featured Skills
        </motion.h2>
        <motion.p
          className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
          variants={textVariants}
          transition={{ delay: 0.2 }} // Add a slight delay to the paragraph
        >
          Dive into a world of knowledge with our carefully curated featured
          skills. From mastering creative arts to gaining technical expertise,
          discover your next passion.
        </motion.p>
      </div>

      {/* Wrap SkillGrid with motion.div and add the layout prop */}
      {/* This will automatically animate the container's size change */}
      <motion.div
        layout // Enable automatic layout animation
        transition={{ duration: 0.5, type: "spring", stiffness: 70, damping: 15 }} // Customize animation
      >
        <SkillGrid skills={visibleSkills} />
      </motion.div>

      <div className="mt-20 text-center">
        <motion.button // Add subtle animation to the button
          className="px-8 py-4 rounded-lg bg-orange-500 text-white font-semibold text-xl hover:bg-orange-600 transition-colors shadow-md"
          onClick={handleShowMore}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          // Use AnimatePresence and key to animate button text change smoothly
          // Note: requires overflow hidden on parent if text size changes drastically
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={showingAll ? "less" : "more"}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {showingAll ? "Show Less Skills" : "Show More Skills"}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.section>
  );
};

export default FeaturedSkills;