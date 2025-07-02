import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'all', label: 'جميع المشاريع', icon: 'fas fa-th-large' },
  { id: 'bots', label: 'البوتات', icon: 'fas fa-robot' },
  { id: 'servers', label: 'الخوادم', icon: 'fas fa-server' },
  { id: 'tools', label: 'الأدوات', icon: 'fas fa-tools' },
  { id: 'templates', label: 'القوالب', icon: 'fas fa-code' },
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {categories.map((category) => (
        <Button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          variant={selectedCategory === category.id ? "default" : "outline"}
          className={`px-6 py-3 font-medium transition-all ${
            selectedCategory === category.id
              ? 'bg-discord-blurple text-white hover:bg-blue-600'
              : 'bg-discord-elevated text-discord-text hover:bg-discord-dark hover:text-white border-discord-dark'
          }`}
        >
          <i className={`${category.icon} ml-2`}></i>
          {category.label}
        </Button>
      ))}
    </div>
  );
}
