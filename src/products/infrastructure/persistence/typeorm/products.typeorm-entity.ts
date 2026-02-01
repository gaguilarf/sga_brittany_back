import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { EnrollmentsTypeOrmEntity } from '../../../../enrollments/infrastructure/persistence/typeorm/enrollments.typeorm-entity';

@Entity('productos')
export class ProductsTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'requires_schedule', type: 'boolean', default: true })
  requiresSchedule: boolean;

  @Column({ name: 'requires_exam_date', type: 'boolean', default: false })
  requiresExamDate: boolean;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => EnrollmentsTypeOrmEntity, (enrollment) => enrollment.product)
  enrollments: EnrollmentsTypeOrmEntity[];
}
