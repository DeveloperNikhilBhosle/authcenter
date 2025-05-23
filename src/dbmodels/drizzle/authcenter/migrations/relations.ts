import { relations } from "drizzle-orm/relations";
import { productsInMasters, product_auth_configurationInMasters, product_rolesInMasters, usersInMasters, user_productsInMasters, user_authInMasters } from "./schema";

export const product_auth_configurationInMastersRelations = relations(product_auth_configurationInMasters, ({one}) => ({
	productsInMaster: one(productsInMasters, {
		fields: [product_auth_configurationInMasters.product_id],
		references: [productsInMasters.id]
	}),
}));

export const productsInMastersRelations = relations(productsInMasters, ({many}) => ({
	product_auth_configurationInMasters: many(product_auth_configurationInMasters),
	product_rolesInMasters: many(product_rolesInMasters),
	user_productsInMasters: many(user_productsInMasters),
}));

export const product_rolesInMastersRelations = relations(product_rolesInMasters, ({one, many}) => ({
	productsInMaster: one(productsInMasters, {
		fields: [product_rolesInMasters.product_id],
		references: [productsInMasters.id]
	}),
	user_productsInMasters: many(user_productsInMasters),
}));

export const user_productsInMastersRelations = relations(user_productsInMasters, ({one}) => ({
	usersInMaster: one(usersInMasters, {
		fields: [user_productsInMasters.user_code],
		references: [usersInMasters.code]
	}),
	productsInMaster: one(productsInMasters, {
		fields: [user_productsInMasters.product_id],
		references: [productsInMasters.id]
	}),
	product_rolesInMaster: one(product_rolesInMasters, {
		fields: [user_productsInMasters.role_id],
		references: [product_rolesInMasters.id]
	}),
}));

export const usersInMastersRelations = relations(usersInMasters, ({many}) => ({
	user_productsInMasters: many(user_productsInMasters),
	user_authInMasters: many(user_authInMasters),
}));

export const user_authInMastersRelations = relations(user_authInMasters, ({one}) => ({
	usersInMaster: one(usersInMasters, {
		fields: [user_authInMasters.user_code],
		references: [usersInMasters.code]
	}),
}));