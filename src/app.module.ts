import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      port: 5432,
      type: 'postgres',
      host: 'localhost',
      synchronize: true,
      username: 'postgres',
      password: 'postgres',
      autoLoadEntities: true,
      database: 'task-management',
    }),
    AuthModule,
  ],
  controllers: [],
})
export class AppModule {}
