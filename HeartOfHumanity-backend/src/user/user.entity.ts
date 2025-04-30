// File: src/user/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserRole } from '../auth/dto/register.dto'; // Import UserRole enum

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.SEEKER, // Default role is SEEKER
  })
  role: UserRole;
}
