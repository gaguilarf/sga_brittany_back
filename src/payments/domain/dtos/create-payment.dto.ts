import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, IsNumber, IsDateString } from 'class-validator';

export class CreatePaymentDto {
    @ApiProperty({ description: 'Enrollment ID', example: 1 })
    @IsInt()
    @IsNotEmpty()
    enrollmentId: number;

    @ApiProperty({ description: 'Payment type', example: 'Mensualidad', maxLength: 100, required: false })
    @IsString()
    @IsOptional()
    @MaxLength(100)
    tipo?: string;

    @ApiProperty({ description: 'Payment method', example: 'Efectivo', maxLength: 100, required: false })
    @IsString()
    @IsOptional()
    @MaxLength(100)
    metodo?: string;

    @ApiProperty({ description: 'Amount', example: 150.00 })
    @IsNumber()
    @IsNotEmpty()
    monto: number;

    @ApiProperty({ description: 'Receipt number', example: 'B001-000456', maxLength: 50, required: false })
    @IsString()
    @IsOptional()
    @MaxLength(50)
    numeroBoleta?: string;

    @ApiProperty({ description: 'Payment date', example: '2024-01-15T10:30:00Z', required: false })
    @IsOptional()
    fechaPago?: string;

    @ApiProperty({ description: 'Campus ID', example: 1, required: false })
    @IsInt()
    @IsOptional()
    campusId?: number;
}
