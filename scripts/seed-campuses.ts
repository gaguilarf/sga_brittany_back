import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

async function seedCampuses() {
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

    // Define campuses data
    const campuses = [
      // Lima
      {
        id: uuidv4(),
        name: 'Miraflores',
        address: 'Av. Benavides 330',
        district: 'Miraflores',
        phone: '(01) 4085672',
        city: 'Lima',
        active: true,
      },
      {
        id: uuidv4(),
        name: 'Lince',
        address: 'Av. Arequipa 1604',
        district: 'Lince',
        phone: '(01) 4128243',
        city: 'Lima',
        active: true,
      },
      // Arequipa
      {
        id: uuidv4(),
        name: 'Bustamante',
        address: 'Av. EEUU (a media cuadra de la pizzería Presto)',
        district: 'Bustamante',
        phone: '(054) 691874',
        city: 'Arequipa',
        active: true,
      },
      {
        id: uuidv4(),
        name: 'San José',
        address: 'Calle San José 105, frente a La Ibérica',
        district: 'San José',
        phone: '+51 928 200 102',
        city: 'Arequipa',
        active: true,
      },
      {
        id: uuidv4(),
        name: 'Umacollo',
        address:
          'Calle María Nieves Bustamante 115, Umacollo (a 1/2 cuadra del parque de la U. Católica)',
        district: 'Umacollo',
        phone: '(054) 627563',
        city: 'Arequipa',
        active: true,
      },
      {
        id: uuidv4(),
        name: 'Cayma',
        address:
          'Calle Los Arces 102 (a media cuada del paradero de Real Plaza)',
        district: 'Cayma',
        phone: '+51 957 167 441',
        city: 'Arequipa',
        active: true,
      },
    ];

    for (const campus of campuses) {
      // Check if campus already exists
      const [existing] = await dataSource.query(
        'SELECT id FROM sedes WHERE name = ? AND district = ?',
        [campus.name, campus.district],
      );

      if (existing) {
        console.log(
          `ℹ️  Campus ${campus.name} (${campus.district}) already exists. Skipping.`,
        );
        continue;
      }

      await dataSource.query(
        `INSERT INTO sedes (id, name, address, district, active, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          campus.id,
          campus.name,
          campus.address,
          campus.district,
          campus.active,
        ],
      );

      console.log(
        `✅ Created campus: ${campus.name} - ${campus.district}, ${campus.city} (${campus.phone})`,
      );
    }

    console.log('\n🎉 Campus seed completed successfully!');
    console.log(`\n📍 Total campuses: ${campuses.length}`);
    console.log('   - Lima: 2 sedes (Miraflores, Lince)');
    console.log(
      '   - Arequipa: 4 sedes (Bustamante, San José, Umacollo, Cayma)',
    );

    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Error seeding campuses:', error);
    process.exit(1);
  }
}

// Load environment variables
require('dotenv').config();

seedCampuses();
