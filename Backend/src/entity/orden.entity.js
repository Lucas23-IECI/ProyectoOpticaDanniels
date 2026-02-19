import { EntitySchema } from "typeorm";

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
        estadoPago: {
            type: "varchar",
            length: 50,
            default: "pendiente",
        },
        metodoPago: {
            type: "varchar",
            length: 50,
            nullable: true,
        },
        metodoEntrega: {
            type: "varchar",
            length: 50,
            default: "envio",
        },
        subtotal: {
            type: "numeric",
            precision: 10,
            scale: 2,
            default: 0,
        },
        iva: {
            type: "numeric",
            precision: 10,
            scale: 2,
            default: 0,
        },
        costoEnvio: {
            type: "numeric",
            precision: 10,
            scale: 2,
            default: 0,
        },
        total: {
            type: "numeric",
            precision: 10,
            scale: 2,
            nullable: false,
            default: 0,
        },
        transactionId: {
            type: "varchar",
            length: 255,
            nullable: true,
        },
        tokenWs: {
            type: "varchar",
            length: 255,
            nullable: true,
        },
        numeroBoleta: {
            type: "varchar",
            length: 50,
            nullable: true,
            unique: true,
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
        direccionId: {
            type: "int",
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
        pagos: {
            type: "one-to-many",
            target: "Pago",
            inverseSide: "orden",
            cascade: true,
        },
        direccionRef: {
            type: "many-to-one",
            target: "Direccion",
            joinColumn: { name: "direccionId" },
            nullable: true,
            onDelete: "SET NULL",
        },
    },
});

export default Orden;
