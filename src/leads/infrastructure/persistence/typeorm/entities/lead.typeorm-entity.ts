import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity('leads')
export class LeadEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    nombreCompleto: string;

    @Column({ type: 'int' })
    edad: number;

    @Column({ type: 'varchar', length: 20 })
    telefono: string;

    @Column({ type: 'varchar', length: 20 })
    modalidad: string;

    @Column({ type: 'varchar', length: 100 })
    sede: string;

    @Column({ type: 'varchar', length: 50 })
    medioContacto: string;

    @Column({ type: 'varchar', length: 100 })
    producto: string;

    @Column({ type: 'boolean', default: true })
    aceptaContacto: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    fechaRegistro: Date;
}
