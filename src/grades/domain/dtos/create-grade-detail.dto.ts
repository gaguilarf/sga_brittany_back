import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsNumber,
} from 'class-validator';

export class CreateGradeDetailDto {
  @ApiProperty({ description: 'Grade ID', example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  gradeId: string;

  @ApiProperty({ example: 18, required: false })
  @IsInt()
  @IsOptional()
  homework?: number;

  @ApiProperty({ example: 18, required: false })
  @IsInt()
  @IsOptional()
  oralProduction?: number;

  @ApiProperty({ example: 18, required: false })
  @IsInt()
  @IsOptional()
  writtenProject?: number;

  @ApiProperty({ example: 18, required: false })
  @IsInt()
  @IsOptional()
  midtermExam?: number;

  @ApiProperty({ example: 18, required: false })
  @IsInt()
  @IsOptional()
  firstOral?: number;

  @ApiProperty({ example: 18, required: false })
  @IsInt()
  @IsOptional()
  finalWritten?: number;

  @ApiProperty({ example: 18, required: false })
  @IsInt()
  @IsOptional()
  finalOral?: number;

  @ApiProperty({ example: 18, required: false })
  @IsInt()
  @IsOptional()
  participation?: number;

  @ApiProperty({ example: 18, required: false })
  @IsInt()
  @IsOptional()
  quiz?: number;

  @ApiProperty({ example: 18, required: false })
  @IsInt()
  @IsOptional()
  projectPresentation?: number;
}
