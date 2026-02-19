"use strict";
import { EntitySchema } from "typeorm";

const StockMovimientoSchema = new EntitySchema({
    name: "StockMovimiento",
    tableName: "stock_movimientos",
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
        },
        cantidad: {
            type: "int",
            nullable: false,
        },
        stockAnterior: {
            type: "int",
            nullable: false,
        },
        stockNuevo: {
            type: "int",
            nullable: false,
        },
        motivo: {
            type: "text",
            nullable: true,
        },
        createdAt: {
            type: "timestamp with time zone",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
        },
        productoId: {
            type: "int",
            nullable: false,
        },
        ordenId: {
            type: "int",
            nullable: true,
        },
    },
    relations: {
        producto: {
            type: "many-to-one",
            target: "Producto",
            joinColumn: { name: "productoId" },
            nullable: false,
            onDelete: "CASCADE",
        },
        orden: {
            type: "many-to-one",
            target: "Orden",
            joinColumn: { name: "ordenId" },
            nullable: true,
            onDelete: "SET NULL",
        },
    },
    indices: [
        {
            name: "IDX_STOCKMOV_PRODUCTO",
            columns: ["productoId"],
        },
        {
            name: "IDX_STOCKMOV_ORDEN",
            columns: ["ordenId"],
        },
        {
            name: "IDX_STOCKMOV_TIPO",
            columns: ["tipo"],
        },
    ],
});

export default StockMovimientoSchema;
