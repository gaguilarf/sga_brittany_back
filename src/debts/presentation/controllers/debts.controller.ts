import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiParam,
} from '@nestjs/swagger';
import { DebtsService } from '../../application/services/debts.service';
// DTOs
import { CreateDebtDto, DebtResponseDto } from '../../domain/dtos';
import { JwtAuthGuard } from '../../../authentication/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../authentication/infrastructure/guards/roles.guard';
import { Roles } from '../../../authentication/infrastructure/decorators/roles.decorator';

@ApiTags('Debts')
@Controller('debts')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiCookieAuth()
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Post()
  @Roles(1, 4) // Administrador, Secretaria
  @ApiOperation({ summary: 'Create a manual debt' })
  @ApiResponse({
    status: 201,
    description: 'Debt created successfully',
    type: DebtResponseDto,
  })
  async create(@Body() createDebtDto: CreateDebtDto): Promise<DebtResponseDto> {
    const debt = await this.debtsService.createDebt({
      ...createDebtDto,
      fechaVencimiento: new Date(createDebtDto.fechaVencimiento),
    } as any);
    return this.toResponseDto(debt);
  }

  @Get('enrollment/:enrollmentId')
  @Roles(1, 2, 3, 4)
  @ApiOperation({ summary: 'Get all pending debts for an enrollment' })
  @ApiParam({ name: 'enrollmentId', type: String })
  async findPendingByEnrollment(
    @Param('enrollmentId') enrollmentId: string,
  ): Promise<DebtResponseDto[]> {
    const debts =
      await this.debtsService.getPendingDebtsByEnrollment(enrollmentId);
    return debts.map((d) => this.toResponseDto(d));
  }

  @Get(':id')
  @Roles(1, 2, 3, 4)
  @ApiOperation({ summary: 'Get debt by ID' })
  async findOne(@Param('id') id: string): Promise<DebtResponseDto> {
    const debt = await this.debtsService.findOne(id);
    if (!debt) throw new Error('Deuda no encontrada');
    return this.toResponseDto(debt);
  }

  @Delete(':id')
  @Roles(1) // Solo Administrador
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a debt by ID' })
  @ApiParam({ name: 'id', type: String })
  async remove(@Param('id') id: string): Promise<void> {
    await this.debtsService.remove(id);
  }

  private toResponseDto(entity: any): DebtResponseDto {
    return {
      id: entity.id,
      enrollmentId: entity.enrollmentId,
      tipoDeuda: entity.tipoDeuda,
      concepto: entity.concepto,
      monto: Number(entity.monto),
      fechaVencimiento: entity.fechaVencimiento,
      mesAplicado: entity.mesAplicado,
      estado: entity.estado,
      active: entity.active,
      createdAt: entity.createdAt,
    };
  }
}
