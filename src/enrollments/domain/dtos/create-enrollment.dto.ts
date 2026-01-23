import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';

export class CreateEnrollmentDto {
  @ApiProperty({ description: 'Student ID', example: 1 })
  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @ApiProperty({ description: 'Campus ID', example: 1 })
  @IsInt()
  @IsNotEmpty()
  campusId: number;

  @ApiProperty({ description: 'Plan ID', example: 1, required: false })
  @IsInt()
  @IsOptional()
  planId?: number;

  @ApiProperty({ description: 'Course ID', example: 1, required: false })
  @IsInt()
  @IsOptional()
  courseId?: number;

  @ApiProperty({
    description: 'Modality',
    example: 'Presencial',
    maxLength: 100,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  modalidad?: string;

  @ApiProperty({
    description: 'Schedule',
    example: 'Lunes-Miércoles-Viernes 08:00-10:00',
    maxLength: 255,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  horario?: string;

  @ApiProperty({ description: 'Group ID', example: 1, required: false })
  @IsInt()
  @IsOptional()
  groupId?: number;

  @ApiProperty({ description: 'Initial Level ID', example: 1, required: false })
  @IsInt()
  @IsOptional()
  initialLevelId?: number;

  @ApiProperty({ description: 'Initial Cycle ID', example: 1, required: false })
  @IsInt()
  @IsOptional()
  initialCycleId?: number;

  @ApiProperty({
    description: 'Enrollment type',
    example: 'Nueva',
    maxLength: 100,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  tipoInscripcion?: string;

  @ApiProperty({ description: 'Advisor ID', example: 1 })
  @IsInt()
  @IsNotEmpty()
  advisorId: number;

  @ApiProperty({
    description: 'Origin',
    example: 'Facebook',
    maxLength: 100,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  origen?: string;

  @ApiProperty({
    description: 'Receipt number',
    example: 'B001-00123',
    maxLength: 50,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  numeroBoleta?: string;

  @ApiProperty({ description: 'Balance', example: 0, required: false })
  @IsNumber()
  @IsOptional()
  saldo?: number;

  @ApiProperty({
    example: 'PLAN',
    enum: ['PLAN', 'PRODUCT'],
    description: 'Tipo de matrícula',
    required: false,
  })
  @IsOptional()
  @IsEnum(['PLAN', 'PRODUCT'])
  enrollmentType?: string;

  @ApiProperty({
    example: 1,
    description: 'ID del producto (solo para enrollmentType=PRODUCT)',
    required: false,
  })
  @IsOptional()
  @IsInt()
  productId?: number;

  @ApiProperty({
    example: '2026-02-15',
    description: 'Fecha de examen (solo para productos que lo requieran)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  examDate?: string;
}
