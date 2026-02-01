import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DebtTypeOrmEntity } from '../../../../debts/infrastructure/persistence/typeorm/debts.typeorm-entity';

@Entity('pagos')
export class PaymentsTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'matricula_id', type: 'uuid' })
  enrollmentId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  tipo: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  metodo: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({
    name: 'numero_boleta',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  numeroBoleta: string;

  @Column({ name: 'fecha_pago', type: 'timestamp', nullable: true })
  fechaPago: Date;

  @Column({ name: 'sede_id', type: 'uuid', nullable: true })
  campusId: string;

  @Column({ name: 'ciclo_asociado', type: 'uuid', nullable: true })
  associatedCycleId: string;

  @Column({ name: 'grupo_asociado', type: 'uuid', nullable: true })
  associatedGroupId: string;

  @Column({ name: 'deuda_id', type: 'uuid', nullable: true })
  debtId: string;

  @Column({ name: 'es_adelantado', type: 'boolean', default: false })
  esAdelantado: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  // Relations
  @ManyToOne('EnrollmentsTypeOrmEntity', 'payments')
  @JoinColumn({ name: 'matricula_id' })
  enrollment: any;

  @ManyToOne('CampusesTypeOrmEntity', 'payments')
  @JoinColumn({ name: 'sede_id' })
  campus: any;

  @ManyToOne('CyclesTypeOrmEntity', 'payments')
  @JoinColumn({ name: 'ciclo_asociado' })
  associatedCycle: any;

  @ManyToOne('GroupsTypeOrmEntity', 'payments')
  @JoinColumn({ name: 'grupo_asociado' })
  associatedGroup: any;

  @ManyToOne(() => DebtTypeOrmEntity, (debt) => debt.payments)
  @JoinColumn({ name: 'deuda_id' })
  debt: DebtTypeOrmEntity;
}
