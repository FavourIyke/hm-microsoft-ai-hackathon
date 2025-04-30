import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Issue } from '../issues/issue.entity';

export enum HelpOfferStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  InProgress = 'InProgress',
  Completed = 'Completed',
}

@Entity()
export class HelpOffer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Issue, (issue) => issue.id, { eager: true })
  @JoinColumn({ name: 'issue_id' })
  issue: Issue;

  @Column('varchar')
  organization_name: string;

  @Column('text')
  message: string;

  @Column('varchar')
  expected_response_time: string;

  @Column('enum', { enum: HelpOfferStatus, default: HelpOfferStatus.Pending })
  status: HelpOfferStatus;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
