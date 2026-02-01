import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

async function seedRoles() {
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

    // Check if roles already exist
    const [existingRoles] = await dataSource.query(
      'SELECT COUNT(*) as count FROM roles',
    );
    if (existingRoles.count > 0) {
      console.log(
        `ℹ️  Roles already exist (${existingRoles.count} roles found). Skipping seed.`,
      );
      await dataSource.destroy();
      return;
    }

    // Insert initial roles with integer IDs
    const roles = [
      {
        id: 1,
        name: 'Administrador',
        description: 'Acceso completo al sistema',
      },
      {
        id: 2,
        name: 'Docente',
        description: 'Acceso a gestión académica y asistencia',
      },
      {
        id: 3,
        name: 'Desarrollador',
        description: 'Acceso técnico al sistema',
      },
      {
        id: 4,
        name: 'Secretaria',
        description: 'Acceso a registro de datos (sin permisos de eliminación)',
      },
    ];

    for (const role of roles) {
      await dataSource.query(
        `INSERT INTO roles (id, name, description, active, created_at, updated_at) 
         VALUES (?, ?, ?, true, NOW(), NOW())`,
        [role.id, role.name, role.description],
      );
      console.log(`✅ Created role: ${role.name}`);
    }

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n💡 You can now register users with these roles');

    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Load environment variables
require('dotenv').config();

seedRoles();
