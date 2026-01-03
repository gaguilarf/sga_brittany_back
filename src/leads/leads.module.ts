import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsController } from './presentation/controllers/leads.controller';
import { LeadsService } from './application/services/leads.service';
import { LeadEntity } from './infrastructure/persistence/typeorm/entities/lead.typeorm-entity';
import { LeadTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/lead.typeorm-repository';
import { LEAD_REPOSITORY } from './domain/repositories/lead.repository.interface';

@Module({
    imports: [TypeOrmModule.forFeature([LeadEntity])],
    controllers: [LeadsController],
    providers: [
        LeadsService,
        {
            provide: LEAD_REPOSITORY,
            useClass: LeadTypeOrmRepository,
        },
    ],
    exports: [LeadsService],
})
export class LeadsModule { }
