import { JwtPayload } from 'jsonwebtoken';

export interface User {
  id: number;
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  role: 'member' | 'admin' | 'financial_officer' | 'ethics_officer' | 'executive' | 'instructor';
  membershipNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean | null;
  verificationToken?: string | null;
  resetToken?: string | null;
}

export interface CreateUserData {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  role: User['role'];
  membershipNumber?: string | null;
  isVerified?: boolean;
  verificationToken?: string;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role?: User['role'];
  membershipNumber?: string | null;
  isVerified?: boolean;
  verificationToken?: string | null;
  resetToken?: string | null;
}

export interface AuthTokenPayload extends JwtPayload {
  userId: number;
  email: string;
  role: User['role'];
}

export interface VerificationTokenPayload extends JwtPayload {
  email: string;
}

export interface ResetTokenPayload extends JwtPayload {
  userId: number;
} 