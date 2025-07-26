#!/bin/bash
set -e

echo "🧹 LIMPIANDO SERVIDOR UBUNTU"
echo "============================"

# Función para manejar errores
handle_error() {
    echo "❌ Error en la línea $1"
    echo "🔄 Continuando con la limpieza..."
}

trap 'handle_error $LINENO' ERR

# Detener y eliminar contenedores Docker
echo "🐳 Deteniendo contenedores Docker..."
if command -v docker-compose &> /dev/null; then
    docker-compose down --volumes --remove-orphans 2>/dev/null || true
    sudo docker-compose down --volumes --remove-orphans 2>/dev/null || true
fi

# Eliminar contenedores específicos del proyecto
echo "🗑️  Eliminando contenedores del proyecto..."
docker ps -a | grep optica | awk '{print $1}' | xargs docker rm -f 2>/dev/null || true
sudo docker ps -a | grep optica | awk '{print $1}' | xargs sudo docker rm -f 2>/dev/null || true

# Eliminar imágenes Docker del proyecto
echo "🗑️  Eliminando imágenes Docker..."
docker images | grep optica | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true
docker images | grep proyectoopticadanniels | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true
sudo docker images | grep optica | awk '{print $3}' | xargs sudo docker rmi -f 2>/dev/null || true
sudo docker images | grep proyectoopticadanniels | awk '{print $3}' | xargs sudo docker rmi -f 2>/dev/null || true

# Limpiar sistema Docker completo
echo "🧽 Limpieza completa de Docker..."
docker system prune -af --volumes 2>/dev/null || true
sudo docker system prune -af --volumes 2>/dev/null || true

# Eliminar directorio del proyecto
echo "📁 Eliminando directorio del proyecto..."
cd ~
if [ -d "ProyectoOpticaDanniels" ]; then
    rm -rf ProyectoOpticaDanniels
    echo "✅ Directorio del proyecto eliminado"
else
    echo "ℹ️  Directorio del proyecto no encontrado"
fi

# Eliminar dominio del archivo hosts
echo "🌐 Eliminando dominio local..."
if sudo grep -q "opticadanniels.com" /etc/hosts; then
    sudo sed -i '/opticadanniels.com/d' /etc/hosts
    echo "✅ Dominio eliminado de /etc/hosts"
else
    echo "ℹ️  Dominio no encontrado en /etc/hosts"
fi

# Eliminar Docker Compose
echo "🔧 Eliminando Docker Compose..."
if [ -f "/usr/local/bin/docker-compose" ]; then
    sudo rm -f /usr/local/bin/docker-compose
    echo "✅ Docker Compose eliminado"
else
    echo "ℹ️  Docker Compose no encontrado"
fi

# Eliminar Docker completamente
echo "🐳 Eliminando Docker..."
if command -v docker &> /dev/null; then
    sudo apt remove -y docker-ce docker-ce-cli containerd.io docker-compose-plugin docker-ce-rootless-extras docker-buildx-plugin docker-model-plugin 2>/dev/null || true
    sudo apt autoremove -y
    sudo rm -rf /var/lib/docker 2>/dev/null || true
    sudo rm -rf /etc/docker 2>/dev/null || true
    sudo groupdel docker 2>/dev/null || true
    echo "✅ Docker eliminado completamente"
else
    echo "ℹ️  Docker no estaba instalado"
fi

# Eliminar archivos de instalación
echo "🗑️  Eliminando archivos temporales..."
rm -f setup.sh get-docker.sh 2>/dev/null || true

# Limpiar sistema
echo "🧼 Limpieza final del sistema..."
sudo apt autoremove -y
sudo apt autoclean

echo ""
echo "✅ SERVIDOR LIMPIO"
echo "=================="
echo "🔄 Se eliminó:"
echo "   • Todos los contenedores Docker"
echo "   • Todas las imágenes Docker" 
echo "   • Docker y Docker Compose"
echo "   • Directorio del proyecto"
echo "   • Dominio local"
echo "   • Archivos temporales"
echo ""
echo "🎯 El servidor está como antes de la instalación."
