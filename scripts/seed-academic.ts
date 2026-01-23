import { DataSource } from 'typeorm';
import { PlansTypeOrmEntity } from '../src/plans/infrastructure/persistence/typeorm/plans.typeorm-entity';
import { CoursesTypeOrmEntity } from '../src/levels/infrastructure/persistence/typeorm/courses.typeorm-entity';
import { LevelsTypeOrmEntity } from '../src/levels/infrastructure/persistence/typeorm/levels.typeorm-entity';
import { CyclesTypeOrmEntity } from '../src/levels/infrastructure/persistence/typeorm/cycles.typeorm-entity';
import * as dotenv from 'dotenv';

dotenv.config();

async function seed() {
  const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'sga_db',
    entities: [__dirname + '/../src/**/*.typeorm-entity{.ts,.js}'],
    synchronize: false,
  });

  try {
    await AppDataSource.initialize();
    console.log('Data Source initialized');

    const planRepo = AppDataSource.getRepository(PlansTypeOrmEntity);
    const courseRepo = AppDataSource.getRepository(CoursesTypeOrmEntity);
    const levelRepo = AppDataSource.getRepository(LevelsTypeOrmEntity);
    const cycleRepo = AppDataSource.getRepository(CyclesTypeOrmEntity);

    // 1. Seed Planes (Sin precios fijos aquí)
    const plans = ['Plan Standard', 'Plan Premium', 'Plan Plus', 'Convenio'];
    for (const pName of plans) {
      const exists = await planRepo.findOne({ where: { name: pName } });
      if (!exists) {
        await planRepo.save({ name: pName, active: true });
        console.log(`Plan ${pName} created`);
      }
    }

    // 2. Seed Cursos
    const cursoNames = [
      'Curso de 1 año',
      'Curso de 18 meses',
      'Curso Kids',
      'Curso Pre-Kids',
    ];
    for (const cName of cursoNames) {
      let curso = await courseRepo.findOne({ where: { name: cName } });
      if (!curso) {
        curso = await courseRepo.save({ name: cName, active: true });
        console.log(`Curso ${cName} created`);
      }

      // 3. Seed Niveles & Ciclos
      if (
        cName === 'Curso de 1 año' ||
        cName === 'Curso Kids' ||
        cName === 'Curso Pre-Kids'
      ) {
        const structure = [
          {
            name: 'Básico',
            duracion: 2,
            ciclos: [
              'Beginner 1',
              'Beginner 2',
              'Elementary 1',
              'Elementary 2',
            ],
          },
          {
            name: 'Intermedio',
            duracion: 2,
            ciclos: [
              'Pre Intermediate 1',
              'Pre Intermediate 2',
              'Intermediate 1',
              'Intermediate 2',
            ],
          },
          {
            name: 'Avanzado',
            duracion: 2,
            ciclos: [
              'Upper Intermediate 1',
              'Upper Intermediate 2',
              'Advanced 1',
              'Advanced 2',
            ],
          },
        ];

        for (let i = 0; i < structure.length; i++) {
          const s = structure[i];
          let level = await levelRepo.findOne({
            where: { nombreNivel: s.name, courseId: curso.id },
          });
          if (!level) {
            level = await levelRepo.save({
              nombreNivel: s.name,
              courseId: curso.id,
              orden: i + 1,
              duracionMeses: s.duracion,
              active: true,
            });
          }

          for (let j = 0; j < s.ciclos.length; j++) {
            const cycleName = s.ciclos[j];
            const cycleExists = await cycleRepo.findOne({
              where: { nombreCiclo: cycleName, levelId: level.id },
            });
            if (!cycleExists) {
              await cycleRepo.save({
                nombreCiclo: cycleName,
                levelId: level.id,
                orden: j + 1,
                active: true,
              });
            }
          }
        }
      } else if (cName === 'Curso de 18 meses') {
        const structure = [
          {
            name: 'Básico',
            duracion: 3,
            ciclos: [
              'Beginner 1',
              'Beginner 2',
              'Beginner 3',
              'Elementary 1',
              'Elementary 2',
              'Elementary 3',
            ],
          },
          {
            name: 'Intermedio',
            duracion: 3,
            ciclos: [
              'Pre Intermediate 1',
              'Pre Intermediate 2',
              'Pre Intermediate 3',
              'Intermediate 1',
              'Intermediate 2',
              'Intermediate 3',
            ],
          },
          {
            name: 'Avanzado',
            duracion: 3,
            ciclos: [
              'Upper Intermediate 1',
              'Upper Intermediate 2',
              'Upper Intermediate 3',
              'Advanced 1',
              'Advanced 2',
              'Advanced 3',
            ],
          },
        ];

        for (let i = 0; i < structure.length; i++) {
          const s = structure[i];
          let level = await levelRepo.findOne({
            where: { nombreNivel: s.name, courseId: curso.id },
          });
          if (!level) {
            level = await levelRepo.save({
              nombreNivel: s.name,
              courseId: curso.id,
              orden: i + 1,
              duracionMeses: s.duracion,
              active: true,
            });
          }

          for (let j = 0; j < s.ciclos.length; j++) {
            const cycleName = s.ciclos[j];
            const cycleExists = await cycleRepo.findOne({
              where: { nombreCiclo: cycleName, levelId: level.id },
            });
            if (!cycleExists) {
              await cycleRepo.save({
                nombreCiclo: cycleName,
                levelId: level.id,
                orden: j + 1,
                active: true,
              });
            }
          }
        }
      }
    }

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error during seed:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

seed();
