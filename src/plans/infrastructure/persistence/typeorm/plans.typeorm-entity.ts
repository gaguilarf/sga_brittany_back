import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { EnrollmentsTypeOrmEntity } from '../../../../enrollments/infrastructure/persistence/typeorm/enrollments.typeorm-entity';
import { LevelsTypeOrmEntity } from '../../../../levels/infrastructure/persistence/typeorm/levels.typeorm-entity';

@Entity('planes')
export class PlansTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  service: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precio: number | null;

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

  @OneToMany(() => LevelsTypeOrmEntity, (level) => level.plan)
  levels: LevelsTypeOrmEntity[];

  @OneToMany('PriceSedePlanTypeOrmEntity', 'plan')
  prices: any[];
}
