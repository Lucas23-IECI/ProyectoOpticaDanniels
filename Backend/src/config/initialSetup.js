"use strict";
import { AppDataSource } from "./configDb.js";
import User from "../entity/user.entity.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

export async function createInitialUsers() {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const count = await userRepository.count();

        if (count > 0) {
            console.log("ℹ️ Ya existen usuarios registrados.");
            return;
        }

        const adminUser = userRepository.create({
            primerNombre: "Lucas Gabriel",
            segundoNombre: null,
            apellidoPaterno: "Méndez",
            apellidoMaterno: "Risopatrón",
            rut: "21.358.808-7",
            email: "administrador2025@gmail.cl",
            password: await encryptPassword("Admin12345"),
            rol: "administrador",
        });

        const user1 = userRepository.create({
            primerNombre: "Usuario",
            segundoNombre: "de Prueba",
            apellidoPaterno: "Uno",
            apellidoMaterno: null,
            rut: "11.111.111-1",
            email: "usuario1@gmail.cl",
            password: await encryptPassword("User12345"),
            rol: "usuario",
        });

        const user2 = userRepository.create({
            primerNombre: "Usuario",
            segundoNombre: "de Prueba",
            apellidoPaterno: "Dos",
            apellidoMaterno: null,
            rut: "22.222.222-2",
            email: "usuario2@gmail.cl",
            password: await encryptPassword("User12345"),
            rol: "usuario",
        });

        await userRepository.save([adminUser, user1, user2]);
        console.log("✅ Usuarios iniciales creados correctamente.");
    } catch (error) {
        console.error("❌ Error al crear usuarios iniciales:", error);
    }
}
