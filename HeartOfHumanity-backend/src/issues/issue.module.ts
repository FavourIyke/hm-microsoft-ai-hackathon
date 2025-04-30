// File: issue/issue.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssueService } from './issue.service';
import { IssueController } from './issues.controller';
import { Issue } from './issue.entity';
import { GeminiExtractorService } from '../ai/germini-extractor.service';
import { AuthModule } from '../auth/auth.module'; // 👈 Import AuthModule here

@Module({
  imports: [
    TypeOrmModule.forFeature([Issue]),
    AuthModule, // 👈 Add this to make AuthGuard('jwt') work
  ],
  controllers: [IssueController],
  providers: [
    IssueService,
    GeminiExtractorService,
  ],
})
export class IssueModule {}
