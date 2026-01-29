import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PaymentsTypeOrmEntity } from './payments.typeorm-entity';
import { EnrollmentsTypeOrmEntity } from '../../../../enrollments/infrastructure/persistence/typeorm/enrollments.typeorm-entity';
import { DebtTypeOrmEntity } from '../../../../debts/infrastructure/persistence/typeorm/debts.typeorm-entity';

@Entity('pagos_adelantados_detalle')
export class PagoAdelantadoDetalleTypeOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pago_id', type: 'int' })
  pagoId: number;

  @Column({ name: 'matricula_id', type: 'int' })
  enrollmentId: number;

  @Column({ name: 'mes_adelantado', type: 'varchar', length: 7 })
  mesAdelantado: string;

  @Column({
    name: 'monto_asignado',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  montoAsignado: number;

  @Column({
    type: 'enum',
    enum: ['PENDIENTE_APLICACION', 'APLICADO', 'CANCELADO'],
    default: 'PENDIENTE_APLICACION',
  })
  estado: string;

  @Column({ name: 'fecha_aplicacion', type: 'date', nullable: true })
  fechaAplicacion: Date;

  @Column({ name: 'deuda_generada_id', type: 'int', nullable: true })
  deudaGeneradaId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  // Relations
  @ManyToOne(() => PaymentsTypeOrmEntity)
  @JoinColumn({ name: 'pago_id' })
  payment: PaymentsTypeOrmEntity;

  @ManyToOne(() => EnrollmentsTypeOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'matricula_id' })
  enrollment: EnrollmentsTypeOrmEntity;

  @ManyToOne(() => DebtTypeOrmEntity)
  @JoinColumn({ name: 'deuda_generada_id' })
  deudaGenerada: DebtTypeOrmEntity;
}
