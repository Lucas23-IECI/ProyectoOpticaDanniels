"use strict";
import { EntitySchema } from "typeorm";

const MarcaSchema = new EntitySchema({
    name: "Marca",
    tableName: "marcas",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre: {
            type: "varchar",
            length: 100,
            nullable: false,
            unique: true,
        },
        logo_path: {
            type: "varchar",
            length: 255,
            nullable: true,
        },
        activo: {
            type: "boolean",
            default: true,
            nullable: false,
        },
        createdAt: {
            type: "timestamptz",
            default: () => "NOW()",
            nullable: false,
        },
        updatedAt: {
            type: "timestamptz",
            default: () => "NOW()",
            nullable: false,
        },
    },
});

export default MarcaSchema;
