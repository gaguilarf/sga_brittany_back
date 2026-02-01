import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('grupos')
export class GroupsTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'nombre_grupo', type: 'varchar', length: 255 })
  nombreGrupo: string;

  @Column({ name: 'sede_id', type: 'uuid' })
  campusId: string;

  @Column({ name: 'ciclo_id', type: 'uuid' })
  cycleId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  horario: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  aula: string;

  @Column({ name: 'fecha_inicio', type: 'date', nullable: true })
  fechaInicio: Date;

  @Column({ name: 'fecha_fin', type: 'date', nullable: true })
  fechaFin: Date;

  @Column({ name: 'capacidad_maxima', type: 'int', nullable: true })
  capacidadMaxima: number;

  @Column({
    name: 'alumnos_inscritos',
    type: 'int',
    default: 0,
  })
  alumnosInscritos: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  estado: string; // Activo, Completado, Cancelado

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  // Relations
  @ManyToOne('CampusesTypeOrmEntity', 'groups')
  @JoinColumn({ name: 'sede_id' })
  campus: any;

  @ManyToOne('CyclesTypeOrmEntity', 'groups')
  @JoinColumn({ name: 'ciclo_id' })
  cycle: any;

  @OneToMany('GroupTeachersTypeOrmEntity', 'group')
  groupTeachers: any[];

  @OneToMany('EnrollmentsTypeOrmEntity', 'group')
  enrollments: any[];

  @OneToMany('StudentsTypeOrmEntity', 'currentGroup')
  students: any[];

  @OneToMany('GradesTypeOrmEntity', 'group')
  grades: any[];

  @OneToMany('AttendanceTypeOrmEntity', 'group')
  attendances: any[];
}
