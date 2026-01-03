import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsBoolean,
    IsIn,
    MinLength,
    MaxLength,
    Min,
    Max,
    Matches,
} from 'class-validator';
import {
    PRODUCTOS,
    SEDES,
    MEDIOS_CONTACTO,
} from '../constants/constants';
import type { Modalidad, Sede, MedioContacto } from '../constants/constants';

export class CreateLeadDto {
    @ApiProperty({
        description: 'Nombre completo del lead',
        example: 'Juan Pérez García',
        minLength: 3,
        maxLength: 100,
    })
    @IsNotEmpty({ message: 'El nombre completo es requerido' })
    @IsString({ message: 'El nombre completo debe ser un texto' })
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
    nombreCompleto: string;

    @ApiProperty({
        description: 'Edad del lead',
        example: 25,
        minimum: 5,
        maximum: 100,
    })
    @IsNotEmpty({ message: 'La edad es requerida' })
    @IsNumber({}, { message: 'La edad debe ser un número' })
    @Min(5, { message: 'La edad mínima es 5 años' })
    @Max(100, { message: 'La edad máxima es 100 años' })
    edad: number;

    @ApiProperty({
        description: 'Número de teléfono del lead',
        example: '+51987654321',
        minLength: 7,
        maxLength: 20,
    })
    @IsNotEmpty({ message: 'El teléfono es requerido' })
    @IsString({ message: 'El teléfono debe ser un texto' })
    @MinLength(7, { message: 'El teléfono debe tener al menos 7 caracteres' })
    @MaxLength(20, { message: 'El teléfono no puede exceder 20 caracteres' })
    @Matches(/^[+]?[0-9\s()-]+$/, {
        message: 'El teléfono solo puede contener números, espacios, +, - y paréntesis',
    })
    telefono: string;

    @ApiProperty({
        description: 'Modalidad del curso',
        enum: ['Virtual', 'Presencial'],
        example: 'Presencial',
    })
    @IsNotEmpty({ message: 'La modalidad es requerida' })
    @IsString({ message: 'La modalidad debe ser un texto' })
    @IsIn(['Virtual', 'Presencial'], {
        message: 'La modalidad debe ser Virtual o Presencial',
    })
    modalidad: Modalidad;

    @ApiProperty({
        description: 'Sede de Brittany',
        enum: SEDES,
        example: 'Arequipa - Centro',
    })
    @IsNotEmpty({ message: 'La sede es requerida' })
    @IsString({ message: 'La sede debe ser un texto' })
    @IsIn(SEDES, {
        message: `La sede debe ser una de las opciones válidas`,
    })
    sede: Sede;

    @ApiProperty({
        description: 'Medio por el cual se enteró del servicio',
        enum: MEDIOS_CONTACTO,
        example: 'Instagram',
    })
    @IsNotEmpty({ message: 'El medio de contacto es requerido' })
    @IsString({ message: 'El medio de contacto debe ser un texto' })
    @IsIn(MEDIOS_CONTACTO, {
        message: `El medio de contacto debe ser una de las opciones válidas`,
    })
    medioContacto: MedioContacto;

    @ApiProperty({
        description: 'Producto de interés',
        enum: PRODUCTOS,
        example: 'Curso de 1 año',
    })
    @IsNotEmpty({ message: 'El producto es requerido' })
    @IsString({ message: 'El producto debe ser un texto' })
    @IsIn(PRODUCTOS, {
        message: `El producto debe ser una de las opciones válidas`,
    })
    producto: string;

    @ApiProperty({
        description: 'Acepta ser contactado',
        example: true,
    })
    @IsNotEmpty({ message: 'Debe indicar si acepta ser contactado' })
    @IsBoolean({ message: 'El campo aceptaContacto debe ser verdadero o falso' })
    aceptaContacto: boolean;
}
