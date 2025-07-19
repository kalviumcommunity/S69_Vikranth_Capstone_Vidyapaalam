// import React from "react";
// import { motion } from "framer-motion";
// import { useParams, Link } from "react-router-dom";
// import { Star, MessageCircle, Heart, Calendar } from "lucide-react";
// import  {Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

// // Mock dataset of teachers
// const teachers = [
//   {
//     id: "1",
//     name: "Maria Johnson",
//     avatar: "/placeholder.svg",
//     initials: "MJ",
//     skill: "Yoga",
//     rating: 4.8,
//     hourlyRate: 30,
//     bio: "Certified yoga instructor with 5+ years of experience teaching Hatha, Vinyasa, and Restorative yoga. Focus on form and breathing.",
//     experience: "5 years",
//     availability: ["Weekdays 5-9pm", "Weekends 9am-3pm"],
//     location: "New York, NY",
//     reviews: [
//       {
//         id: "r1",
//         student: "John D.",
//         rating: 5,
//         comment: "Great session!",
//         date: "March 15, 2025",
//       },
//       {
//         id: "r2",
//         student: "Sarah T.",
//         rating: 4.5,
//         comment: "Very knowledgeable.",
//         date: "Feb 28, 2025",
//       },
//     ],
//   },
//   {
//     id: "2",
//     name: "David Lee",
//     avatar: "/placeholder.svg",
//     initials: "DL",
//     skill: "Guitar",
//     rating: 4.9,
//     hourlyRate: 40,
//     bio: "Professional guitarist specializing in classical and electric styles. 10+ years performing and teaching.",
//     experience: "10 years",
//     availability: ["Mon-Thu 6-10pm", "Sat 10am-2pm"],
//     location: "Los Angeles, CA",
//     reviews: [],
//   },
// ];

// const TeacherProfile = () => {
//   const { id } = useParams();
//   const teacher = teachers.find((t) => t.id === id);

//   if (!teacher) {
//     return (
//       <div className="text-center py-10">
//         <h2 className="text-2xl font-semibold text-gray-800">Teacher not found</h2>
//         <Link to="/student/favorites" className="mt-4 inline-block text-orange-600 hover:underline">
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
//       className="space-y-8 px-4 sm:px-6 lg:px-12 py-6 bg-white"
//     >
//       {/* Header */}
//       <div className="flex flex-col md:flex-row items-start gap-6">
//         <div className="h-32 w-32 rounded-full overflow-hidden ring-4 ring-orange-300 bg-gray-100 flex items-center justify-center text-xl text-gray-700">
//           <img src={teacher.avatar} alt={teacher.name} className="h-full w-full object-cover" />
//         </div>

//         <div className="flex-1 space-y-3">
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
//             <h1 className="text-3xl font-bold text-gray-800">{teacher.name}</h1>
//             <div className="flex gap-2">
//               <button className="flex items-center gap-1 text-orange-600 border border-orange-600 rounded-md px-3 py-1 text-sm hover:bg-orange-50">
//                 <Heart className="h-4 w-4" />
//                 Favorite
//               </button>
//               <Link to={`/student/chat/${teacher.id}`}>
//                 <button className="flex items-center gap-1 text-blue-600 border border-blue-600 rounded-md px-3 py-1 text-sm hover:bg-blue-50">
//                   <MessageCircle className="h-4 w-4" />
//                   Message
//                 </button>
//               </Link>
//             </div>
//           </div>

//           <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
//             <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">{teacher.skill}</span>
//             <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">{teacher.experience}</span>
//             <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">{teacher.location}</span>
//             <div className="flex items-center gap-1">
//               <Star className="h-4 w-4 text-yellow-500" />
//               <span>{teacher.rating}</span>
//             </div>
//           </div>

//           <div className="text-2xl font-semibold text-orange-600">${teacher.hourlyRate}/hour</div>

//           <p className="text-gray-700 leading-relaxed mt-2 text-sm">{teacher.bio}</p>

//           <div className="mt-4 pt-4 border-t border-gray-200">
//             <h2 className="font-semibold mb-2 text-gray-800">Availability</h2>
//             <div className="flex flex-wrap gap-2">
//               {teacher.availability.map((slot, idx) => (
//                 <span
//                   key={idx}
//                   className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full border border-blue-100"
//                 >
//                   {slot}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Video Intro */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Video Introduction</CardTitle>
//         </CardHeader>
//         <CardContent className="p-0">
//           <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
//             <p className="text-gray-500">Video preview coming soon</p>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Reviews */}
//       <Card>
//         <CardHeader className="flex justify-between items-center">
//           <CardTitle>Student Reviews</CardTitle>
//           <div className="flex items-center gap-1 text-gray-700">
//             <Star className="h-5 w-5 text-yellow-500" />
//             <span className="font-medium">{teacher.reviews.length} Reviews</span>
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {teacher.reviews.map((r) => (
//             <motion.div
//               key={r.id}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.3 }}
//               className="flex flex-col gap-2 max-w-2xl w-full bg-white p-5 rounded-lg shadow-md hover:scale-105 transition-transform duration-150"
//             >
//               <div className="flex justify-between items-center">
//                 <span className="font-semibold text-gray-800">{r.student}</span>
//                 <div className="flex items-center gap-1">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className={`h-4 w-4 ${
//                         i < Math.floor(r.rating) ? "text-yellow-400" : "text-yellow-200"
//                       }`}
//                     />
//                   ))}
//                 </div>
//               </div>
//               <p className="text-xs text-gray-400">{r.date}</p>
//               <p className="text-sm text-gray-700 leading-relaxed">{r.comment}</p>
//             </motion.div>
//           ))}
//         </CardContent>
//       </Card>

//       {/* Book Session */}
//       <div className="flex justify-center">
//         <Link to={`/student/book-session/${teacher.id}`} className="w-full md:w-auto">
//           <button className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 w-full md:w-auto py-3 px-6 rounded-md text-sm font-medium">
//             <Calendar className="h-5 w-5" />
//             Book a Session
//           </button>
//         </Link>
//       </div>
//     </motion.div>
//   );
// };

// export default TeacherProfile;







import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { Star, MessageCircle, Heart, Calendar } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const TeacherProfile = () => {
  const { id } = useParams();
  const { api } = useAuth();
  const [teacher, setTeacher] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      setIsLoading(true);
      try {
        if (!api) {
          throw new Error("API instance is undefined");
        }
        const response = await api.get(`/api/teacher-profiles/${id}`);
        console.log("API Response:", response.data);
        setTeacher(response.data);
      } catch (error) {
        console.error("Error fetching teacher profile:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          baseURL: api?.defaults?.baseURL,
        });
        if (error.response?.status === 404) {
          setTeacher(null);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeacher();
  }, [api, id]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-8 px-4 sm:px-6 lg:px-12 py-6 bg-white"
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
        <h2 className="text-2xl font-semibold text-gray-800">Teacher not found</h2>
        <Link to="/student/favorites" className="mt-4 inline-block text-orange-600 hover:underline">
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
      className="space-y-8 px-4 sm:px-6 lg:px-12 py-6 bg-white"
    >
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="h-32 w-32 rounded-full overflow-hidden ring-4 ring-orange-300 bg-gray-100 flex items-center justify-center">
          <img src={teacher.avatarUrl || '/placeholder.svg'} alt={teacher.name} className="h-full w-full object-cover" />
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-800">{teacher.name || 'Unknown Teacher'}</h1>
            <div className="flex gap-2">
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
            {Array.isArray(teacher.teachingSkills) && teacher.teachingSkills.map((skill, idx) => (
              <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                {skill}
              </span>
            ))}
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{(teacher.rating || 0).toFixed(1)}</span>
            </div>
          </div>

          <div className="text-2xl font-semibold text-orange-600">${(teacher.hourlyRate || 0)}/hour</div>

          <p className="text-gray-700 leading-relaxed mt-2 text-sm">{teacher.bio || 'No bio available'}</p>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <h2 className="font-semibold mb-2 text-gray-800">Availability</h2>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(teacher.availability) && teacher.availability.map((slot, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full border border-blue-100"
                >
                  {slot}
                </span>
              ))}
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
            <video controls className="w-full aspect-video">
              <source src={teacher.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </CardContent>
        </Card>
      )}

      {Array.isArray(teacher.galleryPhotos) && teacher.galleryPhotos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teacher.galleryPhotos.map((photo, idx) => (
              <img
                key={idx}
                src={photo.url}
                alt={photo.name || `Photo ${idx + 1}`}
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <Link to={`/student/book-session/${teacher._id}`}>
          <button className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 w-full md:w-auto py-3 px-6 rounded-md text-sm font-medium">
            <Calendar className="h-5 w-5" />
            Book a Session
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default TeacherProfile;
