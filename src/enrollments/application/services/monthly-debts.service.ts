import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { EnrollmentsTypeOrmEntity } from '../../infrastructure/persistence/typeorm/enrollments.typeorm-entity';
import { DebtsService } from '../../../debts/application/services/debts.service';
import { PricesService } from '../../../plans/application/services/prices.service';
import { AccountStatementService } from './account-statement.service';

import { ConsumoTypeOrmEntity } from '../../infrastructure/persistence/typeorm/consumos.typeorm-entity';

@Injectable()
export class MonthlyDebtsService {
  private readonly logger = new Logger(MonthlyDebtsService.name);

  constructor(
    @InjectRepository(EnrollmentsTypeOrmEntity)
    private readonly enrollmentsRepository: Repository<EnrollmentsTypeOrmEntity>,
    @InjectRepository(ConsumoTypeOrmEntity)
    private readonly consumosRepository: Repository<ConsumoTypeOrmEntity>,
    private readonly debtsService: DebtsService,
    private readonly pricesService: PricesService,
    private readonly accountStatementService: AccountStatementService,
  ) {}

  /**
   * Genera las deudas mensuales o consume crédito para todas las matrículas activas de tipo PLAN.
   * @param yearMonth Formato 'YYYY-MM'
   */
  async generateMonthlyDebts(
    yearMonth: string,
  ): Promise<{ processed: number; failures: number }> {
    this.logger.log(
      `Starting monthly debt/consumption generation for: ${yearMonth}`,
    );

    // Obtener todas las matrículas activas de tipo PLAN
    const enrollments = await this.enrollmentsRepository.find({
      where: {
        active: true,
        enrollmentType: 'PLAN',
        estado: 'ACTIVA',
      },
    });

    let processed = 0;
    let failures = 0;

    for (const enrollment of enrollments) {
      try {
        // Verificar si ya existe una deuda o consumo para este mes y matrícula
        // (La verificación se delega o se hace aquí para evitar duplicados en el log de consumos también)
        const hasProcessed = await this.checkIfMonthProcessed(
          enrollment.id,
          yearMonth,
        );

        if (hasProcessed) {
          this.logger.warn(
            `Enrollment ${enrollment.id} already processed for ${yearMonth}. Skipping.`,
          );
          continue;
        }

        // Delegar lógica al AccountStatementService
        await this.accountStatementService.processMonthlyConsumption(
          enrollment.id,
          yearMonth,
        );

        processed++;
      } catch (error) {
        this.logger.error(
          `Failed to process month for enrollment ${enrollment.id}: ${error.message}`,
        );
        failures++;
      }
    }

    this.logger.log(
      `Generation completed. Processed: ${processed}, Failures: ${failures}`,
    );
    return { processed, failures };
  }

  private async checkIfMonthProcessed(
    enrollmentId: string,
    yearMonth: string,
  ): Promise<boolean> {
    // 1. Verificar en deudas
    const existingDebts =
      await this.debtsService.getPendingDebtsByEnrollment(enrollmentId);
    const hasDebt = existingDebts.some(
      (d) => d.tipoDeuda === 'MENSUALIDAD' && d.mesAplicado === yearMonth,
    );
    if (hasDebt) return true;

    // 2. Verificar en consumos (créditos ya aplicados)
    const hasConsumo = await this.consumosRepository.findOne({
      where: { enrollmentId, mes: yearMonth, active: true },
    });
    if (hasConsumo) return true;

    return false;
  }

  private calculateDueDate(yearMonth: string): Date {
    const [year, month] = yearMonth.split('-').map(Number);
    return new Date(year, month - 1, 20);
  }
}
