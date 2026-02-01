import {
  Injectable,
  NotFoundException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CampusesTypeOrmEntity } from '../../infrastructure/persistence/typeorm/campuses.typeorm-entity';
import { CreateCampusDto } from '../../domain/dtos/create-campus.dto';
import { UpdateCampusDto } from '../../domain/dtos/update-campus.dto';
import { CampusResponseDto } from '../../domain/dtos/campus-response.dto';

@Injectable()
export class CampusesService {
  private readonly logger = new Logger(CampusesService.name);

  constructor(
    @InjectRepository(CampusesTypeOrmEntity)
    private readonly campusesRepository: Repository<CampusesTypeOrmEntity>,
  ) {}

  async create(createCampusDto: CreateCampusDto): Promise<CampusResponseDto> {
    try {
      this.logger.log(`Creating new campus: ${createCampusDto.name}`);

      // Check if campus with same name already exists
      const existingCampus = await this.campusesRepository.findOne({
        where: { name: createCampusDto.name },
      });

      if (existingCampus) {
        throw new ConflictException(
          `Campus with name "${createCampusDto.name}" already exists`,
        );
      }

      const campus = this.campusesRepository.create(createCampusDto);
      const savedCampus = await this.campusesRepository.save(campus);

      this.logger.log(
        `Campus created successfully: ${savedCampus.name} (ID: ${savedCampus.id})`,
      );

      return this.toResponseDto(savedCampus);
    } catch (error) {
      this.logger.error(`Error creating campus: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<CampusResponseDto[]> {
    try {
      this.logger.log('Fetching all campuses');
      const campuses = await this.campusesRepository.find({
        order: { createdAt: 'DESC' },
      });

      this.logger.log(`Found ${campuses.length} campuses`);
      return campuses.map((campus) => this.toResponseDto(campus));
    } catch (error) {
      this.logger.error(
        `Error fetching campuses: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findActive(): Promise<CampusResponseDto[]> {
    try {
      this.logger.log('Fetching active campuses');
      const campuses = await this.campusesRepository.find({
        where: { active: true },
        order: { name: 'ASC' },
      });

      this.logger.log(`Found ${campuses.length} active campuses`);
      return campuses.map((campus) => this.toResponseDto(campus));
    } catch (error) {
      this.logger.error(
        `Error fetching active campuses: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<CampusResponseDto> {
    try {
      this.logger.log(`Fetching campus with ID: ${id}`);
      const campus = await this.campusesRepository.findOne({
        where: { id },
      });

      if (!campus) {
        throw new NotFoundException(`Campus with ID ${id} not found`);
      }

      return this.toResponseDto(campus);
    } catch (error) {
      this.logger.error(
        `Error fetching campus ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(
    id: string,
    updateCampusDto: UpdateCampusDto,
  ): Promise<CampusResponseDto> {
    try {
      this.logger.log(`Updating campus with ID: ${id}`);

      const campus = await this.campusesRepository.findOne({
        where: { id },
      });

      if (!campus) {
        throw new NotFoundException(`Campus with ID ${id} not found`);
      }

      // Check if new name conflicts with existing campus
      if (updateCampusDto.name && updateCampusDto.name !== campus.name) {
        const existingCampus = await this.campusesRepository.findOne({
          where: { name: updateCampusDto.name },
        });

        if (existingCampus) {
          throw new ConflictException(
            `Campus with name "${updateCampusDto.name}" already exists`,
          );
        }
      }

      Object.assign(campus, updateCampusDto);
      const updatedCampus = await this.campusesRepository.save(campus);

      this.logger.log(
        `Campus updated successfully: ${updatedCampus.name} (ID: ${updatedCampus.id})`,
      );

      return this.toResponseDto(updatedCampus);
    } catch (error) {
      this.logger.error(
        `Error updating campus ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.log(`Removing campus with ID: ${id}`);

      const campus = await this.campusesRepository.findOne({
        where: { id },
      });

      if (!campus) {
        throw new NotFoundException(`Campus with ID ${id} not found`);
      }

      await this.campusesRepository.remove(campus);

      this.logger.log(
        `Campus removed successfully: ${campus.name} (ID: ${id})`,
      );
    } catch (error) {
      this.logger.error(
        `Error removing campus ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private toResponseDto(campus: CampusesTypeOrmEntity): CampusResponseDto {
    return {
      id: campus.id,
      name: campus.name,
      address: campus.address,
      district: campus.district,
      active: campus.active,
      createdAt: campus.createdAt,
      updatedAt: campus.updatedAt,
    };
  }
}
