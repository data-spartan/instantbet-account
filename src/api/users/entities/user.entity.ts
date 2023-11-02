import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserRolesEnum } from '../roles/roles.enum';
import { RefreshToken } from './token.entity';

//changed default UQ name to be able to catch UQ constraint error properly
//in typeormException.filter and propagate adequate resp to the client
@Entity('users')
@Unique('UQ_telephone_', ['telephone'])
@Unique('UQ_email', ['email'])
@Index('idx_createdat_id', ['createdAt', 'id']) //need to create index for cursor pagination
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar' })
  public firstName: string;

  @Column({ type: 'varchar' })
  public lastName: string;

  @Column({ type: 'varchar', nullable: true })
  public telephone: string;

  // @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar', select: false })
  public password!: string;

  @Column({ type: 'varchar' })
  public email!: string;

  @Column({ type: 'boolean', default: false })
  public verifiedEmail: boolean;

  @Column('enum', { enum: UserRolesEnum, default: UserRolesEnum.Basic })
  public role: UserRolesEnum;

  //sending a new confirmation link doesn’t invalidate the previous sent non-verified links.to achieve that,
  //  we could store most recent confirmation token in the database and check it before confirming.
  @Column({ type: 'varchar', nullable: true, default: null, select: false })
  verifyEmailToken?: string;

  // @Column({ array: true, nullable: true })
  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    nullable: true,
  })
  public refreshToken?: RefreshToken[];

  @Column({ type: 'timestamp', nullable: true, default: null, select: false })
  public lastLoginAt: Date | null;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn({ select: false })
  public updatedAt: Date;
}
