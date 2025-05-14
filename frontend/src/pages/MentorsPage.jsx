import { useState } from "react";
import { mockMentors } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const MentorsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredMentors = mockMentors.filter(mentor => {
    const matchesName = mentor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = mentor.skills.some(skill => 
      skill.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesLocation = mentor.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesName || matchesSkill || matchesLocation;
  });
  
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Find Mentors</h1>
      
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input 
          type="search"
          placeholder="Search by name, skill, or location..." 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <Card key={mentor.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative h-48 bg-gradient-to-b from-skill/50 to-skill-dark/50 flex items-center justify-center">
                <img 
                  src={mentor.image} 
                  alt={mentor.name} 
                  className="w-24 h-24 rounded-full border-4 border-white object-cover"
                />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold text-center mb-2">{mentor.name}</h3>
              <div className="flex items-center justify-center gap-2 mb-4">
                <MapPin size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{mentor.location}</span>
              </div>
              <div className="flex items-center justify-center mb-4">
                <span className="text-amber-500 mr-1">★</span>
                <span>{mentor.rating}</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {mentor.skills.map((skill) => (
                  <Badge key={skill} variant="outline">{skill}</Badge>
                ))}
              </div>
              <p className="text-sm text-center text-muted-foreground mb-6">
                {mentor.bio}
              </p>
              <Link to={`/mentors/${mentor.id}`}>
                <Button className="w-full">View Profile</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredMentors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No mentors found matching your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default MentorsPage;