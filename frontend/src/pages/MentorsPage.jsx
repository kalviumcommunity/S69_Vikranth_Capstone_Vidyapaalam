import { useState } from "react";
import { mockMentors } from "@/data/mockData";
import { Search, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const MentorsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMentors = mockMentors.filter((mentor) => {
    const matchesName = mentor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = mentor.skills.some((skill) =>
      skill.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesLocation = mentor.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesName || matchesSkill || matchesLocation;
  });

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Find Mentors</h1>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Search by name, skill, or location..."
          className="w-full pl-10 py-2 border border-gray-300 rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <div key={mentor.id} className="border rounded-lg shadow-sm overflow-hidden">
            <div className="h-48 bg-gradient-to-b from-gray-200 to-gray-300 flex items-center justify-center">
              <img
                src={mentor.image}
                alt={mentor.name}
                className="w-24 h-24 rounded-full border-4 border-white object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-center mb-2">{mentor.name}</h3>
              <div className="flex items-center justify-center gap-2 mb-4 text-gray-500 text-sm">
                <MapPin size={16} />
                <span>{mentor.location}</span>
              </div>
              <div className="flex items-center justify-center mb-4 text-sm">
                <span className="text-amber-500 mr-1">★</span>
                <span>{mentor.rating}</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {mentor.skills.map((skill) => (
                  <span key={skill} className="px-2 py-1 border rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
              <p className="text-sm text-center text-gray-500 mb-6">{mentor.bio}</p>
              <Link to={`/mentors/${mentor.id}`}>
                <button className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">
                  View Profile
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredMentors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No mentors found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default MentorsPage;
