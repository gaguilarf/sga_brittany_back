import { Modalidad, Sede, MedioContacto } from '../constants/constants';

export class Lead {
    id?: string;
    nombreCompleto: string;
    edad: number;
    telefono: string;
    modalidad: Modalidad;
    sede: Sede;
    medioContacto: MedioContacto;
    producto: string;
    aceptaContacto: boolean;
    fechaRegistro?: Date;

    constructor(data: Partial<Lead>) {
        Object.assign(this, data);
    }
}
