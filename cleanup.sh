#!/bin/bash

echo "🧹 LIMPIANDO SERVIDOR UBUNTU"
echo "============================"

# Detener y eliminar contenedores Docker
echo "🐳 Deteniendo contenedores Docker..."
docker-compose down --volumes 2>/dev/null || true

# Eliminar imágenes Docker del proyecto
echo "🗑️  Eliminando imágenes Docker..."
docker images | grep optica | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true
docker images | grep proyectoopticadanniels | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true

# Limpiar sistema Docker completo
echo "🧽 Limpieza completa de Docker..."
docker system prune -af --volumes

# Eliminar directorio del proyecto
echo "📁 Eliminando directorio del proyecto..."
cd ~
rm -rf ProyectoOpticaDanniels

# Eliminar dominio del archivo hosts
echo "🌐 Eliminando dominio local..."
sudo sed -i '/OpticaDanniels.com/d' /etc/hosts

# Eliminar Docker Compose
echo "🔧 Eliminando Docker Compose..."
sudo rm -f /usr/local/bin/docker-compose

# Eliminar Docker completamente
echo "🐳 Eliminando Docker..."
sudo apt remove -y docker-ce docker-ce-cli containerd.io docker-compose-plugin docker-ce-rootless-extras docker-buildx-plugin docker-model-plugin
sudo apt autoremove -y
sudo rm -rf /var/lib/docker
sudo rm -rf /etc/docker
sudo groupdel docker 2>/dev/null || true

# Eliminar archivos de instalación
echo "🗑️  Eliminando archivos temporales..."
rm -f setup.sh get-docker.sh

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
