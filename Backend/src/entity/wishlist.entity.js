"use strict";
import { EntitySchema } from "typeorm";

const WishlistSchema = new EntitySchema({
  name: "Wishlist",
  tableName: "wishlist",
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
    createdAt: {
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
    },
    producto: {
      type: "many-to-one",
      target: "Producto",
      joinColumn: { name: "productoId" },
      nullable: false,
      eager: true,
    },
  },
  indices: [
    {
      name: "IDX_WISHLIST_USER",
      columns: ["userId"],
    },
    {
      name: "IDX_WISHLIST_PRODUCTO",
      columns: ["productoId"],
    },
    {
      name: "UQ_WISHLIST_USER_PRODUCTO",
      columns: ["userId", "productoId"],
      unique: true,
    },
  ],
});

export default WishlistSchema;
