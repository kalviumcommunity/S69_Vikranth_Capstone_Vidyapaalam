// // src/pages/student/FindTeacher.jsx
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { Search, Filter, Tag, Star, MapPin } from "lucide-react";
// import { motion } from "framer-motion";

// const subjects = [
//   "All Subjects",
//   "Mathematics",
//   "Physics",
//   "English",
//   "History",
//   "Chemistry",
//   "Biology",
//   "Geography",
// ];
// const ratingOptions = [
//   { label: "Any Rating", value: 0 },
//   { label: "3★ & up", value: 3 },
//   { label: "4★ & up", value: 4 },
//   { label: "4.5★ & up", value: 4.5 },
// ];
// const priceRanges = [
//   { label: "Any Price", min: 0, max: Infinity },
//   { label: "$0 – $50", min: 0, max: 50 },
//   { label: "$50 – $100", min: 50, max: 100 },
//   { label: "$100+", min: 100, max: Infinity },
// ];

// // Mock teacher data
// const teachers = [
//   {
//     id: 1,
//     name: "Maria Johnson",
//     subject: "Yoga",
//     rating: 4.8,
//     location: "New York, NY",
//     fee: 30,
//     available: true,
//     bio: "Certified yoga instructor with 5+ years teaching Hatha & Vinyasa flows.",
//   },
//   {
//     id: 2,
//     name: "David Lee",
//     subject: "Guitar",
//     rating: 4.9,
//     location: "Los Angeles, CA",
//     fee: 40,
//     available: false,
//     bio: "Professional guitarist, 10+ years performing & teaching classical & electric guitar.",
//   },
//   {
//     id: 3,
//     name: "Alice Chen",
//     subject: "Mathematics",
//     rating: 4.5,
//     location: "Chicago, IL",
//     fee: 45,
//     available: true,
//     bio: "PhD in Math, specializing in algebra & calculus, 8 years of tutoring experience.",
//   },
//   // …add more as desired…
// ];

// const containerVariants = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: { staggerChildren: 0.1 }
//   }
// };
// const cardVariants = {
//   hidden: { opacity: 0, y: 20 },
//   show:  { opacity: 1, y: 0 },
// };

// export default function FindTeacher() {
//   const [search, setSearch] = useState("");
//   const [open, setOpen] = useState(false);
//   const [subject, setSubject] = useState(subjects[0]);
//   const [rating, setRating] = useState(ratingOptions[0].value);
//   const [priceRange, setPriceRange] = useState(priceRanges[0]);
//   const [availableOnly, setAvailableOnly] = useState(false);

//   const filtered = teachers.filter(t => {
//     const matchName = t.name.toLowerCase().includes(search.toLowerCase());
//     const matchSubject = subject === subjects[0] || t.subject === subject;
//     const matchRating = t.rating >= rating;
//     const matchPrice = priceRange.min <= t.fee && t.fee <= priceRange.max;
//     const matchAvail = !availableOnly || t.available;
//     return matchName && matchSubject && matchRating && matchPrice && matchAvail;
//   });

//   return (
//     <motion.div
//       className="max-w-6xl mx-auto p-6 space-y-6"
//       initial="hidden"
//       animate="show"
//       variants={containerVariants}
//     >
//       {/* Title */}
//       <motion.header variants={cardVariants} className="text-center">
//         <h1 className="text-3xl font-bold text-orange-600">
//           Find Your Perfect Teacher
//         </h1>
//         <p className="text-gray-600">
//           Search and filter expert instructors.
//         </p>
//       </motion.header>

//       {/* Search & Filter Toggle */}
//       <motion.div variants={cardVariants} className="bg-white shadow rounded-lg p-4">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//               placeholder="Search by name…"
//               className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//             />
//           </div>
//           <button
//             onClick={() => setOpen(o => !o)}
//             className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
//           >
//             <Filter className="w-5 h-5" />
//             {open ? "Hide Filters" : "Show Filters"}
//           </button>
//         </div>
//         <div
//           className={`mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 transition-all duration-300 ${
//             open
//               ? "max-h-screen opacity-100"
//               : "max-h-0 opacity-0"
//           }`}
//         >
//           {/* Subject */}
//           <div className="flex items-center gap-2">
//             <Tag className="w-5 h-5 text-gray-500" />
//             <select
//               value={subject}
//               onChange={e => setSubject(e.target.value)}
//               className="flex-1 py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
//             >
//               {subjects.map(s => (
//                 <option key={s} value={s}>{s}</option>
//               ))}
//             </select>
//           </div>
//           {/* Rating */}
//           <div className="flex items-center gap-2">
//             <Star className="w-5 h-5 text-gray-500" />
//             <select
//               value={rating}
//               onChange={e => setRating(parseFloat(e.target.value))}
//               className="flex-1 py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
//             >
//               {ratingOptions.map(o => (
//                 <option key={o.value} value={o.value}>{o.label}</option>
//               ))}
//             </select>
//           </div>
//           {/* Price */}
//           <div className="flex items-center gap-2">
//             <MapPin className="w-5 h-5 text-gray-500" />
//             <select
//               value={priceRange.label}
//               onChange={e => {
//                 const found = priceRanges.find(r => r.label === e.target.value);
//                 if (found) setPriceRange(found);
//               }}
//               className="flex-1 py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
//             >
//               {priceRanges.map(r => (
//                 <option key={r.label} value={r.label}>{r.label}</option>
//               ))}
//             </select>
//           </div>
//           {/* Available only */}
//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={availableOnly}
//               onChange={e => setAvailableOnly(e.target.checked)}
//               className="h-5 w-5 text-green-600 border rounded focus:ring-2 focus:ring-green-400"
//             />
//             Available only
//           </label>
//           {/* Clear */}
//           <div className="md:col-span-4 flex justify-end">
//             <button
//               onClick={() => {
//                 setSearch("");
//                 setSubject(subjects[0]);
//                 setRating(ratingOptions[0].value);
//                 setPriceRange(priceRanges[0]);
//                 setAvailableOnly(false);
//               }}
//               className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
//             >
//               Clear Filters
//             </button>
//           </div>
//         </div>
//       </motion.div>

//       {/* Results count */}
//       <motion.h2 variants={cardVariants} className="text-xl font-semibold">
//         {filtered.length} Teacher{filtered.length !== 1 && "s"} Found
//       </motion.h2>

//       {/* Cards Grid */}
//       <motion.div
//         variants={containerVariants}
//         className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
//       >
//         {filtered.map(t => (
//           <motion.div
//             key={t.id}
//             variants={cardVariants}
//             whileHover={{ scale: 1.03 }}
//             className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col"
//           >
//             <div className="flex items-center justify-between">
//               <h3 className="text-xl font-bold text-gray-800">{t.name}</h3>
//               {!t.available && (
//                 <span className="text-sm px-2 py-1 bg-red-100 text-red-600 rounded">
//                   Booked
//                 </span>
//               )}
//             </div>
//             <p className="mt-2 text-gray-600 flex items-center gap-1">
//               <Tag className="w-4 h-4" /> {t.subject}
//             </p>
//             <p className="mt-1 text-gray-600 flex items-center gap-1">
//               <Star className="w-4 h-4 text-yellow-500" /> {t.rating}
//             </p>
//             <p className="mt-1 text-gray-600 flex items-center gap-1">
//               <MapPin className="w-4 h-4 text-blue-500" /> {t.location}
//             </p>
//             <p className="mt-4 text-gray-700 flex-1 line-clamp-3">{t.bio}</p>
//             <div className="mt-4 flex items-center justify-between">
//               <div className="text-lg font-semibold text-orange-600">
//                 ${t.fee}/hr
//               </div>
//               <Link
//                 to={`/student/teacher/${t.id}`}
//                 className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
//               >
//                 View Profile
//               </Link>
//             </div>
//           </motion.div>
//         ))}
//       </motion.div>

//       {filtered.length === 0 && (
//         <motion.p variants={cardVariants} className="text-center text-gray-500 py-10">
//           No teachers match your criteria.
//         </motion.p>
//       )}
//     </motion.div>
//   );
// }





// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Search } from "lucide-react";
// import { motion } from "framer-motion";
// import { useAuth } from "../../contexts/AuthContext";

// const containerVariants = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: { staggerChildren: 0.1 }
//   }
// };
// const cardVariants = {
//   hidden: { opacity: 0, y: 20 },
//   show: { opacity: 1, y: 0 },
// };

// export default function FindTeacher() {
//   const { api } = useAuth();
//   const [search, setSearch] = useState("");
//   const [teachers, setTeachers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchTeachers = async () => {
//       setIsLoading(true);
//       try {
//         if (!api) {
//           throw new Error("API instance is undefined");
//         }
//         const url = api.defaults.baseURL + "/api/teacher-profiles";
//         console.log("DEBUG: Fetching from", url);
//         const response = await api.get("/api/teacher-profiles");
//         console.log("DEBUG: Response status", response.status);
//         console.log("DEBUG: Response data", response.data);
//         const formattedTeachers = response.data.map(profile => ({
//           _id: profile._id,
//           name: profile.userId?.name || profile.name || "Unknown Teacher",
//           teacherProfile: {
//             teachingSkills: profile.userId?.teachingSkills || profile.skills || [],
//             fee: profile.hourlyRate || 0,
//             bio: profile.aboutMe || "No bio available",
//           },
//         }));
//         console.log("DEBUG: Formatted teachers", formattedTeachers);
//         setTeachers(formattedTeachers);
//       } catch (error) {
//         console.error("Error fetching teacher profiles:", {
//           message: error.message,
//           status: error.response?.status,
//           data: error.response?.data,
//           baseURL: api?.defaults?.baseURL
//         });
//         setTeachers([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchTeachers();
//   }, [api]);

//   const filtered = teachers.filter(t => 
//     search === "" ||
//     t.name.toLowerCase().includes(search.toLowerCase()) ||
//     (t.teacherProfile?.teachingSkills || []).some(skill =>
//       skill.toLowerCase().includes(search.toLowerCase())
//     )
//   );

//   return (
//     <motion.div
//       className="max-w-6xl mx-auto p-6 space-y-6"
//       initial="hidden"
//       animate="show"
//       variants={containerVariants}
//     >
//       <motion.header variants={cardVariants} className="text-center">
//         <h1 className="text-3xl font-bold text-orange-600">
//           Find Your Perfect Teacher
//         </h1>
//         <p className="text-gray-600">
//           Search expert instructors by name or subject.
//         </p>
//       </motion.header>

//       <motion.div variants={cardVariants} className="bg-white shadow rounded-lg p-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             placeholder="Search by name or subject…"
//             className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//           />
//         </div>
//       </motion.div>

//       <motion.h2 variants={cardVariants} className="text-xl font-semibold">
//         {isLoading ? "Loading..." : `${filtered.length} Teacher${filtered.length !== 1 ? "s" : ""} Found`}
//       </motion.h2>

//       <motion.div
//         variants={containerVariants}
//         className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
//       >
//         {filtered.map(t => (
//           <motion.div
//             key={t._id}
//             variants={cardVariants}
//             whileHover={{ scale: 1.03 }}
//             className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col"
//           >
//             <h3 className="text-xl font-bold text-gray-800">{t.name}</h3>
//             <p className="mt-2 text-gray-600 flex items-center gap-1">
//               {(t.teacherProfile?.teachingSkills || []).join(", ") || "N/A"}
//             </p>
//             <p className="mt-2 text-lg font-semibold text-orange-600">
//               ₹{t.teacherProfile?.fee || 0}/hr
//             </p>
//             <p className="mt-4 text-gray-700 flex-1 line-clamp-3">
//               {t.teacherProfile?.bio || "No bio available"}
//             </p>
//             <div className="mt-4 flex justify-end">
//               <Link
//                 to={`/student/teacher/${t._id}`}
//                 className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
//               >
//                 View Profile
//               </Link>
//             </div>
//           </motion.div>
//         ))}
//       </motion.div>

//       {!isLoading && filtered.length === 0 && (
//         <motion.p variants={cardVariants} className="text-center text-gray-500 py-10">
//           No teachers found.
//         </motion.p>
//       )}
//     </motion.div>
//   );
// }







import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Tag, Star, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";

const subjects = [
  "All Skills",
  "Painting",
  "Music",
  "Cooking",
  "Programming",
  "Yoga",
  "Dancing",
  "Photography",
  "Creative Writing",
  "Languages",
  "Arts & Crafts",
  "Gardening",
  "Fitness & Exercise",
];
const ratingOptions = [
  { label: "Any Rating", value: 0 },
  { label: "3★ & up", value: 3 },
  { label: "4★ & up", value: 4 },
  { label: "4.5★ & up", value: 4.5 },
];
const priceRanges = [
  { label: "Any Price", min: 0, max: Infinity },
  { label: "₹0 – ₹50", min: 0, max: 50 },
  { label: "₹50 – ₹100", min: 50, max: 100 },
  { label: "₹100+", min: 100, max: Infinity },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function FindTeacher() {
  const { api } = useAuth();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState(subjects[0]);
  const [rating, setRating] = useState(ratingOptions[0].value);
  const [priceRange, setPriceRange] = useState(priceRanges[0]);
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      setIsLoading(true);
      try {
        if (!api) {
          throw new Error("API instance is undefined");
        }
        const response = await api.get("/api/teacher-profiles");
        const formattedTeachers = response.data.map(profile => ({
          _id: profile._id,
          name: profile.userId?.name || profile.name || "Unknown Teacher",
          teacherProfile: {
            avatarUrl: profile.avatar?.url || "https://via.placeholder.com/64",
            teachingSkills: profile.userId?.teachingSkills || profile.skills || [],
            fee: profile.hourlyRate || 0,
            bio: profile.aboutMe || "No bio available",
            availability: profile.availability || false,
          },
        }));
        setTeachers(formattedTeachers);
      } catch (error) {
        console.error("Error fetching teacher profiles:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          baseURL: api?.defaults?.baseURL
        });
        setTeachers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeachers();
  }, [api]);

  const filtered = teachers.filter(t => {
    const matchName = t.name.toLowerCase().includes(search.toLowerCase());
    const matchSubject = subject === subjects[0] || 
      (t.teacherProfile?.teachingSkills || []).some(skill => skill === subject);
    const matchRating = rating === 0 || t.teacherProfile?.rating >= rating;
    const matchPrice = priceRange.min <= t.teacherProfile.fee && t.teacherProfile.fee <= priceRange.max;
    return matchName && matchSubject && matchRating && matchPrice;
  });

  return (
    <motion.div
      className="w-full min-h-screen p-6 bg-white"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.header variants={cardVariants} className="text-center mb-6">
        <h1 className="text-3xl font-bold text-orange-600">
          Find Your Perfect Teacher
        </h1>
        <p className="text-gray-600">Search and filter expert instructors.</p>
      </motion.header>

      <motion.div variants={cardVariants} className="bg-white shadow rounded-lg p-4 mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name…"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            onClick={() => setOpen(o => !o)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            <Filter className="w-5 h-5" />
            {open ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div
          className={`mt-4 flex flex-row gap-4 transition-all duration-300 overflow-hidden ${
            open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-gray-500" />
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-40 py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-gray-500" />
            <select
              value={rating}
              onChange={e => setRating(parseFloat(e.target.value))}
              className="w-40 py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {ratingOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-500" />
            <select
              value={priceRange.label}
              onChange={e => {
                const found = priceRanges.find(r => r.label === e.target.value);
                if (found) setPriceRange(found);
              }}
              className="w-40 py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {priceRanges.map(r => (
                <option key={r.label} value={r.label}>{r.label}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => {
                setSearch("");
                setSubject(subjects[0]);
                setRating(ratingOptions[0].value);
                setPriceRange(priceRanges[0]);
              }}
              className="px-4 py-2 bg-gray-100 active:bg-orange-500 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </motion.div>

      <motion.h2 variants={cardVariants} className="text-xl font-semibold mb-4">
        {isLoading ? "Loading..." : `${filtered.length} Teacher${filtered.length !== 1 ? "s" : ""} Found`}
      </motion.h2>

      <motion.div variants={containerVariants} className="flex flex-col gap-6 w-full">
        {filtered.map(t => (
          <motion.div
            key={t._id}
            variants={cardVariants}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
              transition: { duration: 0.3 }
            }}
            className="w-full bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-lg p-6 grid grid-cols-5 gap-4"
          >
            <div className="col-span-1 h-24 flex items-center justify-center">
              <img
                src={t.teacherProfile.avatarUrl}
                alt={`${t.name}'s profile`}
                className="w-40 h-40 object-cover rounded-full border-2 border-orange-200 shadow-md"
              />
            </div>
            <div className="col-span-4 space-y-3 text-left">
              <h3 className="text-2xl font-bold text-orange-800">{t.name}</h3>
              <div className="flex flex-wrap gap-2">
                {(t.teacherProfile.teachingSkills || []).map((skill, i) => (
                  <span
                    key={i}
                    className="bg-orange-100 text-orange-700 text-sm font-medium px-3 py-1 rounded-full shadow"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <p className="text-gray-600 line-clamp-3 break-words">{t.teacherProfile.bio}</p>
              <div className="flex items-center gap-4">
                <span className="text-xl font-semibold text-amber-700">
                  ₹{t.teacherProfile.fee}/hr
                </span>
                <Link
                  to={`/student/teacher/${t._id}`}
                  className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg shadow hover:from-orange-600 hover:to-amber-600 transition"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {!isLoading && filtered.length === 0 && (
        <motion.p variants={cardVariants} className="text-center text-gray-500 py-10">
          No teachers found.
        </motion.p>
      )}
    </motion.div>
  );
}
