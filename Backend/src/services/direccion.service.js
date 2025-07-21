import { AppDataSource } from "../config/configDb.js";
import Direccion from "../entity/direccion.entity.js";
import User from "../entity/user.entity.js";

export const crearDireccionService = async (userId, datos) => {
    try {
        const direccionRepository = AppDataSource.getRepository(Direccion);
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({ where: { id: userId } });
        if (!user) {
            return [null, "Usuario no encontrado"];
        }

        // Si es la primera dirección o se marca como principal, 
        // asegurar que sea la única principal
        if (datos.esPrincipal) {
            await direccionRepository.update(
                { userId: userId },
                { esPrincipal: false }
            );
        }

        // Si no hay direcciones, la primera es automáticamente principal
        const direccionesExistentes = await direccionRepository.count({ 
            where: { userId: userId } 
        });
        
        if (direccionesExistentes === 0) {
            datos.esPrincipal = true;
        }

        // Crear la dirección
        const nuevaDireccion = direccionRepository.create({
            ...datos,
            userId: userId
        });

        const direccionCreada = await direccionRepository.save(nuevaDireccion);
        return [direccionCreada, null];
    } catch (error) {
        console.error("Error al crear dirección:", error);
        return [null, "Error interno del servidor"];
    }
};

// Obtener direcciones del usuario
export const obtenerDireccionesService = async (userId) => {
    try {
        const direccionRepository = AppDataSource.getRepository(Direccion);
        
        const direcciones = await direccionRepository.find({
            where: { userId: userId },
            order: { esPrincipal: "DESC", createdAt: "ASC" }
        });

        return [direcciones, null];
    } catch (error) {
        console.error("Error al obtener direcciones:", error);
        return [null, "Error interno del servidor"];
    }
};

// Obtener dirección por ID
export const obtenerDireccionPorIdService = async (userId, direccionId) => {
    try {
        const direccionRepository = AppDataSource.getRepository(Direccion);
        
        const direccion = await direccionRepository.findOne({
            where: { 
                id: direccionId,
                userId: userId 
            }
        });

        if (!direccion) {
            return [null, "Dirección no encontrada"];
        }

        return [direccion, null];
    } catch (error) {
        console.error("Error al obtener dirección:", error);
        return [null, "Error interno del servidor"];
    }
};

// Actualizar dirección
export const actualizarDireccionService = async (userId, direccionId, datos) => {
    try {
        const direccionRepository = AppDataSource.getRepository(Direccion);
        
        // Verificar que la dirección existe y pertenece al usuario
        const direccion = await direccionRepository.findOne({
            where: { 
                id: direccionId,
                userId: userId 
            }
        });

        if (!direccion) {
            return [null, "Dirección no encontrada"];
        }

        // Si se marca como principal, desmarcar las demás
        if (datos.esPrincipal && !direccion.esPrincipal) {
            await direccionRepository.update(
                { userId: userId },
                { esPrincipal: false }
            );
        }

        // Actualizar la dirección
        await direccionRepository.update(direccionId, datos);
        
        const direccionActualizada = await direccionRepository.findOne({
            where: { id: direccionId }
        });

        return [direccionActualizada, null];
    } catch (error) {
        console.error("Error al actualizar dirección:", error);
        return [null, "Error interno del servidor"];
    }
};

// Eliminar dirección
export const eliminarDireccionService = async (userId, direccionId) => {
    try {
        const direccionRepository = AppDataSource.getRepository(Direccion);
        
        // Verificar que la dirección existe y pertenece al usuario
        const direccion = await direccionRepository.findOne({
            where: { 
                id: direccionId,
                userId: userId 
            }
        });

        if (!direccion) {
            return [null, "Dirección no encontrada"];
        }

        const eraPrincipal = direccion.esPrincipal;

        // Eliminar la dirección
        await direccionRepository.delete(direccionId);

        // Si era principal, asignar otra como principal si existen más direcciones
        if (eraPrincipal) {
            const primeraDisponible = await direccionRepository.findOne({
                where: { userId: userId },
                order: { createdAt: "ASC" }
            });

            if (primeraDisponible) {
                await direccionRepository.update(primeraDisponible.id, { 
                    esPrincipal: true 
                });
            }
        }

        return [true, null];
    } catch (error) {
        console.error("Error al eliminar dirección:", error);
        return [null, "Error interno del servidor"];
    }
};

// Establecer dirección como principal
export const establecerPrincipalService = async (userId, direccionId) => {
    try {
        const direccionRepository = AppDataSource.getRepository(Direccion);
        
        // Verificar que la dirección existe y pertenece al usuario
        const direccion = await direccionRepository.findOne({
            where: { 
                id: direccionId,
                userId: userId 
            }
        });

        if (!direccion) {
            return [null, "Dirección no encontrada"];
        }

        // Desmarcar todas como principales
        await direccionRepository.update(
            { userId: userId },
            { esPrincipal: false }
        );

        // Marcar la seleccionada como principal
        await direccionRepository.update(direccionId, { esPrincipal: true });

        const direccionActualizada = await direccionRepository.findOne({
            where: { id: direccionId }
        });

        return [direccionActualizada, null];
    } catch (error) {
        console.error("Error al establecer dirección principal:", error);
        return [null, "Error interno del servidor"];
    }
}; 