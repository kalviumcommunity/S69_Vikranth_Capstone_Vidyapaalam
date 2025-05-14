import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockSkills } from "@/data/mockData";
import { Calendar, Clock, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";

const SkillDetailPage = () => {
  const { id } = useParams();
  const [skill, setSkill] = useState(null);
  
  useEffect(() => {
    const foundSkill = mockSkills.find(s => s.id === id);
    setSkill(foundSkill || null);
  }, [id]);
  
  if (!skill) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Skill not found</h2>
        <p className="mb-8">The skill you're looking for doesn't exist or has been removed.</p>
        <Link to="/skills">
          <Button>Back to Skills</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="rounded-lg overflow-hidden mb-6">
            <img 
              src={skill.image} 
              alt={skill.title} 
              className="w-full h-auto object-cover"
            />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{skill.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge className="bg-skill hover:bg-skill-dark">
              {skill.category}
            </Badge>
            <Badge variant="outline" className="border-skill text-skill">
              {skill.difficulty}
            </Badge>
          </div>
          
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">About this skill</h2>
            <p className="text-muted-foreground mb-4">
              This comprehensive program will guide you through everything you need to know about {skill.title.toLowerCase()}.
              Whether you're a complete beginner or looking to advance your existing knowledge, our mentor will
              provide personalized guidance to help you achieve your learning goals.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 mt-8">What you'll learn</h2>
            <ul className="space-y-2 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Fundamental principles and concepts of {skill.title.toLowerCase()}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Hands-on practical skills through guided projects</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Industry best practices and professional techniques</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Problem-solving approaches specific to this domain</span>
              </li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4 mt-8">Session format</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-secondary rounded-lg p-4 flex flex-col items-center text-center">
                <Clock className="h-6 w-6 text-skill mb-2" />
                <h3 className="font-medium">Duration</h3>
                <p className="text-sm text-muted-foreground">1-2 hours per session</p>
              </div>
              <div className="bg-secondary rounded-lg p-4 flex flex-col items-center text-center">
                <Calendar className="h-6 w-6 text-skill mb-2" />
                <h3 className="font-medium">Frequency</h3>
                <p className="text-sm text-muted-foreground">Weekly or bi-weekly</p>
              </div>
              <div className="bg-secondary rounded-lg p-4 flex flex-col items-center text-center">
                <UserCheck className="h-6 w-6 text-skill mb-2" />
                <h3 className="font-medium">Format</h3>
                <p className="text-sm text-muted-foreground">1:1 or small group</p>
              </div>
            </div>
          </div>
        </div>
        
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
            
            <p className="text-muted-foreground mb-6">
              Experienced mentor with a passion for teaching {skill.title.toLowerCase()} to learners of all levels.
            </p>
            
            <Button className="w-full mb-4">
              Connect with Mentor
            </Button>
            
            <Button variant="outline" className="w-full">
              Save for Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillDetailPage;