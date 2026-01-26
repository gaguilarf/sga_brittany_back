import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtTypeOrmEntity } from './infrastructure/persistence/typeorm/debts.typeorm-entity';
import { DebtsService } from './application/services/debts.service';
import { DebtsController } from './presentation/controllers/debts.controller';
import { EnrollmentsModule } from '../enrollments/enrollments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DebtTypeOrmEntity]),
    forwardRef(() => EnrollmentsModule),
  ],
  controllers: [DebtsController],
  providers: [DebtsService],
  exports: [DebtsService],
})
export class DebtsModule {}
