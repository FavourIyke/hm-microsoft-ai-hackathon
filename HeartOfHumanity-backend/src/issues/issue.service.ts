import { Injectable } from '@nestjs/common';
import { Issue } from './issue.entity';
import { CreateIssueDto } from './dto/create-issue.dto';
import { GeminiExtractorService } from '../ai/germini-extractor.service';
import { DataSource, In } from 'typeorm'; // Import this


@Injectable()
export class IssueService {
  constructor(
    private readonly aiExtractor: GeminiExtractorService,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(queryParams: any): Promise<any> {
    try {
      // Destructure query params and set defaults
      const { page = 1, limit = 10, ...filters } = queryParams;

      // Apply pagination and filters
      const [issues, total] = await this.dataSource.getRepository(Issue).findAndCount({
        where: filters,  // Only apply filters that are provided
        order: { created_at: 'DESC' },
        skip: (page - 1) * limit, // Skip based on the page
        take: limit, // Limit the number of results
      });

      // Return response with pagination details
      return {
        status: true,
        message: 'Issues retrieved successfully',
        data: issues,
        pagination: {
          currentPage: page,
          totalItems: total,
          totalPages: Math.ceil(total / limit),
          itemsPerPage: limit,
        },
      };
    } catch (error) {
      console.error('Error while fetching issues:', error);
      return {
        status: false,
        message: 'An error occurred while fetching issues',
        data: null,
        pagination: null,
      };
    }
  }

  // Create an issue and save it in the database
  async createIssue(createIssueDto: CreateIssueDto): Promise<any> {
    try {
      const extractedDetails = await this.aiExtractor.extractAndCategorize(createIssueDto.description);
      console.log('Extracted details from AI:', extractedDetails);

      // Check for missing fields
      const missingFields = extractedDetails.missing ?? [];

      if (missingFields.length > 0) {
        return {
          status: false,
          message: extractedDetails.message,
          data: {
            missing: missingFields,
            extracted: extractedDetails,
            description: createIssueDto.description,
          }
        };
      }

      
      if (extractedDetails.status === "false") {
        return {
          status: false,
          message: 'Sorry we cannor help we that',
          data: {
            description: createIssueDto.description,
          }
        };
      }

      const relatedIssue = await this.dataSource
      .getRepository(Issue)
      .createQueryBuilder('issue')
      .where('issue.state = :state', { state: extractedDetails.state })
      .andWhere('issue.country = :country', { country: extractedDetails.country })
      .andWhere('issue.category = :category', { category: extractedDetails.category })
      .getOne();

      const count = relatedIssue ? 1 : 0;

      await this.dataSource
      .getRepository(Issue)
      .createQueryBuilder()
      .update(Issue)
      .set({ report_count: () => `"report_count" + 1` }) // Increment report count for related issues
      .where('issue.state = :state', { state: extractedDetails.state })
      .andWhere('issue.country = :country', { country: extractedDetails.country })
      .andWhere('issue.category = :category', { category: extractedDetails.category })
      .execute();

      // Proceed only if all required fields (except lat/long) are present
      const issue = new Issue();
      issue.description = createIssueDto.description;
      issue.category = extractedDetails.category;
      issue.address = extractedDetails.address;
      issue.city = extractedDetails.city;
      issue.state = extractedDetails.state;
      issue.country = extractedDetails.country;
      issue.latitude = extractedDetails.latitude ?? null; // Using null for missing lat/long
      issue.longitude = extractedDetails.longitude ?? null; // Using null for missing lat/long
      issue.priority = extractedDetails.priority;
      issue.posted_by = createIssueDto.posted_by ?? '';
      issue.report_count = count + 1;
      issue.related_summary = extractedDetails.summary;
      issue.action_title = extractedDetails.action_title;
      issue.estimated_cost = extractedDetails.estimated_cost;



      if (count > 0 && relatedIssue) {
        issue.related_issue_id = relatedIssue.id;
      }



  const savedIssue = await issue.save();

// 2. If no relatedIssue was found, default related_issue_id to its own ID
  if (!relatedIssue) {
  await this.dataSource
    .getRepository(Issue)
    .update(savedIssue.id, { related_issue_id: savedIssue.id });

   savedIssue.related_issue_id = savedIssue.id; // Update the object for response
    }
      return {
        status: true,
        message: 'Issue created successfully',
        data: issue,
      };
    } catch (error) {
      console.error('Error while creating issue:', error);
      return {
        status: false,
        message: 'An error occurred while creating the issue.',
        data: null,
      };
    }
  }

    // Fetch issue by ID and related issues based on related_issue_id
    async findOneById(id: string): Promise<any> {
      try {
        // Fetch the main issue
        const issue = await this.dataSource.getRepository(Issue).findOne({
          where: { id },
        });
  
        // If the issue is not found, return an error response
        if (!issue) {
          return {
            status: false,
            message: 'Issue not found',
            data: null,
          };
        }
  
        // Fetch related issues if the current issue has a related_issue_id
        let relatedIssues: Issue[] = [];
        if (issue.related_issue_id) {
          relatedIssues = await this.dataSource
            .getRepository(Issue)
            .createQueryBuilder('issue')
            .where('issue.related_issue_id = :relatedId', { relatedId: issue.related_issue_id })
            .andWhere('issue.id != :relatedId', { relatedId: issue.related_issue_id }) // exclude the issue whose id is the related_issue_id
            .getMany();
        }
        
  
        return {
          status: true,
          message: 'Issue found successfully',
          data: {
            issue,
            related_issues: relatedIssues,
          },
        };
      } catch (error) {
        console.error('Error while fetching issue by ID:', error);
        return {
          status: false,
          message: 'An error occurred while fetching the issue.',
          data: null,
        };
      }
    }
}
