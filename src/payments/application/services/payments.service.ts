import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentsTypeOrmEntity } from '../../infrastructure/persistence/typeorm/payments.typeorm-entity';
import { CreatePaymentDto } from '../../domain/dtos/create-payment.dto';
import { UpdatePaymentDto } from '../../domain/dtos/update-payment.dto';
import { PaymentResponseDto } from '../../domain/dtos/payment-response.dto';
import { DebtsService } from '../../../debts/application/services/debts.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(PaymentsTypeOrmEntity)
    private readonly paymentsRepository: Repository<PaymentsTypeOrmEntity>,
    private readonly debtsService: DebtsService,
  ) {}

  async create(
    createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentResponseDto> {
    try {
      this.logger.log(
        `Creating new payment for enrollment ID: ${createPaymentDto.enrollmentId}`,
      );
      const payment = this.paymentsRepository.create(createPaymentDto);

      // Si el pago está vinculado a una deuda, actualizar el estado de la deuda
      let debtId = createPaymentDto.debtId;

      // Si no viene debtId, intentamos buscar una deuda pendiente de este tipo para esta matrícula
      if (!debtId && createPaymentDto.enrollmentId) {
        const pendingDebts =
          await this.debtsService.getPendingDebtsByEnrollment(
            createPaymentDto.enrollmentId,
          );
        const tipoMapeado: Record<string, string> = {
          Inscripción: 'INSCRIPCION',
          Inscripcion: 'INSCRIPCION',
          Materiales: 'MATERIALES',
          Mensualidad: 'MENSUALIDAD',
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

  async findOne(id: number): Promise<PaymentResponseDto> {
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
    id: number,
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

  async remove(id: number): Promise<void> {
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
