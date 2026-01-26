import { DataSource } from 'typeorm';

async function seedPrices() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connection established');

    // 0. Clean up old plan IDs (2, 3, 4, 5) as requested
    const oldPlanIds = [2, 3, 4, 5];
    console.log('🧹 Cleaning up old duplicate plans (IDs 2, 3, 4, 5)...');

    for (const id of oldPlanIds) {
      // First delete associated prices to avoid FK constraint issues
      await dataSource.query(
        'DELETE FROM precios_sede_plan WHERE plan_id = ?',
        [id],
      );
      // Then delete the plan
      await dataSource.query('DELETE FROM planes WHERE id = ?', [id]);
    }
    console.log('   ✅ Cleanup finished.');

    // 1. Ensure planes exist
    const priceConfigs = [
      { id: 13, name: 'Plan Standard', precio: 280.0, service: 'Matrícula' },
      { id: 14, name: 'Plan Premium', precio: 329.0, service: 'Matrícula' },
      { id: 15, name: 'Plan Plus', precio: 299.0, service: 'Matrícula' },
      { id: 16, name: 'Convenio', precio: 245.0, service: 'Matrícula' },
    ];

    console.log('🚀 Ensuring plans exist...');
    for (const config of priceConfigs) {
      const existingPlan = await dataSource.query(
        'SELECT id FROM planes WHERE id = ?',
        [config.id],
      );
      if (existingPlan.length === 0) {
        await dataSource.query(
          'INSERT INTO planes (id, name, service, active, created_at, updated_at) VALUES (?, ?, ?, true, NOW(), NOW())',
          [config.id, config.name, config.service],
        );
        console.log(`   ✅ Created plan: ${config.name} (ID: ${config.id})`);
      } else {
        console.log(`   ℹ️  Plan ${config.name} already exists.`);
      }
    }

    // 2. Get all campuses
    const campuses = await dataSource.query(
      'SELECT id, name FROM sedes WHERE active = true',
    );
    console.log(`ℹ️  Found ${campuses.length} active campuses`);

    const precioInscripcion = 80.0;
    const precioMateriales = 80.0;
    const fechaInicio = '2024-01-01';

    console.log('🚀 Seeding prices for all campuses...');

    for (const campus of campuses) {
      console.log(`   📍 Campus: ${campus.name} (ID: ${campus.id})`);

      for (const config of priceConfigs) {
        // Check if price already exists for this campus/plan
        const existing = await dataSource.query(
          'SELECT id FROM precios_sede_plan WHERE sede_id = ? AND plan_id = ? AND active = true',
          [campus.id, config.id],
        );

        if (existing.length === 0) {
          await dataSource.query(
            `
                        INSERT INTO precios_sede_plan 
                        (sede_id, plan_id, precio_mensualidad, precio_inscripcion, precio_materiales, fecha_inicio_vigencia, active, created_at, updated_at) 
                        VALUES (?, ?, ?, ?, ?, ?, true, NOW(), NOW())`,
            [
              campus.id,
              config.id,
              config.precio,
              precioInscripcion,
              precioMateriales,
              fechaInicio,
            ],
          );
          console.log(`      ✅ Added ${config.name} (S/. ${config.precio})`);
        } else {
          console.log(`      ℹ️  ${config.name} already configured. Skipping.`);
        }
      }
    }

    console.log('\n🎉 Seed completed successfully!');
    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Error seeding prices:', error);
    process.exit(1);
  }
}

// Load environment variables
require('dotenv').config();

seedPrices();
