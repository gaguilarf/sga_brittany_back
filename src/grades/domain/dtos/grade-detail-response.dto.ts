import { ApiProperty } from '@nestjs/swagger';

export class GradeDetailResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'uuid' })
  gradeId: string;

  @ApiProperty({ example: 18, required: false })
  homework?: number;

  @ApiProperty({ example: 18, required: false })
  oralProduction?: number;

  @ApiProperty({ example: 18, required: false })
  writtenProject?: number;

  @ApiProperty({ example: 18, required: false })
  midtermExam?: number;

  @ApiProperty({ example: 18, required: false })
  firstOral?: number;

  @ApiProperty({ example: 18, required: false })
  finalWritten?: number;

  @ApiProperty({ example: 18, required: false })
  finalOral?: number;

  @ApiProperty({ example: 18, required: false })
  participation?: number;

  @ApiProperty({ example: 18, required: false })
  quiz?: number;

  @ApiProperty({ example: 18, required: false })
  projectPresentation?: number;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
