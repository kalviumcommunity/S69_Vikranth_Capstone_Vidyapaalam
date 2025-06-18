import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";

// --- Mock Data ---
const mockSkills = [
  {
    id: "react",
    title: "React.js",
    image: "https://via.placeholder.com/800x400?text=React+Skill",
    category: "Frontend",
    difficulty: "Intermediate",
    rating: 4.8,
    mentorName: "Jane Doe",
    mentorImage: "https://via.placeholder.com/100?text=Jane",
  },
  {
    id: "node",
    title: "Node.js",
    image: "https://via.placeholder.com/800x400?text=Node+Skill",
    category: "Backend",
    difficulty: "Beginner",
    rating: 4.6,
    mentorName: "John Smith",
    mentorImage: "https://via.placeholder.com/100?text=John",
  },
];

const SkillDetailPage = () => {
  const { id } = useParams();
  const [skill, setSkill] = useState(null);

  useEffect(() => {
    const foundSkill = mockSkills.find((s) => s.id === id);
    setSkill(foundSkill || null);
  }, [id]);

  if (!skill) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Skill not found</h2>
        <p className="mb-8">The skill you're looking for doesn't exist or has been removed.</p>
        <Link to="/skills">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Back to Skills
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="lg:col-span-2">
          <div className="rounded-lg overflow-hidden mb-6">
            <img src={skill.image} alt={skill.title} className="w-full h-auto object-cover" />
          </div>

          <h1 className="text-3xl font-bold mb-4">{skill.title}</h1>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 rounded text-white bg-blue-600">{skill.category}</span>
            <span className="px-3 py-1 border rounded text-blue-600 border-blue-600">
              {skill.difficulty}
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">About this skill</h2>
            <p className="text-gray-600 mb-4">
              This comprehensive program will guide you through everything you need to know about{" "}
              {skill.title.toLowerCase()}. Whether you're a beginner or looking to advance, our mentor
              will provide guidance to help you succeed.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">What you'll learn</h2>
            <ul className="space-y-2 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Core concepts and principles of {skill.title.toLowerCase()}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Hands-on skills through real-world projects</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Best practices and professional workflows</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Problem-solving techniques in the domain</span>
              </li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4 mt-8">Session format</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center text-center">
                <Clock className="h-6 w-6 text-blue-600 mb-2" />
                <h3 className="font-medium">Duration</h3>
                <p className="text-sm text-gray-500">1-2 hours per session</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center text-center">
                <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                <h3 className="font-medium">Frequency</h3>
                <p className="text-sm text-gray-500">Weekly or bi-weekly</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center text-center">
                <UserCheck className="h-6 w-6 text-blue-600 mb-2" />
                <h3 className="font-medium">Format</h3>
                <p className="text-sm text-gray-500">1:1 or small group</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={skill.mentorImage}
                alt={skill.mentorName}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">{skill.mentorName}</h3>
                <div className="flex items-center">
                  <span className="text-amber-500 mr-1">★</span>
                  <span>{skill.rating}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Experienced mentor passionate about teaching {skill.title.toLowerCase()} to all levels.
            </p>

            <button className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4">
              Connect with Mentor
            </button>
            <button className="w-full py-2 px-4 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
              Save for Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillDetailPage;
