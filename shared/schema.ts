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
  jsonb,
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
export const toolTypeEnum = pgEnum('tool_type', ['gis', 'cad', 'coordinate_locator', 'other']);
export const toolStatusEnum = pgEnum('tool_status', ['active', 'maintenance', 'deprecated']);
export const creditTransactionTypeEnum = pgEnum('credit_transaction_type', ['purchase', 'usage', 'refund', 'adjustment']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed', 'failed', 'refunded']);

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

// Profiles
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }),
  gender: genderEnum("gender"),
  dateOfBirth: date("date_of_birth"),
  address: text("address"),
  phoneNumber: text("phone_number"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Qualifications
export const qualifications = pgTable("qualifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }),
  institution: text("institution").notNull(),
  degree: text("degree").notNull(),
  field: text("field").notNull(),
  level: educationLevelEnum("level").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Employments
export const employments = pgTable("employments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }),
  company: text("company").notNull(),
  position: text("position").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  isCurrent: boolean("is_current").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Complaints
export const complaints = pgTable("complaints", {
  id: serial("id").primaryKey(),
  complainantId: integer("complainant_id").references(() => users.id, { onDelete: 'cascade' }),
  respondentId: integer("respondent_id").references(() => users.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: complaintStatusEnum("status").notNull().default('received'),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Applications
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }),
  type: applicationTypeEnum("type").notNull(),
  status: applicationStatusEnum("status").notNull().default('draft'),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  coordinates: json("coordinates").$type<{ lat: number; lng: number }>(),
  documents: json("documents").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Financial Records
export const financialRecords = pgTable("financial_records", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  date: date("date").notNull(),
  reference: text("reference"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Courses
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  instructorId: integer("instructor_id").references(() => users.id),
  status: courseStatusEnum("status").notNull().default('draft'),
  startDate: date("start_date"),
  endDate: date("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Course Modules
export const courseModules = pgTable("course_modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Course Contents
export const courseContents = pgTable("course_contents", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").references(() => courseModules.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  type: contentTypeEnum("type").notNull(),
  content: text("content").notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Enrollments
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }),
  courseId: integer("course_id").references(() => courses.id, { onDelete: 'cascade' }),
  status: enrollmentStatusEnum("status").notNull().default('enrolled'),
  progress: integer("progress").default(0),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Elections
export const elections = pgTable("elections", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Election Positions
export const electionPositions = pgTable("election_positions", {
  id: serial("id").primaryKey(),
  electionId: integer("election_id").references(() => elections.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  description: text("description"),
  maxCandidates: integer("max_candidates").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Election Candidates
export const electionCandidates = pgTable("election_candidates", {
  id: serial("id").primaryKey(),
  positionId: integer("position_id").references(() => electionPositions.id, { onDelete: 'cascade' }),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }),
  manifesto: text("manifesto"),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Votes
export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  electionId: integer("election_id").references(() => elections.id, { onDelete: 'cascade' }),
  positionId: integer("position_id").references(() => electionPositions.id, { onDelete: 'cascade' }),
  candidateId: integer("candidate_id").references(() => electionCandidates.id, { onDelete: 'cascade' }),
  voterId: integer("voter_id").references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Chat Rooms
export const chatRooms = pgTable("chat_rooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isPrivate: boolean("is_private").default(false),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Chat Participants
export const chatParticipants = pgTable("chat_participants", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").references(() => chatRooms.id, { onDelete: 'cascade' }),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }),
  role: text("role").default('member'),
  joinedAt: timestamp("joined_at").defaultNow().notNull()
});

// Chat Messages
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").references(() => chatRooms.id, { onDelete: 'cascade' }),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Publications
export const publications = pgTable("publications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  authors: text("authors").notNull(),
  journal: text("journal"),
  year: integer("year").notNull(),
  doi: text("doi"),
  url: text("url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Member Tools
export const memberTools = pgTable("member_tools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: toolTypeEnum("type").notNull(),
  status: toolStatusEnum("status").notNull().default('active'),
  creditCost: integer("credit_cost").notNull(),
  creditCostUnit: text("credit_cost_unit").notNull(),
  features: json("features").$type<string[]>(),
  url: text("url"),
  iframeUrl: text("iframe_url"),
  apiKey: text("api_key"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Tool Usage Logs
export const toolUsageLogs = pgTable("tool_usage_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }),
  toolId: integer("tool_id").notNull().references(() => memberTools.id, { onDelete: 'cascade' }),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  creditsConsumed: integer("credits_consumed").notNull(),
  status: text("status").notNull().default('active'),
  metadata: json("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Member Credits
export const memberCredits = pgTable("member_credits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }),
  balance: integer("balance").notNull().default(0),
  lastUpdated: timestamp("last_updated").defaultNow().notNull()
});

// Credit Transactions
export const creditTransactions = pgTable("credit_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'cascade' }),
  type: creditTransactionTypeEnum("type").notNull(),
  amount: integer("amount").notNull(),
  description: text("description"),
  paymentReference: text("payment_reference"),
  paymentStatus: paymentStatusEnum("payment_status"),
  paymentAmount: numeric("payment_amount", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Credit Packages
export const creditPackages = pgTable("credit_packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  credits: integer("credits").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles),
  qualifications: many(qualifications),
  employments: many(employments),
  complaints: many(complaints, { relationName: 'complainant' }),
  complaintsReceived: many(complaints, { relationName: 'respondent' })
}));

export const memberToolsRelations = relations(memberTools, ({ many }) => ({
  usageLogs: many(toolUsageLogs)
}));

export const toolUsageLogsRelations = relations(toolUsageLogs, ({ one }) => ({
  user: one(users, {
    fields: [toolUsageLogs.userId],
    references: [users.id]
  }),
  tool: one(memberTools, {
    fields: [toolUsageLogs.toolId],
    references: [memberTools.id]
  })
}));

export const memberCreditsRelations = relations(memberCredits, ({ one }) => ({
  user: one(users, {
    fields: [memberCredits.userId],
    references: [users.id]
  })
}));

export const creditTransactionsRelations = relations(creditTransactions, ({ one }) => ({
  user: one(users, {
    fields: [creditTransactions.userId],
    references: [users.id]
  })
}));

// Insertion schemas
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertProfileSchema = createInsertSchema(profiles).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertQualificationSchema = createInsertSchema(qualifications).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertEmploymentSchema = createInsertSchema(employments).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertComplaintSchema = createInsertSchema(complaints).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertMemberToolSchema = createInsertSchema(memberTools).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertMemberCreditSchema = createInsertSchema(memberCredits).omit({ 
  id: true, balance: true, lastUpdated: true
});

export const insertCreditTransactionSchema = createInsertSchema(creditTransactions).omit({ 
  id: true, createdAt: true 
});

export const insertToolUsageLogSchema = createInsertSchema(toolUsageLogs).omit({ 
  id: true, endTime: true, creditsConsumed: true, createdAt: true 
});

export const insertCreditPackageSchema = createInsertSchema(creditPackages).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertApplicationSchema = createInsertSchema(applications).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertFinancialRecordSchema = createInsertSchema(financialRecords).omit({ 
  id: true,
  createdAt: true
});

export const insertCourseSchema = createInsertSchema(courses).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertCourseModuleSchema = createInsertSchema(courseModules).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertCourseContentSchema = createInsertSchema(courseContents).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({ 
  id: true,
  startedAt: true,
  completedAt: true,
  createdAt: true,
  updatedAt: true
});

export const insertElectionSchema = createInsertSchema(elections).omit({ 
  id: true,
  isActive: true,
  createdAt: true,
  updatedAt: true
});

export const insertElectionPositionSchema = createInsertSchema(electionPositions).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertElectionCandidateSchema = createInsertSchema(electionCandidates).omit({ 
  id: true,
  isApproved: true,
  createdAt: true,
  updatedAt: true
});

export const insertVoteSchema = createInsertSchema(votes).omit({ 
  id: true,
  createdAt: true
});

export const insertChatRoomSchema = createInsertSchema(chatRooms).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertChatParticipantSchema = createInsertSchema(chatParticipants).omit({ 
  id: true,
  joinedAt: true
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ 
  id: true,
  createdAt: true
});

export const insertPublicationSchema = createInsertSchema(publications).omit({ 
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

export type Complaint = typeof complaints.$inferSelect;
export type InsertComplaint = z.infer<typeof insertComplaintSchema>;

export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

export type FinancialRecord = typeof financialRecords.$inferSelect;
export type InsertFinancialRecord = z.infer<typeof insertFinancialRecordSchema>;

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

export type Publication = typeof publications.$inferSelect;
export type InsertPublication = z.infer<typeof insertPublicationSchema>;

export type MemberTool = typeof memberTools.$inferSelect;
export type InsertMemberTool = z.infer<typeof insertMemberToolSchema>;

export type MemberCredit = typeof memberCredits.$inferSelect;
export type InsertMemberCredit = z.infer<typeof insertMemberCreditSchema>;

export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = z.infer<typeof insertCreditTransactionSchema>;

export type ToolUsageLog = typeof toolUsageLogs.$inferSelect;
export type InsertToolUsageLog = z.infer<typeof insertToolUsageLogSchema>;

export type CreditPackage = typeof creditPackages.$inferSelect;
export type InsertCreditPackage = z.infer<typeof insertCreditPackageSchema>;

// Chat and Social Media Tables
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  roomId: integer('room_id').references(() => chatRooms.id),
  senderId: integer('sender_id').references(() => users.id),
  content: text('content').notNull(),
  type: text('type').default('text'), // text, image, file
  metadata: jsonb('metadata'), // for storing additional data like file info
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const directMessages = pgTable('direct_messages', {
  id: serial('id').primaryKey(),
  senderId: integer('sender_id').references(() => users.id),
  receiverId: integer('receiver_id').references(() => users.id),
  content: text('content').notNull(),
  type: text('type').default('text'),
  metadata: jsonb('metadata'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const userConnections = pgTable('user_connections', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  connectedUserId: integer('connected_user_id').references(() => users.id),
  status: text('status').default('pending'), // pending, accepted, rejected
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  content: text('content').notNull(),
  type: text('type').default('text'), // text, image, link
  metadata: jsonb('metadata'),
  visibility: text('visibility').default('public'), // public, connections, private
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const postLikes = pgTable('post_likes', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').references(() => posts.id),
  userId: integer('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const postComments = pgTable('post_comments', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').references(() => posts.id),
  userId: integer('user_id').references(() => users.id),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  type: text('type').notNull(), // message, connection, like, comment, etc.
  content: text('content').notNull(),
  metadata: jsonb('metadata'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdBy: integer('created_by').references(() => users.id),
  isPrivate: boolean('is_private').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const groupMembers = pgTable('group_members', {
  id: serial('id').primaryKey(),
  groupId: integer('group_id').references(() => groups.id),
  userId: integer('user_id').references(() => users.id),
  role: text('role').default('member'), // member, moderator, admin
  joinedAt: timestamp('joined_at').defaultNow(),
});

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  location: text('location'),
  createdBy: integer('created_by').references(() => users.id),
  groupId: integer('group_id').references(() => groups.id),
  isPublic: boolean('is_public').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const eventRegistrations = pgTable('event_registrations', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => events.id),
  userId: integer('user_id').references(() => users.id),
  status: text('status').default('registered'), // registered, attended, cancelled
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}); 