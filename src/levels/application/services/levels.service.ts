import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoursesTypeOrmEntity } from '../../infrastructure/persistence/typeorm/courses.typeorm-entity';
import { LevelsTypeOrmEntity } from '../../infrastructure/persistence/typeorm/levels.typeorm-entity';
import { CyclesTypeOrmEntity } from '../../infrastructure/persistence/typeorm/cycles.typeorm-entity';
import {
  CourseResponseDto,
  LevelResponseDto,
  CycleResponseDto,
} from '../../domain/dtos/level-response.dto';

@Injectable()
export class LevelsService {
  constructor(
    @InjectRepository(CoursesTypeOrmEntity)
    private readonly coursesRepository: Repository<CoursesTypeOrmEntity>,
    @InjectRepository(LevelsTypeOrmEntity)
    private readonly levelsRepository: Repository<LevelsTypeOrmEntity>,
    @InjectRepository(CyclesTypeOrmEntity)
    private readonly cyclesRepository: Repository<CyclesTypeOrmEntity>,
  ) {}

  async findAllCourses(): Promise<CourseResponseDto[]> {
    const courses = await this.coursesRepository.find({
      where: { active: true },
    });
    return courses.map((c) => ({
      id: c.id,
      name: c.name,
      active: c.active,
    }));
  }

  async findLevelsByCourse(courseId: number): Promise<LevelResponseDto[]> {
    const levels = await this.levelsRepository.find({
      where: { courseId, active: true },
    });
    return levels.map((l) => ({
      id: l.id,
      courseId: l.courseId,
      nombreNivel: l.nombreNivel,
      active: l.active,
    }));
  }

  async findCyclesByLevel(levelId: number): Promise<CycleResponseDto[]> {
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
