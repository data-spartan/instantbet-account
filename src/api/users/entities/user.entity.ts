import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { UserRolesEnum } from '../roles/roles.enum';

//changed default UQ name to be able to catch UQ constraint error properly
//in typeormException.filter and propagate adequate resp to the client
@Entity()
@Unique('UQ_telephone_', ['telephone'])
@Unique('UQ_email', ['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar' })
  public firstName: string;

  @Column({ type: 'varchar' })
  public lastName: string;

  @Column({ type: 'varchar', nullable: true })
  public telephone: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar', select: false })
  public password!: string;

  @Column({ type: 'varchar' })
  public email!: string;

  @Column({ type: 'boolean', default: false })
  public verifiedEmail: boolean;

  @Column('enum', { enum: UserRolesEnum, default: UserRolesEnum.Basic })
  public role: UserRolesEnum;

  @Column({
    nullable: true,
  })
  @Exclude()
  public refreshToken?: string;

  @Column({ type: 'timestamp', nullable: true, default: null })
  public lastLoginAt: Date | null;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
