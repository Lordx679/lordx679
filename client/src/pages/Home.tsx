import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import ProjectCard from "@/components/ProjectCard";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import AdminDashboard from "@/components/AdminDashboard";
import ProjectModal from "@/components/ProjectModal";
import { Button } from "@/components/ui/button";
import type { Project, User } from "@shared/schema";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: projects = [], isLoading: projectsLoading, refetch } = useQuery<Project[]>({
    queryKey: ["/api/projects", selectedCategory, searchQuery],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: stats } = useQuery<{totalProjects: number; totalUsers: number; totalViews: number}>({
    queryKey: ["/api/admin/stats"],
    enabled: isAuthenticated && (user as User)?.isAdmin,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-discord-darkest flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-discord-blurple mx-auto mb-4"></div>
          <p className="text-discord-text">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-discord-darkest text-white" dir="rtl">
      {/* Navigation Header */}
      <nav className="bg-discord-darker border-b border-discord-dark sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center">
                <i className="fab fa-discord text-discord-blurple text-2xl ml-3"></i>
                <span className="text-xl font-bold">مشاريع ديسكورد</span>
              </div>
              <div className="hidden md:flex space-x-6 space-x-reverse">
                <button 
                  onClick={() => setShowAdminDashboard(false)}
                  className="text-discord-text hover:text-white transition-colors"
                >
                  الرئيسية
                </button>
                <a href="#projects" className="text-discord-text hover:text-white transition-colors">
                  المشاريع
                </a>
                <a href="#categories" className="text-discord-text hover:text-white transition-colors">
                  الفئات
                </a>
                {(user as User)?.isAdmin && (
                  <button
                    onClick={() => setShowAdminDashboard(true)}
                    className="text-discord-text hover:text-white transition-colors"
                  >
                    لوحة التحكم
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <SearchBar onSearch={setSearchQuery} />
              
              <div className="flex items-center space-x-3 space-x-reverse">
                {(user as User)?.profileImageUrl && (
                  <div className="relative">
                    <img 
                      src={(user as User).profileImageUrl!} 
                      alt="User Avatar" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-discord-green rounded-full border-2 border-discord-darker"></div>
                  </div>
                )}
                <span className="text-sm font-medium">
                  {(user as User)?.firstName || (user as User)?.email?.split('@')[0] || 'مستخدم'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = "/api/logout"}
                  className="text-discord-text hover:text-white"
                >
                  <i className="fas fa-sign-out-alt"></i>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {showAdminDashboard && (user as User)?.isAdmin ? (
        <AdminDashboard stats={stats} onProjectAdded={() => refetch()} />
      ) : (
        <>
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-discord-blurple/20 to-discord-dark/50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                اكتشف أفضل مشاريع
                <span className="text-discord-blurple"> ديسكورد</span>
              </h1>
              <p className="text-xl text-discord-text mb-8 max-w-3xl mx-auto">
                منصة شاملة لعرض ومشاركة مشاريع ديسكورد المبتكرة - من البوتات إلى الخوادم والأدوات المتقدمة
              </p>
              
              {/* Stats */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-discord-dark/50 rounded-xl p-6 backdrop-blur-sm">
                  <div className="text-3xl font-bold text-discord-blurple mb-2">
                    {stats?.totalProjects || 0}
                  </div>
                  <div className="text-discord-text">مشروع منشور</div>
                </div>
                <div className="bg-discord-dark/50 rounded-xl p-6 backdrop-blur-sm">
                  <div className="text-3xl font-bold text-discord-green mb-2">
                    {stats?.totalUsers || 0}
                  </div>
                  <div className="text-discord-text">مطور نشط</div>
                </div>
                <div className="bg-discord-dark/50 rounded-xl p-6 backdrop-blur-sm">
                  <div className="text-3xl font-bold text-discord-yellow mb-2">
                    {stats?.totalViews || 0}
                  </div>
                  <div className="text-discord-text">مشاهدة</div>
                </div>
              </div>
            </div>
          </section>

          {/* Categories Filter */}
          <section id="categories" className="py-12 bg-discord-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-8">فئات المشاريع</h2>
              <CategoryFilter 
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          </section>

          {/* Projects Gallery */}
          <section id="projects" className="py-16 bg-discord-darkest">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-4xl font-bold">المشاريع المميزة</h2>
              </div>

              {projectsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-discord-elevated rounded-xl p-6 animate-pulse">
                      <div className="h-48 bg-discord-dark rounded-lg mb-4"></div>
                      <div className="h-4 bg-discord-dark rounded mb-2"></div>
                      <div className="h-3 bg-discord-dark rounded mb-4"></div>
                      <div className="h-8 bg-discord-dark rounded"></div>
                    </div>
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🤖</div>
                  <h3 className="text-2xl font-bold mb-2">لا توجد مشاريع</h3>
                  <p className="text-discord-text">
                    {searchQuery || selectedCategory !== 'all' 
                      ? 'لم يتم العثور على مشاريع تطابق البحث أو الفئة المحددة'
                      : 'لا توجد مشاريع منشورة حالياً'
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.map((project: Project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onViewDetails={() => setSelectedProject(project.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectModal
          projectId={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
