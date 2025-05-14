// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// const FindTeacher = () => {
//   const subjects = ["Mathematics", "Physics", "English", "History", "Chemistry", "Biology", "Geography"];
//   const ratingOptions = [
//     { label: "Any Rating", value: 0 },
//     { label: "3 stars & above", value: 3 },
//     { label: "4 stars & above", value: 4 },
//     { label: "4.5 stars & above", value: 4.5 },
//   ];
//   const priceRanges = [
//     { label: "Any Price", min: 0, max: Infinity },
//     { label: "$0 - $50", min: 0, max: 50 },
//     { label: "$50 - $100", min: 50, max: 100 },
//     { label: "$100+", min: 100, max: Infinity },
//   ];

//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("All Subjects");
//   const [selectedRating, setSelectedRating] = useState(0);
//   const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
//   const [availableOnly, setAvailableOnly] = useState(false);

//   const teachers = [
//     { id: 1, name: "John Doe", subject: "Mathematics", rating: 4.5, location: "New York", fee: "$50/hr", available: true },
//     { id: 2, name: "Jane Smith", subject: "Physics", rating: 4.8, location: "Los Angeles", fee: "$60/hr", available: false },
//     { id: 3, name: "Alice Johnson", subject: "English", rating: 4.2, location: "Chicago", fee: "$45/hr", available: true },
//     { id: 4, name: "Bob Brown", subject: "History", rating: 4.9, location: "Houston", fee: "$55/hr", available: true },
//     { id: 5, name: "Charlie Davis", subject: "Mathematics", rating: 3.5, location: "San Francisco", fee: "$40/hr", available: false },
//     { id: 6, name: "Diana Evans", subject: "Chemistry", rating: 4.0, location: "Boston", fee: "$50/hr", available: true },
//     { id: 7, name: "Ethan Fox", subject: "Biology", rating: 4.7, location: "Seattle", fee: "$65/hr", available: true },
//     { id: 8, name: "Fiona Green", subject: "Geography", rating: 3.9, location: "Denver", fee: "$35/hr", available: false },
//     { id: 9, name: "George Harris", subject: "Mathematics", rating: 4.3, location: "Austin", fee: "$55/hr", available: true },
//     { id: 10, name: "Hannah Ivy", subject: "Physics", rating: 4.6, location: "Portland", fee: "$70/hr", available: true },
//   ];

//   const filteredTeachers = teachers.filter((teacher) => {
//     const nameMatch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const subjectMatch = selectedSubject === "All Subjects" || teacher.subject === selectedSubject;
//     const ratingMatch = teacher.rating >= selectedRating;
//     const feeNumber = parseInt(teacher.fee.slice(1));
//     const priceMatch = selectedPriceRange.min <= feeNumber && feeNumber <= selectedPriceRange.max;
//     const availabilityMatch = !availableOnly || teacher.available;
//     return nameMatch && subjectMatch && ratingMatch && priceMatch && availabilityMatch;
//   });

//   const clearFilters = () => {
//     setSearchTerm("");
//     setSelectedSubject("All Subjects");
//     setSelectedRating(0);
//     setSelectedPriceRange(priceRanges[0]);
//     setAvailableOnly(false);
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold text-center md:text-left mb-2">
//         Find Your Perfect Teacher
//       </h1>
//       <p className="text-lg text-gray-600 text-center md:text-left mb-6">
//         Discover talented instructors tailored to your learning needs.
//       </p>

//       <div className="mb-8">
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           placeholder="Search teachers by name..."
//           className="w-full p-3 text-base border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
//         />
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//           <div>
//             <label className="text-sm font-medium text-gray-700 block mb-1">Subject</label>
//             <select
//               value={selectedSubject}
//               onChange={(e) => setSelectedSubject(e.target.value)}
//               className="w-full p-2 border rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-600"
//             >
//               <option value="All Subjects">All Subjects</option>
//               {subjects.map((subject) => (
//                 <option key={subject} value={subject}>{subject}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-700 block mb-1">Rating</label>
//             <select
//               value={selectedRating}
//               onChange={(e) => setSelectedRating(parseFloat(e.target.value))}
//               className="w-full p-2 border rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-600"
//             >
//               {ratingOptions.map((option) => (
//                 <option key={option.value} value={option.value}>{option.label}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-700 block mb-1">Price Range</label>
//             <select
//               value={selectedPriceRange.label}
//               onChange={(e) => {
//                 const selected = priceRanges.find((range) => range.label === e.target.value);
//                 setSelectedPriceRange(selected);
//               }}
//               className="w-full p-2 border rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-600"
//             >
//               {priceRanges.map((range) => (
//                 <option key={range.label} value={range.label}>{range.label}</option>
//               ))}
//             </select>
//           </div>
//           <div className="flex items-center mt-6">
//             <input
//               type="checkbox"
//               checked={availableOnly}
//               onChange={(e) => setAvailableOnly(e.target.checked)}
//               className="h-4 w-4 text-orange-600 focus:ring-orange-500"
//             />
//             <label className="ml-2 text-base font-medium text-gray-700">Available only</label>
//           </div>
//         </div>
//         <button
//           onClick={clearFilters}
//           className="text-base rounded-md border border-orange-600 text-orange-600 hover:bg-orange-100 transition-all duration-200 px-4 py-2"
//         >
//           Clear Filters
//         </button>
//       </div>

//       <h3 className="text-2xl font-semibold mb-4">{filteredTeachers.length} Teachers Found</h3>
//       {filteredTeachers.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {filteredTeachers.map((teacher) => (
//             <div
//               key={teacher.id}
//               className="border rounded-md p-5 hover:shadow-lg hover:border-orange-500 transition-all duration-200"
//             >
//               <div className="flex items-center gap-4">
//                 <div className="w-14 h-14 bg-gray-200 rounded-full" />
//                 <div>
//                   <h3 className="text-xl font-bold flex items-center">{teacher.name}</h3>
//                   <p className="text-sm text-gray-600">{teacher.subject}</p>
//                 </div>
//               </div>
//               <div className="mt-4 space-y-2">
//                 <p className="text-sm text-gray-600">Rating: {teacher.rating}</p>
//                 <p className="text-sm text-gray-600">Location: {teacher.location}</p>
//                 <p className="text-base font-medium text-orange-600">Fee: {teacher.fee}</p>
//               </div>
//               <div className="mt-4">
//                  <Link
//                   to={`/student/teacher/${teacher.id}`}
//                   className="block w-full bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-all duration-200 px-6 py-3 text-lg font-medium shadow-md text-center"
//                 >
//                   View Profile
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center">
//           <h3 className="text-xl font-medium">No teachers found</h3>
//           <p className="text-base text-gray-600 mt-2">Try adjusting your search criteria.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FindTeacher;



// src/pages/student/FindTeacher.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Tag, Star, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const subjects = [
  "All Subjects",
  "Mathematics",
  "Physics",
  "English",
  "History",
  "Chemistry",
  "Biology",
  "Geography",
];
const ratingOptions = [
  { label: "Any Rating", value: 0 },
  { label: "3★ & up", value: 3 },
  { label: "4★ & up", value: 4 },
  { label: "4.5★ & up", value: 4.5 },
];
const priceRanges = [
  { label: "Any Price", min: 0, max: Infinity },
  { label: "$0 – $50", min: 0, max: 50 },
  { label: "$50 – $100", min: 50, max: 100 },
  { label: "$100+", min: 100, max: Infinity },
];

// Mock teacher data
const teachers = [
  {
    id: 1,
    name: "Maria Johnson",
    subject: "Yoga",
    rating: 4.8,
    location: "New York, NY",
    fee: 30,
    available: true,
    bio: "Certified yoga instructor with 5+ years teaching Hatha & Vinyasa flows.",
  },
  {
    id: 2,
    name: "David Lee",
    subject: "Guitar",
    rating: 4.9,
    location: "Los Angeles, CA",
    fee: 40,
    available: false,
    bio: "Professional guitarist, 10+ years performing & teaching classical & electric guitar.",
  },
  {
    id: 3,
    name: "Alice Chen",
    subject: "Mathematics",
    rating: 4.5,
    location: "Chicago, IL",
    fee: 45,
    available: true,
    bio: "PhD in Math, specializing in algebra & calculus, 8 years of tutoring experience.",
  },
  // …add more as desired…
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
  show:  { opacity: 1, y: 0 },
};

export default function FindTeacher() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState(subjects[0]);
  const [rating, setRating] = useState(ratingOptions[0].value);
  const [priceRange, setPriceRange] = useState(priceRanges[0]);
  const [availableOnly, setAvailableOnly] = useState(false);

  const filtered = teachers.filter(t => {
    const matchName = t.name.toLowerCase().includes(search.toLowerCase());
    const matchSubject = subject === subjects[0] || t.subject === subject;
    const matchRating = t.rating >= rating;
    const matchPrice = priceRange.min <= t.fee && t.fee <= priceRange.max;
    const matchAvail = !availableOnly || t.available;
    return matchName && matchSubject && matchRating && matchPrice && matchAvail;
  });

  return (
    <motion.div
      className="max-w-6xl mx-auto p-6 space-y-6"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {/* Title */}
      <motion.header variants={cardVariants} className="text-center">
        <h1 className="text-3xl font-bold text-orange-600">
          Find Your Perfect Teacher
        </h1>
        <p className="text-gray-600">
          Search and filter expert instructors.
        </p>
      </motion.header>

      {/* Search & Filter Toggle */}
      <motion.div variants={cardVariants} className="bg-white shadow rounded-lg p-4">
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
          className={`mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 transition-all duration-300 ${
            open
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          {/* Subject */}
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-gray-500" />
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="flex-1 py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          {/* Rating */}
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-gray-500" />
            <select
              value={rating}
              onChange={e => setRating(parseFloat(e.target.value))}
              className="flex-1 py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {ratingOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          {/* Price */}
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-500" />
            <select
              value={priceRange.label}
              onChange={e => {
                const found = priceRanges.find(r => r.label === e.target.value);
                if (found) setPriceRange(found);
              }}
              className="flex-1 py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {priceRanges.map(r => (
                <option key={r.label} value={r.label}>{r.label}</option>
              ))}
            </select>
          </div>
          {/* Available only */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={e => setAvailableOnly(e.target.checked)}
              className="h-5 w-5 text-green-600 border rounded focus:ring-2 focus:ring-green-400"
            />
            Available only
          </label>
          {/* Clear */}
          <div className="md:col-span-4 flex justify-end">
            <button
              onClick={() => {
                setSearch("");
                setSubject(subjects[0]);
                setRating(ratingOptions[0].value);
                setPriceRange(priceRanges[0]);
                setAvailableOnly(false);
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </motion.div>

      {/* Results count */}
      <motion.h2 variants={cardVariants} className="text-xl font-semibold">
        {filtered.length} Teacher{filtered.length !== 1 && "s"} Found
      </motion.h2>

      {/* Cards Grid */}
      <motion.div
        variants={containerVariants}
        className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {filtered.map(t => (
          <motion.div
            key={t.id}
            variants={cardVariants}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">{t.name}</h3>
              {!t.available && (
                <span className="text-sm px-2 py-1 bg-red-100 text-red-600 rounded">
                  Booked
                </span>
              )}
            </div>
            <p className="mt-2 text-gray-600 flex items-center gap-1">
              <Tag className="w-4 h-4" /> {t.subject}
            </p>
            <p className="mt-1 text-gray-600 flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" /> {t.rating}
            </p>
            <p className="mt-1 text-gray-600 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-blue-500" /> {t.location}
            </p>
            <p className="mt-4 text-gray-700 flex-1 line-clamp-3">{t.bio}</p>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-lg font-semibold text-orange-600">
                ${t.fee}/hr
              </div>
              <Link
                to={`/student/teacher/${t.id}`}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                View Profile
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <motion.p variants={cardVariants} className="text-center text-gray-500 py-10">
          No teachers match your criteria.
        </motion.p>
      )}
    </motion.div>
  );
}
