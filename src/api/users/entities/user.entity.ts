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
  OneToOne,
} from 'typeorm';
import { UserRolesEnum } from '../roles/roles.enum';
import { RefreshToken } from './token.entity';
import { IsNumber, Max, Min } from 'class-validator';
import { UserEnum } from './user.enum';

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

  @Column({ type: 'varchar', select: false })
  public password!: string;

  @Column({ type: 'varchar' })
  public email!: string;

  @Column({ type: 'smallint', unsigned: true, nullable: false })
  @IsNumber()
  @Min(UserEnum.AGE_MIN, {
    message: `Must be greater than ${UserEnum.AGE_MIN}`,
  })
  @Max(UserEnum.AGE_MAX, {
    message: `Must be smaller than ${UserEnum.AGE_MAX}`,
  })
  public age: number;

  @Column({ type: 'boolean', default: false })
  public verifiedEmail: boolean;

  @Column('enum', { enum: UserRolesEnum, default: UserRolesEnum.Basic })
  public role: UserRolesEnum;

  //sending a new confirmation link doesn’t invalidate the previous sent non-verified links.to achieve that,
  //  we could store most recent confirmation token in the database and check it before confirming.
  @Column({ type: 'varchar', nullable: true, default: null, select: false })
  public verifyEmailToken?: string;

  // @Column({ array: true, nullable: true })
  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  public refreshToken?: RefreshToken;

  @Column({ type: 'timestamp', nullable: true, default: null, select: false })
  public lastLoginAt: Date | null;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn({ select: false })
  public updatedAt: Date;

  constructor(partial: Partial<User>) {
    // super()
    Object.assign(this, partial);
  }
}
