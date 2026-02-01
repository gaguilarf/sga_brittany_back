import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelsTypeOrmEntity } from './infrastructure/persistence/typeorm/levels.typeorm-entity';
import { CyclesTypeOrmEntity } from './infrastructure/persistence/typeorm/cycles.typeorm-entity';
import { LevelsController } from './presentation/controllers/levels.controller';
import { LevelsService } from './application/services/levels.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LevelsTypeOrmEntity, CyclesTypeOrmEntity]),
  ],
  controllers: [LevelsController],
  providers: [LevelsService],
  exports: [LevelsService],
})
export class LevelsModule {}
