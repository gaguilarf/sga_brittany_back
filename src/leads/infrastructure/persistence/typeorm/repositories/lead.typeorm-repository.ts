import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILeadRepository } from '../../../../domain/repositories/lead.repository.interface';
import { Lead } from '../../../../domain/entities/lead.entity';
import { LeadEntity } from '../entities/lead.typeorm-entity';

@Injectable()
export class LeadTypeOrmRepository implements ILeadRepository {
    constructor(
        @InjectRepository(LeadEntity)
        private readonly repository: Repository<LeadEntity>,
    ) { }

    async create(lead: Lead): Promise<Lead> {
        const entity = this.repository.create(lead);
        const saved = await this.repository.save(entity);
        return this.toDomain(saved);
    }

    async findAll(): Promise<Lead[]> {
        const entities = await this.repository.find({
            order: { fechaRegistro: 'DESC' },
        });
        return entities.map((entity) => this.toDomain(entity));
    }

    async findById(id: string): Promise<Lead | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? this.toDomain(entity) : null;
    }

    async update(id: string, lead: Partial<Lead>): Promise<Lead | null> {
        const entity = await this.repository.findOne({ where: { id } });
        if (!entity) {
            return null;
        }

        Object.assign(entity, lead);
        const updated = await this.repository.save(entity);
        return this.toDomain(updated);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return (result.affected ?? 0) > 0;
    }

    private toDomain(entity: LeadEntity): Lead {
        return new Lead({
            id: entity.id,
            nombreCompleto: entity.nombreCompleto,
            edad: entity.edad,
            telefono: entity.telefono,
            modalidad: entity.modalidad as any,
            sede: entity.sede as any,
            medioContacto: entity.medioContacto as any,
            producto: entity.producto,
            aceptaContacto: entity.aceptaContacto,
            fechaRegistro: entity.fechaRegistro,
        });
    }
}
