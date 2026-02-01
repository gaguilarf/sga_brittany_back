import { ApiProperty } from '@nestjs/swagger';

export class StudentResponseDto {
  @ApiProperty({
    description: 'Student ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Student full name',
    example: 'Juan Carlos Pérez García',
  })
  nombre: string;

  @ApiProperty({
    description: 'Student DNI',
    example: '12345678',
    required: false,
  })
  dni?: string;

  @ApiProperty({
    description: 'Birth date',
    example: '2005-03-15',
    required: false,
  })
  fechaNacimiento?: Date;

  @ApiProperty({ description: 'Age', example: 18, required: false })
  edad?: number;

  @ApiProperty({
    description: 'District',
    example: 'San Isidro',
    required: false,
  })
  distrito?: string;

  @ApiProperty({
    description: 'Student phone',
    example: '+51987654321',
    required: false,
  })
  celularAlumno?: string;

  @ApiProperty({
    description: 'Guardian phone',
    example: '+51987654322',
    required: false,
  })
  celularApoderado?: string;

  @ApiProperty({
    description: 'Email',
    example: 'juan.perez@example.com',
    required: false,
  })
  correo?: string;

  @ApiProperty({ description: 'Active status', example: true })
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
