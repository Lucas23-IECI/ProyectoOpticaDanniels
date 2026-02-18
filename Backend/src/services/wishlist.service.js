"use strict";
import { AppDataSource } from "../config/configDb.js";
import Wishlist from "../entity/wishlist.entity.js";
import Producto from "../entity/producto.entity.js";

const wishlistRepository = AppDataSource.getRepository(Wishlist);

/**
 * Obtiene la wishlist completa del usuario autenticado.
 * Devuelve los items con los datos del producto (eager relation).
 */
export async function getWishlistService(userId) {
  const items = await wishlistRepository.find({
    where: { usuario: { id: userId } },
    order: { createdAt: "DESC" },
  });

  return [items, null];
}

/**
 * Agrega un producto a la wishlist del usuario.
 * Verifica que el producto exista y esté activo.
 * Si ya existe en la wishlist, retorna error.
 */
export async function addToWishlistService(userId, productoId) {
  // Verificar que el producto exista y esté activo
  const productoRepo = AppDataSource.getRepository(Producto);
  const producto = await productoRepo.findOne({ where: { id: productoId, activo: true } });

  if (!producto) {
    return [null, "El producto no existe o no está disponible."];
  }

  // Verificar si ya está en la wishlist
  const existing = await wishlistRepository.findOne({
    where: { usuario: { id: userId }, producto: { id: productoId } },
  });

  if (existing) {
    return [null, "El producto ya está en tu lista de deseos."];
  }

  const wishlistItem = wishlistRepository.create({
    usuario: { id: userId },
    producto: { id: productoId },
  });

  const saved = await wishlistRepository.save(wishlistItem);
  return [saved, null];
}

/**
 * Elimina un producto de la wishlist del usuario.
 */
export async function removeFromWishlistService(userId, productoId) {
  const item = await wishlistRepository.findOne({
    where: { usuario: { id: userId }, producto: { id: productoId } },
  });

  if (!item) {
    return [null, "El producto no está en tu lista de deseos."];
  }

  await wishlistRepository.remove(item);
  return [true, null];
}

/**
 * Verifica si un producto específico está en la wishlist del usuario.
 */
export async function isInWishlistService(userId, productoId) {
  const item = await wishlistRepository.findOne({
    where: { usuario: { id: userId }, producto: { id: productoId } },
  });

  return [{ isInWishlist: !!item }, null];
}
