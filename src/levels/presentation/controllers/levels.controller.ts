import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { LevelsService } from '../../application/services/levels.service';
import {
  CourseResponseDto,
  LevelResponseDto,
  CycleResponseDto,
} from '../../domain/dtos/level-response.dto';

@ApiTags('Levels')
@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Get('courses')
  @ApiOperation({ summary: 'Obtener todos los cursos activos' })
  async getCourses(): Promise<CourseResponseDto[]> {
    return this.levelsService.findAllCourses();
  }

  @Get()
  @ApiOperation({ summary: 'Obtener niveles filtrados por curso' })
  @ApiQuery({ name: 'courseId', required: true, type: Number })
  async getLevelsByCourse(
    @Query('courseId') courseId: number,
  ): Promise<LevelResponseDto[]> {
    return this.levelsService.findLevelsByCourse(Number(courseId));
  }

  @Get('cycles')
  @ApiOperation({ summary: 'Obtener ciclos filtrados por nivel' })
  @ApiQuery({ name: 'levelId', required: true, type: Number })
  async getCyclesByLevel(
    @Query('levelId') levelId: number,
  ): Promise<CycleResponseDto[]> {
    return this.levelsService.findCyclesByLevel(Number(levelId));
  }
}
