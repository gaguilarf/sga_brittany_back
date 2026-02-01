import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';

export class CreateDebtDto {
  @ApiProperty({ description: 'ID de la matrícula asociada' })
  @IsNotEmpty()
  @IsNotEmpty()
  @IsString()
  enrollmentId: string;

  @ApiProperty({
    description: 'Tipo de deuda',
    enum: [
      'MENSUALIDAD',
      'INSCRIPCION',
      'MATERIALES',
      'PRODUCTO',
      'SERVICIO',
      'OTROS',
    ],
  })
  @IsNotEmpty()
  @IsEnum([
    'MENSUALIDAD',
    'INSCRIPCION',
    'MATERIALES',
    'PRODUCTO',
    'SERVICIO',
    'OTROS',
  ])
  tipoDeuda: string;

  @ApiProperty({ description: 'ID del producto si aplica', required: false })
  @IsOptional()
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiProperty({ description: 'Concepto de la deuda' })
  @IsNotEmpty()
  @IsString()
  concepto: string;

  @ApiProperty({ description: 'Descripción detallada', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ description: 'Monto de la deuda' })
  @IsNotEmpty()
  @IsNumber()
  monto: number;

  @ApiProperty({ description: 'Fecha de vencimiento (YYYY-MM-DD)' })
  @IsNotEmpty()
  @IsDateString()
  fechaVencimiento: string;

  @ApiProperty({ description: 'Mes aplicado (YYYY-MM)', required: false })
  @IsOptional()
  @IsString()
  mesAplicado?: string;

  @ApiProperty({ description: 'ID del ciclo asociado', required: false })
  @IsOptional()
  @IsOptional()
  @IsString()
  cicloAsociadoId?: string;

  @ApiProperty({ description: 'ID del grupo asociado', required: false })
  @IsOptional()
  @IsOptional()
  @IsString()
  grupoAsociadoId?: string;

  @ApiProperty({ description: 'ID del nivel asociado', required: false })
  @IsOptional()
  @IsOptional()
  @IsString()
  nivelAsociadoId?: string;
}
