// import React from "react";
// import { motion } from "framer-motion";
// import { useParams, Link } from "react-router-dom";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Star, MessageCircle, Calendar, Clock, Heart } from "lucide-react";

// // Mock teacher data
// const mockTeacher = {
//   id: "1",
//   name: "Maria Johnson",
//   avatar: "/placeholder.svg",
//   initials: "MJ",
//   skill: "Yoga",
//   rating: 4.8,
//   hourlyRate: 30,
//   bio: "Certified yoga instructor with 5+ years of experience teaching various styles including Hatha, Vinyasa, and Restorative yoga. I specialize in helping beginners develop proper form and build confidence in their practice.",
//   experience: "5+ years",
//   videoUrl: "https://example.com/maria-demo.mp4", // This would be a real video URL
//   availability: ["Weekdays 5-9pm", "Weekends 9am-3pm"],
//   reviews: [
//     {
//       id: "1",
//       studentName: "John D.",
//       rating: 5,
//       comment: "Maria is an excellent yoga instructor! She was patient and helped me improve my form significantly.",
//       date: "March 15, 2025"
//     },
//     {
//       id: "2",
//       studentName: "Sarah T.",
//       rating: 4.5,
//       comment: "Great instructor who tailors the sessions to your skill level. Very knowledgeable about proper technique.",
//       date: "February 28, 2025"
//     }
//   ]
// };

// const TeacherProfile = () => {
//   const { id } = useParams();
//   const teacher = mockTeacher; // In a real app, fetch the teacher based on the ID

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className="space-y-6"
//     >
//       {/* Teacher Profile Header */}
//       <div className="flex flex-col md:flex-row gap-6 items-start">
//         <Avatar className="h-24 w-24 md:h-32 md:w-32">
//           <AvatarImage src={teacher.avatar} />
//           <AvatarFallback>{teacher.initials}</AvatarFallback>
//         </Avatar>
        
//         <div className="flex-1 space-y-2">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
//             <h2 className="text-3xl font-bold">{teacher.name}</h2>
//             <div className="flex items-center gap-2">
//               <Button>
//                 <Heart className="mr-1 h-4 w-4" />
//                 Favorite
//               </Button>
//               <Button asChild variant="outline">
//                 <Link to={`/student/chat/${teacher.id}`}>
//                   <MessageCircle className="mr-1 h-4 w-4" />
//                   Message
//                 </Link>
//               </Button>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-2">
//             <Badge variant="outline">{teacher.skill} Teacher</Badge>
//             <div className="flex items-center">
//               <Star className="h-4 w-4 fill-primary text-primary" />
//               <span className="ml-1 font-medium">{teacher.rating}</span>
//             </div>
//             <span className="text-muted-foreground">•</span>
//             <span>{teacher.experience} experience</span>
//           </div>
          
//           <div className="text-xl font-semibold">${teacher.hourlyRate}/hour</div>
          
//           <p className="mt-2 text-muted-foreground">{teacher.bio}</p>
          
//           <div className="mt-4 pt-4 border-t">
//             <h3 className="font-medium mb-1">Availability</h3>
//             <div className="flex flex-wrap gap-2">
//               {teacher.availability.map((time, idx) => (
//                 <Badge key={idx} variant="secondary">{time}</Badge>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Video Introduction */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Video Introduction</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
//             <p className="text-center text-muted-foreground">Teacher introduction video would be embedded here</p>
//           </div>
//         </CardContent>
//       </Card>
      
//       {/* Reviews Section */}
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle>Student Reviews</CardTitle>
//           <div className="flex items-center gap-1">
//             <Star className="h-5 w-5 fill-primary text-primary" />
//             <span className="text-lg font-medium">{teacher.rating}</span>
//             <span className="text-muted-foreground">({teacher.reviews.length} reviews)</span>
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {teacher.reviews.map(review => (
//             <motion.div 
//               key={review.id}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.3 }}
//               className="p-4 border rounded-lg"
//             >
//               <div className="flex justify-between items-start">
//                 <div className="font-medium">{review.studentName}</div>
//                 <div className="flex items-center">
//                   <Star className="h-4 w-4 fill-primary text-primary mr-1" />
//                   <span>{review.rating}</span>
//                 </div>
//               </div>
//               <div className="text-sm text-muted-foreground mb-1">{review.date}</div>
//               <p className="mt-1">{review.comment}</p>
//             </motion.div>
//           ))}
//         </CardContent>
//       </Card>
      
//       {/* Book Session Button */}
//       <div className="flex justify-center">
//         <Button size="lg" asChild className="w-full md:w-auto">
//           <Link to={`/student/book-session/${teacher.id}`}>
//             <Calendar className="mr-2 h-4 w-4" />
//             Book a Session
//           </Link>
//         </Button>
//       </div>
//     </motion.div>
//   );
// };

// export default TeacherProfile;


import React from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageCircle, Heart, Calendar } from "lucide-react";

// Mock dataset of teachers
const teachers = [
  {
    id: "1",
    name: "Maria Johnson",
    avatar: "/placeholder.svg",
    initials: "MJ",
    skill: "Yoga",
    rating: 4.8,
    hourlyRate: 30,
    bio:
      "Certified yoga instructor with 5+ years of experience teaching Hatha, Vinyasa, and Restorative yoga. Focus on form and breathing.",
    experience: "5 years",
    availability: ["Weekdays 5-9pm", "Weekends 9am-3pm"],
    location: "New York, NY",
    reviews: [
      {
        id: "r1",
        student: "John D.",
        rating: 5,
        comment: "Great session!",
        date: "March 15, 2025",
      },
      {
        id: "r2",
        student: "Sarah T.",
        rating: 4.5,
        comment: "Very knowledgeable.",
        date: "Feb 28, 2025",
      },
    ],
  },
  {
    id: "2",
    name: "David Lee",
    avatar: "/placeholder.svg",
    initials: "DL",
    skill: "Guitar",
    rating: 4.9,
    hourlyRate: 40,
    bio:
      "Professional guitarist specializing in classical and electric styles. 10+ years performing and teaching.",
    experience: "10 years",
    availability: ["Mon-Thu 6-10pm", "Sat 10am-2pm"],
    location: "Los Angeles, CA",
    reviews: [],
  },
];

const TeacherProfile = () => {
  const { id } = useParams();
  const teacher = teachers.find((t) => t.id === id);

  if (!teacher) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-800">Teacher not found</h2>
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
      className="space-y-8 px-4 sm:px-6 lg:px-12 py-6 bg-white"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start gap-6">
        <Avatar className="h-32 w-32 ring-4 ring-orange-300 bg-gray-100">
          <AvatarImage src={teacher.avatar} />
          <AvatarFallback className="bg-gray-200 text-gray-700 text-xl">
            {teacher.initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-800">{teacher.name}</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-1 text-orange-600 border-orange-600 hover:bg-orange-50"
              >
                <Heart className="h-4 w-4" />
                Favorite
              </Button>
              <Link to={`/student/chat/${teacher.id}`}>
                <Button
                  variant="outline"
                  className="flex items-center gap-1 text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  <MessageCircle className="h-4 w-4" />
                  Message
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <Badge
              variant="outline"
              className="bg-orange-100 text-orange-700"
            >
              {teacher.skill}
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-100 text-blue-700"
            >
              {teacher.experience}
            </Badge>
            <Badge
              variant="outline"
              className="bg-gray-100 text-gray-700"
            >
              {teacher.location}
            </Badge>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{teacher.rating}</span>
            </div>
          </div>

          <div className="text-2xl font-semibold text-orange-600">
            ${teacher.hourlyRate}/hour
          </div>

          <p className="text-gray-700 leading-relaxed mt-2 text-sm">
            {teacher.bio}
          </p>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <h2 className="font-semibold mb-2 text-gray-800">
              Availability
            </h2>
            <div className="flex flex-wrap gap-2">
              {teacher.availability.map((slot, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="bg-blue-50 text-blue-600 text-xs"
                >
                  {slot}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Intro */}
      <Card className="shadow-lg border border-gray-100">
        <CardHeader>
          <CardTitle>Video Introduction</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Video preview coming soon</p>
          </div>
        </CardContent>
      </Card>

      {/* Reviews */}
      <Card className="shadow-lg border border-gray-100">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Student Reviews</CardTitle>
          <div className="flex items-center gap-1 text-gray-700">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">
              {teacher.reviews.length} Reviews
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {teacher.reviews.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-2 max-w-2xl w-full bg-white p-5 rounded-lg shadow-md hover:scale-105 transition-transform duration-150"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">
                  {r.student}
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(r.rating)
                          ? "text-yellow-400"
                          : "text-yellow-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400">{r.date}</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {r.comment}
              </p>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Book Session */}
      <div className="flex justify-center">
        <Link
          to={`/student/book-session/${teacher.id}`}
          className="w-full md:w-auto"
        >
          <Button
            size="lg"
            className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 w-full md:w-auto py-3 px-6"
          >
            <Calendar className="h-5 w-5" />
            Book a Session
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default TeacherProfile;
