import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsDateString,
} from 'class-validator';

export class CreateAttendanceDto {
  @ApiProperty({ description: 'Student ID', example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ description: 'Attendance date', example: '2024-01-15' })
  @IsDateString()
  @IsNotEmpty()
  fecha: Date;

  @ApiProperty({
    description: 'Attendance status (Presents, Absent, etc.)',
    example: 'Presente',
    maxLength: 50,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  estado?: string;

  @ApiProperty({ description: 'Teacher (User) ID', example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  teacherId: string;
}
