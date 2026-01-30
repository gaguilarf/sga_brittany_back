import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { RolesTypeOrmEntity } from '../../../../roles/infrastructure/persistence/typeorm/roles.typeorm-entity';

@Entity('users')
export class UsersTypeOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ name: 'role_id', type: 'int' })
  roleId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fullname: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  // Relations
  @ManyToOne(() => RolesTypeOrmEntity, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role?: RolesTypeOrmEntity;

  @OneToMany('EnrollmentsTypeOrmEntity', 'advisor')
  enrollmentsAsAdvisor: any[];

  @OneToMany('AdminLeadsTypeOrmEntity', 'advisor')
  adminLeadsAsAdvisor: any[];

  @OneToMany('AttendanceTypeOrmEntity', 'teacher')
  attendancesAsTeacher: any[];

  @OneToMany('UserCampusesTypeOrmEntity', 'user')
  userCampuses: any[];

  @OneToMany('GradesTypeOrmEntity', 'teacher')
  gradesRegistered: any[];

  @OneToMany('GroupTeachersTypeOrmEntity', 'teacher')
  groupAssignments: any[];
}
