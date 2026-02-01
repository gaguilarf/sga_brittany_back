import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('notas_detalle')
export class GradeDetailsTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nota_id', type: 'uuid' })
  gradeId: string;

  @Column({ type: 'int', nullable: true })
  homework: number;

  @Column({ name: 'oral_production', type: 'int', nullable: true })
  oralProduction: number;

  @Column({ name: 'written_project', type: 'int', nullable: true })
  writtenProject: number;

  @Column({ name: 'midterm_exam', type: 'int', nullable: true })
  midtermExam: number;

  @Column({ name: 'first_oral', type: 'int', nullable: true })
  firstOral: number;

  @Column({ name: 'final_written', type: 'int', nullable: true })
  finalWritten: number;

  @Column({ name: 'final_oral', type: 'int', nullable: true })
  finalOral: number;

  @Column({ type: 'int', nullable: true })
  participation: number;

  @Column({ type: 'int', nullable: true })
  quiz: number;

  @Column({ name: 'project_presentation', type: 'int', nullable: true })
  projectPresentation: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  // Relations
  @ManyToOne('GradesTypeOrmEntity', 'details')
  @JoinColumn({ name: 'nota_id' })
  grade: any;
}
