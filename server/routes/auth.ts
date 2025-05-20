import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { sendEmail } from '../config/email';
import { emailTemplates } from '../templates/emails';
import { AuthTokenPayload, CreateUserData, ResetTokenPayload, UpdateUserData, User, VerificationTokenPayload } from '../types/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate verification token
function generateToken<T extends object>(payload: T, expiresIn: string = '1h'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as any });
}

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const [user] = await db.select().from(users).where(eq(users.email, email));
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken<AuthTokenPayload>({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Return user data and token
    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Register route
router.post('/register', async (req, res) => {
  const { email, password, username, firstName, lastName, membershipType, confirmPassword } = req.body;

  try {
    // Check if email already exists
    const [existingUser] = await db.select().from(users).where(eq(users.email, email));
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Check if username already exists
    const [existingUsername] = await db.select().from(users).where(eq(users.username, username));
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate verification token
    const verificationToken = generateToken<VerificationTokenPayload>({ email }, '24h');
    
    // Create user
    const [newUser] = await db.insert(users).values({
      email,
      password: hashedPassword,
      username,
      firstName,
      lastName,
      role: 'member',
      membershipNumber: null,
      isVerified: false,
      verificationToken
    }).returning();

    // Send verification email
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    await sendEmail(email, emailTemplates.emailVerification(verificationLink).subject, emailTemplates.emailVerification(verificationLink).html);

    // Send welcome email
    await sendEmail(email, emailTemplates.welcome(`${firstName} ${lastName}`).subject, emailTemplates.welcome(`${firstName} ${lastName}`).html);

    // Generate auth token
    const token = generateToken<AuthTokenPayload>({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    res.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        isVerified: newUser.isVerified
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Verify email route
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token as string, JWT_SECRET) as VerificationTokenPayload;
    const [user] = await db.select().from(users).where(eq(users.email, decoded.email));

    if (!user) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    await db.update(users)
      .set({ isVerified: true, verificationToken: null })
      .where(eq(users.id, user.id));

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(400).json({ message: 'Invalid or expired verification token' });
  }
});

// Reset password request route
router.post('/reset-password-request', async (req, res) => {
  const { email } = req.body;

  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = generateToken<ResetTokenPayload>({ userId: user.id }, '1h');
    
    await db.update(users)
      .set({ resetToken })
      .where(eq(users.id, user.id));

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendEmail(email, emailTemplates.passwordReset(resetLink).subject, emailTemplates.passwordReset(resetLink).html);

    res.json({ message: 'Password reset instructions sent to your email' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Reset password route
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as ResetTokenPayload;
    const [user] = await db.select().from(users).where(eq(users.id, decoded.userId));

    if (!user) {
      return res.status(400).json({ message: 'Invalid reset token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await db.update(users)
      .set({ 
        password: hashedPassword,
        resetToken: null
      })
      .where(eq(users.id, user.id));

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(400).json({ message: 'Invalid or expired reset token' });
  }
});

export default router; 