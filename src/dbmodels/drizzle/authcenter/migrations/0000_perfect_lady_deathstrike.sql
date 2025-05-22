-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE SCHEMA "users";
--> statement-breakpoint
CREATE TABLE "users"."users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false,
	"mobile_number" text,
	"mobile_verified" boolean DEFAULT false,
	"dob" date,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"last_updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

*/