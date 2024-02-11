import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity('refresh_tokens')
@Index('idx_userid', ['id'])
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar' })
  refreshToken?: string;

  @CreateDateColumn({
    type: 'timestamptz',
    nullable: true,
    default: null,
    precision: 6,
  })
  iat: Date;

  @ManyToOne(() => User, (user) => user.refreshToken, { onDelete: 'CASCADE' }) //when user is deleted related token is also deleted
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User | string;
}
