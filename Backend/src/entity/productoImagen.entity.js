"use strict";
import { EntitySchema } from "typeorm";

const ProductoImagenSchema = new EntitySchema({
    name: "ProductoImagen",
    tableName: "producto_imagenes",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        producto_id: {
            type: "int",
            nullable: false,
        },
        imagen_url: {
            type: "varchar",
            length: 500,
            nullable: false,
        },
        posicion: {
            type: "int",
            default: 0,
            nullable: false,
        },
        es_principal: {
            type: "boolean",
            default: false,
            nullable: false,
        },
        createdAt: {
            type: "timestamp with time zone",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
        },
    },
    relations: {
        producto: {
            type: "many-to-one",
            target: "Producto",
            joinColumn: { name: "producto_id" },
            onDelete: "CASCADE",
        },
    },
    indices: [
        {
            name: "IDX_PRODIMG_PRODUCTO",
            columns: ["producto_id"],
        },
    ],
});

export default ProductoImagenSchema;
