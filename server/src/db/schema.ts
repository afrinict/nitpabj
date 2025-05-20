import { pgTable, serial, integer, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './schema';

export const userProfiles = pgTable('user_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const educations = pgTable('educations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  level: text('level').notNull(),
  institution: text('institution').notNull(),
  degree: text('degree'),
  fieldOfStudy: text('field_of_study'),
  startYear: integer('start_year').notNull(),
  endYear: integer('end_year').notNull(),
  certificateUrl: text('certificate_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}); 