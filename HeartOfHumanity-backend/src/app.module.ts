// File: src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';  // Ensure ConfigModule is imported
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { IssueModule } from './issues/issue.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Ensure this is added
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    IssueModule,
  ],
})
export class AppModule {}
