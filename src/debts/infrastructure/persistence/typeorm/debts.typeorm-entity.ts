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
import { EnrollmentsTypeOrmEntity } from '../../../../enrollments/infrastructure/persistence/typeorm/enrollments.typeorm-entity';
import { ProductsTypeOrmEntity } from '../../../../products/infrastructure/persistence/typeorm/products.typeorm-entity';
import { CyclesTypeOrmEntity } from '../../../../levels/infrastructure/persistence/typeorm/cycles.typeorm-entity';
import { GroupsTypeOrmEntity } from '../../../../groups/infrastructure/persistence/typeorm/groups.typeorm-entity';
import { LevelsTypeOrmEntity } from '../../../../levels/infrastructure/persistence/typeorm/levels.typeorm-entity';
import { PaymentsTypeOrmEntity } from '../../../../payments/infrastructure/persistence/typeorm/payments.typeorm-entity';

@Entity('deudas')
export class DebtTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'matricula_id', type: 'uuid' })
  enrollmentId: string;

  @Column({
    name: 'tipo_deuda',
    type: 'enum',
    enum: [
      'MENSUALIDAD',
      'INSCRIPCION',
      'MATERIALES',
      'PRODUCTO',
      'SERVICIO',
      'OTROS',
    ],
  })
  tipoDeuda: string;

  @Column({ name: 'producto_id', type: 'uuid', nullable: true })
  productId: string;

  @Column({ type: 'varchar', length: 255 })
  concepto: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @CreateDateColumn({ name: 'fecha_generacion' })
  fechaGeneracion: Date;

  @Column({ name: 'fecha_vencimiento', type: 'date' })
  fechaVencimiento: Date;

  @Column({ name: 'mes_aplicado', type: 'varchar', length: 7, nullable: true })
  mesAplicado: string;

  @Column({ name: 'ciclo_asociado_id', type: 'uuid', nullable: true })
  cicloAsociadoId: string;

  @Column({ name: 'grupo_asociado_id', type: 'uuid', nullable: true })
  grupoAsociadoId: string;

  @Column({ name: 'nivel_asociado_id', type: 'uuid', nullable: true })
  nivelAsociadoId: string;

  @Column({
    type: 'enum',
    enum: ['PENDIENTE', 'PAGADO_PARCIAL', 'PAGADO', 'VENCIDO', 'ANULADO'],
    default: 'PENDIENTE',
  })
  estado: string;

  @Column({ type: 'json', nullable: true })
  detalles: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  // Relations
  @ManyToOne(() => EnrollmentsTypeOrmEntity, (enrollment) => enrollment.debts)
  @JoinColumn({ name: 'matricula_id' })
  enrollment: EnrollmentsTypeOrmEntity;

  @ManyToOne(() => ProductsTypeOrmEntity)
  @JoinColumn({ name: 'producto_id' })
  product: ProductsTypeOrmEntity;

  @ManyToOne(() => CyclesTypeOrmEntity)
  @JoinColumn({ name: 'ciclo_asociado_id' })
  cicloAsociado: CyclesTypeOrmEntity;

  @ManyToOne(() => GroupsTypeOrmEntity)
  @JoinColumn({ name: 'grupo_asociado_id' })
  grupoAsociado: GroupsTypeOrmEntity;

  @ManyToOne(() => LevelsTypeOrmEntity)
  @JoinColumn({ name: 'nivel_asociado_id' })
  nivelAsociado: LevelsTypeOrmEntity;

  @OneToMany(() => PaymentsTypeOrmEntity, (payment) => payment.debt)
  payments: PaymentsTypeOrmEntity[];
}
