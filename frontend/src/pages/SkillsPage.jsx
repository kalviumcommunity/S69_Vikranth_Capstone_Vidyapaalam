import { useState } from "react";
import { Search } from "lucide-react";

const mockSkills = [
  {
    id: "react",
    title: "React.js",
    category: "Frontend",
    image: "https://via.placeholder.com/300x180?text=React+Skill",
  },
  {
    id: "node",
    title: "Node.js",
    category: "Backend",
    image: "https://via.placeholder.com/300x180?text=Node+Skill",
  },
  {
    id: "python",
    title: "Python Programming",
    category: "Programming",
    image: "https://via.placeholder.com/300x180?text=Python+Skill",
  },
];

const skillCategories = ["all", "Frontend", "Backend", "Programming"];

const SkillsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSkills = mockSkills.filter((skill) => {
    const matchesCategory = selectedCategory === "all" || skill.category === selectedCategory;
    const matchesSearch = skill.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Explore Skills</h1>

      {/* Search Input */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Search for skills..."
          className="w-full pl-10 py-2 border border-gray-300 rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-10">
        {skillCategories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded border ${
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      {filteredSkills.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <img src={skill.image} alt={skill.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{skill.title}</h3>
                <p className="text-sm text-gray-500">{skill.category}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No skills found matching your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default SkillsPage;
