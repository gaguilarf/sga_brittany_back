import { ApiProperty } from '@nestjs/swagger';

export class EnrollmentResponseDto {
  @ApiProperty({ description: 'Enrollment ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Student ID', example: 1 })
  studentId: number;

  @ApiProperty({ description: 'Campus ID', example: 1 })
  campusId: number;

  @ApiProperty({ description: 'Plan ID', example: 1 })
  planId: number;

  @ApiProperty({ description: 'Course ID', example: 1, required: false })
  courseId?: number;

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

  @ApiProperty({ description: 'Group ID', example: 1, required: false })
  groupId?: number;

  @ApiProperty({ description: 'Initial Level ID', example: 1, required: false })
  initialLevelId?: number;

  @ApiProperty({ description: 'Initial Cycle ID', example: 1, required: false })
  initialCycleId?: number;

  @ApiProperty({
    description: 'Enrollment Type',
    example: 'PLAN',
    enum: ['PLAN', 'PRODUCT'],
  })
  enrollmentType: string;

  @ApiProperty({ description: 'Product ID', example: 1, required: false })
  productId?: number;

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

  @ApiProperty({ description: 'Advisor ID', example: 1 })
  advisorId: number;

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

  @ApiProperty({ description: 'Active status', example: true })
  active: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
