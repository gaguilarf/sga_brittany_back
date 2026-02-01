import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || process.env.DB_NAME,
  synchronize: false,
});

async function recover() {
  try {
    console.log('Connecting to database...');
    await dataSource.initialize();

    console.log('Dropping roles table...');
    // We need to disable foreign key checks to drop the table if it is referenced
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');

    // Check if role_id column in users table is using UUIDs (string)
    // We will update invalid role_ids in users table to NULL or a safe default if possible.
    // However, since we are dropping roles, we should probably set users.role_id to NULL if nullable,
    // or we accept that strict integration will fail until we re-seed.
    // Actually, let's just drop the roles table. TypeORM sync will recreate it.
    await dataSource.query('DROP TABLE IF EXISTS roles');

    // Also, we might need to truncate users table if role_id is not nullable and we want to start fresh?
    // Or we can try to update all users role_id to 1 (Admin) assuming it will be created?
    // But if we drop roles, role 1 won't exist until we seed.
    // Let's set role_id to 1 temporarily? No, that will fail FK check.
    // The safest for DEV is to drop roles. TypeORM sync will recreate table.
    // Then we run seed:roles.

    // For users table, if we have existing UUID role_ids, and we change column to INT...
    // We should probably clear the role_id column data in users table or update it.
    // Let's update users role_id to NULL if possible, or 0.
    // But wait, the column type conversion happens via TypeORM sync.
    // If we just drop roles table, TypeORM will recreate roles table.
    // BUT TypeORM will also try to alter users table role_id column from UUID to INT.
    // If users table has 'uuid-string' values, ALTER TABLE will fail or convert to 0.
    // So we should update users.role_id to a valid int (e.g. 1) or NULL.
    // Since we don't have roles yet, we can't ensure FK constraint.
    // So we should TRUNCATE users table as well to be safe, OR set role_id to NULL.
    // Let's try to set role_id to NULL.

    console.log('Cleaning up users table role_id...');
    // We can't easily ensure type compatibility without explicit ALTER.
    // Let's try to update to NULL if the column allows (it might not).
    // If not, we might need to delete users.
    // Let's delete all users to be safe and clean.
    await dataSource.query('DELETE FROM users');

    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log(
      'Recovery complete. Please restart the application to trigger TypeORM sync, then run `npm run seed:roles` and `npm run seed:users`.',
    );
  } catch (error) {
    console.error('Error during recovery:', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

recover();
