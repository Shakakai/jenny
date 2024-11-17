CREATE TABLE IF NOT EXISTS "document_history" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "document_history_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"document_id" integer,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "documents" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "documents_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"ai_inputs" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"username" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "document_history" ADD CONSTRAINT "document_history_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
