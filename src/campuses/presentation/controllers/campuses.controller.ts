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
import { CampusesService } from '../../application/services/campuses.service';
import { CreateCampusDto } from '../../domain/dtos/create-campus.dto';
import { UpdateCampusDto } from '../../domain/dtos/update-campus.dto';
import { CampusResponseDto } from '../../domain/dtos/campus-response.dto';
import { JwtAuthGuard } from '../../../authentication/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../authentication/infrastructure/guards/roles.guard';
import { Roles } from '../../../authentication/infrastructure/decorators/roles.decorator';

@ApiTags('Campuses')
@Controller('campuses')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiCookieAuth()
export class CampusesController {
  constructor(private readonly campusesService: CampusesService) {}

  @Post()
  @Roles(1, 4) // Administrador, Secretaria
  @ApiOperation({ summary: 'Create a new campus' })
  @ApiResponse({
    status: 201,
    description: 'Campus created successfully',
    type: CampusResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({ status: 409, description: 'Conflict - Campus already exists' })
  async create(
    @Body() createCampusDto: CreateCampusDto,
  ): Promise<CampusResponseDto> {
    return this.campusesService.create(createCampusDto);
  }

  @Get()
  @Roles(1, 2, 3, 4) // All roles can view
  @ApiOperation({ summary: 'Get all campuses' })
  @ApiResponse({
    status: 200,
    description: 'List of all campuses',
    type: [CampusResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(): Promise<CampusResponseDto[]> {
    return this.campusesService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active campuses' })
  @ApiResponse({
    status: 200,
    description: 'List of active campuses',
    type: [CampusResponseDto],
  })
  async findActive(): Promise<CampusResponseDto[]> {
    return this.campusesService.findActive();
  }

  @Get(':id')
  @Roles(1, 2, 3, 4) // All roles can view
  @ApiOperation({ summary: 'Get campus by ID' })
  @ApiParam({ name: 'id', description: 'Campus ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Campus found',
    type: CampusResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Campus not found' })
  async findOne(@Param('id') id: string): Promise<CampusResponseDto> {
    return this.campusesService.findOne(id);
  }

  @Patch(':id')
  @Roles(1) // Only Administrador
  @ApiOperation({ summary: 'Update campus by ID' })
  @ApiParam({ name: 'id', description: 'Campus ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Campus updated successfully',
    type: CampusResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Campus not found' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Campus name already exists',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCampusDto: UpdateCampusDto,
  ): Promise<CampusResponseDto> {
    return this.campusesService.update(id, updateCampusDto);
  }

  @Delete(':id')
  @Roles(1) // Only Administrador
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete campus by ID' })
  @ApiParam({ name: 'id', description: 'Campus ID', type: String })
  @ApiResponse({ status: 204, description: 'Campus deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only administrators can delete',
  })
  @ApiResponse({ status: 404, description: 'Campus not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.campusesService.remove(id);
  }
}
