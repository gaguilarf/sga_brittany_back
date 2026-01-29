import { DataSource } from 'typeorm';

async function cleanDatabase() {
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

    // Disable foreign key checks
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
    console.log('🔒 Foreign key checks disabled');

    const tables = [
      'pagos_adelantados_detalle',
      'pagos',
      'deudas',
      'progreso_alumno',
      'matriculas',
      'alumnos',
    ];

    for (const table of tables) {
      try {
        // Check if table exists before truncating
        const [result] = await dataSource.query(`SHOW TABLES LIKE '${table}'`);
        if (result) {
          await dataSource.query(`TRUNCATE TABLE ${table}`);
          console.log(`🗑️  Truncated table: ${table}`);
        }
      } catch (e) {
        console.log(`⚠️  Could not truncate ${table}: ${e.message}`);
      }
    }

    // Enable foreign key checks
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('🔓 Foreign key checks enabled');

    console.log('\n🎉 Database cleaned successfully!');

    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
    process.exit(1);
  }
}

// Load environment variables
require('dotenv').config();

cleanDatabase();
