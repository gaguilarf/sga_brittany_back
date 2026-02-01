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
import { GradesService } from '../../application/services/grades.service';
import { CreateGradeDto } from '../../domain/dtos/create-grade.dto';
import { UpdateGradeDto } from '../../domain/dtos/update-grade.dto';
import { CreateGradeDetailDto } from '../../domain/dtos/create-grade-detail.dto';
import { GradeResponseDto } from '../../domain/dtos/grade-response.dto';
import { GradeDetailResponseDto } from '../../domain/dtos/grade-detail-response.dto';
import { JwtAuthGuard } from '../../../authentication/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../authentication/infrastructure/guards/roles.guard';
import { Roles } from '../../../authentication/infrastructure/decorators/roles.decorator';

@ApiTags('Grades')
@Controller('grades')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiCookieAuth()
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post()
  @Roles(1, 2, 4) // Admin, Teacher, Secretary
  @ApiOperation({ summary: 'Create a new grade record' })
  @ApiResponse({ status: 201, type: GradeResponseDto })
  async create(
    @Body() createGradeDto: CreateGradeDto,
  ): Promise<GradeResponseDto> {
    return this.gradesService.create(createGradeDto);
  }

  @Get()
  @Roles(1, 2, 3, 4)
  @ApiOperation({ summary: 'Get all grade records' })
  @ApiResponse({ status: 200, type: [GradeResponseDto] })
  async findAll(): Promise<GradeResponseDto[]> {
    return this.gradesService.findAll();
  }

  @Get(':id')
  @Roles(1, 2, 3, 4)
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: GradeResponseDto })
  async findOne(@Param('id') id: string): Promise<GradeResponseDto> {
    return this.gradesService.findOne(id);
  }

  @Patch(':id')
  @Roles(1, 2, 4)
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: GradeResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateGradeDto: UpdateGradeDto,
  ): Promise<GradeResponseDto> {
    return this.gradesService.update(id, updateGradeDto);
  }

  @Delete(':id')
  @Roles(1)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', type: String })
  async remove(@Param('id') id: string): Promise<void> {
    return this.gradesService.remove(id);
  }

  @Post('details')
  @Roles(1, 2, 4)
  @ApiOperation({ summary: 'Add a detail (score per section) to a grade' })
  @ApiResponse({ status: 201, type: GradeDetailResponseDto })
  async addDetail(
    @Body() createDetailDto: CreateGradeDetailDto,
  ): Promise<GradeDetailResponseDto> {
    return this.gradesService.addDetail(createDetailDto);
  }
}
