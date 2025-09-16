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
    const matchSkills = (t.teacherProfile?.teachingSkills || []).some(skill => 
      skill.toLowerCase().includes(search.toLowerCase())
    );
    const matchSubject = subject === subjects[0] || 
      (t.teacherProfile?.teachingSkills || []).some(skill => skill.toLowerCase() === subject.toLowerCase());
    const matchRating = rating === 0 || t.teacherProfile?.rating >= rating;
    const matchPrice = priceRange.min <= t.teacherProfile.fee && t.teacherProfile.fee <= priceRange.max;
    return (matchName || matchSkills) && matchSubject && matchRating && matchPrice;
  });

  return (
   <motion.div
  className="w-full min-h-screen p-4 sm:p-6 bg-white"
  initial="hidden"
  animate="show"
  variants={containerVariants}
>
  {isLoading ? (
    <motion.div variants={cardVariants} className="text-center mb-6">
      <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto animate-pulse mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
    </motion.div>
  ) : (
    <motion.header variants={cardVariants} className="text-center mb-6">
      <h1 className="text-3xl font-bold text-orange-600">
        Find Your Perfect Teacher
      </h1>
      <p className="text-gray-600">Search and filter expert instructors.</p>
    </motion.header>
  )}

  {/* Search & Filter Section */}
  <motion.div variants={cardVariants} className="bg-white shadow rounded-lg p-4 mb-6 border border-gray-200">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or skill…"
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

    {/* Filters */}
    <div
      className={`mt-4 flex flex-col md:flex-row flex-wrap gap-4 transition-all duration-300 overflow-hidden ${
        open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="flex items-center gap-2">
        <Tag className="w-5 h-5 text-gray-500" />
        <select
          value={subject}
          onChange={e => setSubject(e.target.value)}
          className="w-full md:w-40 py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
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
          className="w-full md:w-40 py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
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
          className="w-full md:w-40 py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          {priceRanges.map(r => (
            <option key={r.label} value={r.label}>{r.label}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-start md:justify-end">
        <button
          onClick={() => {
            setSearch("");
            setSubject(subjects[0]);
            setRating(ratingOptions[0].value);
            setPriceRange(priceRanges[0]);
          }}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          Clear Filters
        </button>
      </div>
    </div>
  </motion.div>

  {/* Teacher Count */}
  <motion.h2 variants={cardVariants} className="text-xl font-semibold mb-4 text-center md:text-left">
    {isLoading ? "Loading..." : `${filtered.length} Teacher${filtered.length !== 1 ? "s" : ""} Found`}
  </motion.h2>

  {/* Teacher Cards */}
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
        className="w-full bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-lg p-4 md:p-6 grid grid-cols-1 md:grid-cols-5 gap-4"
      >
        {/* Profile Image */}
        <div className="flex justify-center md:justify-start items-center col-span-1">
          <img
            src={t.teacherProfile.avatarUrl}
            alt={`${t.name}'s profile`}
            className="w-28 h-28 md:w-40 md:h-40 object-cover rounded-full border-2 border-orange-200 shadow-md"
          />
        </div>

        {/* Profile Info */}
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
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

  {/* No Results */}
  {!isLoading && filtered.length === 0 && (
    <motion.p variants={cardVariants} className="text-center text-gray-500 py-10">
      No teachers found.
    </motion.p>
  )}
</motion.div>

  );
}



