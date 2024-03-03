import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class PrivateFile {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public key: string;

  @ManyToOne(() => User, (owner: User) => owner.files, { onDelete: 'CASCADE' })
  public owner: User;

  @Column()
  mimetype: string;

  @CreateDateColumn({
    type: 'timestamptz',
    nullable: true,
    default: null,
    precision: 6,
  })
  createdAt: Date;

  constructor(partial: Partial<PrivateFile>) {
    // super()
    Object.assign(this, partial);
  }
}
