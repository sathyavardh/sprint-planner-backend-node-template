const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const UserDesignation = require('../models/UserDesignation');
const Permission = require('../models/Permission');
const UserDesignationPermission = require('../models/UserDesignationPermission');
const { connectDB } = require('../config/database');
const { DESIGNATIONS, PERMISSIONS } = require('../config/constants');

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Connected to database for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      UserDesignation.deleteMany({}),
      Permission.deleteMany({}),
      UserDesignationPermission.deleteMany({})
    ]);
    console.log('Cleared existing data...');

    // Create designations
    const designations = await UserDesignation.create([
      {
        designationName: DESIGNATIONS.JUNIOR_DEV,
        description: 'Junior Developer - Entry level developer'
      },
      {
        designationName: DESIGNATIONS.SENIOR_DEV,
        description: 'Senior Developer - Experienced developer'
      },
      {
        designationName: DESIGNATIONS.MANAGER,
        description: 'Manager - Team lead and management role'
      }
    ]);
    console.log('Created designations...');

    // Create permissions
    const permissions = await Permission.create(
      Object.values(PERMISSIONS).map(permission => ({
        permissionName: permission,
        permissionDescription: `Permission to ${permission.replace(':', ' ')}`
      }))
    );
    console.log('Created permissions...');

    // Create designation permissions
    const juniorPermissions = permissions.filter(p => 
      p.permissionName.includes('read')
    ).map(p => p._id);

    const seniorPermissions = permissions.filter(p => 
      !p.permissionName.includes('delete') && !p.permissionName.includes('audit')
    ).map(p => p._id);

    const managerPermissions = permissions.map(p => p._id);

    await UserDesignationPermission.create([
      {
        userDesignationId: designations.find(d => d.designationName === DESIGNATIONS.JUNIOR_DEV)._id,
        permissions: juniorPermissions
      },
      {
        userDesignationId: designations.find(d => d.designationName === DESIGNATIONS.SENIOR_DEV)._id,
        permissions: seniorPermissions
      },
      {
        userDesignationId: designations.find(d => d.designationName === DESIGNATIONS.MANAGER)._id,
        permissions: managerPermissions
      }
    ]);
    console.log('Created designation permissions...');

    // Create sample users (no manual hashing)
    const users = await User.create([
      {
        username: 'john_junior',
        userEmail: 'john@company.com',
        userPassword: 'password123', // let the schema hash it
        userDesignation: designations.find(d => d.designationName === DESIGNATIONS.JUNIOR_DEV)._id,
        userCompany: 'Tech Corp',
        userPhno: '1234567890'
      },
      {
        username: 'jane_senior',
        userEmail: 'jane@company.com',
        userPassword: 'password123',
        userDesignation: designations.find(d => d.designationName === DESIGNATIONS.SENIOR_DEV)._id,
        userCompany: 'Tech Corp',
        userPhno: '0987654321'
      },
      {
        username: 'bob_manager',
        userEmail: 'bob@company.com',
        userPassword: 'password123',
        userDesignation: designations.find(d => d.designationName === DESIGNATIONS.MANAGER)._id,
        userCompany: 'Tech Corp',
        userPhno: '5555555555'
      }
    ]);
    console.log('Created sample users...');

    console.log('✅ Database seeding completed successfully!');
    console.log('🧪 Sample login credentials:');
    console.log('- john@company.com / password123 (Junior Developer)');
    console.log('- jane@company.com / password123 (Senior Developer)');
    console.log('- bob@company.com / password123 (Manager)');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
