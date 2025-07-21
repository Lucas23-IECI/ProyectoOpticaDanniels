"use strict";
import { EntitySchema } from "typeorm";

const ProductSchema = new EntitySchema({
    name: "Producto",
    tableName: "productos",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        descripcion: {
            type: "text",
            nullable: false,
        },
        precio: {
            type: "int",
            nullable: false,
        },
        categoria: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        subcategoria: {
            type: "varchar",
            length: 100,
            nullable: true,
        },
        imagen_url: {
            type: "varchar",
            length: 500,
            nullable: true,
        },
        stock: {
            type: "int",
            nullable: false,
        },
        activo: {
            type: "boolean",
            default: true,
            nullable: false,
        },
        marca: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        codigoSKU: {
            type: "varchar",
            length: 100,
            nullable: false,
            unique: true,
        },
        oferta: {
            type: "boolean",
            default: false,
            nullable: false,
        },
        descuento: {
            type: "int",
            default: 0,
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
    indices: [
        {
            name: "IDX_PRODUCT_ID",
            columns: ["id"],
            unique: true,
        },
        {
            name: "IDX_PRODUCT_SKU",
            columns: ["codigoSKU"],
            unique: true,
        },
    ],
});

export default ProductSchema;
