"use strict";
import { EntitySchema } from "typeorm";

const MensajeContactoSchema = new EntitySchema({
  name: "MensajeContacto",
  tableName: "mensajes_contacto",
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
    },
    email: {
      type: "varchar",
      length: 150,
      nullable: false,
    },
    telefono: {
      type: "varchar",
      length: 20,
      nullable: true,
    },
    asunto: {
      type: "varchar",
      length: 200,
      nullable: true,
    },
    mensaje: {
      type: "text",
      nullable: false,
    },
    leido: {
      type: "boolean",
      default: false,
      nullable: false,
    },
    respondido: {
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
  indices: [
    {
      name: "IDX_MENSAJE_LEIDO",
      columns: ["leido"],
    },
    {
      name: "IDX_MENSAJE_EMAIL",
      columns: ["email"],
    },
  ],
});

export default MensajeContactoSchema;
