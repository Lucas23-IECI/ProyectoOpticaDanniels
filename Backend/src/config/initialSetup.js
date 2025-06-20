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
            nombreCompleto: "Lucas Gabriel Méndez Risopatrón",
            rut: "21.358.808-7",
            email: "administrador2025@gmail.cl",
            password: await encryptPassword("admin1234"),
            rol: "administrador",
        });

        const user1 = userRepository.create({
            nombreCompleto: "Usuario de Prueba Uno",
            rut: "11.111.111-1",
            email: "usuario1@gmail.cl",
            password: await encryptPassword("user1234"),
            rol: "usuario",
        });

        const user2 = userRepository.create({
            nombreCompleto: "Usuario de Prueba Dos",
            rut: "22.222.222-2",
            email: "usuario2@gmail.cl",
            password: await encryptPassword("user1234"),
            rol: "usuario",
        });

        await userRepository.save([adminUser, user1, user2]);
        console.log("✅ Usuarios iniciales creados correctamente.");
    } catch (error) {
        console.error("❌ Error al crear usuarios iniciales:", error);
    }
}
