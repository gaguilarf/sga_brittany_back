import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DebtTypeOrmEntity } from '../../../../debts/infrastructure/persistence/typeorm/debts.typeorm-entity';

@Entity('pagos')
export class PaymentsTypeOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'matricula_id', type: 'int' })
  enrollmentId: number;

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

  @Column({ name: 'sede_id', type: 'int', nullable: true })
  campusId: number;

  @Column({ name: 'ciclo_asociado', type: 'int', nullable: true })
  associatedCycleId: number;

  @Column({ name: 'grupo_asociado', type: 'int', nullable: true })
  associatedGroupId: number;

  @Column({ name: 'deuda_id', type: 'int', nullable: true })
  debtId: number;

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
