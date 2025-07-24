// // src/pages/student/StudentOverview.jsx
// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Calendar, Clock, Video, MessageCircle } from "lucide-react";
// import { Link } from "react-router-dom";

// const container = {
//   hidden: { opacity: 0, y: 20 },
//   show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
// };
// const item = {
//   hidden: { opacity: 0, scale: 0.95 },
//   show: { opacity: 1, scale: 1 },
// };

// const SessionCard = ({ session, isPast }) => (
//   <motion.div
//     variants={item}
//     className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 flex flex-col justify-between"
//   >
//     <div className="flex items-center gap-4">
//       <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold">
//         {session.teacherInitials}
//       </div>
//       <div className="space-y-1">
//         <h3 className="text-lg font-semibold text-gray-800">
//           {session.teacherName}
//         </h3>
//         <p className="text-sm text-gray-500">{session.skill} Teacher</p>
//       </div>
//     </div>

//     <div className="mt-4 space-y-2">
//       <div className="flex items-center text-gray-600">
//         <Calendar className="w-5 h-5 mr-2 text-gray-500" />
//         <span>{new Date(session.date).toLocaleDateString()}</span>
//       </div>
//       <div className="flex items-center text-gray-600">
//         <Clock className="w-5 h-5 mr-2 text-gray-500" />
//         <span>{session.time}</span>
//       </div>
//     </div>

//     <div className="mt-6 flex gap-3">
//       {!isPast ? (
//         <>
//           <button
//             className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition"
//           >
//             <Video className="w-4 h-4 inline-block mr-1" />
//             Join
//           </button>
//           <Link
//             to={`/student/chat/${session._id}`}
//             className="flex-1 border border-gray-300 px-4 py-2 rounded-lg text-gray-700 flex items-center justify-center gap-1 hover:bg-gray-50 transition"
//           >
//             <MessageCircle className="w-4 h-4" />
//             Chat
//           </Link>
//         </>
//       ) : (
//         <Link
//           to={`/student/chat/${session._id}`}
//           className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-700 flex items-center justify-center gap-1 hover:bg-gray-50 transition"
//         >
//           <MessageCircle className="w-4 h-4" />
//           Chat
//         </Link>
//       )}
//     </div>
//   </motion.div>
// );

// const EmptyState = ({ message, linkText, linkTo }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.3 }}
//     className="text-center py-16"
//   >
//     <p className="text-gray-500 mb-4">{message}</p>
//     {linkText && linkTo && (
//       <Link
//         to={linkTo}
//         className="inline-block bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition"
//       >
//         {linkText}
//       </Link>
//     )}
//   </motion.div>
// );

// export default function StudentOverview() {
//   const [showPast, setShowPast] = useState(false);
//   const [upcoming, setUpcoming] = useState([]);
//   const [past, setPast] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // simulate fetch
//     const timer = setTimeout(() => {
//       const now = Date.now();
//       setUpcoming([
//         {
//           _id: "up1",
//           teacherName: "John Doe",
//           teacherInitials: "JD",
//           skill: "Mathematics",
//           date: new Date(now + 2 * 86400000),
//           time: "10:00 AM",
//         },
//         {
//           _id: "up2",
//           teacherName: "Emma Watson",
//           teacherInitials: "EW",
//           skill: "Physics",
//           date: new Date(now + 5 * 86400000),
//           time: "2:00 PM",
//         },
//       ]);
//       setPast([
//         {
//           _id: "pa1",
//           teacherName: "Mark Smith",
//           teacherInitials: "MS",
//           skill: "History",
//           date: new Date(now - 3 * 86400000),
//           time: "11:00 AM",
//         },
//         {
//           _id: "pa2",
//           teacherName: "Sophia Brown",
//           teacherInitials: "SB",
//           skill: "Chemistry",
//           date: new Date(now - 10 * 86400000),
//           time: "4:00 PM",
//         },
//       ]);
//       setLoading(false);
//     }, 800);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <motion.div
//       className="max-w-5xl mx-auto p-6 space-y-8"
//       initial="hidden"
//       animate="show"
//       variants={container}
//     >
//       {/* Header */}
//       <motion.div variants={item} className="text-center">
//         <h2 className="text-3xl sm:text-4xl text-orange-600 font-bold">Welcome back!</h2>
//         <p className="text-gray-500">Here’s your learning sessions.</p>
//       </motion.div>

//       {/* Toggle */}
//       <motion.div variants={item} className="flex justify-center gap-6 border-b pb-2">
//         {["Upcoming", "Past"].map((label) => {
//           const active = label === (showPast ? "Past" : "Upcoming");
//           return (
//             <button
//               key={label}
//               onClick={() => setShowPast(label === "Past")}
//               className={`pb-2 text-lg font-medium transition-colors ${
//                 active
//                   ? "border-b-2 border-orange-500 text-orange-600"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               {label}
//             </button>
//           );
//         })}
//       </motion.div>

//       {/* Content */}
//       {loading ? (
//         <motion.p
//           variants={item}
//           className="text-center text-gray-500 py-10"
//         >
//           Loading sessions...
//         </motion.p>
//       ) : showPast ? (
//         past.length === 0 ? (
//           <EmptyState message="No past sessions recorded." />
//         ) : (
//           <motion.div
//             variants={container}
//             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
//           >
//             {past.map((s) => (
//               <SessionCard key={s._id} session={s} isPast />
//             ))}
//           </motion.div>
//         )
//       ) : upcoming.length === 0 ? (
//         <EmptyState
//           message="No upcoming sessions scheduled."
//           linkText="Find Teachers"
//           linkTo="/student/find-teacher"
//         />
//       ) : (
//         <motion.div
//           variants={container}
//           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
//         >
//           {upcoming.map((s) => (
//             <SessionCard key={s._id} session={s} />
//           ))}
//         </motion.div>
//       )}
//     </motion.div>
//   );
// }

// // src/pages/student/StudentOverview.jsx
// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Calendar, Clock, Video, MessageCircle } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext.jsx"; // Import useAuth

// const container = {
//   hidden: { opacity: 0, y: 20 },
//   show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
// };
// const item = {
//   hidden: { opacity: 0, scale: 0.95 },
//   show: { opacity: 1, scale: 1 },
// };

// const SessionCard = ({ session, isPast }) => (
//   <motion.div
//     variants={item}
//     className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 flex flex-col justify-between"
//   >
//     <div className="flex items-center gap-4">
//       <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold">
//         {session.teacherInitials}
//       </div>
//       <div className="space-y-1">
//         <h3 className="text-lg font-semibold text-gray-800">
//           {session.teacherName}
//         </h3>
//         {/* Removed the 'Student' text, now it shows the skill if available */}
//         {session.skill && <p className="text-sm text-gray-500">{session.skill} Teacher</p>}
//       </div>
//     </div>

//     <div className="mt-4 space-y-2">
//       <div className="flex items-center text-gray-600">
//         <Calendar className="w-5 h-5 mr-2 text-gray-500" />
//         <span>{new Date(session.date).toLocaleDateString()}</span>
//       </div>
//       <div className="flex items-center text-gray-600">
//         <Clock className="w-5 h-5 mr-2 text-gray-500" />
//         <span>{session.time}</span>
//       </div>
//     </div>

//     <div className="mt-6 flex gap-3">
//       {!isPast ? (
//         <>
//           <button
//             className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition"
//           >
//             <Video className="w-4 h-4 inline-block mr-1" />
//             Join
//           </button>
//           <Link
//             to={`/student/chat/${session._id}`}
//             className="flex-1 border border-gray-300 px-4 py-2 rounded-lg text-gray-700 flex items-center justify-center gap-1 hover:bg-gray-50 transition"
//           >
//             <MessageCircle className="w-4 h-4" />
//             Chat
//           </Link>
//         </>
//       ) : (
//         <Link
//           to={`/student/chat/${session._id}`}
//           className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-700 flex items-center justify-center gap-1 hover:bg-gray-50 transition"
//         >
//           <MessageCircle className="w-4 h-4" />
//           Chat
//         </Link>
//       )}
//     </div>
//   </motion.div>
// );

// const EmptyState = ({ message, linkText, linkTo }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.3 }}
//     className="text-center py-16"
//   >
//     <p className="text-gray-500 mb-4">{message}</p>
//     {linkText && linkTo && (
//       <Link
//         to={linkTo}
//         className="inline-block bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition"
//       >
//         {linkText}
//       </Link>
//     )}
//   </motion.div>
// );

// export default function StudentOverview() {
//   const { user } = useAuth(); // Get the logged-in user object from AuthContext
//   const [showPast, setShowPast] = useState(false);
//   const [upcoming, setUpcoming] = useState([]);
//   const [past, setPast] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // simulate fetch
//     const timer = setTimeout(() => {
//       const now = Date.now();
//       setUpcoming([
//         {
//           _id: "up1",
//           teacherName: "John Doe",
//           teacherInitials: "JD",
//           skill: "Mathematics",
//           date: new Date(now + 2 * 86400000),
//           time: "10:00 AM",
//         },
//         {
//           _id: "up2",
//           teacherName: "Emma Watson",
//           teacherInitials: "EW",
//           skill: "Physics",
//           date: new Date(now + 5 * 86400000),
//           time: "2:00 PM",
//         },
//       ]);
//       setPast([
//         {
//           _id: "pa1",
//           teacherName: "Mark Smith",
//           teacherInitials: "MS",
//           skill: "History",
//           date: new Date(now - 3 * 86400000),
//           time: "11:00 AM",
//         },
//         {
//           _id: "pa2",
//           teacherName: "Sophia Brown",
//           teacherInitials: "SB",
//           skill: "Chemistry",
//           date: new Date(now - 10 * 86400000),
//           time: "4:00 PM",
//         },
//       ]);
//       setLoading(false);
//     }, 800);
//     return () => clearTimeout(timer);
//   }, []);

//   // Determine the display name for the welcome message
//   const displayUserName = user?.name || user?.email || "Student"; // Fallback to "Student" if name/email aren't available

//   return (
//     <motion.div
//       className="max-w-5xl mx-auto p-6 space-y-8"
//       initial="hidden"
//       animate="show"
//       variants={container}
//     >
//       {/* Header */}
//       <motion.div variants={item} className="text-center">
//         {/* Personalize the welcome message */}
//         <h2 className="text-3xl sm:text-4xl text-orange-600 font-bold">
//           Welcome back, {displayUserName}!
//         </h2>
//         <p className="text-gray-500">Here’s your learning sessions.</p>
//       </motion.div>

//       {/* Toggle */}
//       <motion.div variants={item} className="flex justify-center gap-6 border-b pb-2">
//         {["Upcoming", "Past"].map((label) => {
//           const active = label === (showPast ? "Past" : "Upcoming");
//           return (
//             <button
//               key={label}
//               onClick={() => setShowPast(label === "Past")}
//               className={`pb-2 text-lg font-medium transition-colors ${
//                 active
//                   ? "border-b-2 border-orange-500 text-orange-600"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               {label}
//             </button>
//           );
//         })}
//       </motion.div>

//       {/* Content */}
//       {loading ? (
//         <motion.p
//           variants={item}
//           className="text-center text-gray-500 py-10"
//         >
//           Loading sessions...
//         </motion.p>
//       ) : showPast ? (
//         past.length === 0 ? (
//           <EmptyState message="No past sessions recorded." />
//         ) : (
//           <motion.div
//             variants={container}
//             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
//           >
//             {past.map((s) => (
//               <SessionCard key={s._id} session={s} isPast />
//             ))}
//           </motion.div>
//         )
//       ) : upcoming.length === 0 ? (
//         <EmptyState
//           message="No upcoming sessions scheduled."
//           linkText="Find Teachers"
//           linkTo="/student/find-teacher"
//         />
//       ) : (
//         <motion.div
//           variants={container}
//           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
//         >
//           {upcoming.map((s) => (
//             <SessionCard key={s._id} session={s} />
//           ))}
//         </motion.div>
//       )}
//     </motion.div>
//   );
// }







import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useSession } from "../../contexts/SessionContext";

const container = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 },
};

const SessionCard = ({ session, isPast }) => (
  <motion.div
    variants={item}
    className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 flex flex-col justify-between"
  >
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold">
        {session.teacherInitials || session.teacherName?.slice(0, 2).toUpperCase()}
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-800">
          {session.teacherName || "Unknown Teacher"}
        </h3>
        {session.skill && <p className="text-sm text-gray-500">{session.skill} Teacher</p>}
      </div>
    </div>

    <div className="mt-4 space-y-2">
      <div className="flex items-center text-gray-600">
        <Calendar className="w-5 h-5 mr-2 text-gray-500" />
        <span>{new Date(session.date).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center text-gray-600">
        <Clock className="w-5 h-5 mr-2 text-gray-500" />
        <span>{session.time || "N/A"}</span>
      </div>
    </div>

    <div className="mt-6">
      {/* No Join or Chat buttons for now */}
    </div>
  </motion.div>
);

const EmptyState = ({ message, linkText, linkTo }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="text-center py-16"
  >
    <p className="text-gray-500 mb-4">{message}</p>
    {linkText && linkTo && (
      <Link
        to={linkTo}
        className="inline-block bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition"
      >
        {linkText}
      </Link>
    )}
  </motion.div>
);

export default function StudentOverview() {
  const { upcoming, past, loading, error, fetchSessions, handlePaymentSuccess } = useSession();
  const [showPast, setShowPast] = useState(false);

  const displayUserName = "Student"; // Fallback since user is now in AuthContext

  return (
    <motion.div
      className="max-w-5xl mx-auto p-6 space-y-8"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.div variants={item} className="text-center">
        <h2 className="text-3xl sm:text-4xl text-orange-600 font-bold">
          Welcome back, {displayUserName}!
        </h2>
        <p className="text-gray-500">Here’s your learning sessions.</p>
      </motion.div>

      <motion.div variants={item} className="flex justify-center gap-6 border-b pb-2">
        {["Upcoming", "Past"].map((label) => {
          const active = label === (showPast ? "Past" : "Upcoming");
          return (
            <button
              key={label}
              onClick={() => setShowPast(label === "Past")}
              className={`pb-2 text-lg font-medium transition-colors ${
                active
                  ? "border-b-2 border-orange-500 text-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          );
        })}
      </motion.div>

      {loading ? (
        <motion.p variants={item} className="text-center text-gray-500 py-10">
          Loading sessions...
        </motion.p>
      ) : error ? (
        <motion.p variants={item} className="text-center text-red-500 py-10">
          {error}
        </motion.p>
      ) : showPast ? (
        past.length === 0 ? (
          <EmptyState message="No past sessions recorded." />
        ) : (
          <motion.div variants={container} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {past.map((s) => (
              <SessionCard key={s._id} session={s} isPast />
            ))}
          </motion.div>
        )
      ) : upcoming.length === 0 ? (
        <EmptyState
          message="No upcoming sessions scheduled."
          linkText="Find Teachers"
          linkTo="/student/find-teacher"
        />
      ) : (
        <motion.div variants={container} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcoming.map((s) => (
            <SessionCard key={s._id} session={s} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}