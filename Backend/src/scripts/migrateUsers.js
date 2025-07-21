import { AppDataSource } from "../config/configDb.js";
import User from "../entity/user.entity.js";
import { IsNull, Not } from "typeorm";
import { transformUserToNewStructure } from "../helpers/nameHelpers.js";

export async function migrateUserData() {
    try {
        console.log("🔄 Iniciando migración de usuarios...");
        
        const userRepository = AppDataSource.getRepository(User);
        
        const usersWithNombreCompleto = await userRepository.find({
            where: {
                nombreCompleto: Not(IsNull()),
            },
        });
        
        if (usersWithNombreCompleto.length === 0) {
            console.log("ℹ️ No hay usuarios para migrar.");
            return;
        }
        
        const firstUser = usersWithNombreCompleto[0];
        if (firstUser.primerNombre) {
            console.log("✅ La migración ya fue realizada.");
            return;
        }
        
        console.log(`📋 Migrando ${usersWithNombreCompleto.length} usuarios...`);
        
        for (const user of usersWithNombreCompleto) {
            if (user.nombreCompleto) {
                const transformedUser = transformUserToNewStructure(user);
                
                await userRepository.update(user.id, transformedUser);
                
                console.log(
                    `👤 Usuario migrado: ${user.nombreCompleto} -> ${JSON.stringify(transformedUser)}`
                );
            }
        }
        
        console.log("🎉 Migración completada exitosamente!");
        
    } catch (error) {
        console.error("❌ Error durante la migración:", error);
        throw error;
    }
}

if (process.argv[2] === "--migrate") {
    AppDataSource.initialize().then(async () => {
        await migrateUserData();
        process.exit(0);
    }).catch(error => {
        console.error("Error:", error);
        process.exit(1);
    });
}
