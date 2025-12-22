import {
    Injectable,
    Inject,
    NotFoundException,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import type {
    ILeadRepository,
} from '../../domain/repositories/lead.repository.interface';
import { LEAD_REPOSITORY } from '../../domain/repositories/lead.repository.interface';
import { Lead } from '../../domain/entities/lead.entity';
import { CreateLeadDto } from '../../domain/dtos/create-lead.dto';
import { UpdateLeadDto } from '../../domain/dtos/update-lead.dto';
import { LeadResponseDto } from '../../domain/dtos/lead-response.dto';

@Injectable()
export class LeadsService {
    private readonly logger = new Logger(LeadsService.name);

    constructor(
        @Inject(LEAD_REPOSITORY)
        private readonly leadRepository: ILeadRepository,
    ) { }

    async create(createLeadDto: CreateLeadDto): Promise<LeadResponseDto> {
        try {
            this.logger.log(`Creating new lead: ${createLeadDto.nombreCompleto}`);

            const lead = new Lead({
                ...createLeadDto,
            });

            const createdLead = await this.leadRepository.create(lead);
            this.logger.log(`Lead created successfully with ID: ${createdLead.id}`);

            return this.toResponseDto(createdLead);
        } catch (error) {
            this.logger.error(`Error creating lead: ${error.message}`, error.stack);
            throw new BadRequestException('Error al crear el lead');
        }
    }

    async findAll(): Promise<LeadResponseDto[]> {
        try {
            this.logger.log('Fetching all leads');
            const leads = await this.leadRepository.findAll();
            this.logger.log(`Found ${leads.length} leads`);
            return leads.map((lead) => this.toResponseDto(lead));
        } catch (error) {
            this.logger.error(`Error fetching leads: ${error.message}`, error.stack);
            throw new BadRequestException('Error al obtener los leads');
        }
    }

    async findOne(id: string): Promise<LeadResponseDto> {
        try {
            this.logger.log(`Fetching lead with ID: ${id}`);
            const lead = await this.leadRepository.findById(id);

            if (!lead) {
                this.logger.warn(`Lead not found with ID: ${id}`);
                throw new NotFoundException(`Lead con ID ${id} no encontrado`);
            }

            return this.toResponseDto(lead);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error fetching lead: ${error.message}`, error.stack);
            throw new BadRequestException('Error al obtener el lead');
        }
    }

    async update(
        id: string,
        updateLeadDto: UpdateLeadDto,
    ): Promise<LeadResponseDto> {
        try {
            this.logger.log(`Updating lead with ID: ${id}`);

            const existingLead = await this.leadRepository.findById(id);
            if (!existingLead) {
                this.logger.warn(`Lead not found with ID: ${id}`);
                throw new NotFoundException(`Lead con ID ${id} no encontrado`);
            }

            const updatedLead = await this.leadRepository.update(id, updateLeadDto);

            if (!updatedLead) {
                throw new BadRequestException('Error al actualizar el lead');
            }

            this.logger.log(`Lead updated successfully with ID: ${id}`);
            return this.toResponseDto(updatedLead);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error updating lead: ${error.message}`, error.stack);
            throw new BadRequestException('Error al actualizar el lead');
        }
    }

    async remove(id: string): Promise<void> {
        try {
            this.logger.log(`Deleting lead with ID: ${id}`);

            const existingLead = await this.leadRepository.findById(id);
            if (!existingLead) {
                this.logger.warn(`Lead not found with ID: ${id}`);
                throw new NotFoundException(`Lead con ID ${id} no encontrado`);
            }

            const deleted = await this.leadRepository.delete(id);

            if (!deleted) {
                throw new BadRequestException('Error al eliminar el lead');
            }

            this.logger.log(`Lead deleted successfully with ID: ${id}`);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error deleting lead: ${error.message}`, error.stack);
            throw new BadRequestException('Error al eliminar el lead');
        }
    }

    private toResponseDto(lead: Lead): LeadResponseDto {
        return {
            id: lead.id!,
            nombreCompleto: lead.nombreCompleto,
            edad: lead.edad,
            telefono: lead.telefono,
            modalidad: lead.modalidad,
            sede: lead.sede,
            medioContacto: lead.medioContacto,
            producto: lead.producto,
            aceptaContacto: lead.aceptaContacto,
            fechaRegistro: lead.fechaRegistro!,
        };
    }
}
