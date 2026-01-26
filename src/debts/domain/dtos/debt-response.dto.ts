import { ApiProperty } from '@nestjs/swagger';

export class DebtResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  enrollmentId: number;

  @ApiProperty()
  tipoDeuda: string;

  @ApiProperty()
  concepto: string;

  @ApiProperty()
  monto: number;

  @ApiProperty()
  fechaVencimiento: Date;

  @ApiProperty({ required: false })
  mesAplicado?: string;

  @ApiProperty()
  estado: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  createdAt: Date;
}
