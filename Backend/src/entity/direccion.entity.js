"use strict";
import { EntitySchema } from "typeorm";

const DireccionSchema = new EntitySchema({
    name: "Direccion",
    tableName: "direcciones",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        tipo: {
            type: "varchar",
            length: 50,
            nullable: false,
            default: "casa",
        },
        direccion: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        ciudad: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        region: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        codigoPostal: {
            type: "varchar",
            length: 20,
            nullable: true,
        },
        esPrincipal: {
            type: "boolean",
            nullable: false,
            default: false,
        },
        userId: {
            type: "int",
            nullable: false,
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
    relations: {
        user: {
            target: "User",
            type: "many-to-one",
            joinColumn: { name: "userId" },
            onDelete: "CASCADE",
        },
    },
    indices: [
        {
            name: "IDX_DIRECCION_USER",
            columns: ["userId"],
        },
    ],
});

export default DireccionSchema; 