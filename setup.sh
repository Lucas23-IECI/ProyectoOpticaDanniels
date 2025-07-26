#!/bin/bash
set -e

echo "🚀 INSTALACIÓN AUTOMÁTICA - ÓPTICA # Configurar dominio local (solo si no existe)
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
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configurar dominio en /etc/hosts
print_status "Configurando dominio local..."
if ! grep -q "$DOMAIN" /etc/hosts 2>/dev/null; then
    print_status "Agregando $DOMAIN a /etc/hosts..."
    echo "127.0.0.1    $DOMAIN" | sudo tee -a /etc/hosts > /dev/null
    echo "127.0.0.1    $DOMAIN_WWW" | sudo tee -a /etc/hosts > /dev/null
    print_success "Dominio configurado en /etc/hosts"
else
    print_success "Dominio ya configurado en /etc/hosts"
fi

# Actualizar sistema
print_status "Actualizando repositorios del sistema..."
sudo apt-get update -qq

# Instalar dependencias básicas
print_status "Instalando dependencias básicas..."
sudo apt-get install -y curl ca-certificates gnupg lsb-release

# Instalar Docker
if ! command -v docker &> /dev/null; then
    print_status "Docker no encontrado. Instalando Docker..."
    
    # Agregar clave GPG oficial de Docker
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

    # Agregar repositorio
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    # Instalar Docker Engine
    sudo apt-get update -qq
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # Agregar usuario al grupo docker
    sudo usermod -aG docker $USER
    
    print_success "Docker instalado correctamente"
    print_warning "IMPORTANTE: Necesitas reiniciar la sesión o ejecutar 'newgrp docker'"
else
    print_success "Docker ya está instalado: $(docker --version)"
fi

# Instalar Docker Compose standalone
if ! command -v docker-compose &> /dev/null; then
    print_status "Instalando Docker Compose standalone..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose instalado"
else
    print_success "Docker Compose ya está instalado: $(docker-compose --version)"
fi

# Hacer ejecutables los scripts
chmod +x run.sh 2>/dev/null || true
chmod +x stop.sh 2>/dev/null || true
chmod +x logs.sh 2>/dev/null || true

# Mostrar resumen final
echo ""
echo -e "${GREEN}🎉 ¡INSTALACIÓN COMPLETADA!${NC}"
echo -e "${CYAN}=========================${NC}"
echo ""
echo -e "${BLUE}📋 CONFIGURACIÓN:${NC}"
echo -e "   🌐 Dominio: ${GREEN}http://$DOMAIN${NC}"
echo -e "   🔧 API: ${GREEN}http://$DOMAIN:3000${NC}"
echo -e "   🗄️  BD: ${GREEN}localhost:5432${NC}"
echo ""
echo -e "${BLUE}👤 CREDENCIALES:${NC}"
echo -e "   🔑 Admin: ${GREEN}admin@optica.com${NC} / ${GREEN}password${NC}"
echo -e "   🔑 Cliente: ${GREEN}cliente@test.com${NC} / ${GREEN}password${NC}"
echo ""
echo -e "${YELLOW}⚠️  PASOS SIGUIENTES:${NC}"
echo -e "   1. ${GREEN}newgrp docker${NC} (aplicar permisos)"
echo -e "   2. ${GREEN}./run.sh${NC} (iniciar aplicación)"
echo -e "   3. ${GREEN}http://$DOMAIN${NC} (abrir navegador)"
echo ""
