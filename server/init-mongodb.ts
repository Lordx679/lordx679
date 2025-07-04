// Initialize MongoDB with sample data
import { storage } from "./storage-mongodb";

async function initializeDatabase() {
  try {
    console.log('Initializing MongoDB with sample data...');

    // Add admin user
    await storage.upsertUser({
      _id: '190771533',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      profileImageUrl: 'https://github.com/lordx679.png',
      isAdmin: true
    });

    // Add sample projects
    const sampleProjects = [
      {
        title: 'بوت الترحيب المطور',
        description: 'بوت ديسكورد متطور للترحيب بالأعضاء الجدد مع إعدادات قابلة للتخصيص',
        category: 'بوتات',
        githubUrl: 'https://github.com/example/welcome-bot',
        imageUrl: 'https://via.placeholder.com/400x300',
        authorId: '190771533',
        views: 156
      },
      {
        title: 'خادم الألعاب العربي',
        description: 'خادم ديسكورد مخصص للألعاب العربية مع قنوات منظمة',
        category: 'خوادم',
        githubUrl: 'https://discord.gg/example',
        imageUrl: 'https://via.placeholder.com/400x300',
        authorId: '190771533',
        views: 243
      },
      {
        title: 'أداة إدارة الخادم',
        description: 'أداة شاملة لإدارة خوادم الديسكورد مع لوحة تحكم ويب',
        category: 'أدوات',
        githubUrl: 'https://github.com/example/server-manager',
        imageUrl: 'https://via.placeholder.com/400x300',
        authorId: '190771533',
        views: 89
      },
      {
        title: 'قالب خادم المجتمع',
        description: 'قالب جاهز لإنشاء خادم مجتمع عربي مع جميع القنوات والأدوار',
        category: 'قوالب',
        githubUrl: 'https://github.com/example/community-template',
        imageUrl: 'https://via.placeholder.com/400x300',
        authorId: '190771533',
        views: 302
      },
      {
        title: 'تصميم شعار بوت',
        description: 'مجموعة تصاميم شعارات احترافية للبوتات العربية',
        category: 'مصممين',
        githubUrl: 'https://github.com/example/bot-logos',
        imageUrl: 'https://via.placeholder.com/400x300',
        authorId: '190771533',
        views: 67
      }
    ];

    // Check if projects already exist
    const existingProjects = await storage.getProjects();
    
    if (existingProjects.length === 0) {
      console.log('Adding sample projects...');
      for (const projectData of sampleProjects) {
        await storage.createProject(projectData);
      }
      console.log('Sample projects added successfully!');
    } else {
      console.log('Projects already exist, skipping initialization.');
    }

    console.log('Database initialization completed!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Export the initialization function
export { initializeDatabase };