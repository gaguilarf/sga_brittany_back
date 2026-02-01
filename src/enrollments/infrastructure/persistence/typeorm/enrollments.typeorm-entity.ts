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
import { ProductsTypeOrmEntity } from '../../../../products/infrastructure/persistence/typeorm/products.typeorm-entity';
import { StudentsTypeOrmEntity } from '../../../../students/infrastructure/persistence/typeorm/students.typeorm-entity';
import { CampusesTypeOrmEntity } from '../../../../campuses/infrastructure/persistence/typeorm/campuses.typeorm-entity';
import { PlansTypeOrmEntity } from '../../../../plans/infrastructure/persistence/typeorm/plans.typeorm-entity';
import { UsersTypeOrmEntity } from '../../../../users/infrastructure/persistence/typeorm/users.typeorm-entity';
import { GroupsTypeOrmEntity } from '../../../../groups/infrastructure/persistence/typeorm/groups.typeorm-entity';
import { LevelsTypeOrmEntity } from '../../../../levels/infrastructure/persistence/typeorm/levels.typeorm-entity';
import { CyclesTypeOrmEntity } from '../../../../levels/infrastructure/persistence/typeorm/cycles.typeorm-entity';
import { PaymentsTypeOrmEntity } from '../../../../payments/infrastructure/persistence/typeorm/payments.typeorm-entity';
import { StudentProgressTypeOrmEntity } from '../../../../students/infrastructure/persistence/typeorm/student-progress.typeorm-entity';
import { DebtTypeOrmEntity } from '../../../../debts/infrastructure/persistence/typeorm/debts.typeorm-entity';

@Entity('matriculas')
export class EnrollmentsTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'alumno_id', type: 'uuid' })
  studentId: string;

  @Column({ name: 'sede_id', type: 'uuid' })
  campusId: string;

  @Column({ name: 'plan_id', type: 'uuid', nullable: true })
  planId: string;

  @Column({ name: 'curso_id', type: 'uuid', nullable: true })
  courseId: string;

  @Column({ name: 'grupo_id', type: 'uuid', nullable: true })
  groupId: string;

  @Column({ name: 'nivel_inicial_id', type: 'uuid', nullable: true })
  initialLevelId: string;

  @Column({ name: 'ciclo_inicial_id', type: 'uuid', nullable: true })
  initialCycleId: string;

  @Column({
    name: 'enrollment_type',
    type: 'enum',
    enum: ['PLAN', 'PRODUCT'],
    default: 'PLAN',
  })
  enrollmentType: string;

  @Column({ name: 'product_id', type: 'uuid', nullable: true })
  productId: string;

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

  @Column({ name: 'asesor_id', type: 'uuid' })
  advisorId: string;

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

  @Column({
    name: 'saldo_favor',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  saldoFavor: number;

  @Column({ name: 'fecha_inicio', type: 'date', nullable: true })
  fechaInicio: Date;

  @Column({ name: 'fecha_fin_estimada', type: 'date', nullable: true })
  fechaFinEstimada: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  estado: string;

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

  @OneToMany(() => PaymentsTypeOrmEntity, (payment) => payment.enrollment, {
    onDelete: 'CASCADE',
  })
  payments: PaymentsTypeOrmEntity[];

  @OneToMany(() => DebtTypeOrmEntity, (debt) => debt.enrollment, {
    onDelete: 'CASCADE',
  })
  debts: DebtTypeOrmEntity[];

  @OneToMany(
    () => StudentProgressTypeOrmEntity,
    (progress) => progress.enrollment,
    {
      onDelete: 'CASCADE',
    },
  )
  progressRecords: StudentProgressTypeOrmEntity[];
}
