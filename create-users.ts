import { db } from './server/db';
import { users } from './shared/schema';
import { hashPassword } from './server/auth';

async function createUsers() {
  try {
    // Create member user
    const memberUser = await db.insert(users).values({
      username: 'member',
      email: 'member@example.com',
      password: await hashPassword('Member123!'),
      role: 'member',
      firstName: 'John',
      lastName: 'Doe',
      isVerified: true
    }).returning();

    console.log('Created member user:', memberUser[0]);

    // Create admin user
    const adminUser = await db.insert(users).values({
      username: 'admin',
      email: 'admin@example.com',
      password: await hashPassword('Admin123!'),
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      isVerified: true
    }).returning();

    console.log('Created admin user:', adminUser[0]);

  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    process.exit(0);
  }
}

createUsers(); 