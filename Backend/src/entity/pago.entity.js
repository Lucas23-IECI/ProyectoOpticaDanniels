"use strict";
import { EntitySchema } from "typeorm";

const PagoSchema = new EntitySchema({
    name: "Pago",
    tableName: "pagos",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        monto: {
            type: "numeric",
            precision: 10,
            scale: 2,
            nullable: false,
        },
        metodo: {
            type: "varchar",
            length: 50,
            nullable: false,
        },
        estado: {
            type: "varchar",
            length: 50,
            default: "iniciado",
        },
        transactionId: {
            type: "varchar",
            length: 255,
            nullable: true,
        },
        authorizationCode: {
            type: "varchar",
            length: 100,
            nullable: true,
        },
        responseCode: {
            type: "varchar",
            length: 50,
            nullable: true,
        },
        rawResponse: {
            type: "jsonb",
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
        ordenId: {
            type: "int",
            nullable: false,
        },
    },
    relations: {
        orden: {
            type: "many-to-one",
            target: "Orden",
            joinColumn: { name: "ordenId" },
            nullable: false,
            onDelete: "CASCADE",
        },
    },
    indices: [
        {
            name: "IDX_PAGO_ORDEN",
            columns: ["ordenId"],
        },
        {
            name: "IDX_PAGO_TRANSACTION",
            columns: ["transactionId"],
        },
        {
            name: "IDX_PAGO_ESTADO",
            columns: ["estado"],
        },
    ],
});

export default PagoSchema;
