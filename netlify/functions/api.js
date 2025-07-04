// Simplified Netlify Function for API endpoints
const { MongoClient } = require('mongodb');

let client;
let db;

// Initialize MongoDB connection
async function connectDB() {
  if (!client) {
    client = new MongoClient(process.env.DATABASE_URL);
    await client.connect();
    db = client.db();
  }
  return db;
}

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
};

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    const db = await connectDB();
    const path = event.path.replace('/.netlify/functions/api', '');
    const method = event.httpMethod;
    
    // Stats endpoint
    if (path === '/api/stats' && method === 'GET') {
      const projects = db.collection('projects');
      const users = db.collection('users');
      
      const [totalProjects, totalUsers] = await Promise.all([
        projects.countDocuments({ isPublished: true }),
        users.countDocuments(),
      ]);
      
      // Calculate total views
      const viewsResult = await projects.aggregate([
        { $match: { isPublished: true } },
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ]).toArray();
      
      const totalViews = viewsResult.length > 0 ? viewsResult[0].totalViews : 0;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          totalProjects,
          totalUsers,
          totalViews
        }),
      };
    }
    
    // Projects endpoint
    if (path === '/api/projects' && method === 'GET') {
      const { category, search, limit = '50', offset = '0' } = event.queryStringParameters || {};
      
      const projects = db.collection('projects');
      let query = { isPublished: true };
      
      if (category && category !== 'الكل') {
        query.category = category;
      }
      
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      
      const result = await projects
        .find(query)
        .sort({ createdAt: -1 })
        .skip(parseInt(offset))
        .limit(parseInt(limit))
        .toArray();
      
      // Convert MongoDB _id to string id
      const projectsWithId = result.map(project => ({
        ...project,
        id: project._id.toString(),
        _id: undefined
      }));
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(projectsWithId),
      };
    }
    
    // Single project endpoint
    if (path.startsWith('/api/projects/') && method === 'GET') {
      const projectId = path.split('/')[3];
      const projects = db.collection('projects');
      const users = db.collection('users');
      
      const project = await projects.findOne({ _id: projectId });
      if (!project) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Project not found' }),
        };
      }
      
      const author = await users.findOne({ _id: project.authorId });
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          ...project,
          id: project._id.toString(),
          _id: undefined,
          author: author || { firstName: 'Unknown', lastName: 'User' }
        }),
      };
    }
    
    // Auth user endpoint (simplified)
    if (path === '/api/auth/user' && method === 'GET') {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Unauthorized' }),
      };
    }
    
    // Login redirect
    if (path === '/api/login') {
      const siteUrl = process.env.URL || 'https://discordworld.netlify.app';
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email&redirect_uri=${siteUrl}/api/auth/github/callback`;
      return {
        statusCode: 302,
        headers: {
          ...headers,
          Location: githubAuthUrl,
        },
        body: '',
      };
    }
    
    // GitHub OAuth callback
    if (path === '/api/auth/github/callback' && method === 'GET') {
      const { code } = event.queryStringParameters || {};
      
      if (!code) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing authorization code' }),
        };
      }
      
      try {
        // Exchange code for access token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: code,
          }),
        });
        
        const tokenData = await tokenResponse.json();
        
        if (tokenData.error) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: tokenData.error_description }),
          };
        }
        
        // Get user info from GitHub
        const userResponse = await fetch('https://api.github.com/user', {
          headers: {
            'Authorization': `token ${tokenData.access_token}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        });
        
        const userData = await userResponse.json();
        
        // Redirect to frontend with user data
        const siteUrl = process.env.URL || 'https://discordworld.netlify.app';
        return {
          statusCode: 302,
          headers: {
            ...headers,
            Location: `${siteUrl}?login=success&user=${encodeURIComponent(JSON.stringify({
              id: userData.id.toString(),
              name: userData.name || userData.login,
              email: userData.email,
              avatar: userData.avatar_url,
            }))}`,
          },
          body: '',
        };
      } catch (error) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Authentication failed' }),
        };
      }
    }
    
    // Default 404
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' }),
    };
    
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};