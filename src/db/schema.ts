import { pgTable, text, serial, timestamp, jsonb, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  token: text('token').notNull().unique(),
  userId: integer('user_id').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const trips = pgTable('trips', {
  id: serial('id').primaryKey(),
  userId: integer('user_id'),
  title: text('title').notNull(),
  originCity: text('origin_city'),
  destination: text('destination').notNull(),
  vibe: text('vibe'),
  durationDays: integer('duration_days').notNull().default(3),
  startDate: text('start_date'),
  endDate: text('end_date'),
  budgetLevel: text('budget_level').notNull().default('Moderate'),
  travelParty: text('travel_party').notNull().default('Solo'),
  pace: text('pace').notNull().default('Moderate'),
  interests: jsonb('interests').$type<string[]>().default([]),
  currency: text('currency').notNull().default('INR'),
  totalCostUsd: integer('total_cost_usd').default(0),
  totalCostInr: integer('total_cost_inr').default(0),
  itinerary: jsonb('itinerary').$type<any>().notNull(),
  emergencyContacts: jsonb('emergency_contacts').$type<any>(),
  packingChecklist: jsonb('packing_checklist').$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Trip = typeof trips.$inferSelect;
export type NewTrip = typeof trips.$inferInsert;
