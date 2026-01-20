import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePlanDto } from './create-plan.dto';

export class UpdatePlanDto extends PartialType(CreatePlanDto) {
    @ApiProperty({
        description: 'Plan name',
        example: 'Plan Básico Mensual',
        maxLength: 255,
        required: false,
    })
    name?: string;

    @ApiProperty({
        description: 'Plan service',
        example: 'Mensual',
        maxLength: 100,
        required: false,
    })
    service?: string;

    @ApiProperty({
        description: 'Plan description',
        example: 'Plan básico con acceso a clases grupales',
        required: false,
    })
    description?: string;

    @ApiProperty({
        description: 'Plan active status',
        example: true,
        required: false,
    })
    active?: boolean;
}
