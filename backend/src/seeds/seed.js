const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/livechat';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected for seeding...');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// User Schema (simplified for seeding)
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'agent', 'user'], default: 'agent' },
  status: { type: String, enum: ['online', 'offline', 'away'], default: 'offline' },
  avatar: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Conversation Schema (simplified for seeding)
const ConversationSchema = new mongoose.Schema({
  visitorName: String,
  visitorEmail: String,
  status: { type: String, enum: ['active', 'resolved', 'pending'], default: 'pending' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messages: [{
    sender: String,
    senderType: { type: String, enum: ['visitor', 'agent'] },
    message: String,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const Conversation = mongoose.model('Conversation', ConversationSchema);

// Seed data
const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Conversation.deleteMany({});
    console.log('Cleared existing data');

    // Create demo user
    const hashedPassword = await bcrypt.hash('demo123', 10);
    const demoUser = await User.create({
      name: 'Demo Agent',
      email: 'demo@livechat.com',
      password: hashedPassword,
      role: 'admin',
      status: 'online',
      avatar: 'https://ui-avatars.com/api/?name=Demo+Agent&background=4F46E5&color=fff'
    });

    console.log('Created demo user:', demoUser.email);

    // Create additional agents
    const agent1 = await User.create({
      name: 'Sarah Johnson',
      email: 'sarah@livechat.com',
      password: hashedPassword,
      role: 'agent',
      status: 'online',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=10B981&color=fff'
    });

    const agent2 = await User.create({
      name: 'Mike Smith',
      email: 'mike@livechat.com',
      password: hashedPassword,
      role: 'agent',
      status: 'away',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Smith&background=F59E0B&color=fff'
    });

    console.log('Created additional agents');

    // Create sample conversations
    const conversations = [
      {
        visitorName: 'John Doe',
        visitorEmail: 'john@example.com',
        status: 'active',
        assignedTo: demoUser._id,
        messages: [
          {
            sender: 'John Doe',
            senderType: 'visitor',
            message: 'Hi, I need help with my order',
            timestamp: new Date(Date.now() - 3600000)
          },
          {
            sender: 'Demo Agent',
            senderType: 'agent',
            message: 'Hello John! I\'d be happy to help you with your order. Could you please provide your order number?',
            timestamp: new Date(Date.now() - 3000000)
          },
          {
            sender: 'John Doe',
            senderType: 'visitor',
            message: 'Sure, it\'s #12345',
            timestamp: new Date(Date.now() - 2400000)
          }
        ]
      },
      {
        visitorName: 'Jane Smith',
        visitorEmail: 'jane@example.com',
        status: 'pending',
        messages: [
          {
            sender: 'Jane Smith',
            senderType: 'visitor',
            message: 'Is there anyone available to chat?',
            timestamp: new Date(Date.now() - 600000)
          }
        ]
      },
      {
        visitorName: 'Bob Wilson',
        visitorEmail: 'bob@example.com',
        status: 'resolved',
        assignedTo: agent1._id,
        messages: [
          {
            sender: 'Bob Wilson',
            senderType: 'visitor',
            message: 'I have a question about pricing',
            timestamp: new Date(Date.now() - 86400000)
          },
          {
            sender: 'Sarah Johnson',
            senderType: 'agent',
            message: 'I\'ll be happy to help! What would you like to know?',
            timestamp: new Date(Date.now() - 86000000)
          },
          {
            sender: 'Bob Wilson',
            senderType: 'visitor',
            message: 'Thanks, that answers my question!',
            timestamp: new Date(Date.now() - 85000000)
          }
        ]
      }
    ];

    await Conversation.insertMany(conversations);
    console.log(`Created ${conversations.length} sample conversations`);

    console.log('\n=================================');
    console.log('✅ Seed data created successfully!');
    console.log('=================================');
    console.log('\nDemo Credentials:');
    console.log('Email: demo@livechat.com');
    console.log('Password: demo123');
    console.log('\nOther Test Accounts:');
    console.log('Email: sarah@livechat.com | Password: demo123');
    console.log('Email: mike@livechat.com | Password: demo123');
    console.log('=================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run seed
seedData();
