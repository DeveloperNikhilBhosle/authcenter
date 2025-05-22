import { ConfigurableModuleBuilder } from '@nestjs/common';
import { DatabaseConfig } from './database-options.interface';

export const AUTH_CENTER = 'authcenter';

export const {
    ConfigurableModuleClass: ConfigurableDatabaseModule,
    MODULE_OPTIONS_TOKEN: DATABASE_OPTIONS,
} = new ConfigurableModuleBuilder<DatabaseConfig>()
    .setClassMethodName('forRoot')
    .build();
