import { Lead } from '../entities/lead.entity';

export interface ILeadRepository {
    create(lead: Lead): Promise<Lead>;
    findAll(): Promise<Lead[]>;
    findById(id: string): Promise<Lead | null>;
    update(id: string, lead: Partial<Lead>): Promise<Lead | null>;
    delete(id: string): Promise<boolean>;
}

export const LEAD_REPOSITORY = 'LEAD_REPOSITORY';
