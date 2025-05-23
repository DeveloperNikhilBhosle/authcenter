// import { defineConfig } from "drizzle-kit"

// export default defineConfig({
//     schema: "./src/dbmodels/drizzle/supporthub/schema/*.ts",
//     out: "./src/dbmodels/drizzle/supporthub/migrations",
//     dialect: "postgresql",
//     dbCredentials: process.env.SupportHub_DATABASE_URL,
//     introspect: {
//         casing: 'preserve'
//     },
//     schemaFilter: ['public', 'locker_utility', 'calendar_management', 'lms', 'audit'],
// });


// import type { Config } from 'drizzle-kit';
import { defineConfig } from "drizzle-kit"
import * as dotenv from 'dotenv';


dotenv.config({ path: `.env` }); // or dynamically switch based on NODE_ENV

export default defineConfig({
    schema: "./src/dbmodels/drizzle/authcenter/schema/*.ts",
    out: "./src/dbmodels/drizzle/authcenter/migrations",
    dialect: "postgresql",
    // driver: 'pg',
    dbCredentials: {
        // TODO: connection limit and pooling config to be added
        // connectionString: process.env.AUTH_CENTER_DATABASE_URL,
        url: process.env.AUTH_CENTER_DATABASE_URL ?? ""
    },
    introspect: {
        casing: 'preserve',
    },
    schemaFilter: ['public', 'users', 'masters'],
})