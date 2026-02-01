import { ApiProperty } from '@nestjs/swagger';

export class EnrollmentResponseDto {
  @ApiProperty({
    description: 'Enrollment ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Student ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  studentId: string;

  @ApiProperty({
    description: 'Campus ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  campusId: string;

  @ApiProperty({
    description: 'Plan ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  planId: string;

  @ApiProperty({
    description: 'Course ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  courseId?: string;

  @ApiProperty({
    description: 'Modality',
    example: 'Presencial',
    required: false,
  })
  modalidad?: string;

  @ApiProperty({
    description: 'Schedule',
    example: 'Lunes-Miércoles-Viernes 08:00-10:00',
    required: false,
  })
  horario?: string;

  @ApiProperty({
    description: 'Group ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  groupId?: string;

  @ApiProperty({
    description: 'Initial Level ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  initialLevelId?: string;

  @ApiProperty({
    description: 'Initial Cycle ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  initialCycleId?: string;

  @ApiProperty({
    description: 'Enrollment Type',
    example: 'PLAN',
    enum: ['PLAN', 'PRODUCT'],
  })
  enrollmentType: string;

  @ApiProperty({
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  productId?: string;

  @ApiProperty({
    description: 'Exam Date',
    example: '2026-02-15',
    required: false,
  })
  examDate?: Date;

  @ApiProperty({
    description: 'Enrollment type',
    example: 'Nueva',
    required: false,
  })
  tipoInscripcion?: string;

  @ApiProperty({
    description: 'Advisor ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  advisorId: string;

  @ApiProperty({ description: 'Origin', example: 'Facebook', required: false })
  origen?: string;

  @ApiProperty({
    description: 'Receipt number',
    example: 'B001-00123',
    required: false,
  })
  numeroBoleta?: string;

  @ApiProperty({ description: 'Balance', example: 0 })
  saldo: number;

  @ApiProperty({ description: 'Saldo a favor (Prepagos)', example: 0 })
  saldoFavor: number;

  @ApiProperty({ description: 'Active status', example: true })
  active: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
