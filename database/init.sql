-- Inicialización de Base de Datos - Óptica Danniels
-- ================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- para crypt('...', gen_salt('bf'))

-- =========================
-- TABLAS
-- =========================

-- Tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    rol VARCHAR(50) DEFAULT 'cliente',
    activo BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla productos
CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio INTEGER NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    subcategoria VARCHAR(100),
    imagen_url TEXT,
    stock INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT true,
    marca VARCHAR(100) NOT NULL,
    "codigoSKU" VARCHAR(100) UNIQUE NOT NULL,
    oferta BOOLEAN DEFAULT false,
    descuento INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla direcciones
CREATE TABLE IF NOT EXISTS direcciones (
    id SERIAL PRIMARY KEY,
    "usuarioId" INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    direccion TEXT NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL DEFAULT 'Sin región',
    "codigoPostal" VARCHAR(20),
    telefono VARCHAR(20),
    principal BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla ordenes
CREATE TABLE IF NOT EXISTS ordenes (
    id SERIAL PRIMARY KEY,
    "usuarioId" INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    "direccionId" INTEGER REFERENCES direcciones(id),
    estado VARCHAR(50) DEFAULT 'pendiente',
    total INTEGER NOT NULL,
    "fechaEntrega" DATE,
    observaciones TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla orden_productos (relación many-to-many)
CREATE TABLE IF NOT EXISTS orden_productos (
    id SERIAL PRIMARY KEY,
    "ordenId" INTEGER REFERENCES ordenes(id) ON DELETE CASCADE,
    "productoId" INTEGER REFERENCES productos(id) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio INTEGER NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla wishlist
CREATE TABLE IF NOT EXISTS wishlist (
    id SERIAL PRIMARY KEY,
    "usuarioId" INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    "productoId" INTEGER REFERENCES productos(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("usuarioId", "productoId")
);

-- =========================
-- SEED: USUARIOS
-- =========================

-- Admin/cliente genéricos (password: "password")
INSERT INTO usuarios (email, password, nombre, rol) 
VALUES (
    'admin@optica.com', 
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Administrador Sistema',
    'administrador'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO usuarios (email, password, nombre, rol) 
VALUES (
    'cliente@test.com', 
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Cliente de Prueba',
    'cliente'
) ON CONFLICT (email) DO NOTHING;

-- Usuarios del antiguo initialSetup.js (mismas contraseñas)
INSERT INTO usuarios (email, password, nombre, rol)
VALUES (
    'administrador2025@gmail.cl',
    crypt('Admin12345', gen_salt('bf')),
    'Lucas Gabriel Méndez Risopatrón',
    'administrador'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO usuarios (email, password, nombre, rol)
VALUES (
    'usuario1@gmail.cl',
    crypt('User12345', gen_salt('bf')),
    'Usuario de Prueba Uno',
    'usuario'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO usuarios (email, password, nombre, rol)
VALUES (
    'usuario2@gmail.cl',
    crypt('User12345', gen_salt('bf')),
    'Usuario de Prueba Dos',
    'usuario'
) ON CONFLICT (email) DO NOTHING;

-- =========================
-- SEED: PRODUCTOS (7) con imagen_url en /uploads/productos/...
-- =========================
INSERT INTO productos (nombre, descripcion, precio, categoria, marca, "codigoSKU", stock, imagen_url) VALUES
('Ray-Ban Aviator Clásico', 'Gafas de sol icónicas con diseño atemporal', 89990, 'Gafas de Sol', 'Ray-Ban', 'RB-AVIATOR-001', 15, '/uploads/productos/imagen-1751688907067-771859604.webp'),
('Oakley Holbrook Polarizado', 'Gafas deportivas con lentes polarizadas', 129990, 'Gafas Deportivas', 'Oakley', 'OK-HOLBROOK-001', 10, '/uploads/productos/imagen-1751689044390-958899014.webp'),
('Lentes Acuvue Oasys Daily', 'Lentes de contacto diarios ultra cómodos', 25990, 'Lentes de Contacto', 'Acuvue', 'AC-OASYS-001', 50, '/uploads/productos/imagen-1751689180232-810973486.webp'),
('Ray-Ban Wayfarer Negro', 'El modelo más vendido de Ray-Ban', 79990, 'Gafas de Sol', 'Ray-Ban', 'RB-WAYFARER-001', 20, '/uploads/productos/imagen-1751689254184-303307536.webp'),
('Oakley Frogskins Sport', 'Estilo retro con tecnología moderna', 119990, 'Gafas Deportivas', 'Oakley', 'OK-FROGSKINS-001', 8, '/uploads/productos/imagen-1751689422943-911370221.jpg'),
('Ray-Ban Round Metal', 'Diseño circular clásico en metal', 94990, 'Gafas de Sol', 'Ray-Ban', 'RB-ROUND-001', 12, '/uploads/productos/imagen-1751949381836-127102605.webp'),
('Oakley Radar EV Path', 'Máximo rendimiento para deportistas', 149990, 'Gafas Deportivas', 'Oakley', 'OK-RADAR-001', 6, '/uploads/productos/imagen-1752381832190-952681585.webp')
ON CONFLICT ("codigoSKU") DO NOTHING;

-- Dirección de ejemplo para usuario cliente
INSERT INTO direcciones ("usuarioId", nombre, direccion, ciudad, "codigoPostal", telefono, principal) 
SELECT 
    u.id,
    'Casa Principal',
    'Av. Providencia 1234, Providencia',
    'Santiago',
    '7500000',
    '+56912345678',
    true
FROM usuarios u 
WHERE u.email = 'cliente@test.com'
ON CONFLICT DO NOTHING;

-- =========================
-- ÍNDICES
-- =========================
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON usuarios(activo);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);
CREATE INDEX IF NOT EXISTS idx_productos_codigo ON productos("codigoSKU");
CREATE INDEX IF NOT EXISTS idx_direcciones_usuario ON direcciones("usuarioId");
CREATE INDEX IF NOT EXISTS idx_direcciones_principal ON direcciones(principal);
CREATE INDEX IF NOT EXISTS idx_ordenes_usuario ON ordenes("usuarioId");
CREATE INDEX IF NOT EXISTS idx_ordenes_estado ON ordenes(estado);
CREATE INDEX IF NOT EXISTS idx_wishlist_usuario ON wishlist("usuarioId");
CREATE INDEX IF NOT EXISTS idx_wishlist_producto ON wishlist("productoId");

-- =========================
-- TRIGGERS updatedAt
-- =========================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios;
CREATE TRIGGER update_usuarios_updated_at 
    BEFORE UPDATE ON usuarios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_productos_updated_at ON productos;
CREATE TRIGGER update_productos_updated_at 
    BEFORE UPDATE ON productos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_direcciones_updated_at ON direcciones;
CREATE TRIGGER update_direcciones_updated_at 
    BEFORE UPDATE ON direcciones 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ordenes_updated_at ON ordenes;
CREATE TRIGGER update_ordenes_updated_at 
    BEFORE UPDATE ON ordenes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================
-- RESUMEN
-- =========================
DO $$
DECLARE
    usuario_count INTEGER;
    producto_count INTEGER;
    direccion_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO usuario_count FROM usuarios;
    SELECT COUNT(*) INTO producto_count FROM productos;
    SELECT COUNT(*) INTO direccion_count FROM direcciones;
    
    RAISE NOTICE '';
    RAISE NOTICE '🎉 ======================================';
    RAISE NOTICE '🎉  ÓPTICA DANNIELS - BASE DE DATOS LISTA';
    RAISE NOTICE '🎉 ======================================';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Usuarios creados: %', usuario_count;
    RAISE NOTICE '✅ Productos creados: %', producto_count;
    RAISE NOTICE '✅ Direcciones creadas: %', direccion_count;
    RAISE NOTICE '';
    RAISE NOTICE '👤 Credenciales Admin:';
    RAISE NOTICE '   📧 Email: admin@optica.com / 🔑 password';
    RAISE NOTICE '   📧 Email: administrador2025@gmail.cl / 🔑 Admin12345';
    RAISE NOTICE '';
    RAISE NOTICE '👤 Credenciales Cliente/Usuario:';
    RAISE NOTICE '   📧 Email: cliente@test.com / 🔑 password';
    RAISE NOTICE '   📧 Email: usuario1@gmail.cl / 🔑 User12345';
    RAISE NOTICE '   📧 Email: usuario2@gmail.cl / 🔑 User12345';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 ¡Sistema listo para usar!';
    RAISE NOTICE '';
END $$;
