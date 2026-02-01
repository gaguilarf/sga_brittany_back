import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsNumber,
} from 'class-validator';

export class CreateGradeDto {
  @ApiProperty({ description: 'Student ID', example: 1 })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ description: 'Group ID', example: 1 })
  @IsString()
  @IsNotEmpty()
  groupId: string;

  @ApiProperty({ description: 'Cycle ID', example: 1 })
  @IsString()
  @IsNotEmpty()
  cycleId: string;

  @ApiProperty({ description: 'Month (mes)', example: 1, required: false })
  @IsInt()
  @IsOptional()
  mes?: number;

  @ApiProperty({ description: 'Year (año)', example: 2024, required: false })
  @IsInt()
  @IsOptional()
  año?: number;

  @ApiProperty({ description: 'Final grade', example: 17.5, required: false })
  @IsNumber()
  @IsOptional()
  notaFinal?: number;

  @ApiProperty({ description: 'Teacher ID', example: 1 })
  @IsString()
  @IsNotEmpty()
  teacherId: string;

  @ApiProperty({
    description: 'Observations',
    example: 'Buen desempeño',
    required: false,
  })
  @IsString()
  @IsOptional()
  observaciones?: string;
}
