import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_DATABASE'),
                entities: [__dirname + '/../../**/*.typeorm-entity{.ts,.js}'],
                synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
                logging: configService.get<boolean>('DB_LOGGING', false),
                charset: 'utf8mb4',
                timezone: 'Z',
            }),
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule { }
