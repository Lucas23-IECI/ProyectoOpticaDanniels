-- Inicialización de Base de Datos - Óptica Danniels
-- ================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- para crypt('...', gen_salt('bf'))

-- =========================
-- TABLAS (alineadas a EntitySchema)
-- =========================

-- Tabla users (según Backend/src/entity/user.entity.js)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    "primerNombre"     VARCHAR(100) NOT NULL,
    "segundoNombre"    VARCHAR(100),
    "apellidoPaterno"  VARCHAR(100) NOT NULL,
    "apellidoMaterno"  VARCHAR(100),
    rut                VARCHAR(12)  NOT NULL UNIQUE,
    email              VARCHAR(255) NOT NULL UNIQUE,
    rol                VARCHAR(50)  NOT NULL,
    password           VARCHAR(255) NOT NULL,
    telefono           VARCHAR(20),
    "fechaNacimiento"  DATE,
    genero             VARCHAR(50),
    "createdAt"        TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updatedAt"        TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tabla productos (compatible con tu schema)
CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    precio INTEGER NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    subcategoria VARCHAR(100),
    imagen_url VARCHAR(500),
    stock INTEGER NOT NULL DEFAULT 0,
    activo BOOLEAN NOT NULL DEFAULT true,
    marca VARCHAR(100) NOT NULL,
    "codigoSKU" VARCHAR(100) UNIQUE NOT NULL,
    oferta BOOLEAN NOT NULL DEFAULT false,
    descuento INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tabla direcciones (según Backend/src/entity/direccion.entity.js)
CREATE TABLE IF NOT EXISTS direcciones (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL DEFAULT 'casa',
    direccion VARCHAR(255) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    "codigoPostal" VARCHAR(20),
    "esPrincipal" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tabla ordenes (según Backend/src/entity/orden.entity.js)
-- Soporta checkout con datos inline del cliente (invitados y logueados)
CREATE TABLE IF NOT EXISTS ordenes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(200) NOT NULL,
    observaciones TEXT,
    estado VARCHAR(50) DEFAULT 'pendiente',
    "estadoPago" VARCHAR(50) DEFAULT 'pendiente',
    "metodoPago" VARCHAR(50),
    "metodoEntrega" VARCHAR(50) DEFAULT 'envio',
    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
    iva NUMERIC(10,2) NOT NULL DEFAULT 0,
    "costoEnvio" NUMERIC(10,2) NOT NULL DEFAULT 0,
    total NUMERIC(10,2) NOT NULL DEFAULT 0,
    "transactionId" VARCHAR(255),
    "tokenWs" VARCHAR(255),
    "numeroBoleta" VARCHAR(50) UNIQUE,
    fecha TIMESTAMPTZ DEFAULT NOW(),
    "anonId" VARCHAR(100),
    "direccionId" INTEGER REFERENCES direcciones(id) ON DELETE SET NULL,
    "usuarioId" INTEGER REFERENCES users(id) ON DELETE SET NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Relación ordenes-productos (según Backend/src/entity/ordenProducto.entity.js)
CREATE TABLE IF NOT EXISTS ordenes_productos (
    id SERIAL PRIMARY KEY,
    "ordenId" INTEGER REFERENCES ordenes(id) ON DELETE CASCADE,
    "productoId" INTEGER REFERENCES productos(id) ON DELETE SET NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio NUMERIC(10,2) NOT NULL,
    descuento INTEGER NOT NULL DEFAULT 0,
    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tabla pagos (registro de transacciones de pago)
CREATE TABLE IF NOT EXISTS pagos (
    id SERIAL PRIMARY KEY,
    "ordenId" INTEGER NOT NULL REFERENCES ordenes(id) ON DELETE CASCADE,
    monto NUMERIC(10,2) NOT NULL,
    metodo VARCHAR(50) NOT NULL,
    estado VARCHAR(50) DEFAULT 'iniciado',
    "transactionId" VARCHAR(255),
    "authorizationCode" VARCHAR(100),
    "responseCode" VARCHAR(50),
    "rawResponse" JSONB,
    "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tabla stock_movimientos (trazabilidad de inventario)
CREATE TABLE IF NOT EXISTS stock_movimientos (
    id SERIAL PRIMARY KEY,
    "productoId" INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    "ordenId" INTEGER REFERENCES ordenes(id) ON DELETE SET NULL,
    tipo VARCHAR(50) NOT NULL,
    cantidad INTEGER NOT NULL,
    "stockAnterior" INTEGER NOT NULL,
    "stockNuevo" INTEGER NOT NULL,
    motivo TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Wishlist (lista de deseos del usuario)
CREATE TABLE IF NOT EXISTS wishlist (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "productoId" INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE("userId", "productoId")
);

CREATE TABLE IF NOT EXISTS password_resets (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    "expiresAt" TIMESTAMPTZ NOT NULL,
    used BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tabla reviews (reseñas de productos con moderación admin)
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comentario TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "productoId" INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE("userId", "productoId")
);

CREATE INDEX IF NOT EXISTS idx_review_producto ON reviews ("productoId");
CREATE INDEX IF NOT EXISTS idx_review_usuario ON reviews ("userId");
CREATE INDEX IF NOT EXISTS idx_review_estado ON reviews (estado);

-- Tabla citas (agendar citas genéricas)
CREATE TABLE IF NOT EXISTS citas (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "tipoServicio" VARCHAR(50) NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    notas TEXT,
    "notasAdmin" TEXT,
    telefono VARCHAR(20) NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(fecha, hora)
);

CREATE INDEX IF NOT EXISTS idx_citas_usuario ON citas ("userId");
CREATE INDEX IF NOT EXISTS idx_citas_fecha ON citas (fecha);
CREATE INDEX IF NOT EXISTS idx_citas_estado ON citas (estado);

-- =========================
-- SEED: USUARIOS (coinciden con tu initialSetup.js)
-- =========================
INSERT INTO users
("primerNombre","segundoNombre","apellidoPaterno","apellidoMaterno",rut,email,password,rol,telefono)
VALUES
('Lucas Gabriel', NULL,'Méndez','Risopatrón','21.358.808-7','administrador2025@gmail.cl', crypt('Admin12345', gen_salt('bf')), 'administrador', NULL)
ON CONFLICT (email) DO NOTHING;

INSERT INTO users
("primerNombre","segundoNombre","apellidoPaterno","apellidoMaterno",rut,email,password,rol)
VALUES
('Usuario','de Prueba','Uno',NULL,'11.111.111-1','usuario1@gmail.cl', crypt('User12345', gen_salt('bf')), 'usuario')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users
("primerNombre","segundoNombre","apellidoPaterno","apellidoMaterno",rut,email,password,rol)
VALUES
('Usuario','de Prueba','Dos',NULL,'22.222.222-2','usuario2@gmail.cl', crypt('User12345', gen_salt('bf')), 'usuario')
ON CONFLICT (email) DO NOTHING;

-- También dejamos usuarios genéricos de prueba (password: "password")
INSERT INTO users
("primerNombre","segundoNombre","apellidoPaterno","apellidoMaterno",rut,email,password,rol)
VALUES
('Admin','Sistema','Optica',NULL,'99.999.999-9','admin@optica.com',
'$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','administrador')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users
("primerNombre","segundoNombre","apellidoPaterno","apellidoMaterno",rut,email,password,rol)
VALUES
('Cliente','Prueba','Optica',NULL,'88.888.888-8','cliente@test.com',
'$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','usuario')
ON CONFLICT (email) DO NOTHING;

-- =========================
-- SEED: PRODUCTOS (7)
-- =========================
INSERT INTO productos (nombre, descripcion, precio, categoria, marca, "codigoSKU", stock, imagen_url) VALUES
('Ray-Ban Aviator Clásico', 'Gafas de sol icónicas con diseño atemporal', 89990, 'sol', 'Ray-Ban', 'RB-AVIATOR-001', 15, 'imagen-1751688907067-771859604.webp'),
('Oakley Holbrook Polarizado', 'Gafas deportivas con lentes polarizadas', 129990, 'sol', 'Oakley', 'OK-HOLBROOK-001', 10, 'imagen-1751689044390-958899014.webp'),
('Lentes Acuvue Oasys Daily', 'Lentes de contacto diarios ultra cómodos', 25990, 'opticos', 'Acuvue', 'AC-OASYS-001', 50, 'imagen-1751689180232-810973486.webp'),
('Ray-Ban Wayfarer Negro', 'El modelo más vendido de Ray-Ban', 79990, 'sol', 'Ray-Ban', 'RB-WAYFARER-001', 20, 'imagen-1751689254184-303307536.webp'),
('Oakley Frogskins Sport', 'Estilo retro con tecnología moderna', 119990, 'sol', 'Oakley', 'OK-FROGSKINS-001', 8, 'imagen-1751689422943-911370221.jpg'),
('Ray-Ban Round Metal', 'Diseño circular clásico en metal', 94990, 'sol', 'Ray-Ban', 'RB-ROUND-001', 12, 'imagen-1751949381836-127102605.webp'),
('Oakley Radar EV Path', 'Máximo rendimiento para deportistas', 149990, 'sol', 'Oakley', 'OK-RADAR-001', 6, 'imagen-1752381832190-952681585.webp')
ON CONFLICT ("codigoSKU") DO NOTHING;

-- Dirección ejemplo para 'cliente@test.com'
INSERT INTO direcciones (tipo, direccion, ciudad, region, "codigoPostal", "esPrincipal", "userId")
SELECT 'casa','Av. Providencia 1234, Providencia','Santiago','RM','7500000', true, u.id
FROM users u WHERE u.email = 'cliente@test.com'
ON CONFLICT DO NOTHING;

-- =========================
-- ÍNDICES
-- =========================
CREATE INDEX IF NOT EXISTS idx_users_email   ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_rut     ON users(rut);
CREATE INDEX IF NOT EXISTS idx_products_cat  ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_products_act  ON productos(activo);
CREATE INDEX IF NOT EXISTS idx_products_sku  ON productos("codigoSKU");
CREATE INDEX IF NOT EXISTS idx_dir_user      ON direcciones("userId");
CREATE INDEX IF NOT EXISTS idx_dir_principal ON direcciones("esPrincipal");
CREATE INDEX IF NOT EXISTS idx_ordenes_estado    ON ordenes(estado);
CREATE INDEX IF NOT EXISTS idx_ordenes_correo    ON ordenes(correo);
CREATE INDEX IF NOT EXISTS idx_ordenes_usuario   ON ordenes("usuarioId");
CREATE INDEX IF NOT EXISTS idx_ordprod_orden     ON ordenes_productos("ordenId");
CREATE INDEX IF NOT EXISTS idx_ordprod_producto  ON ordenes_productos("productoId");
CREATE INDEX IF NOT EXISTS idx_pagos_orden       ON pagos("ordenId");
CREATE INDEX IF NOT EXISTS idx_pagos_transaction ON pagos("transactionId");
CREATE INDEX IF NOT EXISTS idx_pagos_estado      ON pagos(estado);
CREATE INDEX IF NOT EXISTS idx_stockmov_producto ON stock_movimientos("productoId");
CREATE INDEX IF NOT EXISTS idx_stockmov_orden    ON stock_movimientos("ordenId");
CREATE INDEX IF NOT EXISTS idx_stockmov_tipo     ON stock_movimientos(tipo);
CREATE INDEX IF NOT EXISTS idx_ordenes_estadopago ON ordenes("estadoPago");
CREATE INDEX IF NOT EXISTS idx_ordenes_boleta    ON ordenes("numeroBoleta");
CREATE INDEX IF NOT EXISTS idx_pwreset_token     ON password_resets(token);
CREATE INDEX IF NOT EXISTS idx_pwreset_email     ON password_resets(email);

-- =========================
-- TRIGGERS updatedAt
-- =========================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DO $$
BEGIN
    PERFORM 1 FROM pg_trigger WHERE tgname = 'tg_users_updated';
    IF NOT FOUND THEN
        CREATE TRIGGER tg_users_updated BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    PERFORM 1 FROM pg_trigger WHERE tgname = 'tg_productos_updated';
    IF NOT FOUND THEN
        CREATE TRIGGER tg_productos_updated BEFORE UPDATE ON productos
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    PERFORM 1 FROM pg_trigger WHERE tgname = 'tg_direcciones_updated';
    IF NOT FOUND THEN
        CREATE TRIGGER tg_direcciones_updated BEFORE UPDATE ON direcciones
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    PERFORM 1 FROM pg_trigger WHERE tgname = 'tg_ordenes_updated';
    IF NOT FOUND THEN
        CREATE TRIGGER tg_ordenes_updated BEFORE UPDATE ON ordenes
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    PERFORM 1 FROM pg_trigger WHERE tgname = 'tg_pagos_updated';
    IF NOT FOUND THEN
        CREATE TRIGGER tg_pagos_updated BEFORE UPDATE ON pagos
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    PERFORM 1 FROM pg_trigger WHERE tgname = 'tg_reviews_updated';
    IF NOT FOUND THEN
        CREATE TRIGGER tg_reviews_updated BEFORE UPDATE ON reviews
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    PERFORM 1 FROM pg_trigger WHERE tgname = 'tg_citas_updated';
    IF NOT FOUND THEN
        CREATE TRIGGER tg_citas_updated BEFORE UPDATE ON citas
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Resumen
DO $$
DECLARE u INT; p INT; d INT; o INT; c INT;
BEGIN
    SELECT COUNT(*) INTO u FROM users;
    SELECT COUNT(*) INTO p FROM productos;
    SELECT COUNT(*) INTO d FROM direcciones;
    SELECT COUNT(*) INTO o FROM ordenes;
    SELECT COUNT(*) INTO c FROM citas;
    RAISE NOTICE '✅ Users: %, Productos: %, Direcciones: %, Ordenes: %, Citas: %', u, p, d, o, c;
END $$;
