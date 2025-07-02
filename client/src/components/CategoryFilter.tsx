import { useEffect, useRef } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Create buttons using vanilla DOM
    categories.forEach((category) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('data-category', category.id);
      
      const isSelected = selectedCategory === category.id;
      
      button.className = `px-6 py-3 font-medium transition-all rounded-lg border ${
        isSelected
          ? 'bg-discord-blurple text-white border-discord-blurple hover:bg-blue-600'
          : 'bg-discord-elevated text-discord-text hover:bg-discord-dark hover:text-white border-discord-dark'
      }`;
      
      button.innerHTML = `<i class="${category.icon} ml-2"></i>${category.label}`;
      
      // Add click listener with native event handling
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const categoryId = button.getAttribute('data-category');
        if (categoryId && categoryId !== selectedCategory) {
          // Use requestAnimationFrame to avoid runtime conflicts
          requestAnimationFrame(() => {
            onCategoryChange(categoryId);
          });
        }
      });
      
      container.appendChild(button);
    });
  }, [selectedCategory, onCategoryChange]);

  return (
    <div 
      ref={containerRef}
      className="flex flex-wrap justify-center gap-4 mb-8"
    />
  );
}
