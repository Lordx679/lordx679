import mongoose, { Schema, Document } from 'mongoose';

// User interface and schema
export interface IUser extends Document {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  _id: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profileImageUrl: { type: String },
  isAdmin: { type: Boolean, default: false },
}, {
  timestamps: true,
  _id: false // We're providing our own _id
});

// Project interface and schema
export interface IProject extends Document {
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

const projectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  githubUrl: { type: String },
  imageUrl: { type: String },
  projectFileUrl: { type: String },
  additionalImageUrl: { type: String },
  authorId: { type: String, required: true, ref: 'User' },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
}, {
  timestamps: true
});

// Project Likes interface and schema
export interface IProjectLike extends Document {
  projectId: string;
  userId: string;
  createdAt: Date;
}

const projectLikeSchema = new Schema<IProjectLike>({
  projectId: { type: String, required: true, ref: 'Project' },
  userId: { type: String, required: true, ref: 'User' },
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Compound index to prevent duplicate likes
projectLikeSchema.index({ projectId: 1, userId: 1 }, { unique: true });

// Export models
export const User = mongoose.model<IUser>('User', userSchema);
export const Project = mongoose.model<IProject>('Project', projectSchema);
export const ProjectLike = mongoose.model<IProjectLike>('ProjectLike', projectLikeSchema);

// Export types for compatibility
export type UserType = IUser;
export type ProjectType = IProject;
export type ProjectLikeType = IProjectLike;

// Insert types for forms
export interface InsertUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  isAdmin?: boolean;
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

export interface UpsertUser extends InsertUser {}

// Categories constant
export const PROJECT_CATEGORIES = [
  'بوتات',
  'خوادم', 
  'أدوات',
  'قوالب',
  'مصممين'
] as const;

export type ProjectCategory = typeof PROJECT_CATEGORIES[number];