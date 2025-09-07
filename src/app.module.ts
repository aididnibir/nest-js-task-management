import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envConfigValidationSchema } from './config.schema';

@Module({
  imports: [
    AuthModule,
    TasksModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      validationSchema: envConfigValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        synchronize: true,
        autoLoadEntities: true,
        host: config.get<string>('DATABASE_HOST'),
        database: config.get<string>('DATABASE_NAME'),
        password: config.get<string>('DATABASE_PASSWORD'),
        username: config.get<string>('DATABASE_USERNAME'),
        port: +(config.get<number>('DATABASE_PORT') ?? 5432),
        type: config.get<string>('DATABASE_TYPE') as 'postgres',
      }),
    }),
  ],
  controllers: [],
})
export class AppModule {}
