const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServerForTeardown = null;

const connectDB = async () => {
  try {
    // Try with original 2-second timeout first
    const conn = await mongoose.connect(process.env.MONGODB_URI, { 
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed production if superadmin is missing
    try {
      const User = require('../models/User');
      const superAdminExists = await User.findOne({ email: 'superadmin@example.com' });
      if (!superAdminExists) {
        console.log('🌱 superadmin@example.com not found. Force-seeding demo accounts...');
        await User.deleteMany({}); // Wipe existing to avoid uniqueness conflicts
        const seedUsers = [
          {
            name: 'Super Admin',
            email: 'superadmin@example.com',
            password: 'admin123',
            role: 'admin',
            status: 'active',
          },
          {
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin',
            status: 'active',
          },
          {
            name: 'Manager User',
            email: 'manager@example.com',
            password: 'manager123',
            role: 'manager',
            status: 'active',
          },
          {
            name: 'Geetansh Malik',
            email: 'geetanshmalik337@gmail.com',
            password: 'manager123',
            role: 'manager',
            status: 'active',
          },
          {
            name: 'User 1',
            email: 'user1@example.com',
            password: 'user123',
            role: 'user',
            status: 'active',
          },
          {
            name: 'Kartik Z',
            email: 'kartikz@example.com',
            password: 'user123',
            role: 'user',
            status: 'active',
          },
          {
            name: 'Alice Johnson',
            email: 'alice@example.com',
            password: 'user123',
            role: 'user',
            status: 'active',
          },
          {
            name: 'Bob Smith',
            email: 'bob@example.com',
            password: 'user123',
            role: 'user',
            status: 'active',
          }
        ];
        for (const userData of seedUsers) {
          await User.create(userData);
        }
        console.log(`✅ Production Database seeded with ${seedUsers.length} demo users`);
      }
    } catch (seedError) {
      console.log(`⚠️  Could not auto-seed production DB: ${seedError.message}`);
    }
  } catch (error) {
    console.error(`❌ MongoDB Atlas Connection Failed: ${error.message}`);
    console.log(`⚠️  Your current IP might not be whitelisted in MongoDB Atlas`);
    console.log(`⚠️  Spinning up fallback MongoDB Memory Server so the app can run...`);
    try {
      const mongoServer = await MongoMemoryServer.create();
      mongoServerForTeardown = mongoServer;
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`✅ Successfully started fallback MongoDB Memory Server at: ${mongoUri}`);
      
      // Because it's an empty DB, let's auto-seed it so the dashboard has data
      try {
        const User = require('../models/User'); // Explicitly import the model here
        const seedUsers = [
          {
            name: 'Super Admin',
            email: 'superadmin@example.com',
            password: 'admin123',
            role: 'admin',
            status: 'active',
          },
          {
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin',
            status: 'active',
          },
          {
            name: 'Manager User',
            email: 'manager@example.com',
            password: 'manager123',
            role: 'manager',
            status: 'active',
          },
          {
            name: 'Geetansh Malik',
            email: 'geetanshmalik337@gmail.com',
            password: 'manager123',
            role: 'manager',
            status: 'active',
          },
          {
            name: 'User 1',
            email: 'user1@example.com',
            password: 'user123',
            role: 'user',
            status: 'active',
          },
          {
            name: 'Kartik Z',
            email: 'kartikz@example.com',
            password: 'user123',
            role: 'user',
            status: 'active',
          },
          {
            name: 'Alice Johnson',
            email: 'alice@example.com',
            password: 'user123',
            role: 'user',
            status: 'active',
          },
          {
            name: 'Bob Smith',
            email: 'bob@example.com',
            password: 'user123',
            role: 'user',
            status: 'active',
          }
        ];

        for (const userData of seedUsers) {
          await User.create(userData);
        }
        console.log(`✅ Memory Database seeded with ${seedUsers.length} demo users`);
      } catch (seedError) {
        console.log(`⚠️  Could not auto-seed memory DB: ${seedError.message}`);
      }
    } catch (memError) {
      console.error(`❌ Fallback MongoDB Connection Error: ${memError.message}`);
      process.exit(1);
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB error: ${err.message}`);
});

module.exports = connectDB;
