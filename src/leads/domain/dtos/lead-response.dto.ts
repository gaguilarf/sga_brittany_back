import { ApiProperty } from '@nestjs/swagger';
import type { Modalidad, Sede, MedioContacto } from '../constants/constants';

export class LeadResponseDto {
    @ApiProperty({
        description: 'ID único del lead',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    id: string;

    @ApiProperty({
        description: 'Nombre completo del lead',
        example: 'Juan Pérez García',
    })
    nombreCompleto: string;

    @ApiProperty({
        description: 'Edad del lead',
        example: 25,
    })
    edad: number;

    @ApiProperty({
        description: 'Número de teléfono del lead',
        example: '+51987654321',
    })
    telefono: string;

    @ApiProperty({
        description: 'Modalidad del curso',
        enum: ['Virtual', 'Presencial'],
        example: 'Presencial',
    })
    modalidad: Modalidad;

    @ApiProperty({
        description: 'Sede de Brittany',
        example: 'Arequipa - Centro',
    })
    sede: Sede;

    @ApiProperty({
        description: 'Medio por el cual se enteró del servicio',
        example: 'Instagram',
    })
    medioContacto: MedioContacto;

    @ApiProperty({
        description: 'Producto de interés',
        example: 'Curso de 1 año',
    })
    producto: string;

    @ApiProperty({
        description: 'Acepta ser contactado',
        example: true,
    })
    aceptaContacto: boolean;

    @ApiProperty({
        description: 'Fecha de registro del lead',
        example: '2024-01-15T10:30:00.000Z',
    })
    fechaRegistro: Date;
}
