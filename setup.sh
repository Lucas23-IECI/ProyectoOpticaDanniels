#!/bin/bash

echo "Clonando entorno de trabajo..."

if [ ! -d ProyectoOpticaDanniels ]; then
  git clone https://github.com/Lucas23-IECI/ProyectoOpticaDanniels.git
  cd ProyectoOpticaDanniels || exit
  echo "Proyecto clonado. Listo para continuar."
else
  echo "Proyecto ya está clonado. Ingresando..."
  cd ProyectoOpticaDanniels
fi

exec bash
