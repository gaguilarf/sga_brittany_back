import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
} from '@nestjs/swagger';
import { LeadsService } from '../../application/services/leads.service';
import { CreateLeadDto } from '../../domain/dtos/create-lead.dto';
import { UpdateLeadDto } from '../../domain/dtos/update-lead.dto';
import { LeadResponseDto } from '../../domain/dtos/lead-response.dto';

@ApiTags('Leads')
@Controller('leads')
export class LeadsController {
    constructor(private readonly leadsService: LeadsService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Crear un nuevo lead',
        description: 'Registra un nuevo lead en el sistema con toda su información',
    })
    @ApiBody({ type: CreateLeadDto })
    @ApiResponse({
        status: 201,
        description: 'Lead creado exitosamente',
        type: LeadResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Datos inválidos o error en la validación',
    })
    async create(@Body() createLeadDto: CreateLeadDto): Promise<LeadResponseDto> {
        return this.leadsService.create(createLeadDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Obtener todos los leads',
        description: 'Retorna la lista completa de leads registrados, ordenados por fecha de registro descendente',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de leads obtenida exitosamente',
        type: [LeadResponseDto],
    })
    async findAll(): Promise<LeadResponseDto[]> {
        return this.leadsService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Obtener un lead por ID',
        description: 'Retorna la información detallada de un lead específico',
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del lead (UUID)',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiResponse({
        status: 200,
        description: 'Lead encontrado exitosamente',
        type: LeadResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Lead no encontrado',
    })
    async findOne(@Param('id') id: string): Promise<LeadResponseDto> {
        return this.leadsService.findOne(id);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Actualizar un lead',
        description: 'Actualiza parcialmente la información de un lead existente',
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del lead (UUID)',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiBody({ type: UpdateLeadDto })
    @ApiResponse({
        status: 200,
        description: 'Lead actualizado exitosamente',
        type: LeadResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Lead no encontrado',
    })
    @ApiResponse({
        status: 400,
        description: 'Datos inválidos',
    })
    async update(
        @Param('id') id: string,
        @Body() updateLeadDto: UpdateLeadDto,
    ): Promise<LeadResponseDto> {
        return this.leadsService.update(id, updateLeadDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Eliminar un lead',
        description: 'Elimina permanentemente un lead del sistema',
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del lead (UUID)',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiResponse({
        status: 204,
        description: 'Lead eliminado exitosamente',
    })
    @ApiResponse({
        status: 404,
        description: 'Lead no encontrado',
    })
    async remove(@Param('id') id: string): Promise<void> {
        return this.leadsService.remove(id);
    }
}
