import SkillCard from "./SkillCard";

const SkillGrid = ({ skills }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8">
      {skills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  );
};

export default SkillGrid;