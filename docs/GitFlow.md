# Flujo de trabajo Git (Git Flow) - Proyecto Óptica Danniels

Este proyecto se utiliza una variante profesional de GitHub Flow, con una rama intermedia de pruebas (`test`) antes de pasar a producción (`main`).

## Ramas principales

- `main`: Rama de producción estable. Solo recibe código desde `test`.
- `test`: Rama de pre-producción o validación. Se prueba toda funcionalidad aquí antes de integrarla a producción.

## Ramas de trabajo

- `feature/<nombre>`: Para el desarrollo de nuevas funcionalidades.
- `fix/<nombre>`: Para corregir errores o bugs.
- `refactor/<nombre>`: Para mejoras internas del código sin modificar funcionalidades.
- `portafolio`: Rama aislada con el landing personal (no forma parte del flujo principal de desarrollo).

## Flujo de trabajo (pasos)

1. Crear una rama de trabajo desde `test`:
   ```bash
   git checkout test
   git pull origin test
   git checkout -b feature/nueva-funcionalidad
