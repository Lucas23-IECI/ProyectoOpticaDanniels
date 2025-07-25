#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Banner inicial
echo -e "${CYAN}"
echo "🏪 ========================================"
echo "🏪  ÓPTICA DANNIELS - SETUP AUTOMÁTICO"
echo "🏪 ========================================"
echo -e "${NC}"

DOMAIN="OpticaDanniels.com"
DOMAIN_WWW="www.OpticaDanniels.com"

echo -e "${BLUE}🌐 Configurando dominio: ${GREEN}$DOMAIN${NC}"
echo ""

# Función para imprimir con colores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
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
