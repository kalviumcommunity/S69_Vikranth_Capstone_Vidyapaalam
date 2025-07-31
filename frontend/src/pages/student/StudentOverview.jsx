
// import React, { useState, useEffect } from "react"; // <--- ADDED useEffect import
// import { motion } from "framer-motion";
// import { Calendar, Clock } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useSession } from "../../contexts/SessionContext";
// import { useAuth } from "../../contexts/AuthContext"; // <--- ADDED useAuth import

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
//         {session.teacherInitials || session.teacherName?.slice(0, 2).toUpperCase()}
//       </div>
//       <div className="space-y-1">
//         <h3 className="text-lg font-semibold text-gray-800">
//           {session.teacherName || "Unknown Teacher"}
//         </h3>
//         {session.skill && <p className="text-sm text-gray-500">{session.skill} Teacher</p>}
//       </div>
//     </div>

//     <div className="mt-4 space-y-2">
//       <div className="flex items-center text-gray-600">
//         <Calendar className="w-5 h-5 mr-2 text-gray-500" />
//         <span>{new Date(session.dateTime).toLocaleDateString()}</span>
//       </div>
//       <div className="flex items-center text-gray-600">
//         <Clock className="w-5 h-5 mr-2 text-gray-500" />
//         <span>{session.timeRange || "N/A"}</span>
//       </div>
//     </div>

//     <div className="mt-6">
//       {/* No Join or Chat buttons for now */}
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
//   // --- CORRECTED DESTRUCTURING HERE ---
//   const {
//     studentUpcomingSessions: upcoming, // Alias to 'upcoming'
//     studentPastSessions: past,       // Alias to 'past'
//     loadingSessions: loading,        // Correct property name from SessionContext
//     sessionError: error,             // Correct property name from SessionContext
//     fetchStudentSessions,            // Correct function name from SessionContext
//   } = useSession();
//   // ------------------------------------

//   const [showPast, setShowPast] = useState(false);

//   // --- GET USER FROM AUTHCONTEXT, NOT SESSIONCONTEXT ---
//   const { user } = useAuth(); // Correct way to get user
//   // -----------------------------------------------------

//   const displayUserName = user?.name || "Student";

//   // --- ADDED useEffect for fetching student sessions ---
//   useEffect(() => {
//     // Optional console logs to verify user and role before fetching
//     console.log("StudentOverview useEffect: user =", user);
//     console.log("StudentOverview useEffect: user.role =", user?.role);

//     if (user && user.role === 'student') {
//       console.log("StudentOverview useEffect: Calling fetchStudentSessions...");
//       fetchStudentSessions();
//       const intervalId = setInterval(fetchStudentSessions, 60 * 1000);
//       return () => clearInterval(intervalId);
//     } else {
//       console.log("StudentOverview useEffect: User not a student or not logged in, not fetching sessions.");
//     }
//   }, [fetchStudentSessions, user]); // Dependencies

//   return (
//     <motion.div
//       className="max-w-5xl mx-auto p-6 space-y-8"
//       initial="hidden"
//       animate="show"
//       variants={container}
//     >
//       <motion.div variants={item} className="text-center">
//         <h2 className="text-3xl sm:text-4xl text-orange-600 font-bold">
//           Welcome back, {displayUserName}!
//         </h2>
//         <p className="text-gray-500">Here’s your learning sessions.</p>
//         {!user?.paymentAcknowledged && (
//           <p className="text-yellow-600 mt-2">
//             Note: No sessions will appear until payment is acknowledged.{" "}
//             <Link to="/book-session" className="underline">Book a session</Link> to get started.
//           </p>
//         )}
//       </motion.div>

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

//       {loading ? (
//         <motion.p variants={item} className="text-center text-gray-500 py-10">
//           Loading sessions...
//         </motion.p>
//       ) : error ? (
//         <motion.p variants={item} className="text-center text-red-500 py-10">
//           {error}
//         </motion.p>
//       ) : showPast ? (
//         // These lines should now work because `past` will be an array (even if empty)
//         past.length === 0 ? (
//           <EmptyState message="No past sessions recorded." />
//         ) : (
//           <motion.div variants={container} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {past.map((s) => (
//               <SessionCard key={s._id} session={s} isPast />
//             ))}
//           </motion.div>
//         )
//       ) : (
//         // These lines should now work because `upcoming` will be an array (even if empty)
//         upcoming.length === 0 ? (
//           <EmptyState
//             message="No upcoming sessions scheduled."
//             linkText="Find Teachers"
//             linkTo="/student/find-teacher"
//           />
//         ) : (
//           <motion.div variants={container} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {upcoming.map((s) => (
//               <SessionCard key={s._id} session={s} />
//             ))}
//           </motion.div>
//         )
//       )}
//     </motion.div>
//   );
// }




// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Calendar, Clock, Video, MessageCircle } from "lucide-react"; // <--- ADDED Video, MessageCircle
// import { Link } from "react-router-dom";
// import { useSession } from "../../contexts/SessionContext";
// import { useAuth } from "../../contexts/AuthContext";

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
//         {session.teacherInitials || session.teacherName?.slice(0, 2).toUpperCase()}
//       </div>
//       <div className="space-y-1">
//         <h3 className="text-lg font-semibold text-gray-800">
//           {session.teacherName || "Unknown Teacher"}
//         </h3>
//         {session.skill && <p className="text-sm text-gray-500">{session.skill} Teacher</p>}
//       </div>
//     </div>

//     <div className="mt-4 space-y-2">
//       <div className="flex items-center text-gray-600">
//         <Calendar className="w-5 h-5 mr-2 text-gray-500" />
//         <span>{new Date(session.dateTime).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
//       </div>
//       <div className="flex items-center text-gray-600">
//         <Clock className="w-5 h-5 mr-2 text-gray-500" />
//         {/* Using session.timeRange which should already be formatted like "HH:MM - HH:MM" */}
//         <span>{session.timeRange || "N/A"}</span>
//       </div>
//     </div>

//     <div className="mt-6 flex flex-col gap-2"> {/* Modified for button spacing */}
//       {isPast ? (
//         <button className="flex w-full justify-center items-center gap-1.5 text-sm font-medium border border-orange-500 text-orange-600 hover:bg-orange-50 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-400">
//           <MessageCircle className="h-4 w-4" /> Message
//         </button>
//       ) : (
//         <>
//           <button className="flex w-full justify-center items-center gap-1.5 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-400">
//             <Video className="h-4 w-4" /> Join Call
//           </button>
//           <button className="flex w-full justify-center items-center gap-1.5 text-sm font-medium border border-orange-500 text-orange-600 hover:bg-orange-50 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-400">
//             <MessageCircle className="h-4 w-4" /> Chat
//           </button>
//         </>
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
//   const {
//     studentUpcomingSessions: upcoming,
//     studentPastSessions: past,
//     loadingSessions: loading,
//     sessionError: error,
//     fetchStudentSessions,
//   } = useSession();

//   const [showPast, setShowPast] = useState(false);

//   const { user } = useAuth();

//   const displayUserName = user?.name || "Student";

//   useEffect(() => {
//     if (user && user.role === 'student') {
//       fetchStudentSessions();
//       const intervalId = setInterval(fetchStudentSessions, 60 * 1000);
//       return () => clearInterval(intervalId);
//     }
//   }, [fetchStudentSessions, user]);

//   return (
//     <motion.div
//       className="max-w-5xl mx-auto p-6 space-y-8"
//       initial="hidden"
//       animate="show"
//       variants={container}
//     >
//       <motion.div variants={item} className="text-center">
//         <h2 className="text-3xl sm:text-4xl text-orange-600 font-bold">
//           Welcome back, {displayUserName}!
//         </h2>
//         <p className="text-gray-500">Here’s your learning sessions.</p>
//         {!user?.paymentAcknowledged && (
//           <p className="text-yellow-600 mt-2">
//             Note: No sessions will appear until payment is acknowledged.{" "}
//             <Link to="/book-session" className="underline">Book a session</Link> to get started.
//           </p>
//         )}
//       </motion.div>

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

//       {loading ? (
//         <motion.p variants={item} className="text-center text-gray-500 py-10">
//           Loading sessions...
//         </motion.p>
//       ) : error ? (
//         <motion.p variants={item} className="text-center text-red-500 py-10">
//           {error}
//         </motion.p>
//       ) : showPast ? (
//         past.length === 0 ? (
//           <EmptyState message="No past sessions recorded." />
//         ) : (
//           <motion.div variants={container} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {past.map((s) => (
//               <SessionCard key={s._id} session={s} isPast />
//             ))}
//           </motion.div>
//         )
//       ) : (
//         upcoming.length === 0 ? (
//           <EmptyState
//             message="No upcoming sessions scheduled."
//             linkText="Find Teachers"
//             linkTo="/student/find-teacher"
//           />
//         ) : (
//           <motion.div variants={container} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {upcoming.map((s) => (
//               <SessionCard key={s._id} session={s} />
//             ))}
//           </motion.div>
//         )
//       )}
//     </motion.div>
//   );
// }



import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Video, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom"; // Link is already here, no need to add it again
import { useSession } from "../../contexts/SessionContext";
import { useAuth } from "../../contexts/AuthContext";

const container = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 },
};

// const SessionCard = ({ session, isPast }) => (
//   <motion.div
//     variants={item}
//     className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 flex flex-col justify-between"
//   >
//     <div className="flex items-center gap-4">
//       <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold">
//         {session.teacherInitials || session.teacherName?.slice(0, 2).toUpperCase()}
//       </div>
//       <div className="space-y-1">
//         <h3 className="text-lg font-semibold text-gray-800">
//           {session.teacherName || "Unknown Teacher"}
//         </h3>
//         {session.skill && <p className="text-sm text-gray-500">{session.skill} Teacher</p>}
//       </div>
//     </div>

//     <div className="mt-4 space-y-2">
//       <div className="flex items-center text-gray-600">
//         <Calendar className="w-5 h-5 mr-2 text-gray-500" />
//         <span>{new Date(session.dateTime).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
//       </div>
//       <div className="flex items-center text-gray-600">
//         <Clock className="w-5 h-5 mr-2 text-gray-500" />
//         <span>{session.timeRange || "N/A"}</span>
//       </div>
//     </div>

//     <div className="mt-6 flex flex-col gap-2">
//       {isPast ? (
//         <Link 
//           to={`/student/chat/${session.teacherId._id}`}
//           className="flex w-full justify-center items-center gap-1.5 text-sm font-medium border border-orange-500 text-orange-600 hover:bg-orange-50 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-400"
//         >
//           <MessageCircle className="h-4 w-4" /> Message
//         </Link>
//       ) : (
//         <>
//           <button className="flex w-full justify-center items-center gap-1.5 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-400">
//             <Video className="h-4 w-4" /> Join Call
//           </button>
//           <Link
//             to={`/student/chat/${session.teacherId._id}`}
//             className="flex w-full justify-center items-center gap-1.5 text-sm font-medium border border-orange-500 text-orange-600 hover:bg-orange-50 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-400"
//           >
//             <MessageCircle className="h-4 w-4" /> Chat
//           </Link>
//         </>
//       )}
//     </div>
//   </motion.div>
// );


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
        <span>{new Date(session.dateTime).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
      </div>
      <div className="flex items-center text-gray-600">
        <Clock className="w-5 h-5 mr-2 text-gray-500" />
        <span>{session.timeRange || "N/A"}</span>
      </div>
    </div>

    <div className="mt-6 flex flex-col gap-2">
      {isPast ? (
        <Link 
          to={`/student/chat/${session.teacherId?._id}`} // <-- FIXED: Added optional chaining
          className="flex w-full justify-center items-center gap-1.5 text-sm font-medium border border-orange-500 text-orange-600 hover:bg-orange-50 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-400"
        >
          <MessageCircle className="h-4 w-4" /> Message
        </Link>
      ) : (
        <>
          <button className="flex w-full justify-center items-center gap-1.5 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-400">
            <Video className="h-4 w-4" /> Join Call
          </button>
          <Link
            to={`/student/chat/${session.teacherId?._id}`} // <-- FIXED: Added optional chaining
            className="flex w-full justify-center items-center gap-1.5 text-sm font-medium border border-orange-500 text-orange-600 hover:bg-orange-50 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-400"
          >
            <MessageCircle className="h-4 w-4" /> Chat
          </Link>
        </>
      )}
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
  const {
    studentUpcomingSessions: upcoming,
    studentPastSessions: past,
    loadingSessions: loading,
    sessionError: error,
    fetchStudentSessions,
  } = useSession();

  const [showPast, setShowPast] = useState(false);

  const { user } = useAuth();

  const displayUserName = user?.name || "Student";

  useEffect(() => {
    if (user && user.role === 'student') {
      fetchStudentSessions();
      const intervalId = setInterval(fetchStudentSessions, 60 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [fetchStudentSessions, user]);

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
        {!user?.paymentAcknowledged && (
          <p className="text-yellow-600 mt-2">
            Note: No sessions will appear until payment is acknowledged.{" "}
            <Link to="/book-session" className="underline">Book a session</Link> to get started.
          </p>
        )}
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
      ) : (
        upcoming.length === 0 ? (
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
        )
      )}
    </motion.div>
  );
}



