import { EntitySchema } from "typeorm";
import UserSchema from "./user.entity.js";

const Orden = new EntitySchema({
    name: "Orden",
    tableName: "ordenes",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        nombre: {
            type: "varchar",
            length: 100,
        },
        correo: {
            type: "varchar",
            length: 100,
        },
        telefono: {
            type: "varchar",
            length: 20,
            nullable: true,
        },
        direccion: {
            type: "varchar",
            length: 200,
        },
        observaciones: {
            type: "text",
            nullable: true,
        },
        estado: {
            type: "varchar",
            default: "pendiente",
        },
        fecha: {
            type: "timestamp",
            createDate: true,
        },
        anonId: {
            type: "varchar",
            length: 100,
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
    relations: {
        productos: {
            type: "one-to-many",
            target: "OrdenProducto",
            inverseSide: "orden",
            cascade: true,
            onDelete: "CASCADE",
        },
        usuario: {
            type: "many-to-one",
            target: "User",
            joinColumn: true,
            nullable: true,
            onDelete: "SET NULL",
        },
    },
});

export default Orden;
