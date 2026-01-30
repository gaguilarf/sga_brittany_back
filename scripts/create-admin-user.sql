-- ============================================
-- CREAR USUARIO ADMIN - ESTRUCTURA ACTUALIZADA
-- ============================================
-- Tabla: users
-- ID: Auto-incremental (int)
-- Contraseña: Admin123!

-- PASO 1: Obtener el ID del rol Administrador
SELECT id FROM roles WHERE name = 'Administrador';

-- PASO 2: Crear el usuario admin
-- ⚠️ IMPORTANTE: Reemplaza '1' con el ID obtenido en el paso 1 si es diferente

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
  'admin',
  '$2a$10$8DG/OdtRHljXMe1aB4RgWusx2XAOc3Lpsr1Ol7q0pGqP9F9hc5ZZC',  -- Hash de "Admin123!"
  1,  -- ⚠️ Reemplaza con el ID del rol si es diferente
  'Administrador del Sistema',
  'admin@brittanygroup.edu.pe',
  '999999999',
  NOW(),
  NOW(),
  1
);

-- PASO 3: Verificar que el usuario fue creado
SELECT id, username, fullname, email, role_id, active 
FROM users 
WHERE username = 'admin';

-- ============================================
-- ESTRUCTURA DE LA TABLA USERS
-- ============================================
/*
CREATE TABLE users (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role_id INT(11) NOT NULL,
  fullname VARCHAR(255) NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(20) NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  active TINYINT(4) NOT NULL DEFAULT 1,
  UNIQUE KEY username (username),
  KEY role_id (role_id),
  KEY email (email)
);
*/
