import { AppDataSource } from "../config/configDb.js";
import ProductoImagen from "../entity/productoImagen.entity.js";
import Producto from "../entity/producto.entity.js";
import fs from "fs";
import path from "path";
import logger from "../config/logger.js";

const getRepo = () => AppDataSource.getRepository(ProductoImagen);
const getProductoRepo = () => AppDataSource.getRepository(Producto);

const eliminarArchivoLocal = (imagenUrl) => {
    if (!imagenUrl || imagenUrl.startsWith("http")) return;
    const ruta = path.join("uploads", "productos", imagenUrl);
    try {
        if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
    } catch (err) {
        logger.error(`Error eliminando imagen local: ${ruta}`, err);
    }
};

const syncPrincipalToProducto = async (productoId) => {
    const repo = getRepo();
    const productoRepo = getProductoRepo();
    const principal = await repo.findOne({
        where: { producto_id: productoId, es_principal: true },
    });
    const producto = await productoRepo.findOneBy({ id: productoId });
    if (!producto) return;
    producto.imagen_url = principal ? principal.imagen_url : null;
    await productoRepo.save(producto);
};

export const obtenerImagenesService = async (productoId) => {
    const repo = getRepo();
    return await repo.find({
        where: { producto_id: productoId },
        order: { posicion: "ASC", id: "ASC" },
    });
};

export const agregarImagenesService = async (productoId, archivos) => {
    const repo = getRepo();
    const productoRepo = getProductoRepo();

    const producto = await productoRepo.findOneBy({ id: productoId });
    if (!producto) throw { status: 404, message: "Producto no encontrado" };

    const existentes = await repo.count({ where: { producto_id: productoId } });
    if (existentes + archivos.length > 5) {
        throw { status: 400, message: `Máximo 5 imágenes por producto. Ya tiene ${existentes}.` };
    }

    const maxPosicion = await repo.maximum("posicion", { producto_id: productoId }) ?? -1;
    const sinPrincipal = existentes === 0;

    const nuevas = archivos.map((file, i) => {
        const imagenUrl = file.path && file.path.startsWith("http") ? file.path : file.filename;
        return repo.create({
            producto_id: productoId,
            imagen_url: imagenUrl,
            posicion: maxPosicion + 1 + i,
            es_principal: sinPrincipal && i === 0,
        });
    });

    const guardadas = await repo.save(nuevas);

    if (sinPrincipal) {
        await syncPrincipalToProducto(productoId);
    }

    return guardadas;
};

export const eliminarImagenService = async (imagenId) => {
    const repo = getRepo();
    const imagen = await repo.findOneBy({ id: imagenId });
    if (!imagen) throw { status: 404, message: "Imagen no encontrada" };

    const productoId = imagen.producto_id;
    const eraPrincipal = imagen.es_principal;

    eliminarArchivoLocal(imagen.imagen_url);
    await repo.remove(imagen);

    if (eraPrincipal) {
        const primera = await repo.findOne({
            where: { producto_id: productoId },
            order: { posicion: "ASC" },
        });
        if (primera) {
            primera.es_principal = true;
            await repo.save(primera);
        }
        await syncPrincipalToProducto(productoId);
    }

    return { productoId };
};

export const reordenarImagenesService = async (productoId, ordenIds) => {
    const repo = getRepo();
    const imagenes = await repo.find({ where: { producto_id: productoId } });

    const idSet = new Set(imagenes.map((img) => img.id));
    for (const id of ordenIds) {
        if (!idSet.has(id)) throw { status: 400, message: `Imagen ${id} no pertenece al producto` };
    }

    const updates = ordenIds.map((id, index) =>
        repo.update(id, { posicion: index })
    );
    await Promise.all(updates);

    return await obtenerImagenesService(productoId);
};

export const establecerPrincipalService = async (imagenId) => {
    const repo = getRepo();
    const imagen = await repo.findOneBy({ id: imagenId });
    if (!imagen) throw { status: 404, message: "Imagen no encontrada" };

    await repo.update({ producto_id: imagen.producto_id }, { es_principal: false });
    imagen.es_principal = true;
    await repo.save(imagen);

    await syncPrincipalToProducto(imagen.producto_id);

    return imagen;
};
