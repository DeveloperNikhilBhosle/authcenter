import { pgTable, pgSchema, foreignKey, serial, integer, varchar, text, unique, uuid, boolean, timestamp, bigint, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const masters = pgSchema("masters");


export const product_auth_configurationInMasters = masters.table("product_auth_configuration", {
	id: serial().primaryKey().notNull(),
	product_id: integer().notNull(),
	auth_type: varchar({ length: 50 }).notNull(),
	client_id: varchar({ length: 255 }).notNull(),
	client_secret: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.product_id],
			foreignColumns: [productsInMasters.id],
			name: "product_auth_configuration_product_id_fkey"
		}),
]);

export const usersInMasters = masters.table("users", {
	id: serial().primaryKey().notNull(),
	code: uuid().notNull(),
	email: text().notNull(),
	email_verified: boolean().default(false),
	mobile_number: text().notNull(),
	mobile_number_verified: boolean().default(false),
	is_active: boolean().default(true),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	email_hash: text(),
	mobile_hash: text(),
}, (table) => [
	unique("users_code_key").on(table.code),
]);

export const product_rolesInMasters = masters.table("product_roles", {
	id: serial().primaryKey().notNull(),
	product_id: integer().notNull(),
	role: varchar({ length: 100 }).notNull(),
	description: text(),
	is_active: boolean().default(true),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	responsible_person: text(),
}, (table) => [
	foreignKey({
			columns: [table.product_id],
			foreignColumns: [productsInMasters.id],
			name: "product_roles_product_id_fkey"
		}),
]);

export const productsInMasters = masters.table("products", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	is_active: boolean().default(true),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	responsible_person: text(),
});

export const google_clientsInMasters = masters.table("google_clients", {
	id: serial().primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	product_id: bigint({ mode: "number" }).notNull(),
	client_id: text().notNull(),
	client_secret: text().notNull(),
	redirect_uri: text().notNull(),
	is_active: boolean().default(true).notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	auth_code: text(),
	unauthorised_url: text(),
	authorised_url: text(),
}, (table) => [
	unique("google_clients_product_id_key").on(table.product_id),
]);

export const user_google_profileInMasters = masters.table("user_google_profile", {
	id: serial().notNull(),
	google_id: text(),
	email: text().notNull(),
	verified_email: boolean().notNull(),
	name: text(),
	given_name: text(),
	family_name: text(),
	picture: text(),
	hd: text(),
	is_active: boolean().default(true),
	created_at: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const user_productsInMasters = masters.table("user_products", {
	user_code: uuid().notNull(),
	product_id: integer().notNull(),
	role_id: integer().notNull(),
	is_active: boolean().default(true),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.user_code],
			foreignColumns: [usersInMasters.code],
			name: "user_products_user_code_fkey"
		}),
	foreignKey({
			columns: [table.product_id],
			foreignColumns: [productsInMasters.id],
			name: "user_products_product_id_fkey"
		}),
	foreignKey({
			columns: [table.role_id],
			foreignColumns: [product_rolesInMasters.id],
			name: "user_products_role_id_fkey"
		}),
	primaryKey({ columns: [table.user_code, table.product_id], name: "user_products_pkey"}),
]);

export const user_authInMasters = masters.table("user_auth", {
	user_code: uuid().notNull(),
	token: text().notNull(),
	refresh_token: text().notNull(),
	expire_at: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	is_active: boolean().default(true),
}, (table) => [
	foreignKey({
			columns: [table.user_code],
			foreignColumns: [usersInMasters.code],
			name: "user_auth_user_code_fkey"
		}),
	primaryKey({ columns: [table.user_code, table.token], name: "user_auth_pkey"}),
]);
