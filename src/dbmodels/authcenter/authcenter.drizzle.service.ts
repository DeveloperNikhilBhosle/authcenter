import { Inject, Injectable } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { AUTH_CENTER } from '../database.module-definition';
import * as AUTH_CENTER_SCHEMA from '../drizzle/authcenter/migrations/schema';



@Injectable()
export class AuthCenterdrizzleService {
    public db: NodePgDatabase<typeof AUTH_CENTER_SCHEMA>;
    constructor(@Inject(AUTH_CENTER) private readonly pool: Pool) {
        this.db = drizzle(this.pool, { schema: AUTH_CENTER_SCHEMA });
    }
}
