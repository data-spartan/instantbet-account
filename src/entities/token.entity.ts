import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  Index,
} from 'typeorm';
import { User } from './user.entity';

@Entity('refresh_tokens')
@Index('idx_userid', ['id'])
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar' })
  refreshToken?: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true, default: null })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true, default: null })
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.refreshToken, { onDelete: 'CASCADE' }) //when user is deleted related token is also deleted
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User | string;
}
