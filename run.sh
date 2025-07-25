#!/bin/bash

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
echo "🚀 ========================================"
echo "🚀  INICIANDO ÓPTICA DANNIELS"
echo "🚀 ========================================"
echo -e "${NC}"

DOMAIN="OpticaDanniels.com"

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Docker no está corriendo. Intentando iniciarlo...${NC}"
    sudo systemctl start docker 2>/dev/null || sudo service docker start 2>/dev/null
    sleep 3
    
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Error: No se pudo iniciar Docker${NC}"
        echo -e "${YELLOW}💡 Intenta ejecutar: sudo systemctl start docker${NC}"
        exit 1
    fi
fi

# Limpiar contenedores anteriores
echo -e "${BLUE}🧹 Limpiando contenedores anteriores...${NC}"
docker-compose down 2>/dev/null || true
docker system prune -f --volumes 2>/dev/null || true

# Construir imágenes frescas
echo -e "${BLUE}🔨 Construyendo imágenes Docker...${NC}"
docker-compose build --no-cache --parallel

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error durante la construcción de imágenes${NC}"
    exit 1
fi

# Iniciar servicios
echo -e "${BLUE}🚀 Iniciando servicios...${NC}"
docker-compose up -d

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al iniciar los servicios${NC}"
    exit 1
fi

# Esperar a que los servicios estén listos
echo -e "${BLUE}⏳ Esperando a que los servicios estén listos...${NC}"

# Esperar base de datos
echo -e "${YELLOW}📊 Esperando base de datos...${NC}"
for i in {1..30}; do
    if docker-compose exec -T database pg_isready -U admin -d optica_danniels >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Base de datos lista${NC}"
        break
    fi
    echo -ne "${YELLOW}⏳ Esperando BD... ($i/30)\r${NC}"
    sleep 2
done

# Esperar backend
echo -e "${YELLOW}🔧 Esperando backend API...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:3000/api/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend API listo${NC}"
        break
    fi
    echo -ne "${YELLOW}⏳ Esperando backend... ($i/30)\r${NC}"
    sleep 2
done

# Esperar frontend
echo -e "${YELLOW}🌐 Esperando frontend...${NC}"
for i in {1..20}; do
    if curl -s http://localhost >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend listo${NC}"
        break
    fi
    echo -ne "${YELLOW}⏳ Esperando frontend... ($i/20)\r${NC}"
    sleep 2
done

# Verificar estado final
echo ""
echo -e "${BLUE}📊 Estado de servicios:${NC}"
docker-compose ps

# Verificar conectividad
echo ""
echo -e "${BLUE}🔍 Verificando conectividad:${NC}"

# Test dominio personalizado
if curl -s http://$DOMAIN >/dev/null 2>&1; then
    echo -e "${GREEN}✅ $DOMAIN responde correctamente${NC}"
else
    echo -e "${YELLOW}⚠️  $DOMAIN no responde, pero localhost debería funcionar${NC}"
fi

# Test API
if curl -s http://localhost:3000/api/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ API Backend responde correctamente${NC}"
else
    echo -e "${RED}❌ API Backend no responde${NC}"
fi

echo ""
echo -e "${GREEN}🎉 ¡ÓPTICA DANNIELS INICIADA EXITOSAMENTE!${NC}"
echo -e "${CYAN}===========================================${NC}"
echo ""
echo -e "${BLUE}🌐 ACCESOS DISPONIBLES:${NC}"
echo -e "   📱 Aplicación principal: ${GREEN}http://$DOMAIN${NC}"
echo -e "   🌐 Aplicación (localhost): ${GREEN}http://localhost${NC}"
echo -e "   🔧 API Backend: ${GREEN}http://localhost:3000${NC}"
echo -e "   🔧 API con dominio: ${GREEN}http://$DOMAIN:3000${NC}"
echo -e "   🗄️  Base de datos: ${GREEN}localhost:5432${NC}"
echo ""
echo -e "${BLUE}👤 CREDENCIALES DE ACCESO:${NC}"
echo -e "   🔑 Administrador: ${GREEN}admin@optica.com${NC} / ${GREEN}password${NC}"
echo -e "   🔑 Cliente prueba: ${GREEN}cliente@test.com${NC} / ${GREEN}password${NC}"
echo ""
echo -e "${BLUE}🛠️  COMANDOS ÚTILES:${NC}"
echo -e "   ${GREEN}./logs.sh${NC}                    - Ver logs en tiempo real"
echo -e "   ${GREEN}./stop.sh${NC}                    - Detener toda la aplicación"
echo -e "   ${GREEN}docker-compose ps${NC}            - Ver estado de contenedores"
echo -e "   ${GREEN}docker-compose restart${NC}       - Reiniciar servicios"
echo -e "   ${GREEN}docker-compose logs -f${NC}       - Ver logs detallados"
echo ""
echo -e "${YELLOW}💡 CONSEJOS:${NC}"
echo -e "   • Si algo no funciona, revisa los logs: ${GREEN}./logs.sh${NC}"
echo -e "   • Para acceso admin BD: PgAdmin en ${GREEN}http://localhost:8080${NC}"
echo -e "   • Para reset completo: ${GREEN}./stop.sh && docker-compose down -v${NC}"
echo ""
echo -e "${CYAN}🏪 ¡Disfruta usando Óptica Danniels! 🏪${NC}"
echo ""
