# 🏪 ÓPTICA DANNIELS - SISTEMA COMPLETO

## 👨‍🎓 INFORMACIÓN DEL PROYECTO
- **Autor**: Lucas - IECI
- **Tecnologías**: React + Node.js + PostgreSQL + Docker
- **Dominio**: http://OpticaDanniels.com (local)
- **Versión**: 1.0.0

## 🚀 INSTALACIÓN SÚPER RÁPIDA

### ⚡ 3 COMANDOS Y LISTO:
```bash
git clone https://github.com/Lucas23-IECI/ProyectoOpticaDanniels.git
cd ProyectoOpticaDanniels
./setup.sh && newgrp docker && ./run.sh
```

### 📋 REQUISITOS MÍNIMOS:
- Ubuntu 18.04+ / Debian 10+
- 4GB RAM libre
- 10GB espacio en disco
- Conexión a internet para descargas

## 🌐 ACCESOS DESPUÉS DE LA INSTALACIÓN

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **🌐 Aplicación** | http://OpticaDanniels.com | Sitio web principal |
| **🌐 Alternativo** | http://localhost | Acceso por localhost |
| **🔧 API REST** | http://OpticaDanniels.com:3000 | Backend API |
| **🗄️ Base de Datos** | localhost:5432 | PostgreSQL |
| **🔧 PgAdmin** | http://localhost:8080 | Administrador BD |

## 👤 CREDENCIALES INICIALES

### 🔑 Aplicación Web:
- **Administrador**: `admin@optica.com` / `password`
- **Cliente Prueba**: `cliente@test.com` / `password`

### 🔑 Base de Datos:
- **PostgreSQL**: `admin` / `admin123`
- **PgAdmin**: `admin@optica.com` / `admin123`

## 🏗️ ARQUITECTURA DEL SISTEMA

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │    BACKEND      │    │   DATABASE      │
│                 │    │                 │    │                 │
│ React + Vite    │◄──►│ Node.js + API   │◄──►│ PostgreSQL 15   │
│ Nginx Proxy     │    │ Express + JWT   │    │ Datos + Backup  │
│ Port: 80        │    │ Port: 3000      │    │ Port: 5432      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────── Docker Network (optica-network) ──────┘
```

## 🎮 COMANDOS DE GESTIÓN

### 🚀 Comandos Principales:
```bash
./setup.sh     # Configuración inicial (solo primera vez)
./run.sh       # Iniciar toda la aplicación
./stop.sh      # Detener toda la aplicación
./logs.sh      # Ver logs en tiempo real
```

### 🔧 Comandos Docker Avanzados:
```bash
docker-compose ps              # Ver estado de contenedores
docker-compose restart         # Reiniciar todos los servicios
docker-compose logs -f         # Ver logs detallados
docker-compose down -v         # Reset completo (elimina datos)
docker system prune -f         # Limpiar imágenes no utilizadas
```

### 📊 Comandos de Monitoreo:
```bash
docker stats                   # Uso de recursos en tiempo real
docker-compose exec backend bash    # Entrar al contenedor backend
docker-compose exec database psql -U admin -d optica_danniels   # Acceder a BD
```

## 🎯 FUNCIONALIDADES IMPLEMENTADAS

### 👥 GESTIÓN DE USUARIOS
- ✅ Registro y autenticación (JWT)
- ✅ Perfiles de usuario editables
- ✅ Sistema de roles (admin/cliente)
- ✅ Gestión de direcciones múltiples
- ✅ Recuperación de contraseñas

### 🛍️ CATÁLOGO DE PRODUCTOS
- ✅ Navegación por categorías
- ✅ Búsqueda avanzada y filtros
- ✅ Galería de imágenes (Base64)
- ✅ Gestión de stock y precios
- ✅ Sistema de ofertas y descuentos

### 💝 LISTA DE DESEOS
- ✅ Agregar/quitar productos favoritos
- ✅ Sincronización por usuario
- ✅ Persistencia en base de datos

### 🛒 SISTEMA DE PEDIDOS
- ✅ Carrito de compras
- ✅ Proceso de checkout
- ✅ Gestión de órdenes
- ✅ Seguimiento de estados

### 🔧 PANEL ADMINISTRATIVO
- ✅ CRUD completo de productos
- ✅ Gestión de usuarios
- ✅ Upload de imágenes
- ✅ Reportes y estadísticas

### 🎨 INTERFAZ DE USUARIO
- ✅ Diseño responsive (móvil/desktop)
- ✅ Componentes reutilizables
- ✅ Navegación fluida (React Router)
- ✅ UX optimizada y accesible

## 📦 CONTENEDORES DOCKER

### 🗄️ optica-database (PostgreSQL 15)
- **Función**: Base de datos principal
- **Puerto**: 5432
- **Datos**: Usuarios, productos, órdenes, direcciones
- **Backup**: Volumen persistente
- **Inicialización**: Script SQL automático

### 🔧 optica-backend (Node.js 18)
- **Función**: API REST + autenticación
- **Puerto**: 3000
- **Tecnologías**: Express, TypeORM, JWT, Multer
- **Comando**: `npm run dev` (desarrollo)
- **Variables**: Archivo `.env` configurable

### 🌐 optica-frontend (React + Nginx)
- **Función**: Interfaz de usuario
- **Puerto**: 80
- **Tecnologías**: React, Vite, CSS Modules
- **Build**: Optimizado para producción
- **Proxy**: Nginx con configuración personalizada

### 🔧 optica-pgadmin (PgAdmin 4) [Opcional]
- **Función**: Administrador gráfico de BD
- **Puerto**: 8080
- **Activación**: `docker-compose --profile admin up`

## 🗄️ ESTRUCTURA DE BASE DE DATOS

### 📋 Tablas Principales:
```sql
usuarios           # Autenticación y perfiles
├── id, email, password, nombre, rol, activo

productos          # Catálogo completo
├── id, nombre, descripcion, precio, categoria
├── imagen_url, stock, marca, codigoSKU, oferta

direcciones        # Direcciones de usuarios
├── id, usuarioId, nombre, direccion, ciudad
├── codigoPostal, telefono, principal

ordenes           # Pedidos realizados
├── id, usuarioId, direccionId, estado, total
├── fechaEntrega, observaciones

orden_productos   # Detalle de pedidos
├── id, ordenId, productoId, cantidad, precio

wishlist          # Lista de deseos
├── id, usuarioId, productoId
```

### 🔍 Índices Optimizados:
- Email de usuarios (unique + indexed)
- Productos por categoría y estado
- Direcciones por usuario
- Wishlist por usuario y producto

## 🚨 SOLUCIÓN DE PROBLEMAS

### ❌ Docker no funciona:
```bash
sudo systemctl start docker
sudo usermod -aG docker $USER
newgrp docker
```

### ❌ Puerto ocupado:
```bash
sudo lsof -i :80      # Ver qué usa el puerto 80
sudo lsof -i :3000    # Ver qué usa el puerto 3000
sudo lsof -i :5432    # Ver qué usa el puerto 5432
```

### ❌ Dominio no resuelve:
```bash
# Verificar /etc/hosts
cat /etc/hosts | grep OpticaDanniels

# Agregar manualmente si falta
echo "127.0.0.1    OpticaDanniels.com" | sudo tee -a /etc/hosts
```

### ❌ Reset completo del sistema:
```bash
./stop.sh
docker-compose down -v
docker system prune -f
docker volume prune -f
./run.sh
```

### ❌ Problemas de permisos:
```bash
sudo chown -R $USER:$USER .
chmod +x *.sh
```

### ❌ Base de datos corrupta:
```bash
docker-compose down
docker volume rm $(docker volume ls -q | grep postgres)
./run.sh
```

## 🧪 TESTING Y VALIDACIÓN

### ✅ Pruebas Realizadas:
- **3 PC Windows** - Funcionamiento completo ✅
- **2 PC Linux Ubuntu** - Funcionamiento completo ✅
- **1 Servidor AWS** - Deploy exitoso ✅

### 🔍 Tests de Funcionalidad:
- ✅ Registro y login de usuarios
- ✅ CRUD completo de productos
- ✅ Carrito y proceso de compra
- ✅ Gestión de direcciones
- ✅ Lista de deseos
- ✅ Panel administrativo
- ✅ Responsive design
- ✅ Manejo de errores

### 📊 Tests de Performance:
- ✅ Tiempo de carga inicial < 3 segundos
- ✅ Imágenes optimizadas (Base64)
- ✅ API response time < 200ms
- ✅ Base de datos indexada correctamente

## 📈 MONITOREO Y LOGS

### 📝 Logs Disponibles:
```bash
./logs.sh                          # Logs en tiempo real de todos los servicios
docker-compose logs backend         # Solo logs del backend
docker-compose logs frontend        # Solo logs del frontend  
docker-compose logs database        # Solo logs de la base de datos
```

### 📊 Métricas del Sistema:
```bash
docker stats                        # CPU, memoria, red en tiempo real
docker system df                    # Uso de espacio en disco
docker-compose ps                   # Estado de todos los contenedores
```

## 🔐 SEGURIDAD IMPLEMENTADA

### 🛡️ Autenticación:
- JWT tokens con expiración
- Passwords hasheados (bcrypt)
- Middleware de autenticación
- Validación de roles

### 🔒 Protección de API:
- CORS configurado correctamente
- Validación de inputs (Joi)
- Rate limiting (opcional)
- Sanitización de datos

### 🚪 Variables de Entorno:
- Secrets externalizados
- Configuración por entorno
- No hardcoding de credenciales

## 📞 SOPORTE Y CONTACTO

### 🐛 Reportar Problemas:
- **GitHub Issues**: [Crear Issue](https://github.com/Lucas23-IECI/ProyectoOpticaDanniels/issues)
- **Email**: [tu-email@ejemplo.com]

### 📚 Documentación Adicional:
- **Frontend**: `Frontend/README.md`
- **Backend**: `Backend/README.md`
- **Base de Datos**: `database/README.md`

### 🔄 Actualizaciones:
```bash
git pull origin main
./stop.sh
./run.sh
```

---

## 🎓 PROYECTO ACADÉMICO

**Desarrollado para**: [Nombre del Curso] - [Universidad/Instituto]
**Año**: 2024
**Profesor**: [Nombre del Profesor]

### 📋 Objetivos Cumplidos:
- ✅ Aplicación web full-stack completa
- ✅ Base de datos relacional bien estructurada
- ✅ Autenticación y autorización
- ✅ Diseño responsive y UX profesional
- ✅ Dockerización completa
- ✅ Documentación exhaustiva
- ✅ Testing en múltiples entornos

---

## 🏪 ¡Gracias por usar Óptica Danniels!

**Un sistema completo para la gestión de ópticas desarrollado con las mejores prácticas de desarrollo web moderno.**

### 🌟 Características Destacadas:
- 🚀 **Instalación en 3 comandos**
- 🏗️ **Arquitectura dockerizada**
- 🎨 **Diseño profesional**
- 🔒 **Seguridad implementada**
- 📱 **Totalmente responsive**
- 🔧 **Fácil mantenimiento**

---

*Desarrollado con ❤️ para el mundo de las ópticas*
