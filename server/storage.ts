import { 
  users, 
  profiles, 
  qualifications, 
  employments, 
  publications,
  complaints,
  applications,
  financialRecords,
  courses,
  courseModules,
  courseContents,
  enrollments,
  elections,
  electionPositions,
  electionCandidates,
  votes,
  chatRooms,
  chatParticipants,
  chatMessages,
  memberTools,
  memberCredits,
  creditTransactions,
  toolUsageLogs,
  type User, 
  type InsertUser,
  type Profile,
  type InsertProfile,
  type Qualification,
  type InsertQualification,
  type Employment,
  type InsertEmployment,
  type Publication,
  type InsertPublication,
  type Complaint,
  type InsertComplaint,
  type Application,
  type InsertApplication,
  type FinancialRecord,
  type InsertFinancialRecord,
  type Course,
  type InsertCourse,
  type CourseModule,
  type InsertCourseModule,
  type CourseContent,
  type InsertCourseContent,
  type Enrollment,
  type InsertEnrollment,
  type Election,
  type InsertElection,
  type ElectionPosition,
  type InsertElectionPosition,
  type ElectionCandidate,
  type InsertElectionCandidate,
  type Vote,
  type InsertVote,
  type ChatRoom,
  type InsertChatRoom,
  type ChatParticipant,
  type InsertChatParticipant,
  type ChatMessage,
  type InsertChatMessage,
  type MemberTool,
  type InsertMemberTool,
  type MemberCredit,
  type InsertMemberCredit,
  type CreditTransaction,
  type InsertCreditTransaction,
  type ToolUsageLog,
  type InsertToolUsageLog
} from "@shared/schema";
import { db, pool } from "./db";
import { eq, and, ilike, desc, sql } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";

// For now, use memory store to get the app running
// Later we can switch to PostgreSQL session store if needed
const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User Management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  // Profile Management
  getProfile(userId: number): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: number, data: Partial<Profile>): Promise<Profile | undefined>;
  
  // Member Directory
  getMembers(search?: string, limit?: number, offset?: number): Promise<User[]>;
  getExecutiveMembers(): Promise<{ user: User, profile: Profile }[]>;
  
  // Qualifications
  getQualifications(userId: number): Promise<Qualification[]>;
  addQualification(qualification: InsertQualification): Promise<Qualification>;
  deleteQualification(id: number): Promise<boolean>;
  
  // Employment
  getEmploymentHistory(userId: number): Promise<Employment[]>;
  addEmployment(employment: InsertEmployment): Promise<Employment>;
  deleteEmployment(id: number): Promise<boolean>;
  
  // Publications
  getPublications(userId: number): Promise<Publication[]>;
  addPublication(publication: InsertPublication): Promise<Publication>;
  deletePublication(id: number): Promise<boolean>;
  
  // Ethics Complaints
  getComplaints(status?: string): Promise<Complaint[]>;
  getComplaintById(id: number): Promise<Complaint | undefined>;
  getUserComplaints(userId: number): Promise<Complaint[]>;
  createComplaint(complaint: InsertComplaint, userId?: number): Promise<Complaint>;
  updateComplaintStatus(id: number, status: string, officerId?: number): Promise<Complaint | undefined>;
  
  // Applications
  getUserApplications(userId: number): Promise<Application[]>;
  getApplicationById(id: number): Promise<Application | undefined>;
  createApplication(application: InsertApplication, userId: number): Promise<Application>;
  updateApplicationStatus(id: number, status: string): Promise<Application | undefined>;
  
  // Financial Records
  getFinancialRecords(category?: string, limit?: number): Promise<FinancialRecord[]>;
  createFinancialRecord(record: InsertFinancialRecord): Promise<FinancialRecord>;
  
  // E-Learning Platform
  // Courses
  getCourses(status?: string, instructorId?: number): Promise<Course[]>;
  getCourseById(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, data: Partial<Course>): Promise<Course | undefined>;
  deleteCourse(id: number): Promise<boolean>;
  
  // Course Modules
  getCourseModules(courseId: number): Promise<CourseModule[]>;
  getCourseModuleById(id: number): Promise<CourseModule | undefined>;
  createCourseModule(module: InsertCourseModule): Promise<CourseModule>;
  updateCourseModule(id: number, data: Partial<CourseModule>): Promise<CourseModule | undefined>;
  deleteCourseModule(id: number): Promise<boolean>;
  
  // Course Contents
  getCourseContents(moduleId: number): Promise<CourseContent[]>;
  getCourseContentById(id: number): Promise<CourseContent | undefined>;
  createCourseContent(content: InsertCourseContent): Promise<CourseContent>;
  updateCourseContent(id: number, data: Partial<CourseContent>): Promise<CourseContent | undefined>;
  deleteCourseContent(id: number): Promise<boolean>;
  
  // Enrollments
  getUserEnrollments(userId: number): Promise<Enrollment[]>;
  getCourseEnrollments(courseId: number): Promise<Enrollment[]>;
  enrollUserInCourse(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollmentStatus(id: number, status: string): Promise<Enrollment | undefined>;
  updateEnrollmentProgress(id: number, progress: number): Promise<Enrollment | undefined>;
  unenrollUser(userId: number, courseId: number): Promise<boolean>;
  
  // Elections System
  // Elections
  getElections(isActive?: boolean): Promise<Election[]>;
  getElectionById(id: number): Promise<Election | undefined>;
  createElection(election: InsertElection): Promise<Election>;
  updateElection(id: number, data: Partial<Election>): Promise<Election | undefined>;
  activateElection(id: number): Promise<Election | undefined>;
  endElection(id: number): Promise<Election | undefined>;
  
  // Election Positions
  getElectionPositions(electionId: number): Promise<ElectionPosition[]>;
  getElectionPositionById(id: number): Promise<ElectionPosition | undefined>;
  createElectionPosition(position: InsertElectionPosition): Promise<ElectionPosition>;
  updateElectionPosition(id: number, data: Partial<ElectionPosition>): Promise<ElectionPosition | undefined>;
  
  // Election Candidates
  getElectionCandidates(positionId: number): Promise<ElectionCandidate[]>;
  getCandidateById(id: number): Promise<ElectionCandidate | undefined>;
  registerAsCandidate(candidate: InsertElectionCandidate): Promise<ElectionCandidate>;
  approveCandidate(id: number): Promise<ElectionCandidate | undefined>;
  withdrawCandidacy(id: number): Promise<boolean>;
  
  // Votes
  castVote(vote: InsertVote): Promise<Vote>;
  getUserVotes(electionId: number, voterId: number): Promise<Vote[]>;
  getCandidateVotes(electionId: number, candidateId: number): Promise<number>;
  getElectionResults(electionId: number): Promise<{position: ElectionPosition, candidates: {candidate: ElectionCandidate, votes: number}[]}[]>;
  
  // Chat & Communication
  // Chat Rooms
  getChatRooms(userId: number): Promise<ChatRoom[]>;
  getChatRoomById(id: number): Promise<ChatRoom | undefined>;
  createChatRoom(room: InsertChatRoom): Promise<ChatRoom>;
  addUserToChatRoom(participant: InsertChatParticipant): Promise<ChatParticipant>;
  removeUserFromChatRoom(roomId: number, userId: number): Promise<boolean>;
  
  // Chat Messages
  getChatMessages(roomId: number, limit?: number, before?: Date): Promise<ChatMessage[]>;
  sendChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Member Tools Access
  // Tools
  getAllTools(): Promise<MemberTool[]>;
  getToolById(id: number): Promise<MemberTool | undefined>;
  createTool(tool: InsertMemberTool): Promise<MemberTool>;
  updateTool(id: number, data: Partial<MemberTool>): Promise<MemberTool | undefined>;
  toggleToolAvailability(id: number): Promise<MemberTool | undefined>;
  
  // Credits
  getMemberCredits(userId: number): Promise<MemberCredit | undefined>;
  addCredits(userId: number, amount: number, paymentReference?: string): Promise<MemberCredit>;
  deductCredits(userId: number, amount: number, toolId: number): Promise<MemberCredit | undefined>;
  
  // Transactions
  getMemberTransactions(userId: number): Promise<CreditTransaction[]>;
  
  // Tool Usage
  startToolUsage(log: InsertToolUsageLog): Promise<ToolUsageLog>;
  endToolUsage(id: number): Promise<ToolUsageLog | undefined>;
  getUserToolUsageHistory(userId: number): Promise<ToolUsageLog[]>;
  
  // Session store
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    // Use memory store for sessions
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  // User Management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const [updated] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result !== null;
  }

  // Profile Management
  async getProfile(userId: number): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile;
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const [newProfile] = await db.insert(profiles).values(profile).returning();
    return newProfile;
  }

  async updateProfile(userId: number, data: Partial<Profile>): Promise<Profile | undefined> {
    const [profile] = await db
      .update(profiles)
      .set(data)
      .where(eq(profiles.userId, userId))
      .returning();
    return profile;
  }

  // Member Directory
  async getMembers(search?: string, limit = 20, offset = 0): Promise<User[]> {
    let query = db.select().from(users);
    
    if (search) {
      query = query.where(
        sql`(
          ${users.firstName} || ' ' || ${users.lastName} ILIKE ${`%${search}%`} OR
          ${users.membershipNumber} ILIKE ${`%${search}%`} OR
          ${users.username} ILIKE ${`%${search}%`} OR
          ${users.email} ILIKE ${`%${search}%`}
        )`
      );
    }
    
    return await query.limit(limit).offset(offset);
  }

  async getExecutiveMembers(): Promise<{ user: User, profile: Profile }[]> {
    const result = await db
      .select({
        user: users,
        profile: profiles,
      })
      .from(users)
      .innerJoin(profiles, eq(users.id, profiles.userId))
      .where(eq(profiles.isExecutive, true));
    
    return result;
  }

  // Qualifications
  async getQualifications(userId: number): Promise<Qualification[]> {
    return await db
      .select()
      .from(qualifications)
      .where(eq(qualifications.userId, userId));
  }

  async addQualification(qualification: InsertQualification): Promise<Qualification> {
    const [newQualification] = await db
      .insert(qualifications)
      .values(qualification)
      .returning();
    return newQualification;
  }

  async deleteQualification(id: number): Promise<boolean> {
    const result = await db.delete(qualifications).where(eq(qualifications.id, id));
    return result !== null;
  }

  // Employment
  async getEmploymentHistory(userId: number): Promise<Employment[]> {
    return await db
      .select()
      .from(employments)
      .where(eq(employments.userId, userId))
      .orderBy(desc(employments.startDate));
  }

  async addEmployment(employment: InsertEmployment): Promise<Employment> {
    const [newEmployment] = await db
      .insert(employments)
      .values(employment)
      .returning();
    return newEmployment;
  }

  async deleteEmployment(id: number): Promise<boolean> {
    const result = await db.delete(employments).where(eq(employments.id, id));
    return result !== null;
  }

  // Publications
  async getPublications(userId: number): Promise<Publication[]> {
    return await db
      .select()
      .from(publications)
      .where(eq(publications.userId, userId))
      .orderBy(desc(publications.year));
  }

  async addPublication(publication: InsertPublication): Promise<Publication> {
    const [newPublication] = await db
      .insert(publications)
      .values(publication)
      .returning();
    return newPublication;
  }

  async deletePublication(id: number): Promise<boolean> {
    const result = await db.delete(publications).where(eq(publications.id, id));
    return result !== null;
  }

  // Ethics Complaints
  async getComplaints(status?: string): Promise<Complaint[]> {
    let query = db.select().from(complaints);
    
    if (status) {
      query = query.where(eq(complaints.status, status));
    }
    
    return await query.orderBy(desc(complaints.createdAt));
  }

  async getComplaintById(id: number): Promise<Complaint | undefined> {
    const [complaint] = await db
      .select()
      .from(complaints)
      .where(eq(complaints.id, id));
    return complaint;
  }

  async getUserComplaints(userId: number): Promise<Complaint[]> {
    return await db
      .select()
      .from(complaints)
      .where(eq(complaints.complainantId, userId))
      .orderBy(desc(complaints.createdAt));
  }

  async createComplaint(complaint: InsertComplaint, userId?: number): Promise<Complaint> {
    const complaintData = userId 
      ? { ...complaint, complainantId: userId } 
      : complaint;
    
    const [newComplaint] = await db
      .insert(complaints)
      .values(complaintData)
      .returning();
    return newComplaint;
  }

  async updateComplaintStatus(id: number, status: string, officerId?: number): Promise<Complaint | undefined> {
    const data: any = { 
      status, 
      updatedAt: new Date() 
    };
    
    if (officerId) {
      data.assignedOfficerId = officerId;
    }
    
    const [updated] = await db
      .update(complaints)
      .set(data)
      .where(eq(complaints.id, id))
      .returning();
    return updated;
  }

  // Applications
  async getUserApplications(userId: number): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.userId, userId))
      .orderBy(desc(applications.createdAt));
  }

  async getApplicationById(id: number): Promise<Application | undefined> {
    const [application] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, id));
    return application;
  }

  async createApplication(application: InsertApplication, userId: number): Promise<Application> {
    const [newApplication] = await db
      .insert(applications)
      .values({ ...application, userId })
      .returning();
    return newApplication;
  }

  async updateApplicationStatus(id: number, status: string): Promise<Application | undefined> {
    const [updated] = await db
      .update(applications)
      .set({ 
        status, 
        updatedAt: new Date() 
      })
      .where(eq(applications.id, id))
      .returning();
    return updated;
  }

  // Financial Records
  async getFinancialRecords(category?: string, limit = 20): Promise<FinancialRecord[]> {
    let query = db.select().from(financialRecords);
    
    if (category) {
      query = query.where(eq(financialRecords.category, category));
    }
    
    return await query
      .limit(limit)
      .orderBy(desc(financialRecords.date));
  }

  async createFinancialRecord(record: InsertFinancialRecord): Promise<FinancialRecord> {
    const [newRecord] = await db
      .insert(financialRecords)
      .values(record)
      .returning();
    return newRecord;
  }
}

export const storage = new DatabaseStorage();
