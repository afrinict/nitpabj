import { db } from '../db';
import { users } from '../../shared/schema';
import { hashPassword } from '../auth';

async function createUsers() {
  const usersToCreate = [
    {
      username: "admin2",
      password: "pass123",
      email: "admin2@example.com",
      firstName: "Admin",
      lastName: "Two",
      role: "admin",
      membershipNumber: "ADM002"
    },
    {
      username: "member",
      password: "pass123",
      email: "member@example.com",
      firstName: "Regular",
      lastName: "Member",
      role: "member",
      membershipNumber: "MEM001"
    },
    {
      username: "member2",
      password: "pass123",
      email: "member2@example.com",
      firstName: "Second",
      lastName: "Member",
      role: "member",
      membershipNumber: "MEM002"
    }
  ];

  for (const user of usersToCreate) {
    try {
      const hashedPassword = await hashPassword(user.password);
      await db.insert(users).values({
        username: user.username,
        password: hashedPassword,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        membershipNumber: user.membershipNumber,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Created user: ${user.username}`);
    } catch (error) {
      console.error(`Error creating user ${user.username}:`, error);
    }
  }
}

createUsers()
  .then(() => {
    console.log('Finished creating users');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  }); 