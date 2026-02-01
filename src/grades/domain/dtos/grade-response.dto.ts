import { ApiProperty } from '@nestjs/swagger';
import { GradeDetailResponseDto } from './grade-detail-response.dto';

export class GradeResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'uuid' })
  studentId: string;

  @ApiProperty({ example: 'uuid' })
  groupId: string;

  @ApiProperty({ example: 'uuid' })
  cycleId: string;

  @ApiProperty({ example: 1, required: false })
  mes?: number;

  @ApiProperty({ example: 2024, required: false })
  año?: number;

  @ApiProperty({ example: 17.5, required: false })
  notaFinal?: number;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [GradeDetailResponseDto], required: false })
  details?: GradeDetailResponseDto[];

  @ApiProperty({ example: 'uuid' })
  teacherId: string;

  @ApiProperty({ example: 'Buen desempeño', required: false })
  observaciones?: string;
}
