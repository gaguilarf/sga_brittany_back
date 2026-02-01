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
import { LevelsTypeOrmEntity } from './levels.typeorm-entity';
import { GroupsTypeOrmEntity } from '../../../../groups/infrastructure/persistence/typeorm/groups.typeorm-entity';
import { EnrollmentsTypeOrmEntity } from '../../../../enrollments/infrastructure/persistence/typeorm/enrollments.typeorm-entity';
import { StudentProgressTypeOrmEntity } from '../../../../students/infrastructure/persistence/typeorm/student-progress.typeorm-entity';

@Entity('ciclos')
export class CyclesTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'nivel_id', type: 'uuid' })
  levelId: string;

  @Column({ name: 'nombre_ciclo', type: 'varchar', length: 100 })
  nombreCiclo: string;

  @Column({ type: 'int', nullable: true })
  orden: number;

  @Column({ name: 'duracion_meses', type: 'int', nullable: true })
  duracionMeses: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  libro: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  // Relations
  @ManyToOne(() => LevelsTypeOrmEntity, (level) => level.cycles)
  @JoinColumn({ name: 'nivel_id' })
  level: LevelsTypeOrmEntity;

  @OneToMany(() => GroupsTypeOrmEntity, (group) => group.cycle)
  groups: GroupsTypeOrmEntity[];

  @OneToMany(
    () => EnrollmentsTypeOrmEntity,
    (enrollment) => enrollment.initialCycle,
  )
  enrollments: EnrollmentsTypeOrmEntity[];

  @OneToMany(() => StudentProgressTypeOrmEntity, (progress) => progress.cycle)
  progressRecords: StudentProgressTypeOrmEntity[];
}
