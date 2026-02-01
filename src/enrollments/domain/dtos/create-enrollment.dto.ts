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
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ description: 'Campus ID', example: 1 })
  @IsString()
  @IsNotEmpty()
  campusId: string;

  @ApiProperty({ description: 'Plan ID', example: 1, required: false })
  @IsString()
  @IsOptional()
  planId?: string;

  @ApiProperty({ description: 'Course ID', example: 1, required: false })
  @IsString()
  @IsOptional()
  courseId?: string;

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
  @IsString()
  @IsOptional()
  groupId?: string;

  @ApiProperty({ description: 'Initial Level ID', example: 1, required: false })
  @IsString()
  @IsOptional()
  initialLevelId?: string;

  @ApiProperty({ description: 'Initial Cycle ID', example: 1, required: false })
  @IsString()
  @IsOptional()
  initialCycleId?: string;

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
  @IsString()
  @IsNotEmpty()
  advisorId: string;

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
  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsDateString()
  examDate?: string;

  @ApiProperty({
    description: 'Monto del pago inicial',
    example: 100,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  montoPago?: number;

  @ApiProperty({
    description: 'Método del pago inicial',
    example: 'Efectivo',
    required: false,
  })
  @IsString()
  @IsOptional()
  metodoPago?: string;

  @ApiProperty({
    description: 'Tipo del pago inicial',
    example: 'INSCRIPCION',
    required: false,
  })
  @IsString()
  @IsOptional()
  tipoPago?: string;
}
