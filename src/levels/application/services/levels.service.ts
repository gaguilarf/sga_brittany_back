import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LevelsTypeOrmEntity } from '../../infrastructure/persistence/typeorm/levels.typeorm-entity';
import { CyclesTypeOrmEntity } from '../../infrastructure/persistence/typeorm/cycles.typeorm-entity';
import {
  LevelResponseDto,
  CycleResponseDto,
} from '../../domain/dtos/level-response.dto';

@Injectable()
export class LevelsService {
  constructor(
    @InjectRepository(LevelsTypeOrmEntity)
    private readonly levelsRepository: Repository<LevelsTypeOrmEntity>,
    @InjectRepository(CyclesTypeOrmEntity)
    private readonly cyclesRepository: Repository<CyclesTypeOrmEntity>,
  ) {}

  async findLevelsByPlan(planId: string): Promise<LevelResponseDto[]> {
    const levels = await this.levelsRepository.find({
      where: { planId, active: true },
    });
    return levels.map((l) => ({
      id: l.id,
      planId: l.planId,
      nombreNivel: l.nombreNivel,
      active: l.active,
    }));
  }

  async findCyclesByLevel(levelId: string): Promise<CycleResponseDto[]> {
    const cycles = await this.cyclesRepository.find({
      where: { levelId, active: true },
    });
    return cycles.map((c) => ({
      id: c.id,
      levelId: c.levelId,
      nombreCiclo: c.nombreCiclo,
      active: c.active,
    }));
  }
}
