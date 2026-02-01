import { ApiProperty } from '@nestjs/swagger';

export class AttendanceResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'uuid' })
  studentId: string;

  @ApiProperty({ example: '2024-01-15' })
  fecha: Date;

  @ApiProperty({ example: 'Presente', required: false })
  estado?: string;

  @ApiProperty({ example: 'uuid' })
  teacherId: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
