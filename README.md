# 🚀 Óptica Danniels - Instalación Automática

## 📋 Requisitos Previos

- Ubuntu 20.04 o superior
- Conexión a internet
- Permisos de administrador (sudo)

## 🎯 Instalación Rápida

### 1. Clonar el repositorio
```bash
git clone https://github.com/Lucas23-IECI/ProyectoOpticaDanniels.git
cd ProyectoOpticaDanniels
git checkout docker-testing-servidor
```

### 2. Ejecutar el setup automático
```bash
chmod +x setup.sh
./setup.sh
```

### 3. ¡Listo! 🎉
- **Frontend**: http://opticadanniels.com
- **API**: http://opticadanniels.com:3000/api

## 👤 Credenciales de Prueba
- **Email**: admin@optica.com
- **Password**: password

## 🛠️ Comandos Útiles

```bash
# Ver logs de los contenedores
docker-compose logs -f

# Detener la aplicación
docker-compose down

# Reiniciar la aplicación
docker-compose restart

# Ver estado de contenedores
docker-compose ps
```

## 🧹 Limpieza Completa

Si quieres eliminar todo y empezar de nuevo:

```bash
# Ejecutar script de limpieza
chmod +x cleanup.sh
./cleanup.sh
```

## 📁 Estructura del Proyecto

```
ProyectoOpticaDanniels/
├── Backend/          # API Node.js + TypeORM
├── Frontend/         # React + Vite
├── database/         # Scripts de base de datos
├── setup.sh          # Instalador automático
├── cleanup.sh        # Limpiador automático
└── docker-compose.yml # Configuración Docker
```

## 🔧 Tecnologías

- **Backend**: Node.js, Express, TypeORM, PostgreSQL
- **Frontend**: React, Vite, CSS Modules
- **Base de Datos**: PostgreSQL
- **Contenedores**: Docker & Docker Compose

## 🆘 Solución de Problemas

### Si hay problemas de permisos de Docker:
```bash
sudo usermod -aG docker $USER
# Reinicia la sesión o usa 'sudo docker-compose up'
```

### Si el setup se detiene:
```bash
# Verificar que estás en el directorio correcto
ls -la docker-compose.yml

# Continuar manualmente
docker-compose up --build -d
```

### Si no puedes acceder a la aplicación:
```bash
# Verificar que los contenedores estén corriendo
docker-compose ps

# Ver logs para diagnosticar
docker-compose logs
```
