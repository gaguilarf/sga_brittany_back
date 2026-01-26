import { Injectable, NotFoundException, Logger } from '@nestjs/common';
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
    try {
      this.logger.log(
        `Creating new enrollment for student ID: ${createEnrollmentDto.studentId}`,
      );

      const enrollment = this.enrollmentsRepository.create(createEnrollmentDto);
      const savedEnrollment = await this.enrollmentsRepository.save(enrollment);

      this.logger.log(
        `Enrollment created successfully with ID: ${savedEnrollment.id}`,
      );

      // --- GENERACIÓN DE DEUDAS ---
      const now = new Date();
      const mesAplicado = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      let debtToPayId: number | null = null;

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
        // Deuda por producto
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

  async findOne(id: number): Promise<EnrollmentResponseDto> {
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
    id: number,
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

  async remove(id: number): Promise<void> {
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

      // 1. Delete progress records
      if (enrollment.progressRecords?.length > 0) {
        await this.studentProgressRepository.remove(enrollment.progressRecords);
      }

      // 2. Delete payments
      if (enrollment.payments?.length > 0) {
        await this.enrollmentsRepository.manager.remove(enrollment.payments);
      }

      // 3. Delete debts
      if (enrollment.debts?.length > 0) {
        await this.enrollmentsRepository.manager.remove(enrollment.debts);
      }

      // 4. Finally delete enrollment
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
      active: entity.active,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
