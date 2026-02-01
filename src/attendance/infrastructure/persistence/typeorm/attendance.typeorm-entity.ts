import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('asistencia')
export class AttendanceTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'alumno_id', type: 'uuid' })
  studentId: string;

  @Column({ name: 'grupo_id', type: 'uuid' })
  groupId: string;

  @Column({ name: 'ciclo_id', type: 'uuid' })
  cycleId: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  estado: string;

  @Column({ name: 'docente_id', type: 'uuid' })
  teacherId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  // Relations
  @ManyToOne('StudentsTypeOrmEntity', 'attendances')
  @JoinColumn({ name: 'alumno_id' })
  student: any;

  @ManyToOne('UsersTypeOrmEntity', 'attendancesAsTeacher')
  @JoinColumn({ name: 'docente_id' })
  teacher: any;

  @ManyToOne('GroupsTypeOrmEntity', 'attendances')
  @JoinColumn({ name: 'grupo_id' })
  group: any;

  @ManyToOne('CyclesTypeOrmEntity', 'attendances')
  @JoinColumn({ name: 'ciclo_id' })
  cycle: any;
}
