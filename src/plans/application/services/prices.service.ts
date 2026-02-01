import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceSedePlanTypeOrmEntity } from '../../infrastructure/persistence/typeorm/price-sede-plan.typeorm-entity';

@Injectable()
export class PricesService {
  constructor(
    @InjectRepository(PriceSedePlanTypeOrmEntity)
    private readonly priceRepository: Repository<PriceSedePlanTypeOrmEntity>,
  ) {}

  async findAll(): Promise<PriceSedePlanTypeOrmEntity[]> {
    return await this.priceRepository.find({
      relations: ['campus', 'plan'],
    });
  }

  async findByCampus(campusId: string): Promise<PriceSedePlanTypeOrmEntity[]> {
    return await this.priceRepository.find({
      where: { campusId, active: true },
      relations: ['plan'],
    });
  }

  async create(
    data: Partial<PriceSedePlanTypeOrmEntity>,
  ): Promise<PriceSedePlanTypeOrmEntity> {
    const price = this.priceRepository.create(data);
    return await this.priceRepository.save(price);
  }

  async update(
    id: string,
    data: Partial<PriceSedePlanTypeOrmEntity>,
  ): Promise<PriceSedePlanTypeOrmEntity> {
    await this.priceRepository.update(id, data);
    return (await this.priceRepository.findOne({
      where: { id },
    })) as PriceSedePlanTypeOrmEntity;
  }

  async getPrice(
    campusId: string,
    planId: string,
  ): Promise<PriceSedePlanTypeOrmEntity> {
    const price = await this.priceRepository.findOne({
      where: {
        campusId,
        planId,
        active: true,
      },
      order: {
        fechaInicioVigencia: 'DESC',
      },
    });

    if (!price) {
      // Si no hay precio configurado en BD, devolvemos valores por defecto según la lógica del usuario
      // Esto es una medida de seguridad si la tabla no está poblada aún
      return this.getDefaultPrice(planId, campusId);
    }

    return price;
  }

  private getDefaultPrice(planId: string, campusId: string): any {
    // Lógica por defecto solicitada:
    // 13. Plan Standard – S/. 280
    // 14. Plan Premium – S/. 329
    // 15. Plan Plus – S/. 299
    // 16. Convenio – S/. 245
    // Materiales: S/. 80, Inscripción: S/. 80

    let precioMensualidad = 280.0; // Default Standard

    if (planId === '13') precioMensualidad = 280.0;
    else if (planId === '14') precioMensualidad = 329.0;
    else if (planId === '15') precioMensualidad = 299.0;
    else if (planId === '16') precioMensualidad = 245.0;

    return {
      precioMensualidad,
      precioInscripcion: 80.0,
      precioMateriales: 80.0,
    };
  }
}
