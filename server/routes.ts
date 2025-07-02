import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./githubAuth";
import { insertProjectSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Project routes
  app.get('/api/projects', async (req, res) => {
    try {
      const { category, search, limit = '50', offset = '0' } = req.query;
      const projects = await storage.getProjects(
        category as string,
        search as string,
        parseInt(limit as string),
        parseInt(offset as string)
      );
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get('/api/projects/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProjectWithAuthor(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Increment view count
      await storage.incrementProjectViews(id);
      
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Admin-only project creation
  app.post('/api/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const isAdmin = await storage.isUserAdmin(userId);
      
      if (!isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const validatedData = insertProjectSchema.parse({
        ...req.body,
        authorId: userId,
      });

      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // Admin-only project update
  app.put('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const isAdmin = await storage.isUserAdmin(userId);
      
      if (!isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const updates = insertProjectSchema.partial().parse(req.body);
      
      const project = await storage.updateProject(id, updates);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  // Admin-only project deletion
  app.delete('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const isAdmin = await storage.isUserAdmin(userId);
      
      if (!isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const success = await storage.deleteProject(id);
      
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Project like/unlike
  app.post('/api/projects/:id/like', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const projectId = parseInt(req.params.id);
      
      const isLiked = await storage.isProjectLiked(projectId, userId);
      
      if (isLiked) {
        await storage.unlikeProject(projectId, userId);
        res.json({ liked: false });
      } else {
        await storage.likeProject(projectId, userId);
        res.json({ liked: true });
      }
    } catch (error) {
      console.error("Error toggling project like:", error);
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  // Check if project is liked
  app.get('/api/projects/:id/liked', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const projectId = parseInt(req.params.id);
      
      const isLiked = await storage.isProjectLiked(projectId, userId);
      res.json({ liked: isLiked });
    } catch (error) {
      console.error("Error checking project like:", error);
      res.status(500).json({ message: "Failed to check like status" });
    }
  });

  // Public stats for landing page
  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await storage.getProjectStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching public stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Admin stats
  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const isAdmin = await storage.isUserAdmin(userId);
      
      if (!isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const stats = await storage.getProjectStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
