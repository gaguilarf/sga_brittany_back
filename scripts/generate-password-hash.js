const bcrypt = require('bcryptjs');

// ============================================
// CONFIGURACIÓN - CAMBIA ESTOS VALORES
// ============================================
const userData = {
  password: 'Admin123!',        // Contraseña que quieres hashear
  username: 'admin',
  fullname: 'Administrador del Sistema',
  email: 'admin@brittanygroup.edu.pe',
  phone: '999999999',
  roleName: 'Administrador'     // Nombre del rol
};

const saltRounds = 10;

// ============================================
// GENERAR HASH Y SQL
// ============================================
async function generateUserSQL() {
  try {
    const hash = await bcrypt.hash(userData.password, saltRounds);
    
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║           HASH DE CONTRASEÑA GENERADO                          ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    console.log('Contraseña original:', userData.password);
    console.log('Hash bcrypt:        ', hash);
    console.log('\n');
    
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║           SENTENCIA SQL PARA CREAR USUARIO                     ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    
    const sql = `-- Paso 1: Obtener el ID del rol
SELECT id FROM roles WHERE name = '${userData.roleName}';

-- Paso 2: Insertar el usuario (reemplaza TU_ROL_ID con el resultado del paso 1)
INSERT INTO users (
  username,
  password,
  role_id,
  fullname,
  email,
  phone,
  created_at,
  updated_at,
  active
) VALUES (
  '${userData.username}',
  '${hash}',
  TU_ROL_ID,  -- ⚠️ REEMPLAZA ESTO con el ID del rol del paso 1
  '${userData.fullname}',
  '${userData.email}',
  '${userData.phone}',
  NOW(),
  NOW(),
  1
);

-- Verificar que el usuario fue creado
SELECT id, username, fullname, email, role_id, active 
FROM users 
WHERE username = '${userData.username}';`;
    
    console.log(sql);
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║                    INSTRUCCIONES                               ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    console.log('1. Ejecuta el paso 1 para obtener el ID del rol');
    console.log('2. Copia el ID del rol (ejemplo: 1, 2, 3, etc.)');
    console.log('3. Reemplaza "TU_ROL_ID" en el paso 2 con ese ID');
    console.log('4. Ejecuta el paso 2 para crear el usuario');
    console.log('5. Ejecuta la verificación para confirmar\n');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

generateUserSQL();
