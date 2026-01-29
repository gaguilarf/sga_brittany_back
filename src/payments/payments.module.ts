import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsTypeOrmEntity } from './infrastructure/persistence/typeorm/payments.typeorm-entity';
import { PagoAdelantadoDetalleTypeOrmEntity } from './infrastructure/persistence/typeorm/pago-adelantado-detalle.typeorm-entity';
import { PaymentsService } from './application/services/payments.service';
import { PaymentsController } from './presentation/controllers/payments.controller';
import { DebtsModule } from '../debts/debts.module';
import { EnrollmentsModule } from '../enrollments/enrollments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentsTypeOrmEntity,
      PagoAdelantadoDetalleTypeOrmEntity,
    ]),
    DebtsModule,
    forwardRef(() => EnrollmentsModule),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
