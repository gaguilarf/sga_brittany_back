import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentsTypeOrmEntity } from '../../infrastructure/persistence/typeorm/payments.typeorm-entity';
import { PagoAdelantadoDetalleTypeOrmEntity } from '../../infrastructure/persistence/typeorm/pago-adelantado-detalle.typeorm-entity';
import { CreatePaymentDto } from '../../domain/dtos/create-payment.dto';
import { UpdatePaymentDto } from '../../domain/dtos/update-payment.dto';
import { PaymentResponseDto } from '../../domain/dtos/payment-response.dto';
import { DebtsService } from '../../../debts/application/services/debts.service';
import { EnrollmentsTypeOrmEntity } from '../../../enrollments/infrastructure/persistence/typeorm/enrollments.typeorm-entity';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(PaymentsTypeOrmEntity)
    private readonly paymentsRepository: Repository<PaymentsTypeOrmEntity>,
    @InjectRepository(PagoAdelantadoDetalleTypeOrmEntity)
    private readonly pagoAdelantadoDetalleRepository: Repository<PagoAdelantadoDetalleTypeOrmEntity>,
    @InjectRepository(EnrollmentsTypeOrmEntity)
    private readonly enrollmentsRepository: Repository<EnrollmentsTypeOrmEntity>,
    private readonly debtsService: DebtsService,
  ) {}

  async create(
    createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentResponseDto> {
    try {
      this.logger.log(
        `Creating new payment for enrollment ID: ${createPaymentDto.enrollmentId}`,
      );
      const paymentData = { ...createPaymentDto };
      delete (paymentData as any).mesesAdelantados;

      // NOTE: Exclusivity between Mensualidad and Pago Adelantado is now managed
      // primarily by the frontend per-transaction logic.
      // Global restriction removed to allow prepaying future months even if previous ones were paid normally.

      const payment = this.paymentsRepository.create(paymentData);

      // Si el pago está vinculado a una deuda, actualizar el estado de la deuda
      let debtId: string | undefined = createPaymentDto.debtId;

      // Si no viene debtId y no es pago adelantado, intentamos buscar una deuda pendiente
      if (
        !debtId &&
        createPaymentDto.enrollmentId &&
        !createPaymentDto.esAdelantado
      ) {
        const pendingDebts =
          await this.debtsService.getPendingDebtsByEnrollment(
            createPaymentDto.enrollmentId,
          );
        const tipoMapeado: Record<string, string> = {
          Inscripción: 'INSCRIPCION',
          Inscripcion: 'INSCRIPCION',
          Materiales: 'MATERIALES',
          Mensualidad: 'MENSUALIDAD',
          'Mensualidad Adelantada': 'MENSUALIDAD',
        };

        const targetTipo = tipoMapeado[createPaymentDto.tipo || ''] || null;

        if (targetTipo) {
          const matchingDebt = pendingDebts.find(
            (d) => d.tipoDeuda === targetTipo,
          );
          if (matchingDebt) {
            debtId = matchingDebt.id;
          }
        }
      }

      if (debtId) {
        await this.debtsService.updateDebtStatus(
          debtId,
          createPaymentDto.monto,
        );
        // Actualizar el entity del pago con el debtId asignado
        (payment as any).debtId = debtId;
      }

      const savedPayment = await this.paymentsRepository.save(payment);

      // Si es un pago adelantado, guardar el detalle por mes
      if (createPaymentDto.esAdelantado && createPaymentDto.mesesAdelantados) {
        // Validar que la matrícula sea de tipo PLAN y esté activa
        const enrollment = await this.enrollmentsRepository.findOne({
          where: { id: createPaymentDto.enrollmentId },
        });

        if (
          !enrollment ||
          !enrollment.active ||
          enrollment.enrollmentType !== 'PLAN'
        ) {
          throw new BadRequestException(
            'Solo se pueden registrar mensualidades adelantadas para matrículas académicas activas.',
          );
        }

        this.logger.log(
          `Saving prepayment details and incrementing saldoFavor for enrollment: ${savedPayment.enrollmentId}`,
        );

        // Actualizar saldo a favor en la matrícula
        enrollment.saldoFavor =
          Number(enrollment.saldoFavor || 0) + Number(savedPayment.monto);
        await this.enrollmentsRepository.save(enrollment);

        for (const detail of createPaymentDto.mesesAdelantados) {
          await this.pagoAdelantadoDetalleRepository.save({
            pagoId: savedPayment.id,
            enrollmentId: savedPayment.enrollmentId,
            mesAdelantado: detail.mes,
            montoAsignado: detail.monto,
            estado: 'PENDIENTE_APLICACION', // Will be applied via monthly job
          });

          this.logger.log(
            `Recorded scheduled credit for month: ${detail.mes}, amount: ${detail.monto}`,
          );
        }
      }

      this.logger.log(
        `Payment created successfully with ID: ${savedPayment.id}`,
      );
      return this.toResponseDto(savedPayment);
    } catch (error) {
      this.logger.error(
        `Error creating payment: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll(): Promise<PaymentResponseDto[]> {
    try {
      this.logger.log('Fetching all payments');
      const payments = await this.paymentsRepository.find({
        order: { createdAt: 'DESC' },
      });
      return payments.map((p) => this.toResponseDto(p));
    } catch (error) {
      this.logger.error(
        `Error fetching payments: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getPrepaymentDetails(paymentId: string) {
    try {
      this.logger.log(
        `Fetching prepayment details for payment ID: ${paymentId}`,
      );
      const details = await this.pagoAdelantadoDetalleRepository.find({
        where: { pagoId: paymentId },
        order: { mesAdelantado: 'ASC' },
      });
      return details.map((d) => ({
        mes: d.mesAdelantado,
        monto: d.montoAsignado,
        estado: d.estado,
      }));
    } catch (error) {
      this.logger.error(
        `Error fetching prepayment details: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<PaymentResponseDto> {
    try {
      this.logger.log(`Fetching payment with ID: ${id}`);
      const payment = await this.paymentsRepository.findOne({
        where: { id },
      });

      if (!payment) {
        throw new NotFoundException(`Payment with ID ${id} not found`);
      }

      return this.toResponseDto(payment);
    } catch (error) {
      this.logger.error(
        `Error fetching payment ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<PaymentResponseDto> {
    try {
      this.logger.log(`Updating payment with ID: ${id}`);
      const payment = await this.paymentsRepository.findOne({
        where: { id },
      });

      if (!payment) {
        throw new NotFoundException(`Payment with ID ${id} not found`);
      }

      Object.assign(payment, updatePaymentDto);
      const updatedPayment = await this.paymentsRepository.save(payment);
      this.logger.log(`Payment updated successfully: ID ${updatedPayment.id}`);
      return this.toResponseDto(updatedPayment);
    } catch (error) {
      this.logger.error(
        `Error updating payment ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.log(`Removing payment with ID: ${id}`);
      const payment = await this.paymentsRepository.findOne({
        where: { id },
      });

      if (!payment) {
        throw new NotFoundException(`Payment with ID ${id} not found`);
      }

      await this.paymentsRepository.remove(payment);
      this.logger.log(`Payment removed successfully: ID ${id}`);
    } catch (error) {
      this.logger.error(
        `Error removing payment ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private toResponseDto(entity: PaymentsTypeOrmEntity): PaymentResponseDto {
    return {
      id: entity.id,
      enrollmentId: entity.enrollmentId,
      tipo: entity.tipo,
      metodo: entity.metodo,
      monto: Number(entity.monto),
      numeroBoleta: entity.numeroBoleta,
      fechaPago: entity.fechaPago,
      campusId: entity.campusId,
      active: entity.active,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
