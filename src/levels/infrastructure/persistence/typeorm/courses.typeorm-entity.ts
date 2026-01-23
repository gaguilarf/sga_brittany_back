import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { LevelsTypeOrmEntity } from './levels.typeorm-entity';
import { EnrollmentsTypeOrmEntity } from '../../../../enrollments/infrastructure/persistence/typeorm/enrollments.typeorm-entity';

@Entity('cursos')
export class CoursesTypeOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  // Relations
  @OneToMany(() => LevelsTypeOrmEntity, (level) => level.course)
  levels: LevelsTypeOrmEntity[];

  @OneToMany(() => EnrollmentsTypeOrmEntity, (enrollment) => enrollment.course)
  enrollments: EnrollmentsTypeOrmEntity[];
}
