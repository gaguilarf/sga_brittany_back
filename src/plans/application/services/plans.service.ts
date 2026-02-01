import {
  Injectable,
  NotFoundException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlansTypeOrmEntity } from '../../infrastructure/persistence/typeorm/plans.typeorm-entity';
import { CreatePlanDto } from '../../domain/dtos/create-plan.dto';
import { UpdatePlanDto } from '../../domain/dtos/update-plan.dto';
import { PlanResponseDto } from '../../domain/dtos/plan-response.dto';

@Injectable()
export class PlansService {
  private readonly logger = new Logger(PlansService.name);

  constructor(
    @InjectRepository(PlansTypeOrmEntity)
    private readonly plansRepository: Repository<PlansTypeOrmEntity>,
  ) {}

  async create(createPlanDto: CreatePlanDto): Promise<PlanResponseDto> {
    try {
      this.logger.log(`Creating new plan: ${createPlanDto.name}`);

      // Check if plan with same name already exists
      const existingPlan = await this.plansRepository.findOne({
        where: { name: createPlanDto.name },
      });

      if (existingPlan) {
        throw new ConflictException(
          `Plan with name "${createPlanDto.name}" already exists`,
        );
      }

      const plan = this.plansRepository.create(createPlanDto);
      const savedPlan = await this.plansRepository.save(plan);

      this.logger.log(
        `Plan created successfully: ${savedPlan.name} (ID: ${savedPlan.id})`,
      );

      return this.toResponseDto(savedPlan);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error creating plan: ${errorMessage}`, errorStack);
      throw error;
    }
  }

  async findAll(): Promise<PlanResponseDto[]> {
    try {
      this.logger.log('Fetching all plans');
      const plans = await this.plansRepository.find({
        order: { createdAt: 'DESC' },
      });

      this.logger.log(`Found ${plans.length} plans`);
      return plans.map((plan) => this.toResponseDto(plan));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error fetching plans: ${errorMessage}`, errorStack);
      throw error;
    }
  }

  async findActive(): Promise<PlanResponseDto[]> {
    try {
      this.logger.log('Fetching active plans');
      const plans = await this.plansRepository.find({
        where: { active: true },
        order: { name: 'ASC' },
      });

      this.logger.log(`Found ${plans.length} active plans`);
      return plans.map((plan) => this.toResponseDto(plan));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Error fetching active plans: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<PlanResponseDto> {
    try {
      this.logger.log(`Fetching plan with ID: ${id}`);
      const plan = await this.plansRepository.findOne({
        where: { id },
      });

      if (!plan) {
        throw new NotFoundException(`Plan with ID ${id} not found`);
      }

      return this.toResponseDto(plan);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Error fetching plan ${id}: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }

  async update(
    id: string,
    updatePlanDto: UpdatePlanDto,
  ): Promise<PlanResponseDto> {
    try {
      this.logger.log(`Updating plan with ID: ${id}`);

      const plan = await this.plansRepository.findOne({
        where: { id },
      });

      if (!plan) {
        throw new NotFoundException(`Plan with ID ${id} not found`);
      }

      // Check if new name conflicts with existing plan
      if (updatePlanDto.name && updatePlanDto.name !== plan.name) {
        const existingPlan = await this.plansRepository.findOne({
          where: { name: updatePlanDto.name },
        });

        if (existingPlan) {
          throw new ConflictException(
            `Plan with name "${updatePlanDto.name}" already exists`,
          );
        }
      }

      Object.assign(plan, updatePlanDto);
      const updatedPlan = await this.plansRepository.save(plan);

      this.logger.log(
        `Plan updated successfully: ${updatedPlan.name} (ID: ${updatedPlan.id})`,
      );

      return this.toResponseDto(updatedPlan);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Error updating plan ${id}: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.log(`Removing plan with ID: ${id}`);

      const plan = await this.plansRepository.findOne({
        where: { id },
      });

      if (!plan) {
        throw new NotFoundException(`Plan with ID ${id} not found`);
      }

      await this.plansRepository.remove(plan);

      this.logger.log(`Plan removed successfully: ${plan.name} (ID: ${id})`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Error removing plan ${id}: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }

  private toResponseDto(plan: PlansTypeOrmEntity): PlanResponseDto {
    return {
      id: plan.id,
      name: plan.name,
      service: plan.service,
      description: plan.description,
      active: plan.active,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }
}
