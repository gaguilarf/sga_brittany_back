import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DebtTypeOrmEntity } from '../../infrastructure/persistence/typeorm/debts.typeorm-entity';

@Injectable()
export class DebtsService {
  constructor(
    @InjectRepository(DebtTypeOrmEntity)
    private readonly debtRepository: Repository<DebtTypeOrmEntity>,
  ) {}

  async createDebt(
    data: Partial<DebtTypeOrmEntity>,
  ): Promise<DebtTypeOrmEntity> {
    const debt = this.debtRepository.create(data);
    return await this.debtRepository.save(debt);
  }

  async getPendingDebtsByEnrollment(
    enrollmentId: number,
  ): Promise<DebtTypeOrmEntity[]> {
    return await this.debtRepository.find({
      where: {
        enrollmentId,
        estado: 'PENDIENTE',
        active: true,
      },
    });
  }

  async findOne(id: number): Promise<DebtTypeOrmEntity | null> {
    return await this.debtRepository.findOne({
      where: { id, active: true },
    });
  }

  async updateDebtStatus(
    debtId: number,
    montoPagado: number,
  ): Promise<DebtTypeOrmEntity> {
    const debt = await this.debtRepository.findOne({ where: { id: debtId } });
    if (!debt) throw new Error('Deuda no encontrada');

    const nuevoMonto = Number(debt.monto) - montoPagado;

    if (nuevoMonto <= 0) {
      debt.estado = 'PAGADO';
      debt.monto = 0;
    } else {
      debt.estado = 'PAGADO_PARCIAL';
      debt.monto = nuevoMonto;
    }

    return await this.debtRepository.save(debt);
  }
}
