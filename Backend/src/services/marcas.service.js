"use strict";
import { AppDataSource } from "../config/configDb.js";
import Marca from "../entity/marcas.entity.js";

export const getMarcasService = async () => {
    try {
        const repo = AppDataSource.getRepository(Marca);
        const marcas = await repo.find({
            where: { activo: true },
            order: { nombre: "ASC" },
        });
        return [marcas, null];
    } catch (error) {
        return [null, error];
    }
};

export const crearMarcaService = async (data) => {
    try {
        const repo = AppDataSource.getRepository(Marca);
        const existing = await repo.findOneBy({ nombre: data.nombre });
        if (existing) {
            return [null, { status: 400, message: "Ya existe una marca con ese nombre." }];
        }
        const marca = repo.create(data);
        const saved = await repo.save(marca);
        return [saved, null];
    } catch (error) {
        return [null, error];
    }
};

export const actualizarMarcaService = async (id, data) => {
    try {
        const repo = AppDataSource.getRepository(Marca);
        const marca = await repo.findOneBy({ id: Number(id) });
        if (!marca) {
            return [null, { status: 404, message: "Marca no encontrada." }];
        }
        Object.assign(marca, data, { updatedAt: new Date() });
        const saved = await repo.save(marca);
        return [saved, null];
    } catch (error) {
        return [null, error];
    }
};

export const eliminarMarcaService = async (id) => {
    try {
        const repo = AppDataSource.getRepository(Marca);
        const marca = await repo.findOneBy({ id: Number(id) });
        if (!marca) {
            return [null, { status: 404, message: "Marca no encontrada." }];
        }
        await repo.remove(marca);
        return [marca, null];
    } catch (error) {
        return [null, error];
    }
};
