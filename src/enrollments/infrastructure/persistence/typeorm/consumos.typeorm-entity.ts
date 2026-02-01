import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EnrollmentsTypeOrmEntity } from './enrollments.typeorm-entity';

@Entity('consumos')
export class ConsumoTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'matricula_id', type: 'uuid' })
  enrollmentId: string;

  @Column({ type: 'varchar', length: 7 }) // Format: YYYY-MM
  mes: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  // Relations
  @ManyToOne(() => EnrollmentsTypeOrmEntity)
  @JoinColumn({ name: 'matricula_id' })
  enrollment: EnrollmentsTypeOrmEntity;
}
