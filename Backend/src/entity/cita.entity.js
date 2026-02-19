"use strict";
import { EntitySchema } from "typeorm";

const CitaSchema = new EntitySchema({
  name: "Cita",
  tableName: "citas",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    userId: {
      type: "int",
      nullable: false,
    },
    tipoServicio: {
      name: "tipoServicio",
      type: "varchar",
      length: 50,
      nullable: false,
    },
    fecha: {
      type: "date",
      nullable: false,
    },
    hora: {
      type: "time",
      nullable: false,
    },
    estado: {
      type: "varchar",
      length: 20,
      default: "'pendiente'",
      nullable: false,
    },
    notas: {
      type: "text",
      nullable: true,
    },
    notasAdmin: {
      name: "notasAdmin",
      type: "text",
      nullable: true,
    },
    telefono: {
      type: "varchar",
      length: 20,
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
      nullable: false,
    },
  },
  relations: {
    usuario: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "userId" },
      nullable: false,
      eager: true,
    },
  },
  indices: [
    {
      name: "IDX_CITA_USUARIO",
      columns: ["userId"],
    },
    {
      name: "IDX_CITA_FECHA",
      columns: ["fecha"],
    },
    {
      name: "IDX_CITA_ESTADO",
      columns: ["estado"],
    },
    {
      name: "UQ_CITA_FECHA_HORA",
      columns: ["fecha", "hora"],
      unique: true,
    },
  ],
});

export default CitaSchema;
