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

@Entity('notas')
export class GradesTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'alumno_id', type: 'uuid' })
  studentId: string;

  @Column({ name: 'grupo_id', type: 'uuid' })
  groupId: string;

  @Column({ name: 'ciclo_id', type: 'uuid' })
  cycleId: string;

  @Column({ type: 'int', nullable: true })
  mes: number;

  @Column({ type: 'int', nullable: true })
  año: number;

  @Column({
    name: 'nota_final',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  notaFinal: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  estado: string; // Pendiente, Publicada, Archivada

  @Column({ name: 'docente_id', type: 'uuid' })
  teacherId: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  // Relations
  @ManyToOne('StudentsTypeOrmEntity', 'grades')
  @JoinColumn({ name: 'alumno_id' })
  student: any;

  @OneToMany('GradeDetailsTypeOrmEntity', 'grade')
  details: any[];

  @ManyToOne('GroupsTypeOrmEntity', 'grades')
  @JoinColumn({ name: 'grupo_id' })
  group: any;

  @ManyToOne('CyclesTypeOrmEntity', 'grades')
  @JoinColumn({ name: 'ciclo_id' })
  cycle: any;

  @ManyToOne('UsersTypeOrmEntity', 'gradesRegistered')
  @JoinColumn({ name: 'docente_id' })
  teacher: any;
}
