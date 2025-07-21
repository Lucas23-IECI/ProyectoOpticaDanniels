"use strict";
import { EntitySchema } from "typeorm";

const UserSchema = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        primerNombre: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        segundoNombre: {
            type: "varchar",
            length: 100,
            nullable: true,
        },
        apellidoPaterno: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        apellidoMaterno: {
            type: "varchar",
            length: 100,
            nullable: true,
        },
        rut: {
            type: "varchar",
            length: 12,
            nullable: false,
            unique: true,
        },
        email: {
            type: "varchar",
            length: 255,
            nullable: false,
            unique: true,
        },
        rol: {
            type: "varchar",
            length: 50,
            nullable: false,
        },
        password: {
            type: "varchar",
            nullable: false,
        },
        telefono: {
            type: "varchar",
            length: 20,
            nullable: true,
        },
        fechaNacimiento: {
            type: "date",
            nullable: true,
        },
        genero: {
            type: "varchar",
            length: 50,
            nullable: true,
        },
        createdAt: {
            type: "timestamp with time zone",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
        },
        updatedAt: {
            type: "timestamp with time zone",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
            nullable: false,
        },
    },
    indices: [
        {
            name: "IDX_USER",
            columns: ["id"],
            unique: true,
        },
        {
            name: "IDX_USER_RUT",
            columns: ["rut"],
            unique: true,
        },
        {
            name: "IDX_USER_EMAIL",
            columns: ["email"],
            unique: true,
        },
    ],
    relations: {
        direcciones: {
            target: "Direccion",
            type: "one-to-many",
            inverseSide: "user",
        },
    },
});

export default UserSchema;