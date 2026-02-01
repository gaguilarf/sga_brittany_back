import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { EnrollmentsTypeOrmEntity } from '../../infrastructure/persistence/typeorm/enrollments.typeorm-entity';
import { ConsumoTypeOrmEntity } from '../../infrastructure/persistence/typeorm/consumos.typeorm-entity';
import { DebtTypeOrmEntity } from '../../../debts/infrastructure/persistence/typeorm/debts.typeorm-entity';
import { PricesService } from '../../../plans/application/services/prices.service';
import { DebtsService } from '../../../debts/application/services/debts.service';

import { PagoAdelantadoDetalleTypeOrmEntity } from '../../../payments/infrastructure/persistence/typeorm/pago-adelantado-detalle.typeorm-entity';

@Injectable()
export class AccountStatementService {
  private readonly logger = new Logger(AccountStatementService.name);

  constructor(
    @InjectRepository(EnrollmentsTypeOrmEntity)
    private readonly enrollmentsRepository: Repository<EnrollmentsTypeOrmEntity>,
    @InjectRepository(ConsumoTypeOrmEntity)
    private readonly consumosRepository: Repository<ConsumoTypeOrmEntity>,
    @InjectRepository(DebtTypeOrmEntity)
    private readonly debtsRepository: Repository<DebtTypeOrmEntity>,
    @InjectRepository(PagoAdelantadoDetalleTypeOrmEntity)
    private readonly prepaymentDetailsRepository: Repository<PagoAdelantadoDetalleTypeOrmEntity>,
    private readonly pricesService: PricesService,
    private readonly debtsService: DebtsService,
  ) {}

  async processMonthlyConsumption(enrollmentId: string, mes: string) {
    this.logger.log(
      `Processing consumption for enrollment ${enrollmentId} - ${mes}`,
    );

    const enrollment = await this.enrollmentsRepository.findOne({
      where: { id: enrollmentId, active: true },
    });

    if (!enrollment || enrollment.enrollmentType !== 'PLAN') return;

    const prices = await this.pricesService.getPrice(
      enrollment.campusId,
      enrollment.planId,
    );
    const montoMensual = Number(prices?.precioMensualidad || 280.0);

    // 1. Buscar pagos adelantados registrados para ESTE mes
    const monthPrepayments = await this.prepaymentDetailsRepository.find({
      where: {
        enrollmentId,
        mesAdelantado: mes,
        estado: 'PENDIENTE_APLICACION',
        active: true,
      },
    });

    let montoCubierto = 0;
    for (const prepay of monthPrepayments) {
      montoCubierto += Number(prepay.montoAsignado);
      prepay.estado = 'APLICADO';
      prepay.fechaAplicacion = new Date();
      await this.prepaymentDetailsRepository.save(prepay);
    }

    let saldoFavorGlobal = Number(enrollment.saldoFavor || 0);
    let montoConsumidoDeCreditoGlobal = 0;
    let deudaGenerada = 0;

    let faltantePorCubrir = montoMensual - montoCubierto;

    if (faltantePorCubrir <= 0) {
      // Mes totalmente cubierto por prepagos específicos
      this.logger.log(`Month ${mes} fully covered by specific prepayments.`);
      faltantePorCubrir = 0;
    } else {
      // Faltante después de prepagos específicos
      // Intentar cubrir con el resto del saldo a favor global
      if (saldoFavorGlobal >= faltantePorCubrir) {
        montoConsumidoDeCreditoGlobal = faltantePorCubrir;
        saldoFavorGlobal -= faltantePorCubrir;
        faltantePorCubrir = 0;
      } else {
        montoConsumidoDeCreditoGlobal = saldoFavorGlobal;
        faltantePorCubrir -= saldoFavorGlobal;
        saldoFavorGlobal = 0;
      }
    }

    // --- NUEVA LÓGICA: Sincronizar con deudas existentes ---
    // Buscar si ya se había generado una deuda de mensualidad para este mes
    const existingDebts = await this.debtsRepository.find({
      where: {
        enrollmentId,
        mesAplicado: mes,
        tipoDeuda: 'MENSUALIDAD',
        active: true,
      },
    });

    const totalAbonado = montoCubierto + montoConsumidoDeCreditoGlobal;
    let abonoRestante = totalAbonado;

    for (const debt of existingDebts) {
      if (debt.estado === 'PAGADO') continue;

      const montoDeuda = Number(debt.monto);
      if (abonoRestante >= montoDeuda) {
        // Cubrir deuda totalmente
        abonoRestante -= montoDeuda;
        debt.monto = 0;
        debt.estado = 'PAGADO';
      } else {
        // Cubrir parcialmente
        debt.monto = montoDeuda - abonoRestante;
        debt.estado = 'PAGADO_PARCIAL';
        abonoRestante = 0;
      }
      await this.debtsRepository.save(debt);
    }

    // Si no existían deudas previas, generamos el faltante como deuda nueva.
    if (existingDebts.length === 0 && faltantePorCubrir > 0) {
      deudaGenerada = faltantePorCubrir;
    }

    // 1. Create Consumo record if there was credit used
    if (totalAbonado > 0) {
      await this.consumosRepository.save({
        enrollmentId,
        mes,
        monto: totalAbonado,
      });
    }

    // 2. Create Debt ONLY if there's still a gap not represented by existing debts
    if (deudaGenerada > 0) {
      await this.debtsService.createDebt({
        enrollmentId,
        tipoDeuda: 'MENSUALIDAD',
        concepto: `Mensualidad - ${mes}`,
        monto: deudaGenerada,
        fechaVencimiento: this.calculateDueDate(mes),
        mesAplicado: mes,
        estado: 'PENDIENTE',
      });
    }

    // 3. Update Enrollment's credit balance
    enrollment.saldoFavor = Number(enrollment.saldoFavor || 0) - totalAbonado;
    if (enrollment.saldoFavor < 0) enrollment.saldoFavor = 0;

    await this.enrollmentsRepository.save(enrollment);

    this.logger.log(
      `Consumption finished: Total Applied ${totalAbonado}, New Debt ${deudaGenerada}`,
    );
  }

  private calculateDueDate(yearMonth: string): Date {
    const [year, month] = yearMonth.split('-').map(Number);
    return new Date(year, month - 1, 20);
  }

  async getAccountStatement(enrollmentId: string) {
    const enrollment = await this.enrollmentsRepository.findOne({
      where: { id: enrollmentId },
      relations: ['debts', 'payments'],
    });

    if (!enrollment) {
      throw new Error('Matrícula no encontrada');
    }

    const prices = await this.pricesService.getPrice(
      enrollment.campusId,
      enrollment.planId,
    );
    const planPrice = Number(prices?.precioMensualidad || 280.0);

    const consumos = await this.consumosRepository.find({
      where: { enrollmentId, active: true },
    });

    const prepayments = await this.prepaymentDetailsRepository.find({
      where: { enrollmentId, active: true },
    });

    // Consolidated Month Breakdown
    const monthDetailsMap = new Map<string, any>();

    // 1. Process Debts
    enrollment.debts.forEach((d) => {
      if (d.tipoDeuda === 'MENSUALIDAD' && d.mesAplicado) {
        const current = monthDetailsMap.get(d.mesAplicado) || {
          mes: d.mesAplicado,
          precioPlan: planPrice,
          montoPagado: 0,
          saldoPendiente: 0,
        };
        // In this system, debts are generated for the REMAINDER.
        // So a debt's existence means there is a pending amount.
        // However, we need to know what was ALREADY paid for this month.
        // If a debt is partially paid, it should reflect in montoPagado?
        // No, based on user requirements: "Monto pagado" should sum Consumos + assigned payments.
        current.saldoPendiente += Number(d.monto);
        monthDetailsMap.set(d.mesAplicado, current);
      }
    });

    // 2. Process Consumos (Applied credits)
    consumos.forEach((c) => {
      const current = monthDetailsMap.get(c.mes) || {
        mes: c.mes,
        precioPlan: planPrice,
        montoPagado: 0,
        saldoPendiente: 0,
      };
      current.montoPagado += Number(c.monto);
      monthDetailsMap.set(c.mes, current);
    });

    // 3. Process Scheduled Prepayments (NOT yet consumed but already paid)
    // These are amounts the student already paid for future months.
    prepayments.forEach((p) => {
      if (p.estado === 'PENDIENTE_APLICACION') {
        const current = monthDetailsMap.get(p.mesAdelantado) || {
          mes: p.mesAdelantado,
          precioPlan: planPrice,
          montoPagado: 0,
          saldoPendiente: 0,
        };
        current.montoPagado += Number(p.montoAsignado);
        monthDetailsMap.set(p.mesAdelantado, current);
      }
    });

    const monthlySummary = Array.from(monthDetailsMap.values()).map((m) => {
      let estado = 'PENDIENTE';
      if (m.montoPagado >= m.precioPlan) {
        estado = 'COMPLETO';
      } else if (m.montoPagado > 0) {
        estado = 'PARCIAL';
      }

      return {
        ...m,
        estado,
        saldoPendiente: Math.max(0, m.precioPlan - m.montoPagado),
      };
    });

    // 4. Calculate AVAILABLE PREPAYMENTS & NET DEBTS
    const prepaymentsByMonth = new Map<string, number>();
    prepayments
      .filter((p) => p.estado === 'PENDIENTE_APLICACION')
      .forEach((p) => {
        const current = prepaymentsByMonth.get(p.mesAdelantado) || 0;
        prepaymentsByMonth.set(
          p.mesAdelantado,
          current + Number(p.montoAsignado),
        );
      });

    const monthlyDebtsByMonth = new Map<
      string,
      { total: number; ids: string[] }
    >();
    enrollment.debts
      .filter(
        (d) =>
          d.tipoDeuda === 'MENSUALIDAD' &&
          d.estado !== 'PAGADO' &&
          d.estado !== 'ANULADO',
      )
      .forEach((d) => {
        const current = monthlyDebtsByMonth.get(d.mesAplicado) || {
          total: 0,
          ids: [],
        };
        monthlyDebtsByMonth.set(d.mesAplicado, {
          total: current.total + Number(d.monto),
          ids: [...current.ids, d.id],
        });
      });

    // Netting Process
    const nettedPrepayments: any[] = [];
    const nettedDebts: any[] = [];

    // All distinct months mentioned in both
    const allMonths = new Set([
      ...prepaymentsByMonth.keys(),
      ...monthlyDebtsByMonth.keys(),
    ]);

    allMonths.forEach((mes) => {
      const credit = prepaymentsByMonth.get(mes) || 0;
      const debtData = monthlyDebtsByMonth.get(mes) || { total: 0, ids: [] };
      const balance = credit - debtData.total;

      if (balance > 0) {
        // Net Credit
        nettedPrepayments.push({
          mes,
          monto: balance,
          estado: balance >= planPrice ? 'TOTAL' : 'PARCIAL',
        });
      } else if (balance < 0) {
        // Net Debt
        nettedDebts.push({
          id: debtData.ids.length > 0 ? debtData.ids[0] : undefined, // Prefer IDs for system linkage
          mes: mes, // Added mes field for sorting
          mesAplicado: mes,
          monto: Math.abs(balance),
          concepto: `Mensualidad - ${mes}`,
          tipoDeuda: 'MENSUALIDAD',
        });
      }
      // If balance == 0, they cancel out
    });

    // Add other (non-monthly) debts to nettedDebts
    enrollment.debts
      .filter(
        (d) =>
          d.tipoDeuda !== 'MENSUALIDAD' &&
          d.estado !== 'PAGADO' &&
          d.estado !== 'ANULADO',
      )
      .forEach((d) => {
        nettedDebts.push({
          id: d.id,
          concepto: d.concepto || d.tipoDeuda,
          monto: Number(d.monto),
          tipoDeuda: d.tipoDeuda,
          mesAplicado: d.mesAplicado,
          estado: d.estado,
        });
      });

    const totalNettedSaldo = nettedDebts.reduce((sum, d) => sum + d.monto, 0);

    return {
      enrollment: {
        id: enrollment.id,
        saldo: enrollment.saldo,
        saldoFavor: enrollment.saldoFavor,
      },
      monthlySummary: monthlySummary.sort((a, b) => b.mes.localeCompare(a.mes)),
      nettedPrepayments: nettedPrepayments.sort((a, b) =>
        b.mes.localeCompare(a.mes),
      ),
      nettedDebts: nettedDebts.sort((a, b) =>
        (b.mesAplicado || '').localeCompare(a.mesAplicado || ''),
      ),
      totalNettedSaldo,
      consumos,
      debts: enrollment.debts, // Raw debts for detail list
      payments: enrollment.payments,
    };
  }
}
