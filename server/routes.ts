import { Express } from "express";
import { db } from "db";
import { emailSubscribers, insertEmailSubscriberSchema } from "db/schema";

export function registerRoutes(app: Express) {
  app.post("/api/subscribe", async (req, res) => {
    const parsed = insertEmailSubscriberSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    try {
      await db.insert(emailSubscribers).values({
        email: parsed.data.email,
        source: "landing",
      });
      return res.status(201).json({ message: "You're on the list." });
    } catch (err: any) {
      // Unique constraint violation — already subscribed
      if (err?.code === "23505") {
        return res.status(200).json({ message: "Already subscribed." });
      }
      console.error("Subscribe error:", err);
      return res.status(500).json({ message: "Something went wrong. Try again." });
    }
  });
}
