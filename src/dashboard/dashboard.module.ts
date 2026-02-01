import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './presentation/controllers/dashboard.controller';
import { DashboardService } from './application/services/dashboard.service';
import { EnrollmentsTypeOrmEntity } from '../enrollments/infrastructure/persistence/typeorm/enrollments.typeorm-entity';
import { LeadEntity } from './../leads/infrastructure/persistence/typeorm/entities/lead.typeorm-entity';
import { PaymentsTypeOrmEntity } from '../payments/infrastructure/persistence/typeorm/payments.typeorm-entity';
import { StudentsTypeOrmEntity } from '../students/infrastructure/persistence/typeorm/students.typeorm-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EnrollmentsTypeOrmEntity,
      LeadEntity,
      PaymentsTypeOrmEntity,
      StudentsTypeOrmEntity,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
