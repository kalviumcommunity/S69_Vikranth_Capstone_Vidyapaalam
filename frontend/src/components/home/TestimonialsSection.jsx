import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    content:
      "VidyaPaalam helped me connect with an amazing web development mentor. I went from coding novice to building my own projects in just three months!",
    author: "Anita S.",
    role: "Learner",
    avatar: "AS",
  },
  {
    id: 2,
    content:
      "Being a mentor on VidyaPaalam has been incredibly rewarding. I've shared my photography skills with students worldwide and even improved my own expertise.",
    author: "Rahul K.",
    role: "Mentor",
    avatar: "RK",
  },
  {
    id: 3,
    content:
      "The platform made it easy to find students interested in traditional cooking. I now have regular sessions teaching authentic recipes from my culture.",
    author: "Priya M.",
    role: "Mentor",
    avatar: "PM",
  },
];

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <motion.div
    ref={ref}
    className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${
      className || ''
    }`}
    {...props}
  />
));

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <motion.img
    ref={ref}
    className={`aspect-square h-full w-full ${className || ''}`}
    {...props}
  />
));

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <motion.div
    ref={ref}
    className={`flex h-full w-full items-center justify-center rounded-full bg-gray-400 ${
      className || ''
    }`}
    {...props}
  />
));

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
      staggerChildren: 0.2, // Stagger the animation of testimonials
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const testimonialVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const TestimonialsSection = () => {
  return (
    <motion.section
      className="py-24 bg-gray-50"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl font-extrabold mb-6 text-gray-900"
            variants={textVariants}
          >
            What Our Community Says
          </motion.h2>
          <motion.p
            className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed"
            variants={textVariants}
            transition={{ delay: 0.2 }}
          >
            Hear from mentors and learners who have experienced the power of
            skill-sharing on VidyaPaalam.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-md p-6"
              variants={testimonialVariants}
            >
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarFallback className="bg-orange-500 text-white font-semibold">
                    {testimonial.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg text-gray-900">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="italic text-gray-600">
                "{testimonial.content}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default TestimonialsSection;