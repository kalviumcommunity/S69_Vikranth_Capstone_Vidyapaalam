import { BookOpen, Calendar, MessageCircle, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: <BookOpen className="h-12 w-12 text-orange-600" />,
    title: "Browse Skills",
    description: "Explore our diverse range of skills taught by experienced mentors",
  },
  {
    icon: <UserCheck className="h-12 w-12 text-orange-600" />,
    title: "Choose a Mentor",
    description:
      "Select a mentor whose experience and teaching style match your needs",
  },
  {
    icon: <MessageCircle className="h-12 w-12 text-orange-600" />,
    title: "Connect",
    description: "Reach out to your chosen mentor to discuss your learning goals",
  },
  {
    icon: <Calendar className="h-12 w-12 text-orange-600" />,
    title: "Learn & Grow",
    description: "Schedule sessions, track your progress, and master new skills",
  },
];

const stepVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

const HowItWorks = () => {
  return (
    <section className="py-24 bg-gray-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl font-extrabold mb-6 text-gray-900"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }} // Only animate once when in view
            variants={stepVariants}
          >
            How VidyaPaalam Works
          </motion.h2>
          <motion.p
            className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }} // Only animate once when in view
            transition={{ delay: 0.2, duration: 0.6, ease: "easeInOut" }}
            variants={stepVariants}
          >
            Our simple process connects learners with the right mentors in just a
            few steps.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }} // Only animate once when in view
              transition={{ delay: index * 0.15, duration: 0.5, ease: "easeInOut" }}
              variants={stepVariants}
            >
              <motion.div className="mb-6" variants={stepVariants}>
                {step.icon}
              </motion.div>
              <motion.h3
                className="font-bold text-2xl mb-3 text-gray-900"
                variants={stepVariants}
              >
                {step.title}
              </motion.h3>
              <motion.p
                className="text-lg text-gray-600 leading-relaxed"
                variants={stepVariants}
              >
                {step.description}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;




// import { BookOpen, Calendar, MessageCircle, UserCheck } from "lucide-react";

// const steps = [
//   {
//     icon: <BookOpen className="h-12 w-12 text-orange-600" />,
//     title: "Browse Skills",
//     description: "Explore our diverse range of skills taught by experienced mentors",
//   },
//   {
//     icon: <UserCheck className="h-12 w-12 text-orange-600" />,
//     title: "Choose a Mentor",
//     description: "Select a mentor whose experience and teaching style match your needs",
//   },
//   {
//     icon: <MessageCircle className="h-12 w-12 text-orange-600" />,
//     title: "Connect",
//     description: "Reach out to your chosen mentor to discuss your learning goals",
//   },
//   {
//     icon: <Calendar className="h-12 w-12 text-orange-600" />,
//     title: "Learn & Grow",
//     description: "Schedule sessions, track your progress, and master new skills",
//   },
// ];

// const HowItWorks = () => {
//   return (
//     <section className="py-24 bg-gray-100">
//       <div className="container mx-auto px-6">
//         <div className="text-center mb-16">
//           <h2 className="text-4xl font-extrabold mb-6 text-gray-900">How VidyaPaalam Works</h2>
//           <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
//             Our simple process connects learners with the right mentors in just a few steps.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {steps.map((step, index) => (
//             <div
//               key={index}
//               className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center"
//             >
//               <div className="mb-6">
//                 {step.icon}
//               </div>
//               <h3 className="font-bold text-2xl mb-3 text-gray-900">{step.title}</h3>
//               <p className="text-lg text-gray-600 leading-relaxed">{step.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HowItWorks;