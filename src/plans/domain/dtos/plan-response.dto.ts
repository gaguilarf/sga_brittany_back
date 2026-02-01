import { ApiProperty } from '@nestjs/swagger';

export class PlanResponseDto {
  @ApiProperty({
    description: 'Plan ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Plan name',
    example: 'Plan Básico Mensual',
  })
  name: string;

  @ApiProperty({
    description: 'Plan service',
    example: 'Mensual',
    required: false,
  })
  service?: string;

  @ApiProperty({
    description: 'Plan description',
    example: 'Plan básico con acceso a clases grupales',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Plan active status',
    example: true,
  })
  active: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;
}
