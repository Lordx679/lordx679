import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import type { Project, User } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
  onViewDetails: () => void;
}

const categoryStyles = {
  bots: { bg: 'bg-discord-blurple/20', text: 'text-discord-blurple', label: 'بوت' },
  servers: { bg: 'bg-discord-green/20', text: 'text-discord-green', label: 'خادم' },
  tools: { bg: 'bg-discord-yellow/20', text: 'text-discord-yellow', label: 'أداة' },
  templates: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'قالب' },
};

export default function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(false);

  const categoryStyle = categoryStyles[project.category as keyof typeof categoryStyles] || categoryStyles.bots;

  // Check if project is liked
  const { data: likeStatus } = useQuery<{liked: boolean}>({
    queryKey: [`/api/projects/${project.id}/liked`],
    enabled: !!user,
    retry: false,
  });

  useEffect(() => {
    if (likeStatus?.liked !== undefined) {
      setIsLiked(likeStatus.liked);
    }
  }, [likeStatus]);

  const likeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/projects/${project.id}/like`);
    },
    onSuccess: (data: any) => {
      setIsLiked(data.liked);
      toast({
        title: data.liked ? "تم الإعجاب" : "تم إلغاء الإعجاب",
        description: data.liked ? "تم إضافة المشروع للمفضلة" : "تم إزالة المشروع من المفضلة",
      });
      // Invalidate and refetch projects
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "غير مصرح",
          description: "يتم تسجيل الدخول مرة أخرى...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "خطأ",
        description: "فشل في تحديث الإعجاب",
        variant: "destructive",
      });
    },
  });

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    likeMutation.mutate();
  };

  const defaultImage = "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400";

  return (
    <div className="bg-discord-elevated rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl group">
      <img 
        src={project.imageUrl || defaultImage}
        alt={project.title}
        className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = defaultImage;
        }}
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`${categoryStyle.bg} ${categoryStyle.text} px-3 py-1 rounded-full text-sm font-medium`}>
            {categoryStyle.label}
          </span>
          <div className="flex items-center space-x-2 space-x-reverse text-discord-text">
            <span>{project.views}</span>
            <i className="fas fa-eye"></i>
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-2 group-hover:text-discord-blurple transition-colors">
          {project.title}
        </h3>
        
        <p className="text-discord-text mb-4 line-clamp-3">
          {project.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="text-sm text-discord-text">
              مطور
            </span>
          </div>
          <div className="flex items-center space-x-1 space-x-reverse">
            <button 
              onClick={handleLike}
              disabled={likeMutation.isPending}
              className={`transition-colors ${
                isLiked 
                  ? 'text-discord-yellow' 
                  : 'text-discord-text hover:text-discord-yellow'
              }`}
            >
              <i className={`fas fa-star ${likeMutation.isPending ? 'animate-pulse' : ''}`}></i>
            </button>
            <span className="text-sm text-discord-text">{project.likes}</span>
          </div>
        </div>
        
        <div className="flex space-x-3 space-x-reverse">
          <Button
            onClick={onViewDetails}
            className="flex-1 bg-discord-blurple hover:bg-blue-600 transition-colors"
          >
            عرض التفاصيل
          </Button>
          {project.githubUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.githubUrl!, '_blank');
              }}
              className="bg-discord-dark hover:bg-discord-darker border-discord-dark"
            >
              <i className="fab fa-github"></i>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
