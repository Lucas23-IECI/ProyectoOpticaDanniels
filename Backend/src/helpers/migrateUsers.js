"use strict";
import { AppDataSource } from "../config/configDb.js";
import User from "../entity/user.entity.js";
import { transformUserToNewStructure } from "../helpers/nameHelpers.js";

export async function migrateUsers() {
    try {
        console.log("🔄 Iniciando migración de usuarios...");
        
        const userRepository = AppDataSource.getRepository(User);
        
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        
        try {
            const table = await queryRunner.getTable("users");
            const primerNombreColumn = table.findColumnByName("primerNombre");
            
            if (!primerNombreColumn) {
                console.log("⚠️  Las columnas nuevas no existen aún. Ejecutando migración de esquema...");
                
                await queryRunner.query(`
                    ALTER TABLE users 
                    ADD COLUMN primerNombre VARCHAR(100),
                    ADD COLUMN segundoNombre VARCHAR(100),
                    ADD COLUMN apellidoPaterno VARCHAR(100),
                    ADD COLUMN apellidoMaterno VARCHAR(100)
                `);
                
                console.log("✅ Columnas agregadas exitosamente");
            }
            
            const nombreCompletoColumn = table.findColumnByName("nombreCompleto");
            
            if (nombreCompletoColumn) {
                console.log("🔄 Migrando datos de nombreCompleto a campos separados...");
                
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
                            primerNombre = ?,
                            segundoNombre = ?,
                            apellidoPaterno = ?,
                            apellidoMaterno = ?
                        WHERE id = ?
                    `, [
                        transformedUser.primerNombre,
                        transformedUser.segundoNombre,
                        transformedUser.apellidoPaterno,
                        transformedUser.apellidoMaterno,
                        user.id
                    ]);
                }
                
                console.log(`✅ Migrados ${usersWithNombreCompleto.length} usuarios`);
                
                await queryRunner.query("ALTER TABLE users DROP COLUMN nombreCompleto");
                console.log("🗑️  Columna nombreCompleto eliminada");
            }
            
        } finally {
            await queryRunner.release();
        }
        
        console.log("✅ Migración de usuarios completada exitosamente");
        
    } catch (error) {
        console.error("❌ Error en migración de usuarios:", error);
        throw error;
    }
}
