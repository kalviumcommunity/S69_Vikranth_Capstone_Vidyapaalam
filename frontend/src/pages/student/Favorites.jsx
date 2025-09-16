import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Star, MapPin } from "lucide-react";

const mockFavorites = [
  {
    id: "1",
    name: "Maria Johnson",
    avatar: "/placeholder.svg",
    initials: "MJ",
    skill: "Yoga",
    rating: 4.8,
    hourlyRate: 30,
    location: "New York, USA",
    experience: "5 years",
    bio:
      "Certified yoga instructor specializing in Hatha and Vinyasa flows. Passionate about mindfulness and flexibility training, with over 2000 hours taught.",
  },
  {
    id: "2",
    name: "David Lee",
    avatar: "/placeholder.svg",
    initials: "DL",
    skill: "Guitar",
    rating: 4.9,
    hourlyRate: 40,
    location: "Los Angeles, USA",
    experience: "10 years",
    bio:
      "Professional guitarist skilled in classical, acoustic, and electric styles. Has performed internationally and recorded three albums.",
  },
  {
    id: "3",
    name: "Michael Chen",
    avatar: "/placeholder.svg",
    initials: "MC",
    skill: "Programming",
    rating: 4.9,
    hourlyRate: 50,
    location: "San Francisco, USA",
    experience: "8 years",
    bio:
      "Full-stack software engineer proficient in React, Node.js, and Python. Passionate about teaching coding fundamentals and best practices.",
  },
];

const Favorites = () => {
  const [favorites, setFavorites] = useState(mockFavorites);

  const handleRemoveFavorite = (id) => {
    setFavorites((prev) => prev.filter((t) => t.id !== id));
    const notification = document.createElement("div");
    notification.className =
      "fixed bottom-4 right-4 bg-orange-100 border border-orange-400 text-orange-800 shadow-lg rounded-lg p-4 animate-fade-in z-50";
    notification.innerHTML = "Teacher removed from favorites";
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add("animate-fade-out");
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  };

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-12 py-6">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-orange-600 mb-2">
          Favorite Teachers
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto">
          Your collection of favorite teachers for quick access.
        </p>
      </motion.div>

      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 mx-auto text-gray-400" />
          <h3 className="text-xl font-medium mt-4 mb-2">
            No favorite teachers yet
          </h3>
          <p className="text-gray-500 mb-6">
            Add teachers to your favorites for quick access to their profiles.
          </p>
          <Link
            to="/student/find-teacher"
            className="inline-flex items-center justify-center px-5 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          >
            Find Teachers
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {favorites.map((teacher) => (
            <motion.div
              key={teacher.id}
              className="w-full max-w-2xl mx-auto bg-white rounded-lg border border-gray-100 shadow hover:shadow-lg transition-shadow p-6 flex flex-col md:flex-row items-start gap-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="h-20 w-20 rounded-full bg-gray-200 overflow-hidden">
                  {teacher.avatar ? (
                    <img
                      src={teacher.avatar}
                      alt={teacher.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-700 font-bold">
                      {teacher.initials}
                    </div>
                  )}
                </div>
              </div>

              {/* Profile & Bio */}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {teacher.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-gray-600 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{teacher.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span>{teacher.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-orange-600">
                      ${teacher.hourlyRate}
                    </span>
                    <span className="text-sm text-gray-500">/hr</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                    {teacher.skill}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {teacher.experience}
                  </span>
                </div>
                <p className="text-gray-700 mt-4 text-sm leading-relaxed line-clamp-3">
                  {teacher.bio}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-center gap-3 md:items-end md:pl-4">
                <button
                  onClick={() => handleRemoveFavorite(teacher.id)}
                  className="p-2 rounded-md border border-gray-200 hover:bg-orange-100 transition-colors"
                >
                  <Heart className="h-5 w-5 text-red-500" />
                </button>
                <Link
                  to={`/student/chat/${teacher.id}`}
                  className="flex items-center gap-1 px-3 py-2 rounded-md border border-gray-200 text-blue-600 hover:bg-blue-50 transition-colors text-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </Link>
                <Link
                  to={`/student/teacher/${teacher.id}`}
                  className="px-3 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-700 transition-colors text-sm"
                >
                  View Profile
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Fade-in/out animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px);} to{ opacity: 1; transform: translateY(0);} }
        @keyframes fadeOut { from { opacity: 1; transform: translateY(0);} to{ opacity: 0; transform: translateY(10px);} }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-fade-out { animation: fadeOut 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Favorites;
