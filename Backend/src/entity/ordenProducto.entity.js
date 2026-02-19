import { EntitySchema } from "typeorm";

const OrdenProducto = new EntitySchema({
    name: "OrdenProducto",
    tableName: "ordenes_productos",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        cantidad: {
            type: "int",
        },
        precio: {
            type: "numeric",
            precision: 10,
            scale: 2,
            nullable: false,
        },
        descuento: {
            type: "int",
            default: 0,
            nullable: false,
        },
        subtotal: {
            type: "numeric",
            precision: 10,
            scale: 2,
            nullable: false,
            default: 0,
        },
    },
    relations: {
        orden: {
            type: "many-to-one",
            target: "Orden",
            joinColumn: true,
            onDelete: "CASCADE",
        },
        producto: {
            type: "many-to-one",
            target: "Producto",
            joinColumn: true,
            eager: true,
            onDelete: "SET NULL",
        },
    },
});

export default OrdenProducto;
