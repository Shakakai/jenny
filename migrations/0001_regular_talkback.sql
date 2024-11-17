ALTER TABLE "documents" ALTER COLUMN "title" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "title" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "content" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "content" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "background" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "style" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "key_points" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "instructions" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN IF EXISTS "ai_inputs";