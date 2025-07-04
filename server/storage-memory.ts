// Temporary in-memory storage implementation for MongoDB transition
import { ADMIN_CONFIG } from "./config";

// MongoDB-style interfaces
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  githubUrl?: string;
  imageUrl?: string;
  projectFileUrl?: string;
  additionalImageUrl?: string;
  authorId: string;
  views: number;
  likes: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectLike {
  _id: string;
  projectId: string;
  userId: string;
  createdAt: Date;
}

export interface InsertProject {
  title: string;
  description: string;
  category: string;
  githubUrl?: string;
  imageUrl?: string;
  projectFileUrl?: string;
  additionalImageUrl?: string;
  authorId: string;
  views?: number;
  likes?: number;
  isPublished?: boolean;
}

export interface UpsertUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  isAdmin?: boolean;
}

// Storage interface
export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createProject(project: InsertProject): Promise<Project>;
  getProjects(category?: string, search?: string, limit?: number, offset?: number): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  getProjectWithAuthor(id: string): Promise<(Project & { author: User }) | undefined>;
  updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  incrementProjectViews(id: string): Promise<void>;
  likeProject(projectId: string, userId: string): Promise<ProjectLike>;
  unlikeProject(projectId: string, userId: string): Promise<boolean>;
  isProjectLiked(projectId: string, userId: string): Promise<boolean>;
  isUserAdmin(userId: string): Promise<boolean>;
  getProjectStats(): Promise<{ totalProjects: number; totalUsers: number; totalViews: number }>;
}

class MemoryStorage implements IStorage {
  private users = new Map<string, User>();
  private projects = new Map<string, Project>();
  private projectLikes = new Map<string, ProjectLike>();
  private nextProjectId = 1;

  constructor() {
    // Add sample data
    this.initSampleData();
  }

  private initSampleData() {
    // Add admin user
    const adminUser: User = {
      _id: '190771533',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      profileImageUrl: 'https://github.com/lordx679.png',
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(adminUser._id, adminUser);

    // Add sample projects
    const sampleProjects = [
      {
        title: 'بوت الترحيب المطور',
        description: 'بوت ديسكورد متطور للترحيب بالأعضاء الجدد مع إعدادات قابلة للتخصيص',
        category: 'بوتات',
        githubUrl: 'https://github.com/example/welcome-bot',
        imageUrl: 'https://via.placeholder.com/400x300',
        views: 156,
        authorId: '190771533'
      },
      {
        title: 'خادم الألعاب العربي',
        description: 'خادم ديسكورد مخصص للألعاب العربية مع قنوات منظمة',
        category: 'خوادم',
        githubUrl: 'https://discord.gg/example',
        imageUrl: 'https://via.placeholder.com/400x300',
        views: 243,
        authorId: '190771533'
      },
      {
        title: 'أداة إدارة الخادم',
        description: 'أداة شاملة لإدارة خوادم الديسكورد مع لوحة تحكم ويب',
        category: 'أدوات',
        githubUrl: 'https://github.com/example/server-manager',
        imageUrl: 'https://via.placeholder.com/400x300',
        views: 89,
        authorId: '190771533'
      },
      {
        title: 'قالب خادم المجتمع',
        description: 'قالب جاهز لإنشاء خادم مجتمع عربي مع جميع القنوات والأدوار',
        category: 'قوالب',
        githubUrl: 'https://github.com/example/community-template',
        imageUrl: 'https://via.placeholder.com/400x300',
        views: 302,
        authorId: '190771533'
      },
      {
        title: 'تصميم شعار بوت',
        description: 'مجموعة تصاميم شعارات احترافية للبوتات العربية',
        category: 'مصممين',
        githubUrl: 'https://github.com/example/bot-logos',
        imageUrl: 'https://via.placeholder.com/400x300',
        views: 67,
        authorId: '190771533'
      }
    ];

    sampleProjects.forEach(proj => {
      const project: Project = {
        _id: (this.nextProjectId++).toString(),
        ...proj,
        views: proj.views || 0,
        likes: 0,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.projects.set(project._id, project);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existing = this.users.get(userData._id);
    const now = new Date();
    
    const user: User = {
      ...userData,
      isAdmin: userData.isAdmin || false,
      createdAt: existing?.createdAt || now,
      updatedAt: now
    };

    this.users.set(userData._id, user);
    return user;
  }

  async createProject(projectData: InsertProject): Promise<Project> {
    const now = new Date();
    const project: Project = {
      _id: (this.nextProjectId++).toString(),
      ...projectData,
      views: projectData.views || 0,
      likes: projectData.likes || 0,
      isPublished: projectData.isPublished !== false,
      createdAt: now,
      updatedAt: now
    };

    this.projects.set(project._id, project);
    return project;
  }

  async getProjects(category?: string, search?: string, limit = 50, offset = 0): Promise<Project[]> {
    let projects = Array.from(this.projects.values())
      .filter(p => p.isPublished);

    if (category && category !== 'all') {
      projects = projects.filter(p => p.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      projects = projects.filter(p => 
        p.title.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower)
      );
    }

    return projects
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectWithAuthor(id: string): Promise<(Project & { author: User }) | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const author = this.users.get(project.authorId);
    if (!author) return undefined;

    return { ...project, author };
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const updatedProject: Project = {
      ...project,
      ...updates,
      updatedAt: new Date()
    };

    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    const deleted = this.projects.delete(id);
    
    // Remove associated likes
    const likesToRemove: string[] = [];
    this.projectLikes.forEach((like, likeId) => {
      if (like.projectId === id) {
        likesToRemove.push(likeId);
      }
    });
    likesToRemove.forEach(likeId => this.projectLikes.delete(likeId));

    return deleted;
  }

  async incrementProjectViews(id: string): Promise<void> {
    const project = this.projects.get(id);
    if (project) {
      project.views++;
      this.projects.set(id, project);
    }
  }

  async likeProject(projectId: string, userId: string): Promise<ProjectLike> {
    const likeId = `${projectId}-${userId}`;
    
    // Check if already liked
    if (this.projectLikes.has(likeId)) {
      throw new Error('Project already liked');
    }

    const like: ProjectLike = {
      _id: likeId,
      projectId,
      userId,
      createdAt: new Date()
    };

    this.projectLikes.set(likeId, like);

    // Increment project likes count
    const project = this.projects.get(projectId);
    if (project) {
      project.likes++;
      this.projects.set(projectId, project);
    }

    return like;
  }

  async unlikeProject(projectId: string, userId: string): Promise<boolean> {
    const likeId = `${projectId}-${userId}`;
    const deleted = this.projectLikes.delete(likeId);

    if (deleted) {
      // Decrement project likes count
      const project = this.projects.get(projectId);
      if (project && project.likes > 0) {
        project.likes--;
        this.projects.set(projectId, project);
      }
    }

    return deleted;
  }

  async isProjectLiked(projectId: string, userId: string): Promise<boolean> {
    const likeId = `${projectId}-${userId}`;
    return this.projectLikes.has(likeId);
  }

  async isUserAdmin(userId: string): Promise<boolean> {
    // Check config-based admin list first
    if (ADMIN_CONFIG.adminUsers.includes(userId)) {
      return true;
    }
    
    // Check user admin flag
    const user = this.users.get(userId);
    return user?.isAdmin || false;
  }

  async getProjectStats(): Promise<{ totalProjects: number; totalUsers: number; totalViews: number }> {
    const projects = Array.from(this.projects.values()).filter(p => p.isPublished);
    const totalViews = projects.reduce((sum, p) => sum + p.views, 0);

    return {
      totalProjects: projects.length,
      totalUsers: this.users.size,
      totalViews
    };
  }
}

export const storage = new MemoryStorage();