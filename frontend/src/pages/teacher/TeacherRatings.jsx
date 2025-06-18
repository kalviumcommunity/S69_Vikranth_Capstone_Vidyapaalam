import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star } from "lucide-react";

// Tailwind Progress Bar
const TailwindProgressBar = ({
  value,
  className = "",
  fillerClassName = "bg-orange-500",
  backgroundClassName = "bg-gray-200",
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

// Mock Ratings Data
const mockRatings = [
  { id: "1", student: "Alice A.", rating: 5, comment: "Amazing session!", date: "Apr 1, 2025", skill: "Yoga" },
  { id: "2", student: "Bob B.", rating: 5, comment: "Very patient.", date: "Apr 2, 2025", skill: "Yoga" },
  { id: "3", student: "Cara C.", rating: 5, comment: "Great technique.", date: "Mar 28, 2025", skill: "Yoga" },
  { id: "4", student: "Dan D.", rating: 4, comment: "Learned a lot.", date: "Mar 29, 2025", skill: "Yoga" },
  { id: "5", student: "Eve E.", rating: 3, comment: "Good, but rushed.", date: "Mar 15, 2025", skill: "Meditation" },
  { id: "6", student: "Frank F.", rating: 3, comment: "Helpful overall.", date: "Mar 16, 2025", skill: "Meditation" },
  { id: "7", student: "Gina G.", rating: 2, comment: "Could improve pacing.", date: "Mar 10, 2025", skill: "Meditation" },
  { id: "8", student: "Harry H.", rating: 4, comment: "Material too advanced.", date: "Mar 11, 2025", skill: "Meditation" },
  { id: "9", student: "Ivy I.", rating: 5, comment: "Not what I expected.", date: "Feb 25, 2025", skill: "Yoga" },
  { id: "10", student: "Jack J.", rating: 4, comment: "Unhelpful session.", date: "Feb 26, 2025", skill: "Yoga" },
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold">
          <span className="bg-orange-500 bg-clip-text text-transparent">My Ratings</span>
        </h2>
        <p className="mt-2 text-base md:text-lg text-gray-600">
          See what students are saying about your sessions.
        </p>
      </motion.div>

      {/* Content Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Ratings Summary */}
        <div className="space-y-6 md:col-span-1">
          <Card className="rounded-xl shadow-md hover:shadow-lg border border-gray-100 transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-gray-700">Overall Rating</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-4">
              <div className="flex items-center text-5xl font-bold text-gray-900">
                {average}
                <Star className="h-8 w-8 text-orange-500 ml-2" />
              </div>
              <p className="mt-1 text-sm text-gray-500">Based on {total} reviews</p>
              <div className="w-full mt-6 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const isActive = filterStar === star;
                  return (
                    <div
                      key={star}
                      onClick={() => setFilterStar(isActive ? 0 : star)}
                      className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                        isActive ? "bg-orange-50" : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center w-12">
                        <span className="font-medium">{star}</span>
                        <Star className="h-4 w-4 text-orange-400 ml-1" />
                      </div>
                      <TailwindProgressBar value={pct(star)} className="flex-1" />
                      <span className="w-6 text-right text-sm text-gray-600">{counts[star]}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews List */}
        <div className="md:col-span-2 space-y-4">
          {reviewsToShow.length === 0 ? (
            <div className="text-center py-10 px-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <Star className="mx-auto h-10 w-10 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-800">
                No {filterStar ? `${filterStar}-star ` : ""}reviews found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {filterStar
                  ? `There are no ${filterStar}-star reviews to display.`
                  : "Reviews matching your filter will appear here."}
              </p>
            </div>
          ) : (
            reviewsToShow.map((r) => (
              <Card
                key={r.id}
                className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-100 transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-500 font-semibold flex items-center justify-center">
                    {r.student.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-gray-800">{r.student}</h4>
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
                    <p className="mt-4 text-base text-gray-700">{r.comment}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
