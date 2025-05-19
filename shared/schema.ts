import { 
  pgTable, 
  text, 
  serial, 
  integer, 
  boolean, 
  date, 
  timestamp, 
  pgEnum,
  numeric,
  json,
  varchar,
  uniqueIndex,
  foreignKey
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum('user_role', ['member', 'admin', 'financial_officer', 'ethics_officer', 'executive', 'instructor']);
export const memberGradeEnum = pgEnum('membership_grade', ['associate', 'graduate', 'corporate', 'fellow']);
export const complaintStatusEnum = pgEnum('complaint_status', ['received', 'under_investigation', 'resolved', 'closed']);
export const applicationStatusEnum = pgEnum('application_status', ['draft', 'submitted', 'under_review', 'approved', 'rejected']);
export const applicationTypeEnum = pgEnum('application_type', ['sar', 'eiar']);
export const educationLevelEnum = pgEnum('education_level', ['secondary', 'higher']);
export const genderEnum = pgEnum('gender', ['male', 'female', 'other']);
export const courseStatusEnum = pgEnum('course_status', ['draft', 'published', 'archived']);
export const contentTypeEnum = pgEnum('content_type', ['text', 'video', 'presentation', 'quiz', 'assignment']);
export const enrollmentStatusEnum = pgEnum('enrollment_status', ['enrolled', 'completed', 'unenrolled']);

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: userRoleEnum("role").notNull().default('member'),
  membershipNumber: text("membership_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isVerified: boolean("is_verified").default(false)
});

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles),
  qualifications: many(qualifications),
  employments: many(employments),
  complaints: many(complaints, { relationName: 'complainant' }),
  complaintsReceived: many(complaints, { relationName: 'respondent' })
}));

// Profiles
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  phoneNumber: text("phone_number"),
  address: text("address"),
  dateOfBirth: date("date_of_birth"),
  gender: genderEnum("gender"),
  nationality: text("nationality"),
  state: text("state"),
  bio: text("bio"),
  profilePicture: text("profile_picture"),
  membershipGrade: memberGradeEnum("membership_grade"),
  researchInterests: text("research_interests"),
  isExecutive: boolean("is_executive").default(false),
  executivePosition: text("executive_position"),
  executiveBio: text("executive_bio")
});

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id]
  })
}));

// Educational Qualifications
export const qualifications = pgTable("qualifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  level: educationLevelEnum("level").notNull(),
  institution: text("institution").notNull(),
  qualification: text("qualification").notNull(),
  yearObtained: integer("year_obtained").notNull(),
  certificate: text("certificate"),
  isVerified: boolean("is_verified").default(false)
});

export const qualificationsRelations = relations(qualifications, ({ one }) => ({
  user: one(users, {
    fields: [qualifications.userId],
    references: [users.id]
  })
}));

// Employment History
export const employments = pgTable("employments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  employer: text("employer").notNull(),
  position: text("position").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  responsibilities: text("responsibilities"),
  isCurrentEmployer: boolean("is_current_employer").default(false)
});

export const employmentsRelations = relations(employments, ({ one }) => ({
  user: one(users, {
    fields: [employments.userId],
    references: [users.id]
  })
}));

// Publications
export const publications = pgTable("publications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  publisher: text("publisher").notNull(),
  year: integer("year").notNull(),
  url: text("url"),
  description: text("description")
});

export const publicationsRelations = relations(publications, ({ one }) => ({
  user: one(users, {
    fields: [publications.userId],
    references: [users.id]
  })
}));

// Ethics Complaints
export const complaints = pgTable("complaints", {
  id: serial("id").primaryKey(),
  complainantId: integer("complainant_id").references(() => users.id),
  respondentId: integer("respondent_id").references(() => users.id),
  nonMemberName: text("non_member_name"),
  nonMemberEmail: text("non_member_email"),
  nonMemberPhone: text("non_member_phone"),
  subject: text("subject").notNull(),
  details: text("details").notNull(),
  supportingDocuments: text("supporting_documents"),
  status: complaintStatusEnum("status").notNull().default('received'),
  assignedOfficerId: integer("assigned_officer_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const complaintsRelations = relations(complaints, ({ one }) => ({
  complainant: one(users, {
    fields: [complaints.complainantId],
    references: [users.id],
    relationName: 'complainant'
  }),
  respondent: one(users, {
    fields: [complaints.respondentId],
    references: [users.id],
    relationName: 'respondent'
  }),
  assignedOfficer: one(users, {
    fields: [complaints.assignedOfficerId],
    references: [users.id]
  })
}));

// Applications (SAR/EIAR)
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: applicationTypeEnum("type").notNull(),
  projectName: text("project_name").notNull(),
  projectType: text("project_type").notNull(),
  state: text("state").notNull(),
  lga: text("lga").notNull(),
  address: text("address").notNull(),
  documents: json("documents").$type<{[key: string]: string}>(),
  status: applicationStatusEnum("status").notNull().default('draft'),
  certificateNumber: text("certificate_number"),
  certificateUrl: text("certificate_url"),
  paymentAmount: numeric("payment_amount", { precision: 10, scale: 2 }),
  paymentStatus: boolean("payment_status").default(false),
  paymentReference: text("payment_reference"),
  additionalInfo: json("additional_info"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const applicationsRelations = relations(applications, ({ one }) => ({
  user: one(users, {
    fields: [applications.userId],
    references: [users.id]
  })
}));

// Financial Records
export const financialRecords = pgTable("financial_records", {
  id: serial("id").primaryKey(),
  transactionType: text("transaction_type").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  date: date("date").notNull(),
  referenceNumber: text("reference_number"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const financialRecordsRelations = relations(financialRecords, ({ one }) => ({
  creator: one(users, {
    fields: [financialRecords.createdBy],
    references: [users.id]
  })
}));

// Insertion schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  membershipNumber: true,
}).extend({
  confirmPassword: z.string().min(6)
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const insertProfileSchema = createInsertSchema(profiles).omit({ 
  id: true 
});

export const insertQualificationSchema = createInsertSchema(qualifications).omit({ 
  id: true 
});

export const insertEmploymentSchema = createInsertSchema(employments).omit({ 
  id: true 
});

export const insertPublicationSchema = createInsertSchema(publications).omit({ 
  id: true 
});

export const insertComplaintSchema = createInsertSchema(complaints).omit({ 
  id: true, 
  complainantId: true,
  status: true,
  assignedOfficerId: true,
  createdAt: true,
  updatedAt: true
});

export const insertApplicationSchema = createInsertSchema(applications).omit({ 
  id: true,
  userId: true,
  status: true,
  certificateNumber: true,
  certificateUrl: true,
  paymentStatus: true,
  createdAt: true,
  updatedAt: true
});

export const insertFinancialRecordSchema = createInsertSchema(financialRecords).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;

export type Qualification = typeof qualifications.$inferSelect;
export type InsertQualification = z.infer<typeof insertQualificationSchema>;

export type Employment = typeof employments.$inferSelect;
export type InsertEmployment = z.infer<typeof insertEmploymentSchema>;

export type Publication = typeof publications.$inferSelect;
export type InsertPublication = z.infer<typeof insertPublicationSchema>;

export type Complaint = typeof complaints.$inferSelect;
export type InsertComplaint = z.infer<typeof insertComplaintSchema>;

export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

export type FinancialRecord = typeof financialRecords.$inferSelect;
export type InsertFinancialRecord = z.infer<typeof insertFinancialRecordSchema>;

// E-Learning Platform
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  instructorId: integer("instructor_id").references(() => users.id).notNull(),
  status: courseStatusEnum("status").default('draft').notNull(),
  thumbnail: text("thumbnail"),
  duration: integer("duration"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const coursesRelations = relations(courses, ({ one, many }) => ({
  instructor: one(users, { fields: [courses.instructorId], references: [users.id] }),
  modules: many(courseModules),
  enrollments: many(enrollments)
}));

export const courseModules = pgTable("course_modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const courseModulesRelations = relations(courseModules, ({ one, many }) => ({
  course: one(courses, { fields: [courseModules.courseId], references: [courses.id] }),
  contents: many(courseContents)
}));

export const courseContents = pgTable("course_contents", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").references(() => courseModules.id).notNull(),
  title: text("title").notNull(),
  type: contentTypeEnum("type").notNull(),
  content: text("content").notNull(),
  order: integer("order").notNull(),
  duration: integer("duration"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const courseContentsRelations = relations(courseContents, ({ one }) => ({
  module: one(courseModules, { fields: [courseContents.moduleId], references: [courseModules.id] })
}));

export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  status: enrollmentStatusEnum("status").default('enrolled').notNull(),
  progress: integer("progress").default(0).notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, { fields: [enrollments.userId], references: [users.id] }),
  course: one(courses, { fields: [enrollments.courseId], references: [courses.id] })
}));

// Elections System
export const elections = pgTable("elections", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(false).notNull(),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const electionsRelations = relations(elections, ({ one, many }) => ({
  creator: one(users, { fields: [elections.createdBy], references: [users.id] }),
  positions: many(electionPositions)
}));

export const electionPositions = pgTable("election_positions", {
  id: serial("id").primaryKey(),
  electionId: integer("election_id").references(() => elections.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  maxCandidates: integer("max_candidates").default(10).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const electionPositionsRelations = relations(electionPositions, ({ one, many }) => ({
  election: one(elections, { fields: [electionPositions.electionId], references: [elections.id] }),
  candidates: many(electionCandidates)
}));

export const electionCandidates = pgTable("election_candidates", {
  id: serial("id").primaryKey(),
  positionId: integer("position_id").references(() => electionPositions.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  manifesto: text("manifesto"),
  isApproved: boolean("is_approved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const electionCandidatesRelations = relations(electionCandidates, ({ one }) => ({
  position: one(electionPositions, { fields: [electionCandidates.positionId], references: [electionPositions.id] }),
  user: one(users, { fields: [electionCandidates.userId], references: [users.id] })
}));

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  electionId: integer("election_id").references(() => elections.id).notNull(),
  positionId: integer("position_id").references(() => electionPositions.id).notNull(),
  candidateId: integer("candidate_id").references(() => electionCandidates.id).notNull(),
  voterId: integer("voter_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const votesRelations = relations(votes, ({ one }) => ({
  election: one(elections, { fields: [votes.electionId], references: [elections.id] }),
  position: one(electionPositions, { fields: [votes.positionId], references: [electionPositions.id] }),
  candidate: one(electionCandidates, { fields: [votes.candidateId], references: [electionCandidates.id] }),
  voter: one(users, { fields: [votes.voterId], references: [users.id] })
}));

// Chat & Communication Features
export const chatRooms = pgTable("chat_rooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isPrivate: boolean("is_private").default(false).notNull(),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const chatRoomsRelations = relations(chatRooms, ({ one, many }) => ({
  creator: one(users, { fields: [chatRooms.createdBy], references: [users.id] }),
  messages: many(chatMessages),
  participants: many(chatParticipants)
}));

export const chatParticipants = pgTable("chat_participants", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").references(() => chatRooms.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const chatParticipantsRelations = relations(chatParticipants, ({ one }) => ({
  room: one(chatRooms, { fields: [chatParticipants.roomId], references: [chatRooms.id] }),
  user: one(users, { fields: [chatParticipants.userId], references: [users.id] })
}));

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").references(() => chatRooms.id).notNull(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  attachmentUrl: text("attachment_url"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  room: one(chatRooms, { fields: [chatMessages.roomId], references: [chatRooms.id] }),
  sender: one(users, { fields: [chatMessages.senderId], references: [users.id] })
}));

// Member Tools Access
export const memberTools = pgTable("member_tools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon"),
  toolUrl: text("tool_url").notNull(),
  creditsPerHour: integer("credits_per_hour").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const memberCredits = pgTable("member_credits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  balance: integer("balance").default(0).notNull(),
  totalPurchased: integer("total_purchased").default(0).notNull(),
  totalUsed: integer("total_used").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const memberCreditsRelations = relations(memberCredits, ({ one }) => ({
  user: one(users, { fields: [memberCredits.userId], references: [users.id] })
}));

export const creditTransactions = pgTable("credit_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  amount: integer("amount").notNull(),
  type: text("type").notNull(), // purchase, usage, refund
  toolId: integer("tool_id").references(() => memberTools.id),
  paymentReference: text("payment_reference"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const creditTransactionsRelations = relations(creditTransactions, ({ one }) => ({
  user: one(users, { fields: [creditTransactions.userId], references: [users.id] }),
  tool: one(memberTools, { fields: [creditTransactions.toolId], references: [memberTools.id] })
}));

export const toolUsageLogs = pgTable("tool_usage_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  toolId: integer("tool_id").references(() => memberTools.id).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  creditsUsed: integer("credits_used"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const toolUsageLogsRelations = relations(toolUsageLogs, ({ one }) => ({
  user: one(users, { fields: [toolUsageLogs.userId], references: [users.id] }),
  tool: one(memberTools, { fields: [toolUsageLogs.toolId], references: [memberTools.id] })
}));

// Insert schemas for the new tables
export const insertCourseSchema = createInsertSchema(courses).omit({ 
  id: true, createdAt: true, updatedAt: true 
});

export const insertCourseModuleSchema = createInsertSchema(courseModules).omit({ 
  id: true, createdAt: true, updatedAt: true 
});

export const insertCourseContentSchema = createInsertSchema(courseContents).omit({ 
  id: true, createdAt: true, updatedAt: true 
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({ 
  id: true, progress: true, completedAt: true, createdAt: true, updatedAt: true 
});

export const insertElectionSchema = createInsertSchema(elections).omit({ 
  id: true, isActive: true, createdAt: true, updatedAt: true 
});

export const insertElectionPositionSchema = createInsertSchema(electionPositions).omit({ 
  id: true, createdAt: true, updatedAt: true 
});

export const insertElectionCandidateSchema = createInsertSchema(electionCandidates).omit({ 
  id: true, isApproved: true, createdAt: true, updatedAt: true 
});

export const insertVoteSchema = createInsertSchema(votes).omit({ 
  id: true, createdAt: true 
});

export const insertChatRoomSchema = createInsertSchema(chatRooms).omit({ 
  id: true, createdAt: true, updatedAt: true 
});

export const insertChatParticipantSchema = createInsertSchema(chatParticipants).omit({ 
  id: true, createdAt: true 
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ 
  id: true, createdAt: true 
});

export const insertMemberToolSchema = createInsertSchema(memberTools).omit({ 
  id: true, isActive: true, createdAt: true, updatedAt: true 
});

export const insertMemberCreditSchema = createInsertSchema(memberCredits).omit({ 
  id: true, balance: true, totalPurchased: true, totalUsed: true, updatedAt: true 
});

export const insertCreditTransactionSchema = createInsertSchema(creditTransactions).omit({ 
  id: true, createdAt: true 
});

export const insertToolUsageLogSchema = createInsertSchema(toolUsageLogs).omit({ 
  id: true, endTime: true, creditsUsed: true, createdAt: true 
});

// Types for the new tables
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type CourseModule = typeof courseModules.$inferSelect;
export type InsertCourseModule = z.infer<typeof insertCourseModuleSchema>;

export type CourseContent = typeof courseContents.$inferSelect;
export type InsertCourseContent = z.infer<typeof insertCourseContentSchema>;

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;

export type Election = typeof elections.$inferSelect;
export type InsertElection = z.infer<typeof insertElectionSchema>;

export type ElectionPosition = typeof electionPositions.$inferSelect;
export type InsertElectionPosition = z.infer<typeof insertElectionPositionSchema>;

export type ElectionCandidate = typeof electionCandidates.$inferSelect;
export type InsertElectionCandidate = z.infer<typeof insertElectionCandidateSchema>;

export type Vote = typeof votes.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;

export type ChatRoom = typeof chatRooms.$inferSelect;
export type InsertChatRoom = z.infer<typeof insertChatRoomSchema>;

export type ChatParticipant = typeof chatParticipants.$inferSelect;
export type InsertChatParticipant = z.infer<typeof insertChatParticipantSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type MemberTool = typeof memberTools.$inferSelect;
export type InsertMemberTool = z.infer<typeof insertMemberToolSchema>;

export type MemberCredit = typeof memberCredits.$inferSelect;
export type InsertMemberCredit = z.infer<typeof insertMemberCreditSchema>;

export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = z.infer<typeof insertCreditTransactionSchema>;

export type ToolUsageLog = typeof toolUsageLogs.$inferSelect;
export type InsertToolUsageLog = z.infer<typeof insertToolUsageLogSchema>;
