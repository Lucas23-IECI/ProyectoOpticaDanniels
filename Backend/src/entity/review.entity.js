"use strict";
import { EntitySchema } from "typeorm";

const ReviewSchema = new EntitySchema({
  name: "Review",
  tableName: "reviews",
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
    productoId: {
      type: "int",
      nullable: false,
    },
    rating: {
      type: "int",
      nullable: false,
    },
    comentario: {
      type: "text",
      nullable: true,
    },
    estado: {
      type: "varchar",
      length: 20,
      default: "'pendiente'",
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
    producto: {
      type: "many-to-one",
      target: "Producto",
      joinColumn: { name: "productoId" },
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_REVIEW_PRODUCTO",
      columns: ["productoId"],
    },
    {
      name: "IDX_REVIEW_USUARIO",
      columns: ["userId"],
    },
    {
      name: "IDX_REVIEW_ESTADO",
      columns: ["estado"],
    },
    {
      name: "UQ_REVIEW_USUARIO_PRODUCTO",
      columns: ["userId", "productoId"],
      unique: true,
    },
  ],
});

export default ReviewSchema;
