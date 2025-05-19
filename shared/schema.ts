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
export const userRoleEnum = pgEnum('user_role', ['member', 'admin', 'financial_officer', 'ethics_officer', 'executive']);
export const memberGradeEnum = pgEnum('membership_grade', ['associate', 'graduate', 'corporate', 'fellow']);
export const complaintStatusEnum = pgEnum('complaint_status', ['received', 'under_investigation', 'resolved', 'closed']);
export const applicationStatusEnum = pgEnum('application_status', ['draft', 'submitted', 'under_review', 'approved', 'rejected']);
export const applicationTypeEnum = pgEnum('application_type', ['sar', 'eiar']);
export const educationLevelEnum = pgEnum('education_level', ['secondary', 'higher']);
export const genderEnum = pgEnum('gender', ['male', 'female', 'other']);

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
