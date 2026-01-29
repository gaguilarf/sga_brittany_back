import {
  Injectable,
  NotFoundException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentsTypeOrmEntity } from '../../infrastructure/persistence/typeorm/students.typeorm-entity';
import { CreateStudentDto } from '../../domain/dtos/create-student.dto';
import { UpdateStudentDto } from '../../domain/dtos/update-student.dto';
import { StudentResponseDto } from '../../domain/dtos/student-response.dto';

@Injectable()
export class StudentsService {
  private readonly logger = new Logger(StudentsService.name);

  constructor(
    @InjectRepository(StudentsTypeOrmEntity)
    private readonly studentsRepository: Repository<StudentsTypeOrmEntity>,
  ) {}

  async create(
    createStudentDto: CreateStudentDto,
  ): Promise<StudentResponseDto> {
    try {
      this.logger.log(`Creating new student: ${createStudentDto.nombre}`);

      // Check if DNI already exists (if provided)
      if (createStudentDto.dni) {
        const existingStudent = await this.studentsRepository.findOne({
          where: { dni: createStudentDto.dni },
        });

        if (existingStudent) {
          throw new ConflictException(
            `Student with DNI "${createStudentDto.dni}" already exists`,
          );
        }
      }

      const student = this.studentsRepository.create(createStudentDto);
      const savedStudent = await this.studentsRepository.save(student);

      this.logger.log(
        `Student created successfully: ${savedStudent.nombre} (ID: ${savedStudent.id})`,
      );

      return this.toResponseDto(savedStudent);
    } catch (error) {
      this.logger.error(
        `Error creating student: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll(): Promise<StudentResponseDto[]> {
    try {
      this.logger.log('Fetching all students');
      const students = await this.studentsRepository.find({
        order: { createdAt: 'DESC' },
      });

      this.logger.log(`Found ${students.length} students`);
      return students.map((student) => this.toResponseDto(student));
    } catch (error) {
      this.logger.error(
        `Error fetching students: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findActive(): Promise<StudentResponseDto[]> {
    try {
      this.logger.log('Fetching active students');
      const students = await this.studentsRepository.find({
        where: { active: true },
        order: { nombre: 'ASC' },
      });

      this.logger.log(`Found ${students.length} active students`);
      return students.map((student) => this.toResponseDto(student));
    } catch (error) {
      this.logger.error(
        `Error fetching active students: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: number): Promise<StudentResponseDto> {
    try {
      this.logger.log(`Fetching student with ID: ${id}`);
      const student = await this.studentsRepository.findOne({
        where: { id },
      });

      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }

      return this.toResponseDto(student);
    } catch (error) {
      this.logger.error(
        `Error fetching student ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(
    id: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<StudentResponseDto> {
    try {
      this.logger.log(`Updating student with ID: ${id}`);

      const student = await this.studentsRepository.findOne({
        where: { id },
      });

      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }

      // Check if new DNI conflicts with existing student
      if (updateStudentDto.dni && updateStudentDto.dni !== student.dni) {
        const existingStudent = await this.studentsRepository.findOne({
          where: { dni: updateStudentDto.dni },
        });

        if (existingStudent) {
          throw new ConflictException(
            `Student with DNI "${updateStudentDto.dni}" already exists`,
          );
        }
      }

      Object.assign(student, updateStudentDto);
      const updatedStudent = await this.studentsRepository.save(student);

      this.logger.log(
        `Student updated successfully: ${updatedStudent.nombre} (ID: ${updatedStudent.id})`,
      );

      return this.toResponseDto(updatedStudent);
    } catch (error) {
      this.logger.error(
        `Error updating student ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async removeAll(): Promise<void> {
    try {
      this.logger.log('Removing all students');
      await this.studentsRepository.delete({});
      this.logger.log('All students removed successfully');
    } catch (error) {
      this.logger.error(
        `Error removing all students: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      this.logger.log(`Removing student with ID: ${id}`);

      const student = await this.studentsRepository.findOne({
        where: { id },
      });

      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }

      await this.studentsRepository.remove(student);

      this.logger.log(
        `Student removed successfully: ${student.nombre} (ID: ${id})`,
      );
    } catch (error) {
      this.logger.error(
        `Error removing student ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private toResponseDto(student: StudentsTypeOrmEntity): StudentResponseDto {
    return {
      id: student.id,
      nombre: student.nombre,
      dni: student.dni,
      fechaNacimiento: student.fechaNacimiento,
      edad: student.edad,
      distrito: student.distrito,
      celularAlumno: student.celularAlumno,
      celularApoderado: student.celularApoderado,
      correo: student.correo,
      active: student.active,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    };
  }
}
