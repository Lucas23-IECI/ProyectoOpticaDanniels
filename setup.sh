#!/bin/bash
set -e

echo "🚀 INSTALACIÓN AUTOMÁTICA - ÓPTICA # Configurar domini# Configurar dominio local (solo si no existe)
echo "🌐 Configurando dominio local..."
if ! grep -q "OpticaDanniels.com" /etc/hosts; then
    echo "127.0.0.1 OpticaDanniels.com" | sudo tee -a /etc/hosts
    echo "✅ Dominio agregado"
else
    echo "✅ Dominio ya configurado"
fi

# Iniciar Docker
echo "🚀 Iniciando Docker..."
sudo systemctl start docker
sudo systemctl enable docker

# Esperar a que Docker inicie
echo "⏳ Esperando a que Docker inicie..."
sleep 5

# Ejecutar aplicación
echo "🏗️  Construyendo y ejecutando aplicación..."
sg docker -c "docker-compose up --build -d"si no existe)
echo "🌐 Configurando dominio local..."
if ! grep -q "OpticaDanniels.com" /etc/hosts; then
    echo "127.0.0.1 OpticaDanniels.com" | sudo tee -a /etc/hosts
    echo "✅ Dominio agregado"
else
    echo "✅ Dominio ya configurado"
fi

# Iniciar Docker
echo "🚀 Iniciando Docker..."
sudo systemctl start docker
sudo systemctl enable docker

# Esperar a que Docker inicie
echo "⏳ Esperando a que Docker inicie..."
sleep 5

# Ejecutar aplicación
echo "🏗️  Construyendo y ejecutando aplicación..."
sg docker -c "docker-compose up --build -d"o "============================================"

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
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    rm get-docker.sh
else
    echo "✅ Docker ya está instalado"
fi

# Crear grupo docker si no existe y agregar usuario
echo "👥 Configurando permisos Docker..."
sudo groupadd docker 2>/dev/null || true
sudo usermod -aG docker $USER

# Verificar si Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "🔧 Instalando Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo "✅ Docker Compose ya está instalado"
fi

# Clonar proyecto
echo "📥 Clonando proyecto..."
if [ -d "ProyectoOpticaDanniels" ]; then
    rm -rf ProyectoOpticaDanniels
fi
git clone https://github.com/Lucas23-IECI/ProyectoOpticaDanniels.git
cd ProyectoOpticaDanniels
git checkout docker-testing-servidor

# Configurar dominio local
echo "� Configurando dominio local..."
echo "127.0.0.1 OpticaDanniels.com" | sudo tee -a /etc/hosts

# Iniciar Docker
echo "🚀 Iniciando Docker..."
sudo systemctl start docker
sudo systemctl enable docker

# Ejecutar aplicación
echo "🏗️  Construyendo y ejecutando aplicación..."
newgrp docker << EOF
docker-compose up --build -d
EOF

# Verificar estado
echo "📊 Verificando estado de contenedores..."
sleep 10
docker-compose ps

# Mostrar información final
echo ""
echo "✅ INSTALACIÓN COMPLETADA"
echo "========================="
echo "🌐 Aplicación disponible en: http://OpticaDanniels.com"
echo "🔧 API disponible en: http://OpticaDanniels.com:3000/api"
echo ""
echo "👤 Credenciales de prueba:"
echo "   📧 Email: admin@optica.com"
echo "   🔑 Password: password"
echo ""
echo "🛠️  Comandos útiles:"
echo "   Ver logs: docker-compose logs -f"
echo "   Detener: docker-compose down"
echo "   Reiniciar: docker-compose restart"
echo ""
echo "🌐 Abriendo navegador..."
firefox http://OpticaDanniels.com &

echo "🎉 ¡LISTO! Tu aplicación está funcionando."
