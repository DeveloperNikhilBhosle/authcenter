import { pgTable, pgSchema, serial, text, boolean, date, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const users = pgSchema("users");


export const usersInUsers = users.table("users", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	email_verified: boolean().default(false),
	mobile_number: text(),
	mobile_verified: boolean().default(false),
	dob: date(),
	created_at: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	last_updated_at: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});
