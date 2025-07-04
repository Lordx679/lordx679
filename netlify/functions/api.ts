import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { MongoClient } from "mongodb";

// Import the storage and route handlers from server
import { MongoDBStorage } from "../../server/storage-mongodb.js";

const client = new MongoClient(process.env.DATABASE_URL!);
let storage: MongoDBStorage;

// Initialize MongoDB connection
async function initStorage() {
  if (!storage) {
    await client.connect();
    storage = new MongoDBStorage();
    await storage.connect();
  }
  return storage;
}

// Main API handler
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
  };

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    await initStorage();
    
    const path = event.path.replace("/.netlify/functions/api", "");
    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : null;
    
    // Route handling
    if (path === "/api/stats" && method === "GET") {
      const stats = await storage.getProjectStats();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(stats),
      };
    }
    
    if (path === "/api/projects" && method === "GET") {
      const { category, search, limit, offset } = event.queryStringParameters || {};
      const projects = await storage.getProjects(
        category || undefined,
        search || undefined,
        limit ? parseInt(limit) : 50,
        offset ? parseInt(offset) : 0
      );
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(projects),
      };
    }
    
    if (path.startsWith("/api/projects/") && method === "GET") {
      const projectId = path.split("/")[3];
      const project = await storage.getProjectWithAuthor(projectId);
      if (!project) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: "Project not found" }),
        };
      }
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(project),
      };
    }
    
    // Auth endpoints
    if (path === "/api/auth/user" && method === "GET") {
      // For now, return unauthorized since Netlify Functions don't easily support sessions
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: "Unauthorized" }),
      };
    }
    
    if (path === "/api/login") {
      // Redirect to GitHub OAuth
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email&redirect_uri=${process.env.URL}/api/auth/github/callback`;
      return {
        statusCode: 302,
        headers: {
          ...headers,
          Location: githubAuthUrl,
        },
        body: "",
      };
    }
    
    // Default 404
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: "Not found" }),
    };
    
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};