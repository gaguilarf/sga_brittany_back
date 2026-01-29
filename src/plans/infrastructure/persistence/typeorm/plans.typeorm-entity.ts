import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { PriceSedePlanTypeOrmEntity } from './price-sede-plan.typeorm-entity';
import { EnrollmentsTypeOrmEntity } from '../../../../enrollments/infrastructure/persistence/typeorm/enrollments.typeorm-entity';

@Entity('planes')
export class PlansTypeOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  service: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'duracion_meses', type: 'int', default: 12 })
  duracionMeses: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  // Relations
  @OneToMany('EnrollmentsTypeOrmEntity', 'plan')
  enrollments: any[];

  @OneToMany(() => PriceSedePlanTypeOrmEntity, (price) => price.plan)
  prices: PriceSedePlanTypeOrmEntity[];
}
