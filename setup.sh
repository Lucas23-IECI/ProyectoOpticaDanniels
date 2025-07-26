#!/bin/bash
#
# Este script es una versión mejorada del instalador automático para el
# proyecto Óptica Danniels. Incorpora correcciones y robustez extra para
# manejar problemas comunes de Docker durante la descarga de imágenes, como
# el error «open /var/lib/docker/tmp/GetImageBlob…» que se produce cuando
# Docker intenta usar un directorio temporal inexistente. También pre‑descarga
# la imagen de la base de datos para reducir las fallas durante el «pull» y
# simplifica el flujo eliminando el paso redundante de `docker-compose pull`.

set -e

# Función para manejar errores
handle_error() {
    echo "❌ Error en la línea $1"
    echo "🔄 Continuando con la instalación..."
}

trap 'handle_error $LINENO' ERR

echo "🚀 INSTALACIÓN AUTOMÁTICA - ÓPTICA DANNIELS"
echo "============================================"

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: No se encontró docker-compose.yml"
    echo "💡 Asegúrate de estar en el directorio del proyecto ProyectoOpticaDanniels"
    echo "💡 Ejecuta: cd ProyectoOpticaDanniels"
    exit 1
fi

echo "✅ Directorio del proyecto verificado"

# Verificar espacio en disco
echo "💾 Verificando espacio en disco..."
FREE_SPACE=$(df / | awk 'NR==2 {print $4}')
if [ "$FREE_SPACE" -lt 5000000 ]; then
    echo "⚠️  Poco espacio en disco. Se requieren al menos 5GB libres."
    echo "💡 Espacio disponible: $((FREE_SPACE / 1024 / 1024))GB"
    echo "🔄 Continuando de todas formas..."
else
    echo "✅ Espacio en disco suficiente: $((FREE_SPACE / 1024 / 1024))GB libres"
fi

# Detener actualizaciones automáticas que bloquean el sistema
echo "⏹️  Deteniendo actualizaciones automáticas..."
sudo killall unattended-upgrade 2>/dev/null || true
sudo dpkg --configure -a

# Actualizar sistema e instalar herramientas básicas
echo "📦 Verificando herramientas del sistema..."
sudo apt update

# Verificar si git está instalado
if ! command -v git &> /dev/null; then
    echo "📦 Instalando Git..."
    sudo apt install -y git
else
    echo "✅ Git ya está instalado"
fi

# Verificar si curl está instalado
if ! command -v curl &> /dev/null; then
    echo "📦 Instalando Curl..."
    sudo apt install -y curl
else
    echo "✅ Curl ya está instalado"
fi

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "🐳 Instalando Docker..."
    echo "🔄 Instalando con apt..."
    sudo apt update
    sudo apt install -y docker.io docker-compose
    sudo systemctl start docker
    sudo systemctl enable docker
    echo "✅ Docker instalado con apt"
else
    echo "✅ Docker ya está instalado"
fi

# Crear grupo docker si no existe y agregar usuario
echo "👥 Configurando permisos Docker..."
sudo groupadd docker 2>/dev/null || true
sudo usermod -aG docker $USER

# Nota: Los cambios de grupo se aplicarán después de reiniciar sesión
echo "ℹ️  Nota: Si hay problemas de permisos, reinicia la sesión o usa 'sudo'"

# Verificar si Docker Compose está instalado y funcionando
if ! command -v docker-compose &> /dev/null; then
    echo "🔧 Instalando Docker Compose..."
    sudo apt install -y docker-compose
    echo "✅ Docker Compose instalado con apt"
else
    echo "✅ Docker Compose ya está instalado"
fi

# Verificar que Docker Compose funcione correctamente
echo "🔍 Verificando Docker Compose..."
if ! docker-compose --version &> /dev/null; then
    echo "⚠️  Docker Compose no funciona. Instalando versión más reciente..."
    # Eliminar versión problemática
    sudo apt remove -y docker-compose
    sudo apt autoremove -y
    # Instalar versión más reciente
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose actualizado"
fi

# Iniciar Docker
echo "🚀 Iniciando Docker..."
sudo systemctl start docker
sudo systemctl enable docker

# Esperar a que Docker inicie
echo "⏳ Esperando a que Docker inicie..."
sleep 5

# Verificar que Docker esté funcionando
echo "🔍 Verificando que Docker esté funcionando..."
if ! sudo docker info &> /dev/null; then
    echo "❌ Docker no está funcionando correctamente"
    echo "🔄 Reiniciando Docker..."
    sudo systemctl restart docker
    sleep 3
    if ! sudo docker info &> /dev/null; then
        echo "❌ Docker sigue sin funcionar. Verifica la instalación."
        exit 1
    fi
fi
echo "✅ Docker funcionando correctamente"

# Asegurar que el directorio temporal de Docker exista
if [ ! -d "/var/lib/docker/tmp" ]; then
    echo "🛠️  Creando directorio temporal de Docker (/var/lib/docker/tmp)..."
    sudo mkdir -p /var/lib/docker/tmp
    sudo chown root:root /var/lib/docker/tmp
fi

# Pre‑descargar imagen de la base de datos para evitar fallos en docker-compose pull
echo "🐳 Descargando imagen de base de datos (postgres:15)..."
if ! sudo docker pull postgres:15; then
    echo "⚠️  Error al descargar la imagen de Postgres. Reiniciando Docker y reintentando..."
    sudo systemctl restart docker
    sleep 3
    sudo docker pull postgres:15 || {
        echo "❌ No se pudo descargar la imagen postgres:15 después de reintento. Continúa con la instalación, pero la base de datos puede no funcionar."
    }
fi

# Configurar para localhost
echo "🌐 Configurando para localhost..."
echo "✅ Usando localhost:5173"

# Crear archivo .env para el backend
echo "📝 Creando archivo .env para el backend..."
cat > Backend/src/config/.env << 'EOF'
# Configuración de la base de datos
HOST=database
DB_USERNAME=admin
PASSWORD=admin123
DATABASE=optica_danniels

# Configuración del servidor
PORT=3000
NODE_ENV=production

# Configuración de autenticación
ACCESS_TOKEN_SECRET=tu_secreto_super_seguro_aqui_cambiar_en_produccion
cookieKey=otro_secreto_super_seguro_aqui_cambiar_en_produccion

# Configuración del frontend
FRONTEND_URL=http://localhost:5173
EOF
echo "✅ Archivo .env del backend creado"

# Crear archivo .env para el frontend
echo "📝 Creando archivo .env para el frontend..."
cat > Frontend/.env << 'EOF'
VITE_BASE_URL=http://localhost:3000/api
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Óptica Danniels
EOF
echo "✅ Archivo .env del frontend creado"

# Verificar que los archivos .env se crearon
echo "🔍 Verificando archivos .env..."
if [ -f "Backend/src/config/.env" ] && [ -f "Frontend/.env" ]; then
    echo "✅ Archivos .env creados correctamente"
else
    echo "❌ Error: No se pudieron crear los archivos .env"
    exit 1
fi

# Ejecutar aplicación
echo "🏗️  Construyendo y ejecutando aplicación..."

# Construir y levantar contenedores en segundo plano. Se omite `docker-compose pull` para
# reducir fallos por descarga de imágenes; el parámetro `--pull always` hace que
# Compose actualice las imágenes de servicio que usan la directiva `image:` cuando
# sea necesario.
echo "⏳ Construyendo y ejecutando contenedores con Docker Compose (puede tardar unos minutos)..."
sudo docker-compose up --build --pull always -d
echo "✅ Aplicación iniciada correctamente"

# Verificar estado
echo "📊 Verificando estado de contenedores..."
sleep 15
sudo docker-compose ps

# Verificar si hay errores en el frontend
echo "🔍 Verificando logs del frontend..."
if sudo docker-compose logs frontend | grep -q "error\|Error\|ERROR"; then
    echo "⚠️  Hay errores en el frontend. Mostrando logs:" 
    sudo docker-compose logs frontend --tail=20
fi

echo "✅ Verificación completada"

# Mostrar información final
echo ""
echo "✅ INSTALACIÓN COMPLETADA"
echo "========================="
echo "🌐 Aplicación disponible en: http://localhost:5173"
echo "🔧 API disponible en: http://localhost:3000/api"
echo "💡 Si la app no carga, prueba: http://localhost:5173/OpticaDanniels"
echo ""
echo "👤 Credenciales de prueba:"
echo "   📧 Email: admin@optica.com"
echo "   🔑 Password: password"
echo ""
echo "🛠️  Comandos útiles:"
echo "   Ver logs: sudo docker-compose logs -f"
echo "   Detener: sudo docker-compose down"
echo "   Reiniciar: sudo docker-compose restart"
echo ""


echo "🎉 ¡LISTO! Tu aplicación está funcionando"
