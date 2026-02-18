"use strict";
import {
  addToWishlistService,
  getWishlistService,
  isInWishlistService,
  removeFromWishlistService,
} from "../services/wishlist.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

/**
 * GET /api/wishlist — Lista la wishlist del usuario autenticado
 */
export async function getWishlist(req, res) {
  try {
    const userId = req.user.id;
    const [items, error] = await getWishlistService(userId);

    if (error) return handleErrorClient(res, 400, error);
    return handleSuccess(res, 200, "Lista de deseos obtenida.", items);
  } catch (error) {
    return handleErrorServer(res, 500, error.message);
  }
}

/**
 * POST /api/wishlist — Agrega un producto a la wishlist
 */
export async function addToWishlist(req, res) {
  try {
    const userId = req.user.id;
    const { productoId } = req.body;

    const [item, error] = await addToWishlistService(userId, productoId);

    if (error) return handleErrorClient(res, 400, error);
    return handleSuccess(res, 201, "Producto agregado a la lista de deseos.", item);
  } catch (error) {
    return handleErrorServer(res, 500, error.message);
  }
}

/**
 * DELETE /api/wishlist/:productoId — Elimina un producto de la wishlist
 */
export async function removeFromWishlist(req, res) {
  try {
    const userId = req.user.id;
    const productoId = parseInt(req.params.productoId);

    if (isNaN(productoId)) {
      return handleErrorClient(res, 400, "ID de producto inválido.");
    }

    const [result, error] = await removeFromWishlistService(userId, productoId);

    if (error) return handleErrorClient(res, 404, error);
    return handleSuccess(res, 200, "Producto eliminado de la lista de deseos.");
  } catch (error) {
    return handleErrorServer(res, 500, error.message);
  }
}

/**
 * GET /api/wishlist/check/:productoId — Verifica si un producto está en la wishlist
 */
export async function checkWishlist(req, res) {
  try {
    const userId = req.user.id;
    const productoId = parseInt(req.params.productoId);

    if (isNaN(productoId)) {
      return handleErrorClient(res, 400, "ID de producto inválido.");
    }

    const [result, error] = await isInWishlistService(userId, productoId);

    if (error) return handleErrorClient(res, 400, error);
    return handleSuccess(res, 200, "Consulta realizada.", result);
  } catch (error) {
    return handleErrorServer(res, 500, error.message);
  }
}
