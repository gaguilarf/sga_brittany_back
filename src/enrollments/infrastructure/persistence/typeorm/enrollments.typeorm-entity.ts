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
import { ProductsTypeOrmEntity } from '../../../../products/infrastructure/persistence/typeorm/products.typeorm-entity';
import { StudentsTypeOrmEntity } from '../../../../students/infrastructure/persistence/typeorm/students.typeorm-entity';
import { CampusesTypeOrmEntity } from '../../../../campuses/infrastructure/persistence/typeorm/campuses.typeorm-entity';
import { PlansTypeOrmEntity } from '../../../../plans/infrastructure/persistence/typeorm/plans.typeorm-entity';
import { CoursesTypeOrmEntity } from '../../../../levels/infrastructure/persistence/typeorm/courses.typeorm-entity';
import { UsersTypeOrmEntity } from '../../../../users/infrastructure/persistence/typeorm/users.typeorm-entity';
import { GroupsTypeOrmEntity } from '../../../../groups/infrastructure/persistence/typeorm/groups.typeorm-entity';
import { LevelsTypeOrmEntity } from '../../../../levels/infrastructure/persistence/typeorm/levels.typeorm-entity';
import { CyclesTypeOrmEntity } from '../../../../levels/infrastructure/persistence/typeorm/cycles.typeorm-entity';
import { PaymentsTypeOrmEntity } from '../../../../payments/infrastructure/persistence/typeorm/payments.typeorm-entity';
import { StudentProgressTypeOrmEntity } from '../../../../students/infrastructure/persistence/typeorm/student-progress.typeorm-entity';

@Entity('matriculas')
export class EnrollmentsTypeOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'alumno_id', type: 'int' })
  studentId: number;

  @Column({ name: 'sede_id', type: 'int' })
  campusId: number;

  @Column({ name: 'plan_id', type: 'int', nullable: true })
  planId: number;

  @Column({ name: 'curso_id', type: 'int', nullable: true })
  courseId: number;

  @Column({ name: 'grupo_id', type: 'int', nullable: true })
  groupId: number;

  @Column({ name: 'nivel_inicial_id', type: 'int', nullable: true })
  initialLevelId: number;

  @Column({ name: 'ciclo_inicial_id', type: 'int', nullable: true })
  initialCycleId: number;

  @Column({
    name: 'enrollment_type',
    type: 'enum',
    enum: ['PLAN', 'PRODUCT'],
    default: 'PLAN',
  })
  enrollmentType: string;

  @Column({ name: 'product_id', type: 'int', nullable: true })
  productId: number;

  @Column({ name: 'exam_date', type: 'date', nullable: true })
  examDate: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  modalidad: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  horario: string;

  @Column({
    name: 'tipo_inscripcion',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  tipoInscripcion: string;

  @Column({ name: 'asesor_id', type: 'int' })
  advisorId: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  origen: string;

  @Column({
    name: 'numero_boleta',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  numeroBoleta: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  saldo: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  // Relations
  @ManyToOne(() => StudentsTypeOrmEntity, (student) => student.enrollments)
  @JoinColumn({ name: 'alumno_id' })
  student: StudentsTypeOrmEntity;

  @ManyToOne(() => CampusesTypeOrmEntity, (campus) => campus.enrollments)
  @JoinColumn({ name: 'sede_id' })
  campus: CampusesTypeOrmEntity;

  @ManyToOne(() => PlansTypeOrmEntity, (plan) => plan.enrollments)
  @JoinColumn({ name: 'plan_id' })
  plan: PlansTypeOrmEntity;

  @ManyToOne(() => CoursesTypeOrmEntity, (course) => course.enrollments)
  @JoinColumn({ name: 'curso_id' })
  course: CoursesTypeOrmEntity;

  @ManyToOne(() => UsersTypeOrmEntity, (user) => user.enrollmentsAsAdvisor)
  @JoinColumn({ name: 'asesor_id' })
  advisor: UsersTypeOrmEntity;

  @ManyToOne(() => GroupsTypeOrmEntity, (group) => group.enrollments)
  @JoinColumn({ name: 'grupo_id' })
  group: GroupsTypeOrmEntity;

  @ManyToOne(() => LevelsTypeOrmEntity, (level) => level.enrollments)
  @JoinColumn({ name: 'nivel_inicial_id' })
  initialLevel: LevelsTypeOrmEntity;

  @ManyToOne(() => CyclesTypeOrmEntity, (cycle) => cycle.enrollments)
  @JoinColumn({ name: 'ciclo_inicial_id' })
  initialCycle: CyclesTypeOrmEntity;

  @ManyToOne(() => ProductsTypeOrmEntity, (product) => product.enrollments)
  @JoinColumn({ name: 'product_id' })
  product: ProductsTypeOrmEntity;

  @OneToMany(() => PaymentsTypeOrmEntity, (payment) => payment.enrollment)
  payments: PaymentsTypeOrmEntity[];

  @OneToMany(
    () => StudentProgressTypeOrmEntity,
    (progress) => progress.enrollment,
  )
  progressRecords: StudentProgressTypeOrmEntity[];
}
