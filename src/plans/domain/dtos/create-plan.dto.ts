import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength, IsBoolean } from 'class-validator';

export class CreatePlanDto {
    @ApiProperty({
        description: 'Plan name',
        example: 'Plan Básico Mensual',
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ApiProperty({
        description: 'Plan service',
        example: 'Mensual',
        maxLength: 100,
        required: false,
    })
    @IsString()
    @IsOptional()
    @MaxLength(100)
    service?: string;

    @ApiProperty({
        description: 'Plan description',
        example: 'Plan básico con acceso a clases grupales',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Plan active status',
        example: true,
        default: true,
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    active?: boolean;
}
