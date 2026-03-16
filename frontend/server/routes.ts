import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.get("/api/auction/current", async (_req, res) => {
    const auction = await storage.getCurrentAuction();
    res.json(auction);
  });

  app.get("/api/gallery", async (_req, res) => {
    const gallery = await storage.getGallery();
    res.json(gallery);
  });

  app.get("/api/stats", async (_req, res) => {
    const stats = await storage.getStats();
    res.json(stats);
  });

  return httpServer;
}
