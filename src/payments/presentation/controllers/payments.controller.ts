import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiParam,
} from '@nestjs/swagger';
import { PaymentsService } from '../../application/services/payments.service';
import { CreatePaymentDto } from '../../domain/dtos/create-payment.dto';
import { UpdatePaymentDto } from '../../domain/dtos/update-payment.dto';
import { PaymentResponseDto } from '../../domain/dtos/payment-response.dto';
import { JwtAuthGuard } from '../../../authentication/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../authentication/infrastructure/guards/roles.guard';
import { Roles } from '../../../authentication/infrastructure/decorators/roles.decorator';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiCookieAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles(1, 4) // Administrador, Secretaria
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({
    status: 201,
    description: 'Payment created successfully',
    type: PaymentResponseDto,
  })
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentResponseDto> {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @Roles(1, 2, 3, 4) // All roles
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({
    status: 200,
    description: 'List of all payments',
    type: [PaymentResponseDto],
  })
  async findAll(): Promise<PaymentResponseDto[]> {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  @Roles(1, 2, 3, 4) // All roles
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiParam({ name: 'id', description: 'Payment ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Payment found',
    type: PaymentResponseDto,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PaymentResponseDto> {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(1, 4) // Administrador, Secretaria
  @ApiOperation({ summary: 'Update payment by ID' })
  @ApiParam({ name: 'id', description: 'Payment ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Payment updated successfully',
    type: PaymentResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<PaymentResponseDto> {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Get(':id/prepayment-details')
  @Roles(1, 2, 3, 4) // All roles
  @ApiOperation({ summary: 'Get prepayment details by payment ID' })
  @ApiParam({ name: 'id', description: 'Payment ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Prepayment details found',
  })
  async getPrepaymentDetails(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.getPrepaymentDetails(id);
  }

  @Delete(':id')
  @Roles(1) // Only Administrador
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete payment by ID' })
  @ApiParam({ name: 'id', description: 'Payment ID', type: Number })
  @ApiResponse({ status: 204, description: 'Payment deleted successfully' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.paymentsService.remove(id);
  }
}
