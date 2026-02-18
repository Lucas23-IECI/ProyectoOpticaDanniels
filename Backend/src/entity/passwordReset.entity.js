"use strict";
import { EntitySchema } from "typeorm";

const PasswordResetSchema = new EntitySchema({
    name: "PasswordReset",
    tableName: "password_resets",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        token: {
            type: "varchar",
            length: 255,
            nullable: false,
            unique: true,
        },
        email: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        expiresAt: {
            type: "timestamp with time zone",
            nullable: false,
        },
        used: {
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
            name: "IDX_PASSWORD_RESET_TOKEN",
            columns: ["token"],
            unique: true,
        },
        {
            name: "IDX_PASSWORD_RESET_EMAIL",
            columns: ["email"],
        },
    ],
});

export default PasswordResetSchema;
