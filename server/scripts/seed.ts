import { db } from '../db';
import { users, profiles, qualifications, employments } from '@shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    console.log('Testing database connection...');
    
    // Test connection by querying users table
    const existingUsers = await db.select().from(users);
    console.log('Successfully connected to database!');
    console.log(`Found ${existingUsers.length} existing users`);

    if (existingUsers.length === 0) {
      console.log('Seeding initial data...');

      // Create admin user
      const adminPassword = await bcrypt.hash('admin123', 10);
      const [admin] = await db.insert(users).values({
        username: 'admin',
        password: adminPassword,
        email: 'admin@nitpabj.org',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        membershipNumber: 'ADMIN001',
        isVerified: true
      }).returning();

      // Create admin profile
      await db.insert(profiles).values({
        userId: admin.id,
        gender: 'male',
        address: 'NITP Headquarters',
        phoneNumber: '+2348000000000',
        bio: 'System Administrator'
      });

      // Create member user
      const memberPassword = await bcrypt.hash('member123', 10);
      const [member] = await db.insert(users).values({
        username: 'member',
        password: memberPassword,
        email: 'member@nitpabj.org',
        firstName: 'John',
        lastName: 'Doe',
        role: 'member',
        membershipNumber: 'MEM001',
        isVerified: true
      }).returning();

      // Create member profile
      await db.insert(profiles).values({
        userId: member.id,
        gender: 'male',
        address: '123 Member Street',
        phoneNumber: '+2348000000001',
        bio: 'Professional Member'
      });

      // Add qualification for member
      await db.insert(qualifications).values({
        userId: member.id,
        institution: 'University of Lagos',
        degree: 'Bachelor of Urban and Regional Planning',
        field: 'Urban Planning',
        level: 'higher',
        startDate: '2011-09-01',
        endDate: '2015-07-31'
      });

      // Add employment for member
      await db.insert(employments).values({
        userId: member.id,
        company: 'Lagos State Ministry of Physical Planning',
        position: 'Senior Town Planner',
        startDate: '2016-01-01',
        isCurrent: true
      });

      console.log('Successfully seeded initial data!');
    } else {
      console.log('Database already has data, skipping seed...');
    }

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed(); 