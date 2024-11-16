import { pgTable, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull().default("draft"),
  metadata: jsonb("metadata").default({}).notNull(),
  aiInputs: jsonb("ai_inputs").default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const documentHistory = pgTable("document_history", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  documentId: integer("document_id").references(() => documents.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;

export const insertDocumentSchema = createInsertSchema(documents);
export const selectDocumentSchema = createSelectSchema(documents);
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = z.infer<typeof selectDocumentSchema>;

export const insertDocumentHistorySchema = createInsertSchema(documentHistory);
export const selectDocumentHistorySchema = createSelectSchema(documentHistory);
export type InsertDocumentHistory = z.infer<typeof insertDocumentHistorySchema>;
export type DocumentHistory = z.infer<typeof selectDocumentHistorySchema>;
