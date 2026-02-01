import { ApiProperty } from '@nestjs/swagger';

export class PaymentResponseDto {
  @ApiProperty({
    description: 'Payment ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Enrollment ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  enrollmentId: string;

  @ApiProperty({
    description: 'Payment type',
    example: 'Mensualidad',
    required: false,
  })
  tipo?: string;

  @ApiProperty({
    description: 'Payment method',
    example: 'Efectivo',
    required: false,
  })
  metodo?: string;

  @ApiProperty({ description: 'Amount', example: 150.0 })
  monto: number;

  @ApiProperty({
    description: 'Receipt number',
    example: 'B001-000456',
    required: false,
  })
  numeroBoleta?: string;

  @ApiProperty({
    description: 'Payment date',
    example: '2024-01-15T10:30:00Z',
    required: false,
  })
  fechaPago?: Date;

  @ApiProperty({
    description: 'Campus ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  campusId?: string;

  @ApiProperty({ description: 'Active status', example: true })
  active: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
