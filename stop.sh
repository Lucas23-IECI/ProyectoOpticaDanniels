#!/bin/bash

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${RED}"
echo "🛑 ========================================"
echo "🛑  DETENIENDO ÓPTICA DANNIELS"
echo "🛑 ========================================"
echo -e "${NC}"

# Mostrar servicios que se van a detener
echo -e "${BLUE}📊 Servicios actualmente corriendo:${NC}"
docker-compose ps 2>/dev/null

echo ""
echo -e "${YELLOW}🛑 Deteniendo todos los servicios...${NC}"

# Detener contenedores
docker-compose down

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Todos los servicios detenidos correctamente${NC}"
else
    echo -e "${RED}❌ Hubo errores al detener algunos servicios${NC}"
fi

# Mostrar estado final
echo ""
echo -e "${BLUE}📊 Estado final:${NC}"
if [ "$(docker-compose ps -q 2>/dev/null)" ]; then
    echo -e "${YELLOW}⚠️  Algunos contenedores aún están corriendo:${NC}"
    docker-compose ps
else
    echo -e "${GREEN}✅ Todos los contenedores están detenidos${NC}"
fi

echo ""
echo -e "${BLUE}🔧 OPCIONES ADICIONALES:${NC}"
echo -e "   ${GREEN}./run.sh${NC}                     - Reiniciar aplicación"
echo -e "   ${GREEN}docker-compose down -v${NC}       - Detener y eliminar volúmenes (reset completo)"
echo -e "   ${GREEN}docker system prune -f${NC}       - Limpiar imágenes no utilizadas"
echo ""
echo -e "${YELLOW}💡 Para reset completo (eliminar datos):${NC}"
echo -e "   ${RED}docker-compose down -v && docker system prune -f${NC}"
echo ""
echo -e "${CYAN}🏪 ¡Óptica Danniels detenida! 🏪${NC}"
echo ""
