import { useState } from "react";
import { mockSkills, skillCategories } from "@/data/mockData";
import SkillGrid from "@/components/skills/SkillGrid";
import SkillCategoryFilter from "@/components/skills/SkillCategoryFilter";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SkillsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredSkills = mockSkills.filter(skill => {
    const matchesCategory = selectedCategory === "all" || skill.category === selectedCategory;
    const matchesSearch = skill.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Explore Skills</h1>
      
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input 
          type="search"
          placeholder="Search for skills..." 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <SkillCategoryFilter 
        categories={skillCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      {filteredSkills.length > 0 ? (
        <SkillGrid skills={filteredSkills} />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No skills found matching your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default SkillsPage;