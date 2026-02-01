import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceTypeOrmEntity } from '../../infrastructure/persistence/typeorm/attendance.typeorm-entity';
import { CreateAttendanceDto } from '../../domain/dtos/create-attendance.dto';
import { UpdateAttendanceDto } from '../../domain/dtos/update-attendance.dto';
import { AttendanceResponseDto } from '../../domain/dtos/attendance-response.dto';

@Injectable()
export class AttendanceService {
  private readonly logger = new Logger(AttendanceService.name);

  constructor(
    @InjectRepository(AttendanceTypeOrmEntity)
    private readonly attendanceRepository: Repository<AttendanceTypeOrmEntity>,
  ) {}

  async create(
    createAttendanceDto: CreateAttendanceDto,
  ): Promise<AttendanceResponseDto> {
    try {
      this.logger.log(
        `Recording attendance for student ID: ${createAttendanceDto.studentId}`,
      );
      const attendance = this.attendanceRepository.create(createAttendanceDto);
      const savedAttendance = await this.attendanceRepository.save(attendance);
      return this.toResponseDto(savedAttendance);
    } catch (error) {
      this.logger.error(
        `Error recording attendance: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll(): Promise<AttendanceResponseDto[]> {
    try {
      this.logger.log('Fetching all attendance records');
      const attendance = await this.attendanceRepository.find({
        order: { fecha: 'DESC', createdAt: 'DESC' },
      });
      return attendance.map((a) => this.toResponseDto(a));
    } catch (error) {
      this.logger.error(
        `Error fetching attendance: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<AttendanceResponseDto> {
    try {
      this.logger.log(`Fetching attendance record with ID: ${id}`);
      const attendance = await this.attendanceRepository.findOne({
        where: { id },
      });

      if (!attendance) {
        throw new NotFoundException(
          `Attendance record with ID ${id} not found`,
        );
      }

      return this.toResponseDto(attendance);
    } catch (error) {
      this.logger.error(
        `Error fetching attendance ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(
    id: string,
    updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<AttendanceResponseDto> {
    try {
      this.logger.log(`Updating attendance record with ID: ${id}`);
      const attendance = await this.attendanceRepository.findOne({
        where: { id },
      });

      if (!attendance) {
        throw new NotFoundException(
          `Attendance record with ID ${id} not found`,
        );
      }

      Object.assign(attendance, updateAttendanceDto);
      const updatedAttendance =
        await this.attendanceRepository.save(attendance);
      return this.toResponseDto(updatedAttendance);
    } catch (error) {
      this.logger.error(
        `Error updating attendance ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.log(`Removing attendance record with ID: ${id}`);
      const attendance = await this.attendanceRepository.findOne({
        where: { id },
      });

      if (!attendance) {
        throw new NotFoundException(
          `Attendance record with ID ${id} not found`,
        );
      }

      await this.attendanceRepository.remove(attendance);
    } catch (error) {
      this.logger.error(
        `Error removing attendance ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private toResponseDto(
    entity: AttendanceTypeOrmEntity,
  ): AttendanceResponseDto {
    return {
      id: entity.id,
      studentId: entity.studentId,
      fecha: entity.fecha,
      estado: entity.estado,
      teacherId: entity.teacherId,
      active: entity.active,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
