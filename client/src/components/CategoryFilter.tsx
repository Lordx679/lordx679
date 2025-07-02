import React, { memo, useCallback } from "react";

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

const CategoryButton = memo(({ 
  category, 
  isSelected, 
  onClick 
}: { 
  category: typeof categories[0];
  isSelected: boolean;
  onClick: () => void;
}) => {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Minimal delay to avoid runtime conflicts
    setTimeout(() => {
      onClick();
    }, 0);
  }, [onClick]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`px-6 py-3 font-medium transition-all rounded-lg border ${
        isSelected
          ? 'bg-discord-blurple text-white border-discord-blurple hover:bg-blue-600'
          : 'bg-discord-elevated text-discord-text hover:bg-discord-dark hover:text-white border-discord-dark'
      }`}
    >
      <i className={`${category.icon} ml-2`}></i>
      {category.label}
    </button>
  );
});

CategoryButton.displayName = 'CategoryButton';

const CategoryFilter = memo(({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  const handleCategoryClick = useCallback((categoryId: string) => {
    if (categoryId === selectedCategory) {
      return;
    }
    
    try {
      onCategoryChange(categoryId);
    } catch (error) {
      console.error('Category change error:', error);
    }
  }, [selectedCategory, onCategoryChange]);

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {categories.map((category) => (
        <CategoryButton
          key={category.id}
          category={category}
          isSelected={selectedCategory === category.id}
          onClick={() => handleCategoryClick(category.id)}
        />
      ))}
    </div>
  );
});

CategoryFilter.displayName = 'CategoryFilter';

export default CategoryFilter;
