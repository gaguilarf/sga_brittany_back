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
import { PlansService } from '../../application/services/plans.service';
import { CreatePlanDto } from '../../domain/dtos/create-plan.dto';
import { UpdatePlanDto } from '../../domain/dtos/update-plan.dto';
import { PlanResponseDto } from '../../domain/dtos/plan-response.dto';
import { JwtAuthGuard } from '../../../authentication/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../authentication/infrastructure/guards/roles.guard';
import { Roles } from '../../../authentication/infrastructure/decorators/roles.decorator';

@ApiTags('Plans')
@Controller('plans')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiCookieAuth()
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  @Roles(1, 4) // Administrador, Secretaria
  @ApiOperation({ summary: 'Create a new plan' })
  @ApiResponse({
    status: 201,
    description: 'Plan created successfully',
    type: PlanResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({ status: 409, description: 'Conflict - Plan already exists' })
  async create(@Body() createPlanDto: CreatePlanDto): Promise<PlanResponseDto> {
    return this.plansService.create(createPlanDto);
  }

  @Get()
  @Roles(1, 2, 3, 4) // All roles can view
  @ApiOperation({ summary: 'Get all plans' })
  @ApiResponse({
    status: 200,
    description: 'List of all plans',
    type: [PlanResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(): Promise<PlanResponseDto[]> {
    return this.plansService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active plans' })
  @ApiResponse({
    status: 200,
    description: 'List of active plans',
    type: [PlanResponseDto],
  })
  async findActive(): Promise<PlanResponseDto[]> {
    return this.plansService.findActive();
  }

  @Get(':id')
  @Roles(1, 2, 3, 4) // All roles can view
  @ApiOperation({ summary: 'Get plan by ID' })
  @ApiParam({ name: 'id', description: 'Plan ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Plan found',
    type: PlanResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PlanResponseDto> {
    return this.plansService.findOne(id);
  }

  @Patch(':id')
  @Roles(1) // Only Administrador
  @ApiOperation({ summary: 'Update plan by ID' })
  @ApiParam({ name: 'id', description: 'Plan ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Plan updated successfully',
    type: PlanResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Plan name already exists',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlanDto: UpdatePlanDto,
  ): Promise<PlanResponseDto> {
    return this.plansService.update(id, updatePlanDto);
  }

  @Delete(':id')
  @Roles(1) // Only Administrador
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete plan by ID' })
  @ApiParam({ name: 'id', description: 'Plan ID', type: Number })
  @ApiResponse({ status: 204, description: 'Plan deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only administrators can delete',
  })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.plansService.remove(id);
  }
}
