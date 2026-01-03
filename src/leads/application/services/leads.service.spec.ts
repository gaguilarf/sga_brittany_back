import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LEAD_REPOSITORY } from '../../domain/repositories/lead.repository.interface';
import { Lead } from '../../domain/entities/lead.entity';
import { CreateLeadDto } from '../../domain/dtos/create-lead.dto';
import { UpdateLeadDto } from '../../domain/dtos/update-lead.dto';

describe('LeadsService', () => {
    let service: LeadsService;
    let mockRepository: any;

    const mockLead: Lead = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        nombreCompleto: 'Juan Pérez',
        edad: 25,
        telefono: '+51987654321',
        modalidad: 'Presencial',
        sede: 'Arequipa - Centro',
        medioContacto: 'Instagram',
        producto: 'Curso de 1 año',
        aceptaContacto: true,
        fechaRegistro: new Date('2024-01-15'),
    };

    beforeEach(async () => {
        mockRepository = {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LeadsService,
                {
                    provide: LEAD_REPOSITORY,
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<LeadsService>(LeadsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new lead successfully', async () => {
            const createLeadDto: CreateLeadDto = {
                nombreCompleto: 'Juan Pérez',
                edad: 25,
                telefono: '+51987654321',
                modalidad: 'Presencial',
                sede: 'Arequipa - Centro',
                medioContacto: 'Instagram',
                producto: 'Curso de 1 año',
                aceptaContacto: true,
            };

            mockRepository.create.mockResolvedValue(mockLead);

            const result = await service.create(createLeadDto);

            expect(result).toEqual({
                id: mockLead.id,
                nombreCompleto: mockLead.nombreCompleto,
                edad: mockLead.edad,
                telefono: mockLead.telefono,
                modalidad: mockLead.modalidad,
                sede: mockLead.sede,
                medioContacto: mockLead.medioContacto,
                producto: mockLead.producto,
                aceptaContacto: mockLead.aceptaContacto,
                fechaRegistro: mockLead.fechaRegistro,
            });
            expect(mockRepository.create).toHaveBeenCalledWith(
                expect.objectContaining(createLeadDto),
            );
        });

        it('should throw BadRequestException on repository error', async () => {
            const createLeadDto: CreateLeadDto = {
                nombreCompleto: 'Juan Pérez',
                edad: 25,
                telefono: '+51987654321',
                modalidad: 'Presencial',
                sede: 'Arequipa - Centro',
                medioContacto: 'Instagram',
                producto: 'Curso de 1 año',
                aceptaContacto: true,
            };

            mockRepository.create.mockRejectedValue(new Error('Database error'));

            await expect(service.create(createLeadDto)).rejects.toThrow(
                BadRequestException,
            );
        });
    });

    describe('findAll', () => {
        it('should return an array of leads', async () => {
            const mockLeads = [mockLead];
            mockRepository.findAll.mockResolvedValue(mockLeads);

            const result = await service.findAll();

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(mockLead.id);
            expect(mockRepository.findAll).toHaveBeenCalled();
        });

        it('should return empty array when no leads exist', async () => {
            mockRepository.findAll.mockResolvedValue([]);

            const result = await service.findAll();

            expect(result).toEqual([]);
            expect(mockRepository.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a lead by id', async () => {
            mockRepository.findById.mockResolvedValue(mockLead);

            const result = await service.findOne(mockLead.id!);

            expect(result.id).toBe(mockLead.id);
            expect(mockRepository.findById).toHaveBeenCalledWith(mockLead.id);
        });

        it('should throw NotFoundException when lead not found', async () => {
            mockRepository.findById.mockResolvedValue(null);

            await expect(service.findOne('non-existent-id')).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('update', () => {
        it('should update a lead successfully', async () => {
            const updateLeadDto: UpdateLeadDto = {
                nombreCompleto: 'Juan Pérez Actualizado',
            };

            const updatedLead = { ...mockLead, ...updateLeadDto };

            mockRepository.findById.mockResolvedValue(mockLead);
            mockRepository.update.mockResolvedValue(updatedLead);

            const result = await service.update(mockLead.id!, updateLeadDto);

            expect(result.nombreCompleto).toBe(updateLeadDto.nombreCompleto);
            expect(mockRepository.update).toHaveBeenCalledWith(
                mockLead.id,
                updateLeadDto,
            );
        });

        it('should throw NotFoundException when lead not found', async () => {
            mockRepository.findById.mockResolvedValue(null);

            await expect(
                service.update('non-existent-id', { nombreCompleto: 'Test' }),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException when update fails', async () => {
            mockRepository.findById.mockResolvedValue(mockLead);
            mockRepository.update.mockResolvedValue(null);

            await expect(
                service.update(mockLead.id!, { nombreCompleto: 'Test' }),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('remove', () => {
        it('should delete a lead successfully', async () => {
            mockRepository.findById.mockResolvedValue(mockLead);
            mockRepository.delete.mockResolvedValue(true);

            await service.remove(mockLead.id!);

            expect(mockRepository.delete).toHaveBeenCalledWith(mockLead.id);
        });

        it('should throw NotFoundException when lead not found', async () => {
            mockRepository.findById.mockResolvedValue(null);

            await expect(service.remove('non-existent-id')).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should throw BadRequestException when delete fails', async () => {
            mockRepository.findById.mockResolvedValue(mockLead);
            mockRepository.delete.mockResolvedValue(false);

            await expect(service.remove(mockLead.id!)).rejects.toThrow(
                BadRequestException,
            );
        });
    });
});
