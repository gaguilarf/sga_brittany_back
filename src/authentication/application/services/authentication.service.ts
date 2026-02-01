import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';

// Type-safe wrappers for bcryptjs to avoid ESLint warnings
const hashPassword = async (
  password: string,
  saltRounds: number,
): Promise<string> => {
  return bcrypt.hash(password, saltRounds) as Promise<string>;
};

const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash) as Promise<boolean>;
};
import { UsersTypeOrmEntity } from '../../../users/infrastructure/persistence/typeorm/users.typeorm-entity';
import { RegisterDto } from '../../domain/dtos/register.dto';
import { LoginDto } from '../../domain/dtos/login.dto';
import { AuthResponseDto } from '../../domain/dtos/auth-response.dto';
import { JwtPayload } from '../../domain/interfaces/jwt-payload.interface';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    @InjectRepository(UsersTypeOrmEntity)
    private readonly usersRepository: Repository<UsersTypeOrmEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    try {
      this.logger.log(`Registering new user: ${registerDto.username}`);

      // Check if username already exists
      const existingUser = await this.usersRepository.findOne({
        where: { username: registerDto.username },
      });

      if (existingUser) {
        throw new ConflictException('Username already exists');
      }

      // Check if email already exists
      const existingEmail = await this.usersRepository.findOne({
        where: { email: registerDto.email },
      });

      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }

      // Hash password
      const hashedPassword = await hashPassword(registerDto.password, 10);

      // Create user
      const user = this.usersRepository.create({
        username: registerDto.username,
        password: hashedPassword,
        fullname: registerDto.fullname,
        email: registerDto.email,
        phone: registerDto.phone,
        roleId: registerDto.roleId,
        active: true,
      });

      const savedUser = await this.usersRepository.save(user);

      this.logger.log(`User registered successfully: ${savedUser.username}`);

      return this.toAuthResponse(savedUser);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error registering user: ${errorMessage}`, errorStack);
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    try {
      this.logger.log(`Login attempt for user: ${loginDto.username}`);

      const user = await this.validateUser(
        loginDto.username,
        loginDto.password,
      );

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload: JwtPayload = {
        sub: user.id,
        username: user.username,
        fullname: user.fullname,
        roleId: user.roleId,
      };

      const accessToken = this.jwtService.sign(payload);

      this.logger.log(`User logged in successfully: ${user.username}`);

      return {
        ...this.toAuthResponse(user),
        accessToken,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error during login: ${errorMessage}`, errorStack);
      throw error;
    }
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<UsersTypeOrmEntity | null> {
    const user = await this.usersRepository.findOne({
      where: { username, active: true },
      relations: ['role'],
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async getCurrentUser(userId: string): Promise<AuthResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { id: userId, active: true },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toAuthResponse(user);
  }

  async refreshToken(userId: string): Promise<{ accessToken: string }> {
    const user = await this.usersRepository.findOne({
      where: { id: userId, active: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      fullname: user.fullname,
      roleId: user.roleId,
    };

    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  private toAuthResponse(user: UsersTypeOrmEntity): AuthResponseDto {
    return {
      id: user.id,
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      roleId: user.roleId,
      roleName: user.role?.name,
    };
  }
}
