import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersTypeOrmEntity } from '../../infrastructure/persistence/typeorm/users.typeorm-entity';
import { UserResponseDto } from '../../domain/dtos/user-response.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UsersTypeOrmEntity)
    private readonly usersRepository: Repository<UsersTypeOrmEntity>,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    try {
      this.logger.log('Fetching all users');
      const users = await this.usersRepository.find({
        relations: ['role'],
        order: { createdAt: 'DESC' },
      });
      return users.map((u) => this.toResponseDto(u));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error fetching users: ${errorMessage}`, errorStack);
      throw error;
    }
  }

  private toResponseDto(entity: UsersTypeOrmEntity): UserResponseDto {
    return {
      id: entity.id,
      username: entity.username,
      roleId: entity.roleId,
      fullname: entity.fullname,
      email: entity.email,
      phone: entity.phone,
      active: entity.active,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
