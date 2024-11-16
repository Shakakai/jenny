import { Express } from "express";
import { setupAuth } from "./auth";
import { db } from "db";
import { documents, documentHistory } from "db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express) {
  setupAuth(app);

  // Document CRUD operations
  app.get("/api/documents", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    
    const userDocs = await db.query.documents.findMany({
      where: eq(documents.userId, req.user.id),
      orderBy: [documents.updatedAt],
    });
    res.json(userDocs);
  });

  app.post("/api/documents", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    
    const { title, content, metadata } = req.body;
    const [newDoc] = await db.insert(documents)
      .values({
        title,
        content,
        metadata,
        userId: req.user.id,
      })
      .returning();
    res.json(newDoc);
  });

  app.put("/api/documents/:id", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    
    const { id } = req.params;
    const { title, content, metadata } = req.body;

    // Save to history
    await db.insert(documentHistory).values({
      documentId: parseInt(id),
      content: (await db.query.documents.findFirst({
        where: eq(documents.id, parseInt(id)),
      }))?.content || "",
    });

    // Update document
    const [updatedDoc] = await db.update(documents)
      .set({ title, content, metadata, updatedAt: new Date() })
      .where(eq(documents.id, parseInt(id)))
      .returning();
    
    res.json(updatedDoc);
  });

  app.get("/api/documents/:id/history", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    
    const { id } = req.params;
    const history = await db.query.documentHistory.findMany({
      where: eq(documentHistory.documentId, parseInt(id)),
      orderBy: [documentHistory.createdAt],
    });
    res.json(history);
  });

  app.delete("/api/documents/:id", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    
    const { id } = req.params;
    await db.delete(documents).where(eq(documents.id, parseInt(id)));
    res.json({ success: true });
  });
}
