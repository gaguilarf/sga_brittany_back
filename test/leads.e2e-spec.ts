import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateLeadDto } from '../src/leads/domain/dtos/create-lead.dto';

describe('Leads (e2e)', () => {
    let app: INestApplication;
    let createdLeadId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        // Apply same configuration as main.ts
        app.setGlobalPrefix('api');
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
                transformOptions: {
                    enableImplicitConversion: true,
                },
            }),
        );

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/api/leads (POST)', () => {
        it('should create a new lead', () => {
            const createLeadDto: CreateLeadDto = {
                nombreCompleto: 'María García López',
                edad: 28,
                telefono: '+51987654321',
                modalidad: 'Presencial',
                sede: 'Arequipa - Centro',
                medioContacto: 'Instagram',
                producto: 'Curso de 1 año',
                aceptaContacto: true,
            };

            return request(app.getHttpServer())
                .post('/api/leads')
                .send(createLeadDto)
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('id');
                    expect(res.body.nombreCompleto).toBe(createLeadDto.nombreCompleto);
                    expect(res.body.edad).toBe(createLeadDto.edad);
                    expect(res.body.telefono).toBe(createLeadDto.telefono);
                    expect(res.body).toHaveProperty('fechaRegistro');
                    createdLeadId = res.body.id;
                });
        });

        it('should fail with invalid data - missing required fields', () => {
            return request(app.getHttpServer())
                .post('/api/leads')
                .send({
                    nombreCompleto: 'Test',
                })
                .expect(400);
        });

        it('should fail with invalid data - invalid modalidad', () => {
            const invalidDto = {
                nombreCompleto: 'Test User',
                edad: 25,
                telefono: '+51987654321',
                modalidad: 'InvalidModalidad',
                sede: 'Arequipa - Centro',
                medioContacto: 'Instagram',
                producto: 'Curso de 1 año',
                aceptaContacto: true,
            };

            return request(app.getHttpServer())
                .post('/api/leads')
                .send(invalidDto)
                .expect(400);
        });

        it('should fail with invalid data - edad too low', () => {
            const invalidDto = {
                nombreCompleto: 'Test User',
                edad: 3,
                telefono: '+51987654321',
                modalidad: 'Presencial',
                sede: 'Arequipa - Centro',
                medioContacto: 'Instagram',
                producto: 'Curso de 1 año',
                aceptaContacto: true,
            };

            return request(app.getHttpServer())
                .post('/api/leads')
                .send(invalidDto)
                .expect(400);
        });
    });

    describe('/api/leads (GET)', () => {
        it('should return all leads', () => {
            return request(app.getHttpServer())
                .get('/api/leads')
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body)).toBe(true);
                    expect(res.body.length).toBeGreaterThan(0);
                });
        });
    });

    describe('/api/leads/:id (GET)', () => {
        it('should return a single lead', () => {
            return request(app.getHttpServer())
                .get(`/api/leads/${createdLeadId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toBe(createdLeadId);
                    expect(res.body).toHaveProperty('nombreCompleto');
                    expect(res.body).toHaveProperty('edad');
                });
        });

        it('should return 404 for non-existent lead', () => {
            return request(app.getHttpServer())
                .get('/api/leads/550e8400-e29b-41d4-a716-446655440000')
                .expect(404);
        });
    });

    describe('/api/leads/:id (PATCH)', () => {
        it('should update a lead', () => {
            const updateDto = {
                nombreCompleto: 'María García López Actualizada',
                edad: 29,
            };

            return request(app.getHttpServer())
                .patch(`/api/leads/${createdLeadId}`)
                .send(updateDto)
                .expect(200)
                .expect((res) => {
                    expect(res.body.nombreCompleto).toBe(updateDto.nombreCompleto);
                    expect(res.body.edad).toBe(updateDto.edad);
                });
        });

        it('should return 404 for non-existent lead', () => {
            return request(app.getHttpServer())
                .patch('/api/leads/550e8400-e29b-41d4-a716-446655440000')
                .send({ nombreCompleto: 'Test' })
                .expect(404);
        });

        it('should fail with invalid data', () => {
            return request(app.getHttpServer())
                .patch(`/api/leads/${createdLeadId}`)
                .send({ edad: 3 })
                .expect(400);
        });
    });

    describe('/api/leads/:id (DELETE)', () => {
        it('should delete a lead', () => {
            return request(app.getHttpServer())
                .delete(`/api/leads/${createdLeadId}`)
                .expect(204);
        });

        it('should return 404 when trying to delete non-existent lead', () => {
            return request(app.getHttpServer())
                .delete('/api/leads/550e8400-e29b-41d4-a716-446655440000')
                .expect(404);
        });

        it('should return 404 when trying to get deleted lead', () => {
            return request(app.getHttpServer())
                .get(`/api/leads/${createdLeadId}`)
                .expect(404);
        });
    });
});
