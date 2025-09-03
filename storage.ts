import { 
  type User, 
  type InsertUser, 
  type SoundscapeSession, 
  type InsertSoundscapeSession,
  type UsageAnalytics,
  type InsertUsageAnalytics,
  type SoundscapePreferences,
  type InsertSoundscapePreferences
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Soundscape sessions
  createSoundscapeSession(session: InsertSoundscapeSession): Promise<SoundscapeSession>;
  getSoundscapeSession(id: string): Promise<SoundscapeSession | undefined>;
  getUserSoundscapeSessions(userId: string): Promise<SoundscapeSession[]>;

  // Usage analytics
  recordAnalytics(analytics: InsertUsageAnalytics): Promise<UsageAnalytics>;
  getAnalyticsBySession(sessionId: string): Promise<UsageAnalytics[]>;
  getAnalyticsSummary(): Promise<any>;

  // User preferences
  getSoundscapePreferences(userId: string): Promise<SoundscapePreferences[]>;
  updateSoundscapePreferences(preferences: InsertSoundscapePreferences): Promise<SoundscapePreferences>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private soundscapeSessions: Map<string, SoundscapeSession>;
  private usageAnalytics: Map<string, UsageAnalytics>;
  private soundscapePreferences: Map<string, SoundscapePreferences>;

  constructor() {
    this.users = new Map();
    this.soundscapeSessions = new Map();
    this.usageAnalytics = new Map();
    this.soundscapePreferences = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createSoundscapeSession(insertSession: InsertSoundscapeSession): Promise<SoundscapeSession> {
    const id = randomUUID();
    const session: SoundscapeSession = {
      ...insertSession,
      id,
      createdAt: new Date(),
    };
    this.soundscapeSessions.set(id, session);
    return session;
  }

  async getSoundscapeSession(id: string): Promise<SoundscapeSession | undefined> {
    return this.soundscapeSessions.get(id);
  }

  async getUserSoundscapeSessions(userId: string): Promise<SoundscapeSession[]> {
    return Array.from(this.soundscapeSessions.values()).filter(
      (session) => session.userId === userId
    );
  }

  async recordAnalytics(insertAnalytics: InsertUsageAnalytics): Promise<UsageAnalytics> {
    const id = randomUUID();
    const analytics: UsageAnalytics = {
      ...insertAnalytics,
      id,
      timestamp: new Date(),
    };
    this.usageAnalytics.set(id, analytics);
    return analytics;
  }

  async getAnalyticsBySession(sessionId: string): Promise<UsageAnalytics[]> {
    return Array.from(this.usageAnalytics.values()).filter(
      (analytics) => analytics.sessionId === sessionId
    );
  }

  async getAnalyticsSummary(): Promise<any> {
    const analytics = Array.from(this.usageAnalytics.values());
    
    // Calculate summary statistics
    const totalEvents = analytics.length;
    const eventTypes = new Map<string, number>();
    const soundscapeUsage = new Map<string, number>();

    analytics.forEach(event => {
      // Count event types
      const currentCount = eventTypes.get(event.eventType) || 0;
      eventTypes.set(event.eventType, currentCount + 1);

      // Count soundscape usage
      if (event.eventData && typeof event.eventData === 'object' && 'soundscape' in event.eventData) {
        const soundscape = (event.eventData as any).soundscape;
        const currentUsage = soundscapeUsage.get(soundscape) || 0;
        soundscapeUsage.set(soundscape, currentUsage + 1);
      }
    });

    return {
      totalEvents,
      eventTypes: Object.fromEntries(eventTypes),
      soundscapeUsage: Object.fromEntries(soundscapeUsage),
      recentEvents: analytics.slice(-10), // Last 10 events
    };
  }

  async getSoundscapePreferences(userId: string): Promise<SoundscapePreferences[]> {
    return Array.from(this.soundscapePreferences.values()).filter(
      (prefs) => prefs.userId === userId
    );
  }

  async updateSoundscapePreferences(insertPrefs: InsertSoundscapePreferences): Promise<SoundscapePreferences> {
    // Find existing preferences for this user and soundscape
    const existing = Array.from(this.soundscapePreferences.values()).find(
      (prefs) => prefs.userId === insertPrefs.userId && prefs.soundscapeType === insertPrefs.soundscapeType
    );

    if (existing) {
      // Update existing preferences
      const updated: SoundscapePreferences = {
        ...existing,
        ...insertPrefs,
        useCount: (existing.useCount || 0) + 1,
        lastUsed: new Date(),
      };
      this.soundscapePreferences.set(existing.id, updated);
      return updated;
    } else {
      // Create new preferences
      const id = randomUUID();
      const prefs: SoundscapePreferences = {
        ...insertPrefs,
        id,
        lastUsed: new Date(),
      };
      this.soundscapePreferences.set(id, prefs);
      return prefs;
    }
  }
}

export const storage = new MemStorage();
