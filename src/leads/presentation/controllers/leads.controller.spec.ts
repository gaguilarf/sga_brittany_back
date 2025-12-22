import { Test, TestingModule } from '@nestjs/testing';
import { LeadsController } from './leads.controller';
import { LeadsService } from '../../application/services/leads.service';
import { CreateLeadDto } from '../../domain/dtos/create-lead.dto';
import { UpdateLeadDto } from '../../domain/dtos/update-lead.dto';
import { LeadResponseDto } from '../../domain/dtos/lead-response.dto';

describe('LeadsController', () => {
    let controller: LeadsController;
    let service: LeadsService;

    const mockLeadResponse: LeadResponseDto = {
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

    const mockLeadsService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LeadsController],
            providers: [
                {
                    provide: LeadsService,
                    useValue: mockLeadsService,
                },
            ],
        }).compile();

        controller = module.get<LeadsController>(LeadsController);
        service = module.get<LeadsService>(LeadsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new lead', async () => {
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

            mockLeadsService.create.mockResolvedValue(mockLeadResponse);

            const result = await controller.create(createLeadDto);

            expect(result).toEqual(mockLeadResponse);
            expect(service.create).toHaveBeenCalledWith(createLeadDto);
        });
    });

    describe('findAll', () => {
        it('should return an array of leads', async () => {
            const mockLeads = [mockLeadResponse];
            mockLeadsService.findAll.mockResolvedValue(mockLeads);

            const result = await controller.findAll();

            expect(result).toEqual(mockLeads);
            expect(service.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a single lead', async () => {
            mockLeadsService.findOne.mockResolvedValue(mockLeadResponse);

            const result = await controller.findOne(mockLeadResponse.id);

            expect(result).toEqual(mockLeadResponse);
            expect(service.findOne).toHaveBeenCalledWith(mockLeadResponse.id);
        });
    });

    describe('update', () => {
        it('should update a lead', async () => {
            const updateLeadDto: UpdateLeadDto = {
                nombreCompleto: 'Juan Pérez Actualizado',
            };

            const updatedLead = { ...mockLeadResponse, ...updateLeadDto };
            mockLeadsService.update.mockResolvedValue(updatedLead);

            const result = await controller.update(mockLeadResponse.id, updateLeadDto);

            expect(result).toEqual(updatedLead);
            expect(service.update).toHaveBeenCalledWith(
                mockLeadResponse.id,
                updateLeadDto,
            );
        });
    });

    describe('remove', () => {
        it('should delete a lead', async () => {
            mockLeadsService.remove.mockResolvedValue(undefined);

            await controller.remove(mockLeadResponse.id);

            expect(service.remove).toHaveBeenCalledWith(mockLeadResponse.id);
        });
    });
});
