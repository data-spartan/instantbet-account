import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  Index,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { UserRolesEnum } from '../api/users/roles/roles.enum';
import { RefreshToken } from './token.entity';
import { PrivateFile } from './file.entity';

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

  @Column({ type: 'date', nullable: false })
  public dateOfBirth: Date;

  @Column({ type: 'boolean', default: false })
  public verifiedEmail: boolean;

  @Column('enum', { enum: UserRolesEnum, default: UserRolesEnum.Basic })
  public role: UserRolesEnum;

  //sending a new confirmation link doesn’t invalidate the previous sent non-verified links.to achieve that,
  //  we could store most recent confirmation token in the database and check it before confirming.
  @Column({ type: 'varchar', nullable: true, default: null, select: false })
  public verifyEmailToken?: string;

  @Column({ type: 'varchar', nullable: true, default: null, select: false })
  public photoUrl?: string;

  @OneToMany(() => PrivateFile, (file: PrivateFile) => file.owner)
  public files: PrivateFile[];

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user, {
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
