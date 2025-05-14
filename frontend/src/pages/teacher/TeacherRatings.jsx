// import React from "react";
// import { motion } from "framer-motion";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Star } from "lucide-react";
// import { Progress } from "@/components/ui/progress";

// // Mock ratings data
// const mockRatings = [
//   {
//     id: "1",
//     studentName: "John Doe",
//     studentAvatar: "/placeholder.svg",
//     studentInitials: "JD",
//     rating: 5,
//     comment: "Jane is an excellent teacher! She was patient and helped me improve significantly.",
//     date: "April 1, 2025",
//     skillName: "Yoga",
//   },
//   {
//     id: "2",
//     studentName: "Sarah Thompson",
//     studentAvatar: "/placeholder.svg",
//     studentInitials: "ST",
//     rating: 4.5,
//     comment: "Great instructor who tailors the sessions to your skill level. Very knowledgeable about proper technique.",
//     date: "March 28, 2025",
//     skillName: "Yoga",
//   },
//   {
//     id: "3",
//     studentName: "Michael Brown",
//     studentAvatar: "/placeholder.svg",
//     studentInitials: "MB",
//     rating: 5,
//     comment: "Jane is awesome! I've learned so much in just a few sessions.",
//     date: "March 15, 2025",
//     skillName: "Meditation",
//   },
//   {
//     id: "4",
//     studentName: "Emily Davis",
//     studentAvatar: "/placeholder.svg",
//     studentInitials: "ED",
//     rating: 4,
//     comment: "Very professional and knowledgeable. Would recommend to anyone looking to learn meditation.",
//     date: "March 10, 2025",
//     skillName: "Meditation",
//   },
//   {
//     id: "5",
//     studentName: "Robert Johnson",
//     studentAvatar: "/placeholder.svg",
//     studentInitials: "RJ",
//     rating: 5,
//     comment: "Jane is an incredible instructor. Her teaching style is clear and easy to follow.",
//     date: "February 25, 2025",
//     skillName: "Yoga",
//   },
// ];

// const TeacherRatings = () => {
//   const calculateAverageRating = () => {
//     const sum = mockRatings.reduce((acc, curr) => acc + curr.rating, 0);
//     return (sum / mockRatings.length).toFixed(1);
//   };

//   const calculateRatingCounts = () => {
//     const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
//     mockRatings.forEach((rating) => {
//       const rounded = Math.round(rating.rating);
//       counts[rounded] += 1;
//     });
//     return counts;
//   };

//   const averageRating = calculateAverageRating();
//   const ratingCounts = calculateRatingCounts();
//   const totalRatings = mockRatings.length;

//   const getProgressValue = (count) => {
//     return (count / totalRatings) * 100;
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className="space-y-6"
//     >
//       <div>
//         <h2 className="text-3xl font-bold mb-2">Your Ratings & Reviews</h2>
//         <p className="text-muted-foreground">See what your students are saying about your teaching.</p>
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         <Card className="lg:col-span-1">
//           <CardHeader>
//             <CardTitle>Overall Rating</CardTitle>
//           </CardHeader>
//           <CardContent className="flex flex-col items-center justify-center pt-6">
//             <div className="text-5xl font-bold flex items-center">
//               {averageRating}
//               <Star className="h-8 w-8 ml-2 fill-primary text-primary" />
//             </div>
//             <p className="mt-2 text-muted-foreground">
//               Based on {totalRatings} reviews
//             </p>
            
//             <div className="w-full space-y-3 mt-8">
//               {[5, 4, 3, 2, 1].map((rating) => (
//                 <div key={rating} className="flex items-center gap-3">
//                   <div className="flex items-center">
//                     <span className="w-3">{rating}</span>
//                     <Star className="h-4 w-4 ml-1 fill-primary text-primary" />
//                   </div>
//                   <Progress value={getProgressValue(ratingCounts[rating])} className="h-2" />
//                   <span className="text-sm text-muted-foreground w-8 text-right">
//                     {ratingCounts[rating]}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card className="lg:col-span-3">
//           <CardHeader>
//             <CardTitle>Recent Reviews</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Tabs defaultValue="all">
//               <TabsList>
//                 <TabsTrigger value="all">All Reviews</TabsTrigger>
//                 <TabsTrigger value="yoga">Yoga</TabsTrigger>
//                 <TabsTrigger value="meditation">Meditation</TabsTrigger>
//               </TabsList>
              
//               <TabsContent value="all" className="mt-6 space-y-6">
//                 {mockRatings.map((review) => (
//                   <motion.div 
//                     key={review.id}
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 0.3 }}
//                     className="border-b pb-6 last:border-b-0 last:pb-0"
//                   >
//                     <div className="flex justify-between items-start">
//                       <div className="flex items-center gap-3">
//                         <Avatar>
//                           <AvatarImage src={review.studentAvatar} />
//                           <AvatarFallback>{review.studentInitials}</AvatarFallback>
//                         </Avatar>
//                         <div>
//                           <div className="font-medium">{review.studentName}</div>
//                           <div className="text-sm text-muted-foreground flex items-center">
//                             <span>{review.date}</span>
//                             <span className="mx-2">•</span>
//                             <span>{review.skillName}</span>
//                           </div>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center">
//                         <Star className="h-4 w-4 fill-primary text-primary mr-1" />
//                         <span>{review.rating}</span>
//                       </div>
//                     </div>
                    
//                     <p className="mt-3">{review.comment}</p>
//                   </motion.div>
//                 ))}
//               </TabsContent>
              
//               <TabsContent value="yoga" className="mt-6 space-y-6">
//                 {mockRatings
//                   .filter((review) => review.skillName === "Yoga")
//                   .map((review) => (
//                     <motion.div 
//                       key={review.id}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ duration: 0.3 }}
//                       className="border-b pb-6 last:border-b-0 last:pb-0"
//                     >
//                       <div className="flex justify-between items-start">
//                         <div className="flex items-center gap-3">
//                           <Avatar>
//                             <AvatarImage src={review.studentAvatar} />
//                             <AvatarFallback>{review.studentInitials}</AvatarFallback>
//                           </Avatar>
//                           <div>
//                             <div className="font-medium">{review.studentName}</div>
//                             <div className="text-sm text-muted-foreground">{review.date}</div>
//                           </div>
//                         </div>
                        
//                         <div className="flex items-center">
//                           <Star className="h-4 w-4 fill-primary text-primary mr-1" />
//                           <span>{review.rating}</span>
//                         </div>
//                       </div>
                      
//                       <p className="mt-3">{review.comment}</p>
//                     </motion.div>
//                   ))}
//               </TabsContent>
              
//               <TabsContent value="meditation" className="mt-6 space-y-6">
//                 {mockRatings
//                   .filter((review) => review.skillName === "Meditation")
//                   .map((review) => (
//                     <motion.div 
//                       key={review.id}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ duration: 0.3 }}
//                       className="border-b pb-6 last:border-b-0 last:pb-0"
//                     >
//                       <div className="flex justify-between items-start">
//                         <div className="flex items-center gap-3">
//                           <Avatar>
//                             <AvatarImage src={review.studentAvatar} />
//                             <AvatarFallback>{review.studentInitials}</AvatarFallback>
//                           </Avatar>
//                           <div>
//                             <div className="font-medium">{review.studentName}</div>
//                             <div className="text-sm text-muted-foreground">{review.date}</div>
//                           </div>
//                         </div>
                        
//                         <div className="flex items-center">
//                           <Star className="h-4 w-4 fill-primary text-primary mr-1" />
//                           <span>{review.rating}</span>
//                         </div>
//                       </div>
                      
//                       <p className="mt-3">{review.comment}</p>
//                     </motion.div>
//                   ))}
//               </TabsContent>
//             </Tabs>
//           </CardContent>
//         </Card>
//       </div>
//     </motion.div>
//   );
// };

// export default TeacherRatings;









import React, { useState } from "react";
import { motion } from "framer-motion";
// Assuming you still use these UI components if they weren't replaced
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react"; // Assuming lucide-react is still used

// --- Custom Tailwind Progress Bar Component (Keep as defined before) ---
const TailwindProgressBar = ({
  value,
  className = "",
  fillerClassName = "bg-orange-500",
  backgroundClassName = "bg-gray-200"
}) => {
  const validValue = Math.min(100, Math.max(0, value || 0));
  return (
    <div
      className={`h-2 ${backgroundClassName} rounded-full overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={validValue}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        className={`h-full ${fillerClassName} rounded-full transition-all duration-300 ease-out`}
        style={{ width: `${validValue}%` }}
      ></div>
    </div>
  );
};

// --- Mock Data (Keep as defined before) ---
const mockRatings = [
    { id: "1", student: "Alice A.", rating: 5, comment: "Amazing session!", date: "Apr 1, 2025", skill: "Yoga" },
    { id: "2", student: "Bob B.",   rating: 5, comment: "Very patient.",    date: "Apr 2, 2025", skill: "Yoga" },
    { id: "3", student: "Cara C.",  rating: 5, comment: "Great technique.", date: "Mar 28, 2025", skill: "Yoga" },
    { id: "4", student: "Dan D.",   rating: 4, comment: "Learned a lot.",   date: "Mar 29, 2025", skill: "Yoga" },
    { id: "5", student: "Eve E.",   rating: 3, comment: "Good, but rushed.",date: "Mar 15, 2025", skill: "Meditation" },
    { id: "6", student: "Frank F.", rating: 3, comment: "Helpful overall.",date: "Mar 16, 2025", skill: "Meditation" },
    { id: "7", student: "Gina G.",  rating: 2, comment: "Could improve pacing.", date: "Mar 10, 2025", skill: "Meditation" },
    { id: "8", student: "Harry H.", rating: 4, comment: "Material too advanced.", date: "Mar 11, 2025", skill: "Meditation" },
    { id: "9", student: "Ivy I.",   rating: 5, comment: "Not what I expected.", date: "Feb 25, 2025", skill: "Yoga" },
    { id: "10",student: "Jack J.",  rating: 4, comment: "Unhelpful session.", date: "Feb 26, 2025", skill: "Yoga" },
];


export default function TeacherRatings() {
  const total = mockRatings.length;
  const average = (mockRatings.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1);
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  mockRatings.forEach((r) => counts[Math.round(r.rating)]++);
  const [filterStar, setFilterStar] = useState(0);
  const reviewsToShow = mockRatings.filter((r) =>
    filterStar === 0 ? true : Math.round(r.rating) === filterStar
  );
  const pct = (star) => Math.round((counts[star] / total) * 100);

  return (
    // Main container - adjusted padding like TeacherOverview
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

      {/* --- Animated Heading Block (Styled like TeacherOverview) --- */}
      <motion.div
          className="" // Center align heading and subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} // Match duration
      >
          <h2 className="text-3xl md:text-4xl font-bold"> {/* Match font style */}
              <span className=" bg-orange-500 bg-clip-text text-transparent"> {/* Gradient */}
                  My Ratings
              </span>
          </h2>
          <p className="mt-2 text-base md:text-lg text-gray-600"> {/* Subtitle */}
              See what students are saying about your sessions.
          </p>
      </motion.div>
      {/* --- End Heading Block --- */}


      {/* --- Animated Content Grid Block --- */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6" // The grid itself
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }} // Match duration, slight delay
      >
        {/* Left: Ratings Summary (Card styling can remain specific to this page) */}
        <div className="space-y-6 md:col-span-1">
          <Card className="rounded-xl shadow-md hover:shadow-lg border border-gray-100 transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-gray-700">
                Overall Rating
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-4">
              <div className="flex items-center text-5xl font-bold text-gray-900">
                {average}
                <Star className="h-8 w-8 text-orange-500 ml-2" />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Based on {total} reviews
              </p>
              <div className="w-full mt-6 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const isActive = filterStar === star;
                  return (
                    <div
                      key={star}
                      onClick={() =>
                        setFilterStar(isActive ? 0 : star)
                      }
                      className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                        isActive ? "bg-orange-50" : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center w-12">
                        <span className="font-medium">{star}</span>
                        <Star className="h-4 w-4 text-orange-400 ml-1" />
                      </div>
                      <TailwindProgressBar
                        value={pct(star)}
                        className="flex-1"
                      />
                      <span className="w-6 text-right text-sm text-gray-600">
                        {counts[star]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Reviews List (Card styling can remain specific to this page) */}
        <div className="md:col-span-2 space-y-4">
          {reviewsToShow.length === 0 ? (
            <div className="text-center py-10 px-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <Star className="mx-auto h-10 w-10 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-800">
                    No {filterStar ? `${filterStar}-star ` : ""}reviews found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    {filterStar ? `There are no ${filterStar}-star reviews to display.` : "Reviews matching your filter will appear here."}
                </p>
            </div>
          ) : (
            reviewsToShow.map((r) => (
              <Card
                key={r.id}
                className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-100 transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 bg-orange-100 text-orange-500 border border-orange-200">
                    <AvatarFallback>
                      {r.student.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-gray-800">
                        {r.student}
                      </h4>
                      <div className="flex items-center text-lg text-gray-800">
                        <Star className="h-5 w-5 text-orange-500 mr-1" />
                        {r.rating}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                      <span>{r.date}</span>
                      <span>•</span>
                      <span>{r.skill}</span>
                    </div>
                    <p className="mt-4 text-base text-gray-700">
                      {r.comment}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </motion.div> {/* --- End Content Grid Block --- */}

    </div> // End Main container
  );
}