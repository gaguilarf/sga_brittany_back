import { DataSource } from 'typeorm';
import { v5 as uuidv5 } from 'uuid';
import * as dotenv from 'dotenv';

dotenv.config();

// Deterministic UUID Namespace for SGA
const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

function getUUID(name: string): string {
  return uuidv5(name, NAMESPACE);
}

async function seed() {
  const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'sga_db',
    synchronize: false,
  });

  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    // Clean up academic tables to ensure a fresh deterministic seed
    console.log('🗑️ Cleaning academic tables...');
    try {
      await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 0');
      await AppDataSource.query('TRUNCATE TABLE ciclos');
      await AppDataSource.query('TRUNCATE TABLE niveles');
      await AppDataSource.query('TRUNCATE TABLE planes');
      await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (e) {
      console.log(
        '⚠️ Could not truncate tables, proceeding with INSERT strategy.',
      );
    }

    // 1. Seed Planes
    console.log('\n🌱 Seeding Plans...');
    const plansData = [
      { name: 'Curso de 1 año', precio: 280.0, duracion: 12 },
      { name: 'Curso de 18 meses', precio: 299.0, duracion: 18 },
      { name: 'Kids', precio: 329.0, duracion: 18 },
      { name: 'Pre-Kids', precio: null, duracion: 9 },
    ];

    for (const p of plansData) {
      const planId = getUUID(
        `PLAN_${p.name.toUpperCase().replace(/\s/g, '_')}`,
      );
      await AppDataSource.query(
        `INSERT INTO planes (id, name, precio, service, duracion_meses, active, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [planId, p.name, p.precio, 'Matrícula', p.duracion, true],
      );
      console.log(`📦 Plan: ${p.name} (${planId})`);

      // 2. Seed Levels and Cycles based on Program rules
      if (p.name === 'Curso de 1 año' || p.name === 'Curso de 18 meses') {
        const levels = [
          { name: 'Básico', orden: 1 },
          { name: 'Intermedio', orden: 2 },
          { name: 'Avanzado', orden: 3 },
        ];

        const cyclesByLevel = p.name === 'Curso de 1 año' ? 4 : 6;
        const duracionCiclo = p.name === 'Curso de 1 año' ? 2 : 3;

        for (const l of levels) {
          const levelId = getUUID(
            `LEVEL_${p.name.toUpperCase()}_${l.name.toUpperCase()}`,
          );
          const totalDuracionNivel = cyclesByLevel * duracionCiclo;

          await AppDataSource.query(
            `INSERT INTO niveles (id, plan_id, nombre_nivel, orden, duracion_meses, active, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [levelId, planId, l.name, l.orden, totalDuracionNivel, true],
          );
          console.log(`  📂 Level: ${l.name}`);

          const cycleNames = getCycleNamesForLevel(l.name, cyclesByLevel);
          for (let i = 0; i < cycleNames.length; i++) {
            const cycleName = cycleNames[i];
            const cycleId = getUUID(
              `CYCLE_${p.name.toUpperCase()}_${l.name.toUpperCase()}_${cycleName.toUpperCase().replace(/\s/g, '_')}`,
            );

            await AppDataSource.query(
              `INSERT INTO ciclos (id, nivel_id, nombre_ciclo, orden, duracion_meses, libro, active, created_at, updated_at) 
               VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
              [
                cycleId,
                levelId,
                cycleName,
                i + 1,
                duracionCiclo,
                cycleName,
                true,
              ],
            );
          }
        }
      } else if (p.name === 'Kids') {
        const levelName = 'KIDS';
        const levelId = getUUID(`LEVEL_${p.name.toUpperCase()}_${levelName}`);

        await AppDataSource.query(
          `INSERT INTO niveles (id, plan_id, nombre_nivel, orden, duracion_meses, active, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [levelId, planId, levelName, 1, 18, true],
        );
        console.log(`  📂 Level: ${levelName}`);

        for (let i = 1; i <= 18; i++) {
          const cycleName = `KIDS ${i}`;
          const cycleId = getUUID(
            `CYCLE_${p.name.toUpperCase()}_${cycleName.replace(/\s/g, '_')}`,
          );

          await AppDataSource.query(
            `INSERT INTO ciclos (id, nivel_id, nombre_ciclo, orden, duracion_meses, libro, active, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [cycleId, levelId, cycleName, i, 1, cycleName, true],
          );
        }
      } else if (p.name === 'Pre-Kids') {
        const levelName = 'PRE-KIDS';
        const levelId = getUUID(`LEVEL_${p.name.toUpperCase()}_${levelName}`);

        await AppDataSource.query(
          `INSERT INTO niveles (id, plan_id, nombre_nivel, orden, duracion_meses, active, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [levelId, planId, levelName, 1, 9, true],
        );
        console.log(`  📂 Level: ${levelName}`);

        for (let i = 1; i <= 9; i++) {
          const cycleName = `PREKIDS ${i}`;
          const cycleId = getUUID(
            `CYCLE_${p.name.toUpperCase()}_${cycleName.replace(/\s/g, '_')}`,
          );

          await AppDataSource.query(
            `INSERT INTO ciclos (id, nivel_id, nombre_ciclo, orden, duracion_meses, libro, active, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [cycleId, levelId, cycleName, i, 1, cycleName, true],
          );
        }
      }
    }

    console.log('\n✨ Academic seed completed successfully!');
    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

function getCycleNamesForLevel(levelName: string, count: number): string[] {
  if (levelName === 'Básico') {
    const base = [
      'Beginner 1',
      'Beginner 2',
      'Beginner 3',
      'Elementary 1',
      'Elementary 2',
      'Elementary 3',
    ];
    return base.slice(0, count);
  }
  if (levelName === 'Intermedio') {
    const base = [
      'Pre Intermediate 1',
      'Pre Intermediate 2',
      'Pre Intermediate 3',
      'Intermediate 1',
      'Intermediate 2',
      'Intermediate 3',
    ];
    return base.slice(0, count);
  }
  if (levelName === 'Avanzado') {
    const base = [
      'Upper Intermediate 1',
      'Upper Intermediate 2',
      'Upper Intermediate 3',
      'Advanced 1',
      'Advanced 2',
      'Advanced 3',
    ];
    return base.slice(0, count);
  }
  return [];
}

seed();
