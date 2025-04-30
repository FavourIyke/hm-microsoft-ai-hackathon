import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

// Use string unions instead of enums for flexibility
export type IssueCategory = 'Water' | 'Electricity' | 'Medical' | 'Food' | 'Other' | 'Unknown';
export type IssueStatus = 'Open' | 'InProgress' | 'Resolved';
export type IssuePriority = 'Critical' | 'High' | 'Medium' | 'Low';

@Entity()
export class Issue extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  description: string;

  // Use strings instead of enums
  @Column('varchar', { default: 'Unknown' })
  category: IssueCategory;

  @Column('varchar', { default: 'Open' })
  status: IssueStatus;

  @Column('varchar', { nullable: true })
  address: string;

  @Column('varchar', { nullable: true })
  city: string;

  @Column('varchar', { nullable: true })
  state: string;

  @Column('varchar', { nullable: true })
  country: string;

  @Column('double precision', { nullable: true })
  latitude: number;

  @Column('double precision', { nullable: true })
  longitude: number;

  // Use strings instead of enums
  @Column('varchar', { default: 'Low' })
  priority: IssuePriority;

  @Column('int', { default: 1 })
  report_count: number;

  // 🧑 Posted by (user ID or identifier)
  @Column('varchar', { nullable: true })
  posted_by: string;

    // Related summary for aggregation or brief related issue details
  @Column('text', { nullable: true })
  related_summary: string;

  @Column('uuid', { nullable: true })
  related_issue_id: string;
  
  // Boolean flag indicating whether the issue has been summarized or not
  @Column('boolean', { default: false })
  is_summarized: boolean;

  @Column('int', { default: 0 })
  progress: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column('varchar', { nullable: true })
  action_title: string;

  @Column('double precision', { nullable: true })
  estimated_cost: number;
}
