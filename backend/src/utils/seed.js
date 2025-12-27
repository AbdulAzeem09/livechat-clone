require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Department = require('../models/Department');
const CannedResponse = require('../models/CannedResponse');
const Tag = require('../models/Tag');
const Widget = require('../models/Widget');
const BusinessHours = require('../models/BusinessHours');
const logger = require('./logger');

/**
 * Seed database with sample data
 */
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('MongoDB connected for seeding');

    // Clear existing data (optional - comment out if you want to keep existing data)
    await User.deleteMany({});
    await Department.deleteMany({});
    await CannedResponse.deleteMany({});
    await Tag.deleteMany({});
    await Widget.deleteMany({});
    await BusinessHours.deleteMany({});

    logger.info('Existing data cleared');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@livechat.com',
      password: 'admin123',
      role: 'super_admin',
      status: 'online',
      isActive: true,
    });
    logger.info('Admin user created');

    // Create agent users
    const agent1 = await User.create({
      name: 'Alice Johnson',
      email: 'alice@livechat.com',
      password: 'agent123',
      role: 'agent',
      status: 'online',
      maxConcurrentChats: 5,
    });

    const agent2 = await User.create({
      name: 'Bob Smith',
      email: 'bob@livechat.com',
      password: 'agent123',
      role: 'agent',
      status: 'online',
      maxConcurrentChats: 5,
    });

    const agent3 = await User.create({
      name: 'Carol Davis',
      email: 'carol@livechat.com',
      password: 'agent123',
      role: 'agent',
      status: 'away',
      maxConcurrentChats: 3,
    });
    logger.info('Agent users created');

    // Create departments
    const salesDept = await Department.create({
      name: 'Sales',
      description: 'Sales and pre-sales support',
      agents: [agent1._id, agent2._id],
      email: 'sales@livechat.com',
      isActive: true,
      settings: {
        autoAssignment: true,
        assignmentMethod: 'load_balancing',
        maxWaitTime: 5,
      },
    });

    const supportDept = await Department.create({
      name: 'Technical Support',
      description: 'Technical support and troubleshooting',
      agents: [agent2._id, agent3._id],
      email: 'support@livechat.com',
      isActive: true,
      settings: {
        autoAssignment: true,
        assignmentMethod: 'round_robin',
        maxWaitTime: 3,
      },
    });
    logger.info('Departments created');

    // Update agents with departments
    agent1.departments = [salesDept._id];
    await agent1.save();
    agent2.departments = [salesDept._id, supportDept._id];
    await agent2.save();
    agent3.departments = [supportDept._id];
    await agent3.save();

    // Create canned responses
    await CannedResponse.create([
      {
        shortcut: '/hello',
        message: 'Hello! Welcome to our support chat. How can I help you today?',
        category: 'Greeting',
        createdBy: admin._id,
      },
      {
        shortcut: '/thanks',
        message: 'Thank you for contacting us! Is there anything else I can help you with?',
        category: 'Closing',
        createdBy: admin._id,
      },
      {
        shortcut: '/wait',
        message: 'Thank you for your patience. Let me check that for you.',
        category: 'General',
        createdBy: admin._id,
      },
      {
        shortcut: '/email',
        message: 'Could you please provide your email address so I can send you more information?',
        category: 'General',
        createdBy: admin._id,
      },
      {
        shortcut: '/resolved',
        message: 'Great! I\'m glad I could help. Have a wonderful day!',
        category: 'Closing',
        createdBy: admin._id,
      },
    ]);
    logger.info('Canned responses created');

    // Create tags
    await Tag.create([
      { name: 'Important', color: '#ef4444', category: 'conversation', createdBy: admin._id },
      { name: 'Follow-up', color: '#f59e0b', category: 'conversation', createdBy: admin._id },
      { name: 'Bug Report', color: '#8b5cf6', category: 'conversation', createdBy: admin._id },
      { name: 'Feature Request', color: '#3b82f6', category: 'conversation', createdBy: admin._id },
      { name: 'VIP', color: '#10b981', category: 'visitor', createdBy: admin._id },
      { name: 'New Customer', color: '#06b6d4', category: 'visitor', createdBy: admin._id },
    ]);
    logger.info('Tags created');

    // Create business hours
    const businessHours = await BusinessHours.create({
      name: 'Default Business Hours',
      enabled: true,
      timezone: 'UTC',
      schedule: {
        0: { enabled: false, start: '09:00', end: '17:00' }, // Sunday
        1: { enabled: true, start: '09:00', end: '18:00' },  // Monday
        2: { enabled: true, start: '09:00', end: '18:00' },  // Tuesday
        3: { enabled: true, start: '09:00', end: '18:00' },  // Wednesday
        4: { enabled: true, start: '09:00', end: '18:00' },  // Thursday
        5: { enabled: true, start: '09:00', end: '18:00' },  // Friday
        6: { enabled: false, start: '09:00', end: '17:00' }, // Saturday
      },
      holidays: [],
      createdBy: admin._id,
    });
    logger.info('Business hours created');

    // Create widget configuration
    await Widget.create({
      name: 'Default Widget',
      domain: 'localhost',
      isActive: true,
      appearance: {
        primaryColor: '#3b82f6',
        position: 'right',
        launcherIcon: 'chat',
        welcomeMessage: 'Hi there! 👋 How can we help you today?',
        offlineMessage: 'Sorry, we\'re currently offline. Please leave us a message and we\'ll get back to you soon!',
        theme: 'light',
      },
      preChatForm: {
        enabled: false,
        fields: [
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
        ],
      },
      offlineForm: {
        enabled: true,
        fields: [
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'message', label: 'Message', type: 'textarea', required: true },
        ],
      },
      ratingForm: {
        enabled: true,
        title: 'How was your experience?',
        feedbackEnabled: true,
      },
      notifications: {
        sound: true,
        desktop: true,
      },
      language: 'en',
      businessHours: businessHours._id,
      departments: [salesDept._id, supportDept._id],
      createdBy: admin._id,
    });
    logger.info('Widget configuration created');

    logger.info('✅ Database seeded successfully!');
    logger.info('\n📋 Seed Data Summary:');
    logger.info('- Admin user: admin@livechat.com / admin123');
    logger.info('- Agent 1: alice@livechat.com / agent123');
    logger.info('- Agent 2: bob@livechat.com / agent123');
    logger.info('- Agent 3: carol@livechat.com / agent123');
    logger.info('- 2 Departments created');
    logger.info('- 5 Canned responses created');
    logger.info('- 6 Tags created');
    logger.info('- Business hours configured');
    logger.info('- Widget configuration created');

    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
