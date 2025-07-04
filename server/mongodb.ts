import { MongoClient, Db } from 'mongodb';
import config from './config.env.ts';

let client: MongoClient;
let db: Db;

// MongoDB connection URL - update in config.env.ts
const MONGODB_URL = config.database.url || process.env.MONGODB_URL || "mongodb://localhost:27017/discord-projects";

export async function connectMongoDB(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGODB_URL);
    await client.connect();
    
    // Extract database name from URL or use default
    const dbName = new URL(MONGODB_URL).pathname.slice(1) || 'discord-projects';
    db = client.db(dbName);
    
    console.log(`Connected to MongoDB database: ${dbName}`);
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function closeMongoDB(): Promise<void> {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

export function getDB(): Db {
  if (!db) {
    throw new Error('Database not connected. Call connectMongoDB() first.');
  }
  return db;
}

// Export the db instance for use in other files
export { db };