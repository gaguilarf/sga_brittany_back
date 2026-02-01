import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { LevelsService } from '../../application/services/levels.service';
import {
  LevelResponseDto,
  CycleResponseDto,
} from '../../domain/dtos/level-response.dto';

@ApiTags('Levels')
@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener niveles filtrados por plan' })
  @ApiQuery({ name: 'planId', required: true, type: String })
  async getLevelsByPlan(
    @Query('planId') planId: string,
  ): Promise<LevelResponseDto[]> {
    return this.levelsService.findLevelsByPlan(planId);
  }

  @Get('cycles')
  @ApiOperation({ summary: 'Obtener ciclos filtrados por nivel' })
  @ApiQuery({ name: 'levelId', required: true, type: String })
  async getCyclesByLevel(
    @Query('levelId') levelId: string,
  ): Promise<CycleResponseDto[]> {
    return this.levelsService.findCyclesByLevel(levelId);
  }
}
