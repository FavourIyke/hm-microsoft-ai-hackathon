import { CreateIssueDto } from '../issues/dto/create-issue.dto';

export interface AiExtractor {
  extractAndCategorize(description: string): Promise<Partial<CreateIssueDto>>; // ✅ Add this line
}
