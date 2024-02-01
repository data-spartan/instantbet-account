import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  constructor(partial: Partial<PrivateFile>) {
    // super()
    Object.assign(this, partial);
  }
}
