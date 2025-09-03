import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const soundscapeSessions = pgTable("soundscape_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  soundscapeType: text("soundscape_type").notNull(),
  volume: integer("volume").notNull().default(75),
  frequencyLow: integer("frequency_low").notNull().default(100),
  frequencyHigh: integer("frequency_high").notNull().default(4000),
  duration: integer("duration"), // in seconds
  createdAt: timestamp("created_at").defaultNow(),
});

export const usageAnalytics = pgTable("usage_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").references(() => soundscapeSessions.id),
  eventType: text("event_type").notNull(), // 'play', 'pause', 'download', 'volume_change', etc.
  eventData: jsonb("event_data"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const soundscapePreferences = pgTable("soundscape_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  soundscapeType: text("soundscape_type").notNull(),
  preferredVolume: integer("preferred_volume").default(75),
  preferredFrequencyLow: integer("preferred_frequency_low").default(100),
  preferredFrequencyHigh: integer("preferred_frequency_high").default(4000),
  useCount: integer("use_count").default(1),
  avgRating: real("avg_rating"),
  lastUsed: timestamp("last_used").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSoundscapeSessionSchema = createInsertSchema(soundscapeSessions).omit({
  id: true,
  createdAt: true,
});

export const insertUsageAnalyticsSchema = createInsertSchema(usageAnalytics).omit({
  id: true,
  timestamp: true,
});

export const insertSoundscapePreferencesSchema = createInsertSchema(soundscapePreferences).omit({
  id: true,
  lastUsed: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SoundscapeSession = typeof soundscapeSessions.$inferSelect;
export type InsertSoundscapeSession = z.infer<typeof insertSoundscapeSessionSchema>;
export type UsageAnalytics = typeof usageAnalytics.$inferSelect;
export type InsertUsageAnalytics = z.infer<typeof insertUsageAnalyticsSchema>;
export type SoundscapePreferences = typeof soundscapePreferences.$inferSelect;
export type InsertSoundscapePreferences = z.infer<typeof insertSoundscapePreferencesSchema>;
