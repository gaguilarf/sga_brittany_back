import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnrollmentsTypeOrmEntity } from '../../infrastructure/persistence/typeorm/enrollments.typeorm-entity';
import { CreateEnrollmentDto } from '../../domain/dtos/create-enrollment.dto';
import { UpdateEnrollmentDto } from '../../domain/dtos/update-enrollment.dto';
import { EnrollmentResponseDto } from '../../domain/dtos/enrollment-response.dto';

@Injectable()
export class EnrollmentsService {
  private readonly logger = new Logger(EnrollmentsService.name);

  constructor(
    @InjectRepository(EnrollmentsTypeOrmEntity)
    private readonly enrollmentsRepository: Repository<EnrollmentsTypeOrmEntity>,
  ) {}

  async create(
    createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<EnrollmentResponseDto> {
    try {
      this.logger.log(
        `Creating new enrollment for student ID: ${createEnrollmentDto.studentId}`,
      );

      const enrollment = this.enrollmentsRepository.create(createEnrollmentDto);
      const savedEnrollment = await this.enrollmentsRepository.save(enrollment);

      this.logger.log(
        `Enrollment created successfully with ID: ${savedEnrollment.id}`,
      );
      return this.toResponseDto(savedEnrollment);
    } catch (error) {
      this.logger.error(
        `Error creating enrollment: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll(): Promise<EnrollmentResponseDto[]> {
    try {
      this.logger.log('Fetching all enrollments');
      const enrollments = await this.enrollmentsRepository.find({
        order: { createdAt: 'DESC' },
      });
      return enrollments.map((e) => this.toResponseDto(e));
    } catch (error) {
      this.logger.error(
        `Error fetching enrollments: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: number): Promise<EnrollmentResponseDto> {
    try {
      this.logger.log(`Fetching enrollment with ID: ${id}`);
      const enrollment = await this.enrollmentsRepository.findOne({
        where: { id },
      });

      if (!enrollment) {
        throw new NotFoundException(`Enrollment with ID ${id} not found`);
      }

      return this.toResponseDto(enrollment);
    } catch (error) {
      this.logger.error(
        `Error fetching enrollment ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(
    id: number,
    updateEnrollmentDto: UpdateEnrollmentDto,
  ): Promise<EnrollmentResponseDto> {
    try {
      this.logger.log(`Updating enrollment with ID: ${id}`);
      const enrollment = await this.enrollmentsRepository.findOne({
        where: { id },
      });

      if (!enrollment) {
        throw new NotFoundException(`Enrollment with ID ${id} not found`);
      }

      Object.assign(enrollment, updateEnrollmentDto);
      const updatedEnrollment =
        await this.enrollmentsRepository.save(enrollment);

      this.logger.log(
        `Enrollment updated successfully: ID ${updatedEnrollment.id}`,
      );
      return this.toResponseDto(updatedEnrollment);
    } catch (error) {
      this.logger.error(
        `Error updating enrollment ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      this.logger.log(`Removing enrollment with ID: ${id}`);
      const enrollment = await this.enrollmentsRepository.findOne({
        where: { id },
      });

      if (!enrollment) {
        throw new NotFoundException(`Enrollment with ID ${id} not found`);
      }

      await this.enrollmentsRepository.remove(enrollment);
      this.logger.log(`Enrollment removed successfully: ID ${id}`);
    } catch (error) {
      this.logger.error(
        `Error removing enrollment ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private toResponseDto(
    entity: EnrollmentsTypeOrmEntity,
  ): EnrollmentResponseDto {
    return {
      id: entity.id,
      studentId: entity.studentId,
      campusId: entity.campusId,
      planId: entity.planId,
      courseId: entity.courseId,
      modalidad: entity.modalidad,
      horario: entity.horario,
      groupId: entity.groupId,
      initialLevelId: entity.initialLevelId,
      initialCycleId: entity.initialCycleId,
      enrollmentType: entity.enrollmentType,
      productId: entity.productId,
      examDate: entity.examDate,
      tipoInscripcion: entity.tipoInscripcion,
      advisorId: entity.advisorId,
      origen: entity.origen,
      numeroBoleta: entity.numeroBoleta,
      saldo: Number(entity.saldo),
      active: entity.active,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
