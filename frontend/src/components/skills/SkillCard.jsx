// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Link } from "react-router-dom";

// const SkillCard = ({ skill }) => {
//   const difficultyColor = {
//     Beginner: "bg-green-100 text-green-800",
//     Intermediate: "bg-blue-100 text-blue-800",
//     Advanced: "bg-purple-100 text-purple-800",
//   };

//   return (
//     <Link to={`/skills/${skill.id}`}>
//       <Card className="skill-card overflow-hidden h-full flex flex-col">
//         <div className="relative h-48 overflow-hidden">
//           <img 
//             src={skill.image} 
//             alt={skill.title} 
//             className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
//           />
//           <Badge className="absolute top-3 right-3">
//             {skill.category}
//           </Badge>
//         </div>
        
//         <CardHeader className="pb-2">
//           <h3 className="font-semibold text-lg">{skill.title}</h3>
//         </CardHeader>
        
//         <CardContent className="pb-2 flex-grow">
//           <div className="flex items-center gap-2">
//             <span className={`text-xs px-2 py-1 rounded-full ${difficultyColor[skill.difficulty]}`}>
//               {skill.difficulty}
//             </span>
//             <div className="flex items-center">
//               <span className="text-amber-500">★</span>
//               <span className="text-sm ml-1">{skill.rating}</span>
//             </div>
//           </div>
//         </CardContent>
        
//         <CardFooter className="pt-2 border-t">
//           <div className="flex items-center gap-2">
//             <img 
//               src={skill.mentorImage} 
//               alt={skill.mentorName} 
//               className="w-8 h-8 rounded-full object-cover"
//             />
//             <span className="text-sm text-muted-foreground">
//               with {skill.mentorName}
//             </span>
//           </div>
//         </CardFooter>
//       </Card>
//     </Link>
//   );
// };

// export default SkillCard;
import { Link } from "react-router-dom";

const SkillCard = ({ skill }) => {
  const difficultyColor = {
    Beginner: "bg-green-100 text-green-800",
    Intermediate: "bg-blue-100 text-blue-800",
    Advanced: "bg-purple-100 text-purple-800",
  };

  return (
    <Link to={`/skills/${skill.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full flex flex-col">
        <div className="relative h-40 overflow-hidden"> {/* Decreased height */}
          <img
            src={skill.image}
            alt={skill.title}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
          <span className="absolute top-3 right-3 bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-base font-semibold">
            {skill.category}
          </span>
        </div>

        <div className="p-6 flex-grow">
          <h3 className="font-semibold text-xl text-gray-900 mb-3">{skill.title}</h3>
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-lg px-4 py-2 rounded-full ${difficultyColor[skill.difficulty]}`}>
              {skill.difficulty}
            </span>
            <div className="flex items-center">
              <span className="text-amber-500 text-2xl">★</span>
              <span className="text-lg ml-2 text-gray-700">{skill.rating}</span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center gap-3">
          <img
            src={skill.mentorImage}
            alt={skill.mentorName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-lg text-gray-600">with {skill.mentorName}</span>
        </div>
      </div>
    </Link>
  );
};

export default SkillCard;