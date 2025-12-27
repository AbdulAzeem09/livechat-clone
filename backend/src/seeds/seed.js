/**
 * Database Seeder
 * Creates demo data for testing and demonstration
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');

// Models
const User = require('../models/User');
const Department = require('../models/Department');
const CannedResponse = require('../models/CannedResponse');
const BusinessHours = require('../models/BusinessHours');
const Tag = require('../models/Tag');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Department.deleteMany({});
    await CannedResponse.deleteMany({});
    await BusinessHours.deleteMany({});
    await Tag.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Create business hours
    console.log('📅 Creating business hours...');
    const businessHours = await BusinessHours.create({
      name: 'Default Business Hours',
      timezone: 'UTC',
      isDefault: true,
      schedule: {
        monday: { enabled: true, start: '09:00', end: '17:00' },
        tuesday: { enabled: true, start: '09:00', end: '17:00' },
        wednesday: { enabled: true, start: '09:00', end: '17:00' },
        thursday: { enabled: true, start: '09:00', end: '17:00' },
        friday: { enabled: true, start: '09:00', end: '17:00' },
        saturday: { enabled: false, start: '09:00', end: '17:00' },
        sunday: { enabled: false, start: '09:00', end: '17:00' },
      },
    });
    console.log('✅ Business hours created\n');

    // Create departments
    console.log('🏢 Creating departments...');
    const supportDept = await Department.create({
      name: 'Support',
      description: 'General customer support',
      email: 'support@livechat.com',
      isActive: true,
      businessHours: businessHours._id,
      maxConcurrentChats: 5,
    });

    const salesDept = await Department.create({
      name: 'Sales',
      description: 'Sales inquiries and demos',
      email: 'sales@livechat.com',
      isActive: true,
      businessHours: businessHours._id,
      maxConcurrentChats: 3,
    });
    console.log('✅ 2 departments created\n');

    // Create demo user
    console.log('👤 Creating demo user...');
    const demoUser = await User.create({
      name: 'Demo Agent',
      email: 'demo@livechat.com',
      password: 'demo123',
      role: 'admin',
      status: 'online',
      department: supportDept._id,
      maxConcurrentChats: 5,
      skills: ['support', 'technical', 'billing'],
      language: 'en',
    });
    console.log('✅ Demo user created (demo@livechat.com / demo123)\n');

    // Create additional agents
    console.log('👥 Creating additional agents...');
    const agent1 = await User.create({
      name: 'Sarah Johnson',
      email: 'sarah@livechat.com',
      password: 'agent123',
      role: 'agent',
      status: 'online',
      department: supportDept._id,
      maxConcurrentChats: 5,
      skills: ['support', 'technical'],
      language: 'en',
    });

    const agent2 = await User.create({
      name: 'Mike Chen',
      email: 'mike@livechat.com',
      password: 'agent123',
      role: 'agent',
      status: 'away',
      department: salesDept._id,
      maxConcurrentChats: 3,
      skills: ['sales', 'product'],
      language: 'en',
    });
    console.log('✅ 2 additional agents created\n');

    // Update departments with agents
    await Department.findByIdAndUpdate(supportDept._id, {
      $push: { agents: { $each: [demoUser._id, agent1._id] } },
    });
    await Department.findByIdAndUpdate(salesDept._id, {
      $push: { agents: agent2._id },
    });

    // Create canned responses
    console.log('💬 Creating canned responses...');
    await CannedResponse.create([
      {
        title: 'Welcome Message',
        content: 'Hello! Thank you for contacting us. How can I help you today?',
        shortcut: '/welcome',
        category: 'greeting',
        createdBy: demoUser._id,
      },
      {
        title: 'Technical Support',
        content: 'I understand you\'re experiencing a technical issue. Let me help you troubleshoot this. Can you provide more details about what\'s happening?',
        shortcut: '/tech',
        category: 'support',
        createdBy: demoUser._id,
      },
      {
        title: 'Billing Question',
        content: 'I\'ll be happy to help with your billing question. Let me pull up your account information.',
        shortcut: '/billing',
        category: 'billing',
        createdBy: demoUser._id,
      },
      {
        title: 'Closing Message',
        content: 'Thank you for chatting with us! Is there anything else I can help you with today?',
        shortcut: '/close',
        category: 'closing',
        createdBy: demoUser._id,
      },
      {
        title: 'Transfer to Specialist',
        content: 'Let me transfer you to a specialist who can better assist you with this matter. Please hold for just a moment.',
        shortcut: '/transfer',
        category: 'action',
        createdBy: demoUser._id,
      },
    ]);
    console.log('✅ 5 canned responses created\n');

    // Create tags
    console.log('🏷️  Creating tags...');
    await Tag.create([
      {
        name: 'Urgent',
        color: '#EF4444',
        category: 'priority',
        createdBy: demoUser._id,
      },
      {
        name: 'Technical',
        color: '#3B82F6',
        category: 'topic',
        createdBy: demoUser._id,
      },
      {
        name: 'Billing',
        color: '#F59E0B',
        category: 'topic',
        createdBy: demoUser._id,
      },
      {
        name: 'Sales',
        color: '#10B981',
        category: 'topic',
        createdBy: demoUser._id,
      },
      {
        name: 'Follow-up',
        color: '#8B5CF6',
        category: 'status',
        createdBy: demoUser._id,
      },
    ]);
    console.log('✅ 5 tags created\n');

    console.log('🎉 Database seeding completed successfully!\n');
    console.log('📋 Summary:');
    console.log('   - 3 users created (1 admin, 2 agents)');
    console.log('   - 2 departments created');
    console.log('   - 5 canned responses created');
    console.log('   - 5 tags created');
    console.log('   - 1 business hours configuration created');
    console.log('\n🔑 Demo credentials:');
    console.log('   Email: demo@livechat.com');
    console.log('   Password: demo123');
    console.log('\n   Email: sarah@livechat.com');
    console.log('   Password: agent123');
    console.log('\n   Email: mike@livechat.com');
    console.log('   Password: agent123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeder
seedDatabase();
