import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const SkillCategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="w-full mb-8">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
              selectedCategory === "all"
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "border border-gray-300 text-gray-800 hover:bg-gray-100"
            }`}
            onClick={() => onSelectCategory("all")}
          >
            All Categories
          </button>

          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
                selectedCategory === category
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "border border-gray-300 text-gray-800 hover:bg-gray-100"
              }`}
              onClick={() => onSelectCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default SkillCategoryFilter;
