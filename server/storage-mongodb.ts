import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import config from './config.env.ts';

// MongoDB interfaces
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
  _id?: ObjectId;
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
  _id?: ObjectId;
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

export class MongoDBStorage implements IStorage {
  private client: MongoClient;
  private db!: Db;
  private users!: Collection<User>;
  private projects!: Collection<Project>;
  private projectLikes!: Collection<ProjectLike>;

  constructor() {
    // Use MONGODB_URL first, then fallback to config database URL
    const mongoUrl = process.env.MONGODB_URL || config.database.url;
    console.log('Connecting to MongoDB Atlas at:', mongoUrl.substring(0, 50) + '...');
    this.client = new MongoClient(mongoUrl);
  }

  async connect(): Promise<void> {
    await this.client.connect();
    const dbName = 'discord-projects';
    this.db = this.client.db(dbName);
    this.users = this.db.collection<User>('users');
    this.projects = this.db.collection<Project>('projects');
    this.projectLikes = this.db.collection<ProjectLike>('projectLikes');

    // Create indexes
    await this.createIndexes();
    console.log('Connected to MongoDB');
  }

  private async createIndexes(): Promise<void> {
    // User indexes
    await this.users.createIndex({ email: 1 }, { unique: true });
    
    // Project indexes
    await this.projects.createIndex({ category: 1 });
    await this.projects.createIndex({ authorId: 1 });
    await this.projects.createIndex({ title: "text", description: "text" });
    await this.projects.createIndex({ createdAt: -1 });
    
    // Project likes indexes
    await this.projectLikes.createIndex({ projectId: 1, userId: 1 }, { unique: true });
  }

  async getUser(id: string): Promise<User | undefined> {
    const user = await this.users.findOne({ _id: id });
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const now = new Date();
    const user: User = {
      ...userData,
      isAdmin: userData.isAdmin || false,
      createdAt: now,
      updatedAt: now
    };

    await this.users.replaceOne(
      { _id: userData._id },
      user,
      { upsert: true }
    );

    return user;
  }

  async createProject(projectData: InsertProject): Promise<Project> {
    const now = new Date();
    const project: Project = {
      ...projectData,
      views: projectData.views || 0,
      likes: projectData.likes || 0,
      isPublished: projectData.isPublished !== false,
      createdAt: now,
      updatedAt: now
    };

    const result = await this.projects.insertOne(project);
    return { ...project, _id: result.insertedId };
  }

  async getProjects(category?: string, search?: string, limit = 50, offset = 0): Promise<Project[]> {
    let query: any = { isPublished: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const projects = await this.projects
      .find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    return projects;
  }

  async getProject(id: string): Promise<Project | undefined> {
    const objectId = new ObjectId(id);
    const project = await this.projects.findOne({ _id: objectId });
    return project || undefined;
  }

  async getProjectWithAuthor(id: string): Promise<(Project & { author: User }) | undefined> {
    const objectId = new ObjectId(id);
    const result = await this.projects.aggregate([
      { $match: { _id: objectId } },
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' }
    ]).toArray();

    return result[0] as (Project & { author: User }) | undefined;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const objectId = new ObjectId(id);
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };

    const result = await this.projects.findOneAndUpdate(
      { _id: objectId },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    return result || undefined;
  }

  async deleteProject(id: string): Promise<boolean> {
    const objectId = new ObjectId(id);
    const result = await this.projects.deleteOne({ _id: objectId });
    
    // Also delete associated likes
    await this.projectLikes.deleteMany({ projectId: id });
    
    return result.deletedCount > 0;
  }

  async incrementProjectViews(id: string): Promise<void> {
    const objectId = new ObjectId(id);
    await this.projects.updateOne(
      { _id: objectId },
      { $inc: { views: 1 } }
    );
  }

  async likeProject(projectId: string, userId: string): Promise<ProjectLike> {
    const like: ProjectLike = {
      projectId,
      userId,
      createdAt: new Date()
    };

    const result = await this.projectLikes.insertOne(like);
    
    // Increment project likes count
    const objectId = new ObjectId(projectId);
    await this.projects.updateOne(
      { _id: objectId },
      { $inc: { likes: 1 } }
    );

    return { ...like, _id: result.insertedId };
  }

  async unlikeProject(projectId: string, userId: string): Promise<boolean> {
    const result = await this.projectLikes.deleteOne({ projectId, userId });
    
    if (result.deletedCount > 0) {
      // Decrement project likes count
      const objectId = new ObjectId(projectId);
      await this.projects.updateOne(
        { _id: objectId },
        { $inc: { likes: -1 } }
      );
      return true;
    }
    
    return false;
  }

  async isProjectLiked(projectId: string, userId: string): Promise<boolean> {
    const like = await this.projectLikes.findOne({ projectId, userId });
    return !!like;
  }

  async isUserAdmin(userId: string): Promise<boolean> {
    // Check config-based admin list first
    if (config.admin.adminUsers.includes(userId)) {
      return true;
    }
    
    // Check database admin flag
    const user = await this.users.findOne({ _id: userId });
    return user?.isAdmin || false;
  }

  async getProjectStats(): Promise<{ totalProjects: number; totalUsers: number; totalViews: number }> {
    const [projectCount, userCount, viewsResult] = await Promise.all([
      this.projects.countDocuments({ isPublished: true }),
      this.users.countDocuments(),
      this.projects.aggregate([
        { $match: { isPublished: true } },
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ]).toArray()
    ]);

    const totalViews = viewsResult[0]?.totalViews || 0;

    return {
      totalProjects: projectCount,
      totalUsers: userCount,
      totalViews
    };
  }

  async close(): Promise<void> {
    await this.client.close();
  }
}

// Create and export storage instance
const mongoStorage = new MongoDBStorage();

// Initialize connection and export a promise-based storage
let storageReady = false;

mongoStorage.connect()
  .then(() => {
    storageReady = true;
    console.log('MongoDB storage ready');
  })
  .catch(console.error);

// Wrapper to ensure connection before operations
const ensureConnection = async () => {
  if (!storageReady) {
    await mongoStorage.connect();
    storageReady = true;
  }
  return mongoStorage;
};

// Create a proxy storage that ensures connection
export const storage = new Proxy(mongoStorage, {
  get(target, prop) {
    const method = target[prop as keyof MongoDBStorage];
    if (typeof method === 'function') {
      return async (...args: any[]) => {
        await ensureConnection();
        return (method as Function).apply(target, args);
      };
    }
    return method;
  }
});