import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CampusesTypeOrmEntity } from '../../../../campuses/infrastructure/persistence/typeorm/campuses.typeorm-entity';
import { PlansTypeOrmEntity } from './plans.typeorm-entity';

@Entity('precios_sede_plan')
export class PriceSedePlanTypeOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sede_id', type: 'int' })
  campusId: number;

  @Column({ name: 'plan_id', type: 'int' })
  planId: number;

  @Column({
    name: 'precio_mensualidad',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  precioMensualidad: number;

  @Column({
    name: 'precio_inscripcion',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 80.0,
  })
  precioInscripcion: number;

  @Column({
    name: 'precio_materiales',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 80.0,
  })
  precioMateriales: number;

  @Column({ name: 'fecha_inicio_vigencia', type: 'date' })
  fechaInicioVigencia: Date;

  @Column({ name: 'fecha_fin_vigencia', type: 'date', nullable: true })
  fechaFinVigencia: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  // Relations
  @ManyToOne(() => CampusesTypeOrmEntity, (campus) => campus.prices)
  @JoinColumn({ name: 'sede_id' })
  campus: CampusesTypeOrmEntity;

  @ManyToOne(() => PlansTypeOrmEntity, (plan) => plan.prices)
  @JoinColumn({ name: 'plan_id' })
  plan: PlansTypeOrmEntity;
}
