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
import { EnrollmentsService } from '../../application/services/enrollments.service';
import { CreateEnrollmentDto } from '../../domain/dtos/create-enrollment.dto';
import { UpdateEnrollmentDto } from '../../domain/dtos/update-enrollment.dto';
import { EnrollmentResponseDto } from '../../domain/dtos/enrollment-response.dto';
import { MonthlyDebtsService } from '../../application/services/monthly-debts.service';
import { AccountStatementService } from '../../application/services/account-statement.service';
import { JwtAuthGuard } from '../../../authentication/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../authentication/infrastructure/guards/roles.guard';
import { Roles } from '../../../authentication/infrastructure/decorators/roles.decorator';

@ApiTags('Enrollments')
@Controller('enrollments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiCookieAuth()
export class EnrollmentsController {
  constructor(
    private readonly enrollmentsService: EnrollmentsService,
    private readonly monthlyDebtsService: MonthlyDebtsService,
    private readonly accountStatementService: AccountStatementService,
  ) {}

  @Get(':id/account-statement')
  @Roles(1, 2, 3, 4) // All roles
  @ApiOperation({ summary: 'Get student account statement' })
  @ApiParam({ name: 'id', description: 'Enrollment ID', type: String })
  async getAccountStatement(@Param('id') id: string) {
    return this.accountStatementService.getAccountStatement(id);
  }

  @Post('monthly-debts/:yearMonth')
  @Roles(1) // Solo Administrador
  @ApiOperation({
    summary: 'Generate monthly debts for all active enrollments',
  })
  @ApiParam({
    name: 'yearMonth',
    description: 'Format YYYY-MM',
    example: '2026-02',
  })
  async generateMonthlyDebts(
    @Param('yearMonth') yearMonth: string,
  ): Promise<{ processed: number; failures: number }> {
    return this.monthlyDebtsService.generateMonthlyDebts(yearMonth);
  }

  @Post()
  @Roles(1, 4) // Administrador, Secretaria
  @ApiOperation({ summary: 'Create a new enrollment' })
  @ApiResponse({
    status: 201,
    description: 'Enrollment created successfully',
    type: EnrollmentResponseDto,
  })
  async create(
    @Body() createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<EnrollmentResponseDto> {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  @Get()
  @Roles(1, 2, 3, 4) // All roles
  @ApiOperation({ summary: 'Get all enrollments' })
  @ApiResponse({
    status: 200,
    description: 'List of all enrollments',
    type: [EnrollmentResponseDto],
  })
  async findAll(): Promise<EnrollmentResponseDto[]> {
    return this.enrollmentsService.findAll();
  }

  @Get(':id')
  @Roles(1, 2, 3, 4) // All roles
  @ApiOperation({ summary: 'Get enrollment by ID' })
  @ApiParam({ name: 'id', description: 'Enrollment ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Enrollment found',
    type: EnrollmentResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<EnrollmentResponseDto> {
    return this.enrollmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(1, 4) // Administrador, Secretaria
  @ApiOperation({ summary: 'Update enrollment by ID' })
  @ApiParam({ name: 'id', description: 'Enrollment ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Enrollment updated successfully',
    type: EnrollmentResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
  ): Promise<EnrollmentResponseDto> {
    return this.enrollmentsService.update(id, updateEnrollmentDto);
  }

  @Delete('all')
  @Roles(1) // Only Administrador
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete all enrollments' })
  @ApiResponse({
    status: 204,
    description: 'All enrollments deleted successfully',
  })
  async removeAll(): Promise<void> {
    return this.enrollmentsService.removeAll();
  }

  @Delete(':id')
  @Roles(1) // Only Administrador
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete enrollment by ID' })
  @ApiParam({ name: 'id', description: 'Enrollment ID', type: String })
  @ApiResponse({ status: 204, description: 'Enrollment deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.enrollmentsService.remove(id);
  }
}
