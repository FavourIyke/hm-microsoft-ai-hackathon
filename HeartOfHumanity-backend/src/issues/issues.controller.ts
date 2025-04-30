import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Get,
  Query,
  Param
} from '@nestjs/common';
import { IssueService } from './issue.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('issues')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  // Protected route to create an issue
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createIssueDto: CreateIssueDto, @Request() req: any) {
    createIssueDto.posted_by = req.user.id;
    return this.issueService.createIssue(createIssueDto);
  }

  // ✅ Public route to list all issues (no authentication)
  @Get()
  async findAll(@Query() queryParams: any) {
    return this.issueService.findAll(queryParams); // Pass queryParams to the service
  }

  @Get(':id')
  async findOneById(@Param('id') id: string) {
    return this.issueService.findOneById(id);
  }
}
