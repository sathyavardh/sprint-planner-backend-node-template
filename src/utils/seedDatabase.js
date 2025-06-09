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

    // Prepare permissions per designation

    // Junior Dev: permissions containing "read"
    const juniorPermissions = permissions.filter(p => 
      p.permissionName.includes('read')
    ).map(p => p._id);

    // Senior Dev: permissions excluding those containing "delete" or "audit"
    const seniorPermissions = permissions.filter(p => 
      !p.permissionName.includes('delete') && !p.permissionName.includes('audit')
    ).map(p => p._id);

    // Manager: all permissions
    const managerPermissions = permissions.map(p => p._id);

    // Map designations for convenience
    const juniorId = designations.find(d => d.designationName === DESIGNATIONS.JUNIOR_DEV)._id;
    const seniorId = designations.find(d => d.designationName === DESIGNATIONS.SENIOR_DEV)._id;
    const managerId = designations.find(d => d.designationName === DESIGNATIONS.MANAGER)._id;

    // Create one document per designation with all permissions as an array
    await UserDesignationPermission.create([
      {
        userDesignationId: juniorId,
        permissions: juniorPermissions,
        createdBy: null
      },
      {
        userDesignationId: seniorId,
        permissions: seniorPermissions,
        createdBy: null
      },
      {
        userDesignationId: managerId,
        permissions: managerPermissions,
        createdBy: null
      }
    ]);
    console.log('Created designation permissions...');

    // Create sample users (password will be hashed in schema middleware)
    const users = await User.create([
      {
        username: 'Siva', 
        userEmail: 'siva@zohocorp.com', 
        userPassword: 'password123', // schema should hash this
        userDesignation: juniorId,
        userCompany: 'ZohoCorp',
        userPhno: '1234567890'
      },
      {
        username: 'Josheph',
        userEmail: 'josheph@zohocorp.com',
        userPassword: 'password123',
        userDesignation: seniorId,
        userCompany: 'ZohoCorp',
        userPhno: '0987654321'
      },
      {
        username: 'Sathya',
        userEmail: 'sathya@zohocorp.com',
        userPassword: 'password123',
        userDesignation: managerId,
        userCompany: 'Zoho Corp',
        userPhno: '5555555555'
      }
    ]);
    console.log('Created sample users...');

    console.log('✅ Database seeding completed successfully!');
    console.log('🧪 Sample login credentials:');
    console.log('- siva@zohocorp.com / password123 (Junior Developer)');
    console.log('- josheph@zohocorp.com / password123 (Senior Developer)');
    console.log('- sathya@zohocorp.com / password123 (Manager)');

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
