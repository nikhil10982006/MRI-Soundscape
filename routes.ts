import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertSoundscapeSessionSchema, 
  insertUsageAnalyticsSchema,
  insertSoundscapePreferencesSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create soundscape session
  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = insertSoundscapeSessionSchema.parse(req.body);
      const session = await storage.createSoundscapeSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(400).json({ 
        message: error instanceof z.ZodError ? "Invalid session data" : "Failed to create session" 
      });
    }
  });

  // Get soundscape session
  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const session = await storage.getSoundscapeSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error("Error getting session:", error);
      res.status(500).json({ message: "Failed to retrieve session" });
    }
  });

  // Get user sessions
  app.get("/api/users/:userId/sessions", async (req, res) => {
    try {
      const sessions = await storage.getUserSoundscapeSessions(req.params.userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error getting user sessions:", error);
      res.status(500).json({ message: "Failed to retrieve user sessions" });
    }
  });

  // Record analytics event
  app.post("/api/analytics", async (req, res) => {
    try {
      const analyticsData = insertUsageAnalyticsSchema.parse({
        sessionId: req.body.sessionId || null,
        eventType: req.body.eventType,
        eventData: req.body.eventData || null,
      });
      
      const analytics = await storage.recordAnalytics(analyticsData);
      res.json(analytics);
    } catch (error) {
      console.error("Error recording analytics:", error);
      res.status(400).json({ 
        message: error instanceof z.ZodError ? "Invalid analytics data" : "Failed to record analytics" 
      });
    }
  });

  // Get analytics summary
  app.get("/api/analytics/summary", async (req, res) => {
    try {
      const summary = await storage.getAnalyticsSummary();
      res.json(summary);
    } catch (error) {
      console.error("Error getting analytics summary:", error);
      res.status(500).json({ message: "Failed to retrieve analytics summary" });
    }
  });

  // Get user preferences
  app.get("/api/users/:userId/preferences", async (req, res) => {
    try {
      const preferences = await storage.getSoundscapePreferences(req.params.userId);
      res.json(preferences);
    } catch (error) {
      console.error("Error getting preferences:", error);
      res.status(500).json({ message: "Failed to retrieve preferences" });
    }
  });

  // Update user preferences
  app.post("/api/users/:userId/preferences", async (req, res) => {
    try {
      const preferencesData = insertSoundscapePreferencesSchema.parse({
        ...req.body,
        userId: req.params.userId,
      });
      
      const preferences = await storage.updateSoundscapePreferences(preferencesData);
      res.json(preferences);
    } catch (error) {
      console.error("Error updating preferences:", error);
      res.status(400).json({ 
        message: error instanceof z.ZodError ? "Invalid preferences data" : "Failed to update preferences" 
      });
    }
  });

  // AI-powered soundscape generation endpoint (simulated)
  app.post("/api/soundscapes/generate", async (req, res) => {
    try {
      const { soundscapeType, mriNoiseProfile, customSettings } = req.body;
      
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return generated soundscape metadata
      const result = {
        soundscapeId: `generated_${Date.now()}`,
        type: soundscapeType,
        duration: customSettings?.duration || 300,
        sampleRate: 48000,
        channels: 2,
        effectivenessScore: Math.random() * 0.3 + 0.7, // 70-100% effectiveness
        frequencyMasking: {
          low: customSettings?.frequencyLow || 100,
          high: customSettings?.frequencyHigh || 4000,
        },
        downloadUrl: `/api/soundscapes/download/${soundscapeType}`,
        timestamp: new Date().toISOString(),
      };
      
      res.json(result);
    } catch (error) {
      console.error("Error generating soundscape:", error);
      res.status(500).json({ message: "Failed to generate soundscape" });
    }
  });

  // Download generated soundscape
  app.get("/api/soundscapes/download/:type", async (req, res) => {
    try {
      const { type } = req.params;
      
      // In a real implementation, this would return the actual audio file
      // For now, we'll return metadata about the downloadable file
      res.json({
        message: "Download initiated",
        filename: `mri-soundscape-${type}.wav`,
        type: "audio/wav",
        size: "~5MB",
        estimated_download_time: "10-30 seconds",
      });
    } catch (error) {
      console.error("Error downloading soundscape:", error);
      res.status(500).json({ message: "Failed to download soundscape" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      service: "MRI Soundscape API" 
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
