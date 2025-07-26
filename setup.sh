#!/bin/bash
set -e

echo "🚀 INSTALACIÓN AUTOMÁTICA - ÓPTICA DANNIELS"
echo "============================================"

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
    curl -fsSL https://get-docker.com -o get-docker.sh
    sudo sh get-docker.sh
    rm get-docker.sh
else
    echo "✅ Docker ya está instalado"
fi

# Crear grupo docker si no existe y agregar usuario
echo "👥 Configurando permisos Docker..."
sudo groupadd docker 2>/dev/null || true
sudo usermod -aG docker $USER

# Nota: Los cambios de grupo se aplicarán después de reiniciar sesión
echo "ℹ️  Nota: Si hay problemas de permisos, reinicia la sesión o usa 'sudo'"

# Verificar si Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "🔧 Instalando Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo "✅ Docker Compose ya está instalado"
fi

# Iniciar Docker
echo "🚀 Iniciando Docker..."
sudo systemctl start docker
sudo systemctl enable docker

# Esperar a que Docker inicie
echo "⏳ Esperando a que Docker inicie..."
sleep 5

# Crear directorio de trabajo
echo "📁 Creando directorio de trabajo..."
cd ~
if [ -d "ProyectoOpticaDanniels" ]; then
    echo "🗑️  Eliminando instalación anterior..."
    rm -rf ProyectoOpticaDanniels
fi

# Clonar proyecto
echo "📥 Clonando proyecto desde GitHub..."
git clone https://github.com/Lucas23-IECI/ProyectoOpticaDanniels.git
cd ProyectoOpticaDanniels
git checkout docker-testing-servidor

# Configurar dominio local (solo si no existe)
echo "🌐 Configurando dominio local..."
if ! grep -q "opticadanniels.com" /etc/hosts; then
    echo "127.0.0.1 opticadanniels.com" | sudo tee -a /etc/hosts
    echo "✅ Dominio agregado"
else
    echo "✅ Dominio ya configurado"
fi

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
FRONTEND_URL=http://opticadanniels.com
EOF
echo "✅ Archivo .env del backend creado"

# Crear archivo .env para el frontend
echo "📝 Creando archivo .env para el frontend..."
cat > Frontend/.env << 'EOF'
# Configuración del frontend
VITE_API_URL=http://opticadanniels.com:3000/api
VITE_APP_NAME=Óptica Danniels
EOF
echo "✅ Archivo .env del frontend creado"

# Ejecutar aplicación
echo "🏗️  Construyendo y ejecutando aplicación..."
if docker-compose up --build -d; then
    echo "✅ Aplicación iniciada correctamente"
else
    echo "⚠️  Intentando con sudo..."
    sudo docker-compose up --build -d
fi

# Verificar estado
echo "📊 Verificando estado de contenedores..."
sleep 10
if docker-compose ps; then
    echo "✅ Verificación completada"
else
    echo "⚠️  Verificando con sudo..."
    sudo docker-compose ps
fi

# Mostrar información final
echo ""
echo "✅ INSTALACIÓN COMPLETADA"
echo "========================="
echo "🌐 Aplicación disponible en: http://opticadanniels.com"
echo "🔧 API disponible en: http://opticadanniels.com:3000/api"
echo ""
echo "👤 Credenciales de prueba:"
echo "   📧 Email: admin@optica.com"
echo "   🔑 Password: password"
echo ""
echo "🛠️  Comandos útiles:"
echo "   Ver logs: docker-compose logs -f (o sudo docker-compose logs -f)"
echo "   Detener: docker-compose down (o sudo docker-compose down)"
echo "   Reiniciar: docker-compose restart (o sudo docker-compose restart)"
echo ""
echo "🌐 Abriendo navegador..."
firefox http://opticadanniels.com &

echo "🎉 ¡LISTO! Tu aplicación está funcionando."