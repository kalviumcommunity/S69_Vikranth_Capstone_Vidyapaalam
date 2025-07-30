
// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { useParams, Link } from "react-router-dom";
// import { Star, MessageCircle, Heart, Calendar } from "lucide-react";
// import { useAuth } from "../../contexts/AuthContext";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/card";

// const TeacherProfile = () => {
//   const { id } = useParams();
//   const { api } = useAuth();
//   const [teacher, setTeacher] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchTeacher = async () => {
//       setIsLoading(true);
//       try {
//         if (!api) throw new Error("API instance is undefined");
//         const response = await api.get(`/api/teacher-profiles/${id}`);
//         setTeacher(response.data);
//       } catch (error) {
//         console.error("Error fetching teacher profile:", {
//           message: error.message,
//           status: error.response?.status,
//           data: error.response?.data,
//           baseURL: api?.defaults?.baseURL,
//         });
//         if (error.response?.status === 404) setTeacher(null);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchTeacher();
//   }, [api, id]);

//   // Availability logic
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const bookableAvailability = Array.isArray(teacher?.availability)
//     ? teacher.availability
//         .map((item) => {
//           const [dateStr] = item.split(" ");
//           const [year, month, day] = dateStr.split("-");
//           const slotDate = new Date(year, month - 1, day);
//           return { date: slotDate, original: item };
//         })
//         .filter((item) => item.date >= today)
//         .sort((a, b) => a.date - b.date)
//         .map((item, index) => ({ ...item, sortIndex: index }))
//         .map((item) => item.original)
//     : [];

//   // Loading skeleton
//   if (isLoading) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.4 }}
//         className="space-y-8 px-4 sm:px-6 lg:px-12 py-6 bg-white max-w-screen-xl mx-auto"
//       >
//         <div className="flex flex-col md:flex-row items-start gap-6">
//           <div className="h-32 w-32 bg-gray-200 rounded-full animate-pulse"></div>
//           <div className="flex-1 space-y-3">
//             <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
//             <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
//             <div className="h-6 bg-gray-200 rounded w-full animate-pulse"></div>
//             <div className="h-20 bg-gray-200 rounded w-full animate-pulse"></div>
//             <div className="h-16 bg-gray-200 rounded w-full animate-pulse mt-4"></div>
//           </div>
//         </div>
//       </motion.div>
//     );
//   }

//   if (!teacher) {
//     return (
//       <div className="text-center py-10">
//         <h2 className="text-2xl font-semibold text-gray-800">
//           Teacher not found
//         </h2>
//         <Link
//           to="/student/favorites"
//           className="mt-4 inline-block text-orange-600 hover:underline"
//         >
//           Back to Favorites
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       className="space-y-8 px-4 sm:px-6 lg:px-12 py-6 bg-white max-w-screen-xl mx-auto"
//     >
//       {/* Header */}
//       <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
//         <div className="h-32 w-32 rounded-full overflow-hidden ring-4 ring-orange-300 bg-gray-100 flex items-center justify-center">
//           <img
//             src={teacher.avatarUrl || "/placeholder.svg"}
//             alt={teacher.name || "Unknown Teacher"}
//             className="h-full w-full object-cover"
//           />
//         </div>

//         <div className="flex-1 space-y-3">
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
//             <h1 className="text-3xl font-bold text-gray-800">
//               {teacher.name || "Unknown Teacher"}
//             </h1>
//             <div className="flex flex-wrap gap-2">
//               <button className="flex items-center gap-1 text-orange-600 border border-orange-600 rounded-md px-3 py-1 text-sm hover:bg-orange-50">
//                 <Heart className="h-4 w-4" />
//                 Favorite
//               </button>
//               <Link to={`/student/chat/${teacher._id}`}>
//                 <button className="flex items-center gap-1 text-blue-600 border border-blue-600 rounded-md px-3 py-1 text-sm hover:bg-blue-50">
//                   <MessageCircle className="h-4 w-4" />
//                   Message
//                 </button>
//               </Link>
//             </div>
//           </div>

//           <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
//             {Array.isArray(teacher.userId?.teachingSkills) &&
//             teacher.userId.teachingSkills.length > 0
//               ? teacher.userId.teachingSkills.map((skill, idx) => (
//                   <span
//                     key={idx}
//                     className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs"
//                   >
//                     {skill}
//                   </span>
//                 ))
//               : Array.isArray(teacher.teachingSkills) &&
//                 teacher.teachingSkills.length > 0
//               ? teacher.teachingSkills.map((skill, idx) => (
//                   <span
//                     key={idx}
//                     className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs"
//                   >
//                     {skill}
//                   </span>
//                 ))
//               : (
//                 <span className="px-2 py-1 bg-gray-200 text-gray-500 rounded-full text-xs">
//                   No skills listed
//                 </span>
//               )}
//             <div className="flex items-center gap-1">
//               <Star className="h-4 w-4 text-yellow-500" />
//               <span>{(teacher.rating || 0).toFixed(1)}</span>
//             </div>
//           </div>

//           <div className="text-2xl font-semibold text-orange-600">
//             ${teacher.hourlyRate || 0}/hour
//           </div>

//           <p className="text-gray-700 leading-relaxed mt-2 text-sm">
//             {teacher.bio || "No bio available"}
//           </p>

//           {/* Availability */}
//           <div className="mt-4 pt-4 border-t border-gray-200">
//             <h2 className="font-semibold mb-2 text-gray-800">Availability</h2>
//             <div className="w-full overflow-x-auto rounded-md border border-gray-200">
//               <table className="min-w-[500px] w-full text-sm">
//                 <thead>
//                   <tr className="bg-gray-50">
//                     <th className="py-2 px-4 text-left text-gray-600 font-semibold">
//                       Date
//                     </th>
//                     <th className="py-2 px-4 text-left text-gray-600 font-semibold">
//                       Slots
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bookableAvailability.length > 0 ? (
//                     bookableAvailability.map((slot, idx) => {
//                       const [datePart] = slot.split(" ");
//                       const [year, month, day] = datePart.split("-");
//                       const monthNames = [
//                         "Jan",
//                         "Feb",
//                         "Mar",
//                         "Apr",
//                         "May",
//                         "Jun",
//                         "Jul",
//                         "Aug",
//                         "Sep",
//                         "Oct",
//                         "Nov",
//                         "Dec",
//                       ];
//                       const formattedDate = `${day} ${
//                         monthNames[parseInt(month, 10) - 1]
//                       }`;
//                       const timeSlot = slot.split(" ").slice(1).join(" ");
//                       return (
//                         <tr key={`${datePart}-${idx}`} className="border-t">
//                           <td className="py-2 px-4 text-gray-700">
//                             {formattedDate}
//                           </td>
//                           <td className="py-2 px-4 text-gray-700">
//                             {timeSlot}
//                           </td>
//                         </tr>
//                       );
//                     })
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan="2"
//                         className="py-2 px-4 text-center text-gray-500"
//                       >
//                         No future availability
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Video Introduction */}
//       {teacher.videoUrl && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Video Introduction</CardTitle>
//           </CardHeader>
//           <CardContent className="p-0">
//             <video controls className="w-full aspect-video rounded-md">
//               <source src={teacher.videoUrl} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//           </CardContent>
//         </Card>
//       )}

//       {/* Gallery */}
//       {Array.isArray(teacher.galleryPhotos) &&
//       teacher.galleryPhotos.length > 0 ? (
//         <Card>
//           <CardHeader>
//             <CardTitle>Gallery</CardTitle>
//           </CardHeader>
//           <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {teacher.galleryPhotos.map((photo, idx) => (
//               <img
//                 key={idx}
//                 src={photo.url || "/placeholder.svg"}
//                 alt={photo.name || `Photo ${idx + 1}`}
//                 className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg shadow-md"
//               />
//             ))}
//           </CardContent>
//         </Card>
//       ) : (
//         <Card>
//           <CardContent className="text-center py-4 text-gray-500">
//             No gallery photos available
//           </CardContent>
//         </Card>
//       )}

//       {/* Book Session */}
//       <div className="flex justify-center px-4">
//         <Link to={`/student/book-session/${teacher._id}`}>
//           <button className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 w-full sm:w-auto py-3 px-6 rounded-md text-sm font-medium text-center">
//             <Calendar className="h-5 w-5" />
//             Book a Session
//           </button>
//         </Link>
//       </div>
//     </motion.div>
//   );
// };

// export default TeacherProfile;




// import React, { useState, useEffect, useCallback } from "react";
// import { motion } from "framer-motion";
// import { useParams, Link } from "react-router-dom";
// import { Star, MessageCircle, Heart, Calendar } from "lucide-react";
// import { useAuth } from "../../contexts/AuthContext";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/card";

// const TeacherProfile = () => {
//   const { id } = useParams();
//   const { api } = useAuth();
//   const [teacher, setTeacher] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchTeacher = async () => {
//       setIsLoading(true);
//       try {
//         if (!api) throw new Error("API instance is undefined");
//         const response = await api.get(`/api/teacher-profiles/${id}`);
//         setTeacher(response.data);
//       } catch (error) {
//         console.error("Error fetching teacher profile:", {
//           message: error.message,
//           status: error.response?.status,
//           data: error.response?.data,
//           baseURL: api?.defaults?.baseURL,
//         });
//         if (error.response?.status === 404) setTeacher(null);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchTeacher();
//   }, [api, id]);

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const processedAvailability = Array.isArray(teacher?.availability)
//     ? teacher.availability
//         .map((dateItem) => {
//           const dateObj = new Date(dateItem.date);
          
//           if (dateObj < today) {
//             return null;
//           }

//           const availableAndSortedSlots = Array.isArray(dateItem.slots)
//             ? dateItem.slots
//                 .filter((slot) => slot.available)
//                 .sort((a, b) => a.startTime.localeCompare(b.startTime))
//             : [];

//           if (availableAndSortedSlots.length === 0) {
//             return null;
//           }

//           return {
//             date: dateObj,
//             slots: availableAndSortedSlots,
//           };
//         })
//         .filter(Boolean)
//         .sort((a, b) => a.date.getTime() - b.date.getTime())
//     : [];

//   if (isLoading) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.4 }}
//         className="space-y-8 px-4 sm:px-6 lg:px-12 py-6 bg-white max-w-screen-xl mx-auto"
//       >
//         <div className="flex flex-col md:flex-row items-start gap-6">
//           <div className="h-32 w-32 bg-gray-200 rounded-full animate-pulse"></div>
//           <div className="flex-1 space-y-3">
//             <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
//             <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
//             <div className="h-6 bg-gray-200 rounded w-full animate-pulse"></div>
//             <div className="h-20 bg-gray-200 rounded w-full animate-pulse"></div>
//             <div className="h-16 bg-gray-200 rounded w-full animate-pulse mt-4"></div>
//           </div>
//         </div>
//       </motion.div>
//     );
//   }

//   if (!teacher) {
//     return (
//       <div className="text-center py-10">
//         <h2 className="text-2xl font-semibold text-gray-800">
//           Teacher not found
//         </h2>
//         <Link
//           to="/student/favorites"
//           className="mt-4 inline-block text-orange-600 hover:underline"
//         >
//           Back to Favorites
//         </Link>
//       </div>
//     );
//   }

//   const monthNames = [
//     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//   ];

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       className="space-y-8 px-4 sm:px-6 lg:px-12 py-6 bg-white max-w-screen-xl mx-auto"
//     >
//       <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
//         <div className="h-32 w-32 rounded-full overflow-hidden ring-4 ring-orange-300 bg-gray-100 flex items-center justify-center">
//           <img
//             src={teacher.avatarUrl || "/placeholder.svg"}
//             alt={teacher.name || "Unknown Teacher"}
//             className="h-full w-full object-cover"
//           />
//         </div>

//         <div className="flex-1 space-y-3">
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
//             <h1 className="text-3xl font-bold text-gray-800">
//               {teacher.name || "Unknown Teacher"}
//             </h1>
//             <div className="flex flex-wrap gap-2">
//               <button className="flex items-center gap-1 text-orange-600 border border-orange-600 rounded-md px-3 py-1 text-sm hover:bg-orange-50">
//                 <Heart className="h-4 w-4" />
//                 Favorite
//               </button>
//               <Link to={`/student/chat/${teacher._id}`}>
//                 <button className="flex items-center gap-1 text-blue-600 border border-blue-600 rounded-md px-3 py-1 text-sm hover:bg-blue-50">
//                   <MessageCircle className="h-4 w-4" />
//                   Message
//                 </button>
//               </Link>
//             </div>
//           </div>

//           <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
//             {Array.isArray(teacher.userId?.teachingSkills) &&
//             teacher.userId.teachingSkills.length > 0
//               ? teacher.userId.teachingSkills.map((skill, idx) => (
//                   <span
//                     key={idx}
//                     className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs"
//                   >
//                     {skill}
//                   </span>
//                 ))
//               : Array.isArray(teacher.teachingSkills) &&
//                 teacher.teachingSkills.length > 0
//               ? teacher.teachingSkills.map((skill, idx) => (
//                   <span
//                     key={idx}
//                     className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs"
//                   >
//                     {skill}
//                   </span>
//                 ))
//               : (
//                   <span className="px-2 py-1 bg-gray-200 text-gray-500 rounded-full text-xs">
//                     No skills listed
//                   </span>
//                 )}
//             <div className="flex items-center gap-1">
//               <Star className="h-4 w-4 text-yellow-500" />
//               <span>{(teacher.rating || 0).toFixed(1)}</span>
//             </div>
//           </div>

//           <div className="text-2xl font-semibold text-orange-600">
//             ${teacher.hourlyRate || 0}/hour
//           </div>

//           <p className="text-gray-700 leading-relaxed mt-2 text-sm">
//             {teacher.bio || "No bio available"}
//           </p>

//           <div className="mt-4 pt-4 border-t border-gray-200">
//             <h2 className="font-semibold mb-2 text-gray-800">Availability</h2>
//             <div className="w-full overflow-x-auto rounded-md border border-gray-200">
//               <table className="min-w-[500px] w-full text-sm">
//                 <thead>
//                   <tr className="bg-gray-50">
//                     <th className="py-2 px-4 text-left text-gray-600 font-semibold">
//                       Date
//                     </th>
//                     <th className="py-2 px-4 text-left text-gray-600 font-semibold">
//                       Slots
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {processedAvailability.length > 0 ? (
//                     processedAvailability.flatMap((dateItem) =>
//                       dateItem.slots.map((slot, slotIdx) => (
//                         <tr key={`${dateItem.date.toISOString()}-${slot.startTime}`} className="border-t">
//                           <td className="py-2 px-4 text-gray-700">
//                             {dateItem.date.getDate()} {monthNames[dateItem.date.getMonth()]}
//                           </td>
//                           <td className="py-2 px-4 text-gray-700">
//                             {`${slot.startTime} - ${slot.endTime}`}
//                           </td>
//                         </tr>
//                       ))
//                     )
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan="2"
//                         className="py-2 px-4 text-center text-gray-500"
//                       >
//                         No future availability
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       {teacher.videoUrl && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Video Introduction</CardTitle>
//           </CardHeader>
//           <CardContent className="p-0">
//             <video controls className="w-full aspect-video rounded-md">
//               <source src={teacher.videoUrl} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//           </CardContent>
//         </Card>
//       )}

//       {Array.isArray(teacher.galleryPhotos) &&
//       teacher.galleryPhotos.length > 0 ? (
//         <Card>
//           <CardHeader>
//             <CardTitle>Gallery</CardTitle>
//           </CardHeader>
//           <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {teacher.galleryPhotos.map((photo, idx) => (
//               <img
//                 key={idx}
//                 src={photo.url || "/placeholder.svg"}
//                 alt={photo.name || `Photo ${idx + 1}`}
//                 className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg shadow-md"
//               />
//             ))}
//           </CardContent>
//         </Card>
//       ) : (
//         <Card>
//           <CardContent className="text-center py-4 text-gray-500">
//             No gallery photos available
//           </CardContent>
//         </Card>
//       )}

//       <div className="flex justify-center px-4">
//         <Link to={`/student/book-session/${teacher._id}`}>
//           <button className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 w-full sm:w-auto py-3 px-6 rounded-md text-sm font-medium text-center">
//             <Calendar className="h-5 w-5" />
//             Book a Session
//           </button>
//         </Link>
//       </div>
//     </motion.div>
//   );
// };

// export default TeacherProfile;





// import React, { useState, useEffect, useCallback } from "react";
// import { motion } from "framer-motion";
// import { useParams, Link } from "react-router-dom";
// import { Star, MessageCircle, Heart, Calendar as CalendarIcon, Clock } from "lucide-react";
// import { useAuth } from "../../contexts/AuthContext";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/card";
// import { Calendar } from "@/components/ui/calendar"; 

// const TeacherProfile = () => {
//   const { id } = useParams();
//   const { api } = useAuth();
//   const [teacher, setTeacher] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedDate, setSelectedDate] = useState(null); 

//   useEffect(() => {
//     const fetchTeacher = async () => {
//       setIsLoading(true);
//       try {
//         if (!api) throw new Error("API instance is undefined");
//         const response = await api.get(`/api/teacher-profiles/${id}`);
//         setTeacher(response.data);

//       } catch (error) {
//         console.error("Error fetching teacher profile:", {
//           message: error.message,
//           status: error.response?.status,
//           data: error.response?.data,
//           baseURL: api?.defaults?.baseURL,
//         });
//         if (error.response?.status === 404) setTeacher(null);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchTeacher();
//   }, [api, id]);

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const rawAvailability = Array.isArray(teacher?.availability)
//     ? teacher.availability
//     : Array.isArray(teacher?.userId?.availability)
//     ? teacher.userId.availability
//     : [];

//   const processedAvailability = rawAvailability
//     .map((dateItem) => {
//       const dateObj = new Date(dateItem.date);

//       if (isNaN(dateObj.getTime()) || dateObj < today) {
//         return null;
//       }

//       const availableAndSortedSlots = Array.isArray(dateItem.slots)
//         ? dateItem.slots
//             .filter((slot) => slot.available) 
//             .sort((a, b) => a.startTime.localeCompare(b.startTime))
//         : [];

//       if (availableAndSortedSlots.length === 0) {
//         return null;
//       }

//       return {
//         date: dateObj,
//         slots: availableAndSortedSlots,
//       };
//     })
//     .filter(Boolean) 
//     .sort((a, b) => a.date.getTime() - b.date.getTime());

//   console.log("Processed Availability for UI:", processedAvailability);


//   const isDateDisabled = useCallback((date) => {
//     const compareDate = new Date(date);
//     compareDate.setHours(0, 0, 0, 0);

//     if (compareDate < today) return true; 

//     const calendarDateLocalISO = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

//     return !processedAvailability.some(item => {
//       const itemDateObj = item.date instanceof Date ? item.date : new Date(item.date);
//       const itemDateLocalISO = `${itemDateObj.getFullYear()}-${(itemDateObj.getMonth() + 1).toString().padStart(2, '0')}-${itemDateObj.getDate().toString().padStart(2, '0')}`;
      
//       return itemDateLocalISO === calendarDateLocalISO && item.slots.length > 0; 
//     });
//   }, [processedAvailability, today]);

//   const getAvailableSlotsForDate = useCallback(() => {
//     if (!selectedDate) return [];

//     const selectedDateLocalISO = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;

//     const foundAvailability = processedAvailability.find(item => {
//       const itemDateObj = item.date instanceof Date ? item.date : new Date(item.date);
//       const itemDateLocalISO = `${itemDateObj.getFullYear()}-${(itemDateObj.getMonth() + 1).toString().padStart(2, '0')}-${itemDateObj.getDate().toString().padStart(2, '0')}`;
      
//       return itemDateLocalISO === selectedDateLocalISO;
//     });

//     if (!foundAvailability) return [];

//     const sortedSlots = [...foundAvailability.slots].sort((a, b) => {
//       return a.startTime.localeCompare(b.startTime);
//     });

//     return sortedSlots.map((slot, index) => ({
//       id: `${selectedDateLocalISO}-${slot.startTime}-${slot.endTime}-${index}`,
//       time: `${slot.startTime} - ${slot.endTime}`,
//       startTime: slot.startTime,
//       endTime: slot.endTime,
//       available: slot.available,
//     }));
//   }, [selectedDate, processedAvailability]);

//   if (isLoading) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.4 }}
//         className="space-y-8 px-4 sm:px-6 lg:px-12 py-6 bg-white max-w-screen-xl mx-auto"
//       >
//         <div className="flex flex-col md:flex-row items-start gap-6">
//           <div className="h-32 w-32 bg-gray-200 rounded-full animate-pulse"></div>
//           <div className="flex-1 space-y-3">
//             <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
//             <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
//             <div className="h-6 bg-gray-200 rounded w-full animate-pulse"></div>
//             <div className="h-20 bg-gray-200 rounded w-full animate-pulse"></div>
//             <div className="h-16 bg-gray-200 rounded w-full animate-pulse mt-4"></div>
//           </div>
//         </div>
//       </motion.div>
//     );
//   }

//   if (!teacher) {
//     return (
//       <div className="text-center py-10">
//         <h2 className="text-2xl font-semibold text-gray-800">
//           Teacher not found
//         </h2>
//         <Link
//           to="/student/favorites"
//           className="mt-4 inline-block text-orange-600 hover:underline"
//         >
//           Back to Favorites
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       className="space-y-8 px-4 sm:px-6 lg:px-12 py-6 bg-white max-w-4xl mx-auto"
//     >
//       {/* Header */}
//       <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
//         <div className="h-32 w-32 rounded-full overflow-hidden ring-4 ring-orange-300 bg-gray-100 flex items-center justify-center">
//           <img
//             src={teacher.avatarUrl || "/placeholder.svg"}
//             alt={teacher.name || "Unknown Teacher"}
//             className="h-full w-full object-cover"
//           />
//         </div>

//         <div className="flex-1 space-y-3">
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
//             <h1 className="text-3xl font-bold text-gray-800">
//               {teacher.name || "Unknown Teacher"}
//             </h1>
//             <div className="flex flex-wrap gap-2">
//               <button className="flex items-center gap-1 text-orange-600 border border-orange-600 rounded-md px-3 py-1 text-sm hover:bg-orange-50">
//                 <Heart className="h-4 w-4" />
//                 Favorite
//               </button>
//               <Link to={`/student/chat/${teacher._id}`}>
//                 <button className="flex items-center gap-1 text-blue-600 border border-blue-600 rounded-md px-3 py-1 text-sm hover:bg-blue-50">
//                   <MessageCircle className="h-4 w-4" />
//                   Message
//                 </button>
//               </Link>
//             </div>
//           </div>

//           <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
//             {Array.isArray(teacher.userId?.teachingSkills) &&
//             teacher.userId.teachingSkills.length > 0
//               ? teacher.userId.teachingSkills.map((skill, idx) => (
//                   <span
//                     key={idx}
//                     className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs"
//                   >
//                     {skill}
//                   </span>
//                 ))
//               : Array.isArray(teacher.teachingSkills) &&
//                 teacher.teachingSkills.length > 0
//               ? teacher.teachingSkills.map((skill, idx) => (
//                   <span
//                     key={idx}
//                     className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs"
//                   >
//                     {skill}
//                   </span>
//                 ))
//               : (
//                   <span className="px-2 py-1 bg-gray-200 text-gray-500 rounded-full text-xs">
//                     No skills listed
//                   </span>
//                 )}
//             <div className="flex items-center gap-1">
//               <Star className="h-4 w-4 text-yellow-500" />
//               <span>{(teacher.rating || 0).toFixed(1)}</span>
//             </div>
//           </div>

//           <div className="text-2xl font-semibold text-orange-600">
//             ₹{teacher.hourlyRate || 0}/hour
//           </div>

//           <p className="text-gray-700 leading-relaxed mt-2 text-sm">
//             {teacher.bio || "No bio available"}
//           </p>

//           {/* Availability - UPDATED UI */}
//           <div className="mt-4 pt-4 border-t border-gray-200">
//             <h2 className="font-semibold mb-2 text-gray-800">Availability</h2>
//             {/* Using a grid to layout calendar and slots side-by-side on larger screens */}
//             <div className="grid gap-8 md:grid-cols-2">
//               {/* Calendar Column */}
//               {/* Added w-full to ensure responsiveness */}
//               <div className="w-full">
//                 <h4 className="text-lg font-medium text-gray-700 mb-2">Choose a Date</h4>
//                 <Calendar
//                   mode="single"
//                   selected={selectedDate}
//                   onSelect={setSelectedDate}
//                   className="rounded-md border shadow-sm w-full" // Added w-full here too for Calendar component
//                   disabled={isDateDisabled}
//                 />
//               </div>

//               {/* Time Slots Column */}
//               <div className="w-full">
//                 <h4 className="text-lg font-medium text-gray-700 mb-2">
//                   Available Time Slots for {selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'selected date'}
//                 </h4>
//                 {!selectedDate ? (
//                   <p className="text-gray-500">Please select a date to see available time slots.</p>
//                 ) : getAvailableSlotsForDate().length === 0 ? (
//                   <p className="text-gray-500">No available slots for this date.</p>
//                 ) : (
//                   <div className="space-y-3 max-h-64 overflow-y-auto pr-2"> {/* Added max-h for scroll if many slots */}
//                     {getAvailableSlotsForDate().map((slot) => (
//                       <div
//                         key={slot.id}
//                         className="w-full flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-gray-50"
//                       >
//                         <div className="flex items-center">
//                           <Clock className="h-5 w-5 mr-2 text-gray-500" />
//                           <span>{slot.time}</span>
//                         </div>
//                         {/* On this page, slots are just displayed for info, not directly selectable for booking */}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>

//       {/* Video Introduction */}
//       {teacher.videoUrl && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Video Introduction</CardTitle>
//           </CardHeader>
//           <CardContent className="p-0">
//             <video controls className="w-full aspect-video rounded-md">
//               <source src={teacher.videoUrl} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//           </CardContent>
//         </Card>
//       )}

//       {/* Gallery */}
//       {Array.isArray(teacher.galleryPhotos) &&
//       teacher.galleryPhotos.length > 0 ? (
//         <Card>
//           <CardHeader>
//             <CardTitle>Gallery</CardTitle>
//           </CardHeader>
//           <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {teacher.galleryPhotos.map((photo, idx) => (
//               <img
//                 key={idx}
//                 src={photo.url || "/placeholder.svg"}
//                 alt={photo.name || `Photo ${idx + 1}`}
//                 className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg shadow-md"
//               />
//             ))}
//           </CardContent>
//         </Card>
//       ) : (
//         <Card>
//           <CardContent className="text-center py-4 text-gray-500">
//             No gallery photos available
//           </CardContent>
//         </Card>
//       )}

//       {/* Book Session button */}
//       <div className="flex justify-center px-4">
//         <Link to={`/student/book-session/${teacher._id}`}>
//           <button className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 w-full sm:w-auto py-3 px-6 rounded-md text-sm font-medium text-center">
//             <CalendarIcon className="h-5 w-5" />
//             Book a Session
//           </button>
//         </Link>
//       </div>
//     </motion.div>
//   );
// };

// export default TeacherProfile;






import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { Star, MessageCircle, Heart, Calendar as CalendarIcon, Clock } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Calendar } from "@/components/ui/calendar";

const TeacherProfile = () => {
  const { id } = useParams();
  const { api } = useAuth();
  const [teacher, setTeacher] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      setIsLoading(true);
      try {
        if (!api) throw new Error("API instance is undefined");
        const response = await api.get(`/api/teacher-profiles/${id}`);
        setTeacher(response.data);
      } catch (error) {
        console.error("Error fetching teacher profile:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          baseURL: api?.defaults?.baseURL,
        });
        if (error.response?.status === 404) setTeacher(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeacher();
  }, [api, id]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rawAvailability = Array.isArray(teacher?.availability)
    ? teacher.availability
    : Array.isArray(teacher?.userId?.availability)
    ? teacher.userId.availability
    : [];

  const processedAvailability = rawAvailability
    .map((dateItem) => {
      const dateObj = new Date(dateItem.date);

      if (isNaN(dateObj.getTime()) || dateObj < today) {
        return null;
      }

      const availableAndSortedSlots = Array.isArray(dateItem.slots)
        ? dateItem.slots
            .filter((slot) => slot.available)
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
        : [];

      if (availableAndSortedSlots.length === 0) {
        return null;
      }

      return {
        date: dateObj,
        slots: availableAndSortedSlots,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const isDateDisabled = useCallback((date) => {
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    if (compareDate < today) return true;

    const calendarDateLocalISO = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    return !processedAvailability.some(item => {
      const itemDateObj = item.date instanceof Date ? item.date : new Date(item.date);
      const itemDateLocalISO = `${itemDateObj.getFullYear()}-${(itemDateObj.getMonth() + 1).toString().padStart(2, '0')}-${itemDateObj.getDate().toString().padStart(2, '0')}`;
      
      return itemDateLocalISO === calendarDateLocalISO && item.slots.length > 0;
    });
  }, [processedAvailability, today]);

  const getAvailableSlotsForDate = useCallback(() => {
    if (!selectedDate) return [];

    const selectedDateLocalISO = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;

    const foundAvailability = processedAvailability.find(item => {
      const itemDateObj = item.date instanceof Date ? item.date : new Date(item.date);
      const itemDateLocalISO = `${itemDateObj.getFullYear()}-${(itemDateObj.getMonth() + 1).toString().padStart(2, '0')}-${itemDateObj.getDate().toString().padStart(2, '0')}`;
      
      return itemDateLocalISO === selectedDateLocalISO;
    });

    if (!foundAvailability) return [];

    const sortedSlots = [...foundAvailability.slots].sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });

    return sortedSlots.map((slot, index) => ({
      id: `${selectedDateLocalISO}-${slot.startTime}-${slot.endTime}-${index}`,
      time: `${slot.startTime} - ${slot.endTime}`,
      startTime: slot.startTime,
      endTime: slot.endTime,
      available: slot.available,
    }));
  }, [selectedDate, processedAvailability]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-8 p-6 bg-white max-w-3xl mx-auto"
      >
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="h-32 w-32 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="flex-1 space-y-3">
            <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-20 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-16 bg-gray-200 rounded w-full animate-pulse mt-4"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!teacher) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-800">
          Teacher not found
        </h2>
        <Link
          to="/student/favorites"
          className="mt-4 inline-block text-orange-600 hover:underline"
        >
          Back to Favorites
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 p-6 bg-white max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="h-32 w-32 rounded-full overflow-hidden ring-4 ring-orange-300 bg-gray-100 flex items-center justify-center">
          <img
            src={teacher.avatarUrl || "/placeholder.svg"}
            alt={teacher.name || "Unknown Teacher"}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-800">
              {teacher.name || "Unknown Teacher"}
            </h1>
            <div className="flex flex-wrap gap-2">
              <button className="flex items-center gap-1 text-orange-600 border border-orange-600 rounded-md px-3 py-1 text-sm hover:bg-orange-50">
                <Heart className="h-4 w-4" />
                Favorite
              </button>
              <Link to={`/student/chat/${teacher._id}`}>
                <button className="flex items-center gap-1 text-blue-600 border border-blue-600 rounded-md px-3 py-1 text-sm hover:bg-blue-50">
                  <MessageCircle className="h-4 w-4" />
                  Message
                </button>
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            {Array.isArray(teacher.userId?.teachingSkills) &&
            teacher.userId.teachingSkills.length > 0
              ? teacher.userId.teachingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))
              : Array.isArray(teacher.teachingSkills) &&
                teacher.teachingSkills.length > 0
              ? teacher.teachingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))
              : (
                  <span className="px-2 py-1 bg-gray-200 text-gray-500 rounded-full text-xs">
                    No skills listed
                  </span>
                )}
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{(teacher.rating || 0).toFixed(1)}</span>
            </div>
          </div>

          <div className="text-2xl font-semibold text-orange-600">
            ₹{teacher.hourlyRate || 0}/hour
          </div>

          <p className="text-gray-700 leading-relaxed mt-2 text-sm">
            {teacher.bio || "No bio available"}
          </p>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <h2 className="font-semibold mb-2 text-gray-800">Availability</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="w-full">
                <h4 className="text-lg font-medium text-gray-700 mb-2">Choose a Date</h4>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border shadow-sm w-full"
                  disabled={isDateDisabled}
                />
              </div>

              <div className="w-full">
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  Available Time Slots for {selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'selected date'}
                </h4>
                {!selectedDate ? (
                  <p className="text-gray-500">Please select a date to see available time slots.</p>
                ) : getAvailableSlotsForDate().length === 0 ? (
                  <p className="text-gray-500">No available slots for this date.</p>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {getAvailableSlotsForDate().map((slot) => (
                      <div
                        key={slot.id}
                        className="w-full flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-gray-500" />
                          <span>{slot.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {teacher.videoUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Video Introduction</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <video controls className="w-full aspect-video rounded-md">
              <source src={teacher.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </CardContent>
        </Card>
      )}

      {Array.isArray(teacher.galleryPhotos) &&
      teacher.galleryPhotos.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teacher.galleryPhotos.map((photo, idx) => (
              <img
                key={idx}
                src={photo.url || "/placeholder.svg"}
                alt={photo.name || `Photo ${idx + 1}`}
                className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg shadow-md"
              />
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-4 text-gray-500">
            No gallery photos available
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center px-4">
        <Link to={`/student/book-session/${teacher._id}`}>
          <button className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 w-full sm:w-auto py-3 px-6 rounded-md text-sm font-medium text-center">
            <CalendarIcon className="h-5 w-5" />
            Book a Session
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default TeacherProfile;
