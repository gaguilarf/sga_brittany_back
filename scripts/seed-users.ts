import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

async function seedUsers() {
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

    // Get admin role ID
    const [roles] = await dataSource.query(
      "SELECT id FROM roles WHERE name = 'Administrador' LIMIT 1",
    );

    if (!roles) {
      console.error('❌ Admin role not found. Please run seed-roles first.');
      process.exit(1);
    }

    const adminRoleId = roles.id;

    // Hash password
    const hashedPassword = await bcrypt.hash('SecurePassword123!', 10);

    // Create users
    const users = [
      {
        id: uuidv4(),
        username: 'Eduardo',
        password: hashedPassword,
        roleId: adminRoleId,
        fullname: 'Eduardo Durand Obando',
        email: 'eduardo@brittanygroup.edu.pe',
        phone: '+51933069319',
        active: true,
      },
      {
        id: uuidv4(),
        username: 'Gustavo',
        password: hashedPassword,
        roleId: adminRoleId,
        fullname: 'Gustavo Administrador',
        email: 'gustavo@brittanygroup.edu.pe',
        phone: '+51999999999',
        active: true,
      },
    ];

    for (const user of users) {
      // Check if user already exists
      const [existing] = await dataSource.query(
        'SELECT id FROM users WHERE username = ?',
        [user.username],
      );

      if (existing) {
        console.log(`ℹ️  User ${user.username} already exists. Skipping.`);
        continue;
      }

      await dataSource.query(
        `INSERT INTO users (id, username, password, role_id, fullname, email, phone, active, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          user.id,
          user.username,
          user.password,
          user.roleId,
          user.fullname,
          user.email,
          user.phone,
          user.active,
        ],
      );

      console.log(`✅ Created user: ${user.username} (${user.fullname})`);
    }

    console.log('\n🎉 User seed completed successfully!');
    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
}

// Load environment variables
require('dotenv').config();

seedUsers();
