import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                const socketPath = configService.get<string>('DB_SOCKET_PATH');
                const config: any = {
                    type: 'mysql',
                    username: configService.get<string>('DB_USERNAME'),
                    password: configService.get<string>('DB_PASSWORD'),
                    database: configService.get<string>('DB_DATABASE'),
                    entities: [__dirname + '/../../**/*.typeorm-entity{.ts,.js}'],
                    synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
                    logging: configService.get<boolean>('DB_LOGGING', false),
                    charset: 'utf8mb4',
                    timezone: 'Z',
                };

                // Use socket path if provided, otherwise use host/port
                if (socketPath) {
                    config.socketPath = socketPath;
                } else {
                    config.host = configService.get<string>('DB_HOST');
                    config.port = configService.get<number>('DB_PORT');
                }

                return config;
            },
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule { }
