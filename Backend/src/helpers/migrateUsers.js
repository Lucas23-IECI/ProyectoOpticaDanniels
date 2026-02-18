"use strict";
import { AppDataSource } from "../config/configDb.js";
import User from "../entity/user.entity.js";
import { transformUserToNewStructure } from "../helpers/nameHelpers.js";
import logger from "../config/logger.js";

export async function migrateUsers() {
    try {
        logger.info("Iniciando migración de usuarios...");
        
        // Verificar que la conexión esté activa
        if (!AppDataSource.isInitialized) {
            logger.warn("Base de datos no inicializada. Saltando migración.");
            return;
        }

        const userRepository = AppDataSource.getRepository(User);
        
        // Verificar que la tabla existe intentando contar usuarios
        let userCount = 0;
        try {
            userCount = await userRepository.count();
        } catch (error) {
            logger.warn("Tabla users no existe aún. Saltando migración.");
            return;
        }

        // Si no hay usuarios, no hay nada que migrar
        if (userCount === 0) {
            logger.info("No hay usuarios para migrar.");
            return;
        }
        
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        
        try {
            // Verificar si la tabla existe
            const tableExists = await queryRunner.hasTable("users");
            if (!tableExists) {
                logger.warn("Tabla users no existe. Saltando migración.");
                return;
            }

            const table = await queryRunner.getTable("users");
            if (!table) {
                logger.warn("No se pudo obtener información de la tabla users. Saltando migración.");
                return;
            }

            const primerNombreColumn = table.findColumnByName("primerNombre");
            const nombreCompletoColumn = table.findColumnByName("nombreCompleto");
            
            // Si ya tenemos primerNombre, la migración ya se hizo o no es necesaria
            if (primerNombreColumn) {
                logger.info("La tabla users ya tiene la estructura correcta (campos separados).");
                
                // Si además existe nombreCompleto, podemos migrarlo
                if (nombreCompletoColumn) {
                    logger.info("Migrando datos de nombreCompleto a campos separados...");
                    
                    const usersWithNombreCompleto = await queryRunner.query(`
                        SELECT id, nombreCompleto 
                        FROM users 
                        WHERE nombreCompleto IS NOT NULL 
                        AND (primerNombre IS NULL OR primerNombre = '')
                    `);
                    
                    for (const user of usersWithNombreCompleto) {
                        const transformedUser = transformUserToNewStructure(user);
                        
                        await queryRunner.query(`
                            UPDATE users 
                            SET 
                                primerNombre = $1,
                                segundoNombre = $2,
                                apellidoPaterno = $3,
                                apellidoMaterno = $4
                            WHERE id = $5
                        `, [
                            transformedUser.primerNombre,
                            transformedUser.segundoNombre,
                            transformedUser.apellidoPaterno,
                            transformedUser.apellidoMaterno,
                            user.id
                        ]);
                    }
                    
                    logger.info(`Migrados ${usersWithNombreCompleto.length} usuarios`);
                    
                    // Solo eliminar nombreCompleto si se migraron datos
                    if (usersWithNombreCompleto.length > 0) {
                        await queryRunner.query("ALTER TABLE users DROP COLUMN nombreCompleto");
                        logger.info("Columna nombreCompleto eliminada");
                    }
                }
                
                logger.info("Migración de usuarios completada exitosamente");
                return;
            }
            
            // Si llegamos aquí, no tenemos primerNombre, necesitamos agregarlo
            logger.warn("Las columnas nuevas no existen aún. Ejecutando migración de esquema...");
            
            await queryRunner.query(`
                ALTER TABLE users 
                ADD COLUMN primerNombre VARCHAR(100),
                ADD COLUMN segundoNombre VARCHAR(100),
                ADD COLUMN apellidoPaterno VARCHAR(100),
                ADD COLUMN apellidoMaterno VARCHAR(100)
            `);
            
            logger.info("Columnas agregadas exitosamente");
            
            // Ahora migrar datos si existe nombreCompleto
            if (nombreCompletoColumn) {
                logger.info("Migrando datos de nombreCompleto a campos separados...");
                
                const usersWithNombreCompleto = await queryRunner.query(`
                    SELECT id, nombreCompleto 
                    FROM users 
                    WHERE nombreCompleto IS NOT NULL 
                    AND (primerNombre IS NULL OR primerNombre = '')
                `);
                
                for (const user of usersWithNombreCompleto) {
                    const transformedUser = transformUserToNewStructure(user);
                    
                    await queryRunner.query(`
                        UPDATE users 
                        SET 
                            primerNombre = $1,
                            segundoNombre = $2,
                            apellidoPaterno = $3,
                            apellidoMaterno = $4
                        WHERE id = $5
                    `, [
                        transformedUser.primerNombre,
                        transformedUser.segundoNombre,
                        transformedUser.apellidoPaterno,
                        transformedUser.apellidoMaterno,
                        user.id
                    ]);
                }
                
                logger.info(`Migrados ${usersWithNombreCompleto.length} usuarios`);
                
                await queryRunner.query("ALTER TABLE users DROP COLUMN nombreCompleto");
                logger.info("Columna nombreCompleto eliminada");
            }
            
        } finally {
            await queryRunner.release();
        }
        
        logger.info("Migración de usuarios completada exitosamente");
        
    } catch (error) {
        logger.error("Error en migración de usuarios:", error);
        // No lanzar el error para que no rompa el inicio de la aplicación
        logger.warn("Continuando con el inicio de la aplicación...");
    }
}
