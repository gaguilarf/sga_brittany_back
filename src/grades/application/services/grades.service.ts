import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GradesTypeOrmEntity } from '../../infrastructure/persistence/typeorm/grades.typeorm-entity';
import { GradeDetailsTypeOrmEntity } from '../../infrastructure/persistence/typeorm/grade-details.typeorm-entity';
import { CreateGradeDto } from '../../domain/dtos/create-grade.dto';
import { UpdateGradeDto } from '../../domain/dtos/update-grade.dto';
import { CreateGradeDetailDto } from '../../domain/dtos/create-grade-detail.dto';
import { GradeResponseDto } from '../../domain/dtos/grade-response.dto';
import { GradeDetailResponseDto } from '../../domain/dtos/grade-detail-response.dto';

@Injectable()
export class GradesService {
  private readonly logger = new Logger(GradesService.name);

  constructor(
    @InjectRepository(GradesTypeOrmEntity)
    private readonly gradesRepository: Repository<GradesTypeOrmEntity>,
    @InjectRepository(GradeDetailsTypeOrmEntity)
    private readonly gradeDetailsRepository: Repository<GradeDetailsTypeOrmEntity>,
  ) {}

  async create(createGradeDto: CreateGradeDto): Promise<GradeResponseDto> {
    try {
      this.logger.log(
        `Creating new grade for student ID: ${createGradeDto.studentId}`,
      );
      const grade = this.gradesRepository.create(createGradeDto);
      const savedGrade = await this.gradesRepository.save(grade);
      return this.toResponseDto(savedGrade);
    } catch (error) {
      this.logger.error(`Error creating grade: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<GradeResponseDto[]> {
    try {
      this.logger.log('Fetching all grades');
      const grades = await this.gradesRepository.find({
        relations: ['details'],
        order: { createdAt: 'DESC' },
      });
      return grades.map((g) => this.toResponseDto(g));
    } catch (error) {
      this.logger.error(`Error fetching grades: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string): Promise<GradeResponseDto> {
    try {
      this.logger.log(`Fetching grade with ID: ${id}`);
      const grade = await this.gradesRepository.findOne({
        where: { id },
        relations: ['details'],
      });

      if (!grade) {
        throw new NotFoundException(`Grade with ID ${id} not found`);
      }

      return this.toResponseDto(grade);
    } catch (error) {
      this.logger.error(
        `Error fetching grade ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(
    id: string,
    updateGradeDto: UpdateGradeDto,
  ): Promise<GradeResponseDto> {
    try {
      this.logger.log(`Updating grade with ID: ${id}`);
      const grade = await this.gradesRepository.findOne({
        where: { id },
      });

      if (!grade) {
        throw new NotFoundException(`Grade with ID ${id} not found`);
      }

      Object.assign(grade, updateGradeDto);
      const updatedGrade = await this.gradesRepository.save(grade);
      return this.toResponseDto(updatedGrade);
    } catch (error) {
      this.logger.error(
        `Error updating grade ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.log(`Removing grade with ID: ${id}`);
      const grade = await this.gradesRepository.findOne({
        where: { id },
      });

      if (!grade) {
        throw new NotFoundException(`Grade with ID ${id} not found`);
      }

      await this.gradesRepository.remove(grade);
    } catch (error) {
      this.logger.error(
        `Error removing grade ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  // Grade Details
  async addDetail(
    createDetailDto: CreateGradeDetailDto,
  ): Promise<GradeDetailResponseDto> {
    try {
      this.logger.log(`Adding detail to grade ID: ${createDetailDto.gradeId}`);
      const detail = this.gradeDetailsRepository.create(createDetailDto);
      const savedDetail = await this.gradeDetailsRepository.save(detail);

      // Update final grade score (simplified logic)
      const grade = await this.gradesRepository.findOne({
        where: { id: createDetailDto.gradeId },
        relations: ['details'],
      });

      if (grade) {
        // Calculation logic would go here based on the 10 fields
        // For now, we just saved the detail
        await this.gradesRepository.save(grade);
      }

      return this.toDetailResponseDto(savedDetail);
    } catch (error) {
      this.logger.error(
        `Error adding grade detail: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private toResponseDto(entity: GradesTypeOrmEntity): GradeResponseDto {
    return {
      id: entity.id,
      studentId: entity.studentId,
      groupId: entity.groupId,
      cycleId: entity.cycleId,
      mes: entity.mes,
      año: entity.año,
      notaFinal: entity.notaFinal ? Number(entity.notaFinal) : undefined,
      active: entity.active,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      details: entity.details?.map((d) => this.toDetailResponseDto(d)),
      teacherId: entity.teacherId,
      observaciones: entity.observaciones,
    };
  }

  private toDetailResponseDto(
    entity: GradeDetailsTypeOrmEntity,
  ): GradeDetailResponseDto {
    return {
      id: entity.id,
      gradeId: entity.gradeId,
      homework: entity.homework,
      oralProduction: entity.oralProduction,
      writtenProject: entity.writtenProject,
      midtermExam: entity.midtermExam,
      firstOral: entity.firstOral,
      finalWritten: entity.finalWritten,
      finalOral: entity.finalOral,
      participation: entity.participation,
      quiz: entity.quiz,
      projectPresentation: entity.projectPresentation,
      active: entity.active,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
