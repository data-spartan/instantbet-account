import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar' })
  refreshToken?: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true, default: null })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true, default: null })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.refreshToken, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User | string;
}
