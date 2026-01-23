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
import { CoursesTypeOrmEntity } from './courses.typeorm-entity';
import { CyclesTypeOrmEntity } from './cycles.typeorm-entity';
import { EnrollmentsTypeOrmEntity } from '../../../../enrollments/infrastructure/persistence/typeorm/enrollments.typeorm-entity';
import { StudentProgressTypeOrmEntity } from '../../../../students/infrastructure/persistence/typeorm/student-progress.typeorm-entity';

@Entity('niveles')
export class LevelsTypeOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'curso_id', type: 'int' })
  courseId: number;

  @Column({ name: 'nombre_nivel', type: 'varchar', length: 100 })
  nombreNivel: string;

  @Column({ type: 'int', nullable: true })
  orden: number;

  @Column({ name: 'duracion_meses', type: 'int', nullable: true })
  duracionMeses: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  // Relations
  @ManyToOne(() => CoursesTypeOrmEntity, (course) => course.levels)
  @JoinColumn({ name: 'curso_id' })
  course: CoursesTypeOrmEntity;

  @OneToMany(() => CyclesTypeOrmEntity, (cycle) => cycle.level)
  cycles: CyclesTypeOrmEntity[];

  @OneToMany(
    () => EnrollmentsTypeOrmEntity,
    (enrollment) => enrollment.initialLevel,
  )
  enrollments: EnrollmentsTypeOrmEntity[];

  @OneToMany(() => StudentProgressTypeOrmEntity, (progress) => progress.level)
  progressRecords: StudentProgressTypeOrmEntity[];
}
