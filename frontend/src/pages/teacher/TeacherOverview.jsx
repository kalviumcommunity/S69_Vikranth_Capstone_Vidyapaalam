
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";

const UsersIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const StarIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const ClockIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const CalendarIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const VideoIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);
const MessageIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const TeacherOverview = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('/api/sessions/teacher');
        setUpcoming(data.upcomingSessions || []);
        setPast(data.pastSessions || []);
      } catch (err) {
        console.error('Error fetching sessions:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalCount = upcoming.length + past.length;
  const stats = [
    { title: 'Total Sessions', value: totalCount.toString(), icon: <UsersIcon className="h-5 w-5 text-orange-500" /> },
    { title: 'Rating', value: '4.8', icon: <StarIcon className="h-5 w-5 text-orange-500" /> },
    { title: 'Upcoming', value: upcoming.length.toString(), icon: <ClockIcon className="h-5 w-5 text-orange-500" /> },
  ];

  const renderCard = (session, isPast) => (
    <motion.div
      key={session._id}
      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md overflow-hidden flex flex-col h-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 flex flex-col flex-grow gap-4">
        <div>
          <h4 className="text-base font-semibold text-gray-800">{session.studentName}</h4>
          <p className="text-sm text-gray-500">{session.topic} Session</p>
        </div>
        <div className="flex flex-col gap-1.5 text-sm text-gray-700">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-orange-500" />
            <span className="font-medium">{new Date(session.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-2 text-orange-500" />
            <span className="font-medium">{session.time}</span>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 pt-3 flex flex-col gap-2">
        {isPast ? (
          <button className="flex w-full justify-center items-center gap-1.5 text-sm font-medium border border-orange-500 text-orange-600 hover:bg-orange-50 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-400">
            <MessageIcon className="h-4 w-4" /> Message
          </button>
        ) : (
          <>
            <button className="flex w-full justify-center items-center gap-1.5 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-400">
              <VideoIcon className="h-4 w-4" /> Start
            </button>
            <button className="flex w-full justify-center items-center gap-1.5 text-sm font-medium border border-orange-500 text-orange-600 hover:bg-orange-50 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-400">
              <MessageIcon className="h-4 w-4" /> Chat
            </button>
          </>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl md:text-4xl font-bold">
          <span className="bg-orange-500 bg-clip-text text-transparent">Welcome back, Teacher!</span>
        </h2>
        <p className="mt-2 text-base md:text-lg text-gray-600">Here’s a snapshot of your teaching stats and sessions.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat, i) => (
          <motion.div key={i} className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-600">{stat.title}</h3>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="flex border-b border-gray-200">
          <button onClick={() => setActiveTab("upcoming")} className={`flex-1 py-3 px-4 text-center text-sm font-semibold transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-400 ${activeTab === "upcoming" ? "text-orange-600 border-b-2 border-orange-500" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-b-2 border-transparent"}`}>Upcoming ({upcoming.length})</button>
          <button onClick={() => setActiveTab("past")} className={`flex-1 py-3 px-4 text-center text-sm font-semibold transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-400 ${activeTab === "past" ? "text-orange-600 border-b-2 border-orange-500" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-b-2 border-transparent"}`}>Past ({past.length})</button>
        </div>
        <div className="p-4 sm:p-6 bg-gray-50/50">
          {loading ? (
            <p className="text-gray-500 text-center py-10">Loading sessions...</p>
          ) : activeTab === "upcoming" ? (
            upcoming.length === 0 ? (
              <div className="text-center py-10 px-4 space-y-3">
                <ClockIcon className="mx-auto h-10 w-10 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-800">No upcoming sessions</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">Looks like your schedule is clear! Update your availability to allow students to book new sessions.</p>
                <Link to="/teacher/availability" className="inline-flex items-center justify-center mt-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md px-5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">Set Availability</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {upcoming.map((s) => renderCard(s, false))}
              </div>
            )
          ) : past.length === 0 ? (
            <div className="text-center py-10 px-4 space-y-3">
              <UsersIcon className="mx-auto h-10 w-10 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-800">No past sessions yet</h3>
              <p className="text-sm text-gray-500">Your completed sessions will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {past.map((s) => renderCard(s, true))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherOverview;
