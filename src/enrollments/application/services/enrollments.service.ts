import {
  Injectable,
  Logger,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnrollmentsTypeOrmEntity } from '../../infrastructure/persistence/typeorm/enrollments.typeorm-entity';
import { StudentProgressTypeOrmEntity } from '../../../students/infrastructure/persistence/typeorm/student-progress.typeorm-entity';
import { CreateEnrollmentDto } from '../../domain/dtos/create-enrollment.dto';
import { UpdateEnrollmentDto } from '../../domain/dtos/update-enrollment.dto';
import { EnrollmentResponseDto } from '../../domain/dtos/enrollment-response.dto';

import { PricesService } from '../../../plans/application/services/prices.service';
import { DebtsService } from '../../../debts/application/services/debts.service';
import { PaymentsService } from '../../../payments/application/services/payments.service';
import { PagoAdelantadoDetalleTypeOrmEntity } from '../../../payments/infrastructure/persistence/typeorm/pago-adelantado-detalle.typeorm-entity';

@Injectable()
export class EnrollmentsService {
  private readonly logger = new Logger(EnrollmentsService.name);

  constructor(
    @InjectRepository(EnrollmentsTypeOrmEntity)
    private readonly enrollmentsRepository: Repository<EnrollmentsTypeOrmEntity>,
    @InjectRepository(StudentProgressTypeOrmEntity)
    private readonly studentProgressRepository: Repository<StudentProgressTypeOrmEntity>,
    private readonly pricesService: PricesService,
    private readonly debtsService: DebtsService,
    private readonly paymentsService: PaymentsService,
  ) {}

  async create(
    createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<EnrollmentResponseDto> {
    this.logger.log(
      `Creating new enrollment for student ID: ${createEnrollmentDto.studentId}`,
    );

    try {
      // Validate uniqueness for PLAN enrollment
      if (createEnrollmentDto.enrollmentType === 'PLAN') {
        const existingPlanEnrollment = await this.enrollmentsRepository.findOne(
          {
            where: {
              studentId: createEnrollmentDto.studentId,
              enrollmentType: 'PLAN',
              active: true,
            },
          },
        );

        if (existingPlanEnrollment) {
          throw new ConflictException(
            'El alumno ya tiene una matrícula de tipo PLAN activa. No puede registrar otra.',
          );
        }
      }

      const enrollment = this.enrollmentsRepository.create(createEnrollmentDto);
      const savedEnrollment = await this.enrollmentsRepository.save(enrollment);

      this.logger.log(
        `Enrollment created successfully with ID: ${savedEnrollment.id}`,
      );

      // --- GENERACIÓN DE DEUDAS ---
      const now = new Date();
      const mesAplicado = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      let debtToPayId: string | null = null;

      if (createEnrollmentDto.enrollmentType === 'PLAN') {
        const prices = await this.pricesService.getPrice(
          savedEnrollment.campusId,
          savedEnrollment.planId,
        );

        // 1. Inscripción
        const inscDebt = await this.debtsService.createDebt({
          enrollmentId: savedEnrollment.id,
          tipoDeuda: 'INSCRIPCION',
          concepto: 'Pago por Inscripción',
          monto: prices?.precioInscripcion || 80.0,
          fechaVencimiento: now,
          mesAplicado,
          estado: 'PENDIENTE',
        });
        debtToPayId = inscDebt.id;

        // 2. Materiales
        await this.debtsService.createDebt({
          enrollmentId: savedEnrollment.id,
          tipoDeuda: 'MATERIALES',
          concepto: 'Materiales Académicos',
          monto: prices?.precioMateriales || 80.0,
          fechaVencimiento: now,
          mesAplicado,
          estado: 'PENDIENTE',
        });

        // 3. Primera Mensualidad
        const firstMonthDueDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          20,
        );

        await this.debtsService.createDebt({
          enrollmentId: savedEnrollment.id,
          tipoDeuda: 'MENSUALIDAD',
          concepto: `Mensualidad - ${mesAplicado}`,
          monto: prices?.precioMensualidad || 280.0,
          fechaVencimiento: firstMonthDueDate,
          mesAplicado,
          cicloAsociadoId: savedEnrollment.initialCycleId,
          nivelAsociadoId: savedEnrollment.initialLevelId,
          estado: 'PENDIENTE',
        });
      } else if (createEnrollmentDto.enrollmentType === 'PRODUCT') {
        // Deuda por producto - DESACTIVADO POR AHORA (No se cuentan con los precios)
        /*
        const productDebt = await this.debtsService.createDebt({
          enrollmentId: savedEnrollment.id,
          tipoDeuda: 'PRODUCTO',
          concepto: `Producto contratado`,
          monto: Number(savedEnrollment.saldo) || 0,
          fechaVencimiento: now,
          productId: savedEnrollment.productId,
          estado: 'PENDIENTE',
        });
        debtToPayId = productDebt.id;
        */
      }

      // --- REGISTRO DE PAGO INICIAL ---
      if (createEnrollmentDto.montoPago && createEnrollmentDto.montoPago > 0) {
        await this.paymentsService.create({
          enrollmentId: savedEnrollment.id,
          monto: createEnrollmentDto.montoPago,
          metodo: createEnrollmentDto.metodoPago || 'Efectivo',
          tipo: createEnrollmentDto.tipoPago || 'INSCRIPCION',
          numeroBoleta: createEnrollmentDto.numeroBoleta,
          fechaPago: now.toISOString(),
          campusId: savedEnrollment.campusId,
          debtId: debtToPayId,
        } as any);

        // Actualizar estado de la deuda vinculada
        if (debtToPayId) {
          await this.debtsService.updateDebtStatus(
            debtToPayId,
            createEnrollmentDto.montoPago,
          );
        }

        // Actualizar saldo de la matrícula
        savedEnrollment.saldo =
          Number(savedEnrollment.saldo) - createEnrollmentDto.montoPago;
        await this.enrollmentsRepository.save(savedEnrollment);
      }

      return this.toResponseDto(savedEnrollment);
    } catch (error) {
      this.logger.error(
        `Error creating enrollment: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll(): Promise<EnrollmentResponseDto[]> {
    try {
      this.logger.log('Fetching all enrollments');
      const enrollments = await this.enrollmentsRepository.find({
        order: { createdAt: 'DESC' },
      });
      return enrollments.map((e) => this.toResponseDto(e));
    } catch (error) {
      this.logger.error(
        `Error fetching enrollments: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<EnrollmentResponseDto> {
    try {
      this.logger.log(`Fetching enrollment with ID: ${id}`);
      const enrollment = await this.enrollmentsRepository.findOne({
        where: { id },
      });

      if (!enrollment) {
        throw new NotFoundException(`Enrollment with ID ${id} not found`);
      }

      return this.toResponseDto(enrollment);
    } catch (error) {
      this.logger.error(
        `Error fetching enrollment ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(
    id: string,
    updateEnrollmentDto: UpdateEnrollmentDto,
  ): Promise<EnrollmentResponseDto> {
    try {
      this.logger.log(`Updating enrollment with ID: ${id}`);
      const enrollment = await this.enrollmentsRepository.findOne({
        where: { id },
      });

      if (!enrollment) {
        throw new NotFoundException(`Enrollment with ID ${id} not found`);
      }

      Object.assign(enrollment, updateEnrollmentDto);
      const updatedEnrollment =
        await this.enrollmentsRepository.save(enrollment);

      this.logger.log(
        `Enrollment updated successfully: ID ${updatedEnrollment.id}`,
      );
      return this.toResponseDto(updatedEnrollment);
    } catch (error) {
      this.logger.error(
        `Error updating enrollment ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async removeAll(): Promise<void> {
    try {
      this.logger.log('Removing all enrollments and their dependencies');

      // Since we have cascade delete on database level for payments and debts,
      // and on ORM level for progress records via relations cascade or manual deletion if needed.
      // However, to be safe and ensure triggers/subscribers run if any, or just to follow the pattern:

      // Note: delete({}) triggers typeorm delete, which might bypassing some hooks if not careful,
      // but with database cascade constraints it's the most efficient.
      // Given we set onDelete: 'CASCADE' in the entity, a simple delete should work.

      await this.enrollmentsRepository.delete({});

      this.logger.log('All enrollments removed successfully');
    } catch (error) {
      this.logger.error(
        `Error removing all enrollments: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.log(
        `Removing enrollment with ID: ${id} and all its dependencies`,
      );
      const enrollment = await this.enrollmentsRepository.findOne({
        where: { id },
        relations: ['payments', 'debts', 'progressRecords'],
      });

      if (!enrollment) {
        throw new NotFoundException(`Enrollment with ID ${id} not found`);
      }

      // Perform deletion in strict order to avoid FK constraints
      // Order: PagoAdelantadoDetalle -> Payments -> Debts -> StudentProgress -> Enrollment

      // 0. Delete PagoAdelantadoDetalle (references Payments and Enrollments)
      // Must be deleted before Payments to avoid FK constraint fails on 'pago_id'
      this.logger.log('Checking for PagoAdelantadoDetalle records...');
      const pagoAdelantadoRepo =
        this.enrollmentsRepository.manager.getRepository(
          PagoAdelantadoDetalleTypeOrmEntity,
        );
      // We delete by enrollmentId directly
      await pagoAdelantadoRepo.delete({ enrollmentId: id });

      // 1. Delete Payments (referencing Debts and Enrollments)
      if (enrollment.payments?.length > 0) {
        this.logger.log(`Deleting ${enrollment.payments.length} payments...`);
        // Use manager to remove entities directly
        await this.enrollmentsRepository.manager.remove(enrollment.payments);
      }

      // 2. Delete Debts (referencing Enrollments)
      if (enrollment.debts?.length > 0) {
        this.logger.log(`Deleting ${enrollment.debts.length} debts...`);
        // Use manager to remove entities directly
        await this.enrollmentsRepository.manager.remove(enrollment.debts);
      }

      // 3. Delete Student Progress (referencing Enrollments)
      if (enrollment.progressRecords?.length > 0) {
        this.logger.log(
          `Deleting ${enrollment.progressRecords.length} progress records...`,
        );
        await this.studentProgressRepository.remove(enrollment.progressRecords);
      }

      // 4. Finally delete the Enrollment
      await this.enrollmentsRepository.remove(enrollment);

      this.logger.log(
        `Enrollment and dependencies removed successfully: ID ${id}`,
      );
    } catch (error) {
      this.logger.error(
        `Error removing enrollment ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private toResponseDto(
    entity: EnrollmentsTypeOrmEntity,
  ): EnrollmentResponseDto {
    return {
      id: entity.id,
      studentId: entity.studentId,
      campusId: entity.campusId,
      planId: entity.planId,
      courseId: entity.courseId,
      modalidad: entity.modalidad,
      horario: entity.horario,
      groupId: entity.groupId,
      initialLevelId: entity.initialLevelId,
      initialCycleId: entity.initialCycleId,
      enrollmentType: entity.enrollmentType,
      productId: entity.productId,
      examDate: entity.examDate,
      tipoInscripcion: entity.tipoInscripcion,
      advisorId: entity.advisorId,
      origen: entity.origen,
      numeroBoleta: entity.numeroBoleta,
      saldo: Number(entity.saldo),
      saldoFavor: Number(entity.saldoFavor),
      active: entity.active,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
