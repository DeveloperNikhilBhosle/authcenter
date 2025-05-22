import { Global, Module } from '@nestjs/common';
import { Pool } from 'pg';
import { AuthCenterdrizzleService } from './authcenter.drizzle.service';
import { AUTH_CENTER, ConfigurableDatabaseModule, DATABASE_OPTIONS } from '../database.module-definition';
import { DatabaseConfig } from '../database-options.interface';

@Global()
@Module({
    exports: [AuthCenterdrizzleService],
    providers: [
        AuthCenterdrizzleService,
        {
            provide: AUTH_CENTER,
            inject: [DATABASE_OPTIONS],
            useFactory: (databaseOptions: DatabaseConfig) => {
                return new Pool({
                    connectionString: databaseOptions.url,
                });
            },
        },
    ],
})
export class AuthCenterDBModule extends ConfigurableDatabaseModule { }
