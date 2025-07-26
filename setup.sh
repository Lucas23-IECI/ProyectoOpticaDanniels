#!/bin/bash
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
# Configuración del frontend
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Óptica Danniels
EOF
echo "✅ Archivo .env del frontend creado"

# Ejecutar aplicación
echo "🏗️  Construyendo y ejecutando aplicación..."
sudo docker-compose up --build -d
echo "✅ Aplicación iniciada correctamente"

# Verificar estado
echo "📊 Verificando estado de contenedores..."
sleep 10
sudo docker-compose ps
echo "✅ Verificación completada"

# Mostrar información final
echo ""
echo "✅ INSTALACIÓN COMPLETADA"
echo "========================="
echo "🌐 Aplicación disponible en: http://localhost:5173"
echo "🔧 API disponible en: http://localhost:3000/api"
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
echo "🌐 Abriendo navegador..."
firefox http://localhost:5173 &

echo "🎉 ¡LISTO! Tu aplicación está funcionando."