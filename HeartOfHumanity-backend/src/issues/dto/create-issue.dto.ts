import { IsEnum, IsString, IsOptional, IsUUID, IsNumber } from 'class-validator';
import { IssueCategory, IssuePriority } from '../issue.entity';

export class CreateIssueDto {
  @IsString()
  description: string; // Description of the issue

  @IsString()
  category: IssueCategory; // The category of the issue (e.g., Water, Electricity)

  @IsOptional()
  @IsString()
  address?: string; // Optional address field

  @IsOptional()
  @IsString()
  city?: string; // Optional city field

  @IsOptional()
  @IsString()
  state?: string; // Optional state field

  @IsOptional()
  @IsString()
  country?: string; // Optional country field

  @IsOptional()
  @IsNumber()
  latitude?: number; // Optional latitude for location

  @IsOptional()
  @IsNumber()
  longitude?: number; // Optional longitude for location

  @IsString()
  priority: IssuePriority; // Priority of the issue (Critical, High, Medium, Low)

  @IsOptional()
  @IsUUID()
  posted_by?: string; // Optional field for user ID (who reported the issue)
}
