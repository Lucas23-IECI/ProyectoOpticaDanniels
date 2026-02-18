import axios from "./root.service";

/**
 * Obtiene la wishlist del usuario autenticado.
 * @returns {Promise<Array>} Lista de items de la wishlist con datos de producto
 */
export async function getWishlist() {
  try {
    const { data } = await axios.get("/wishlist");
    return data?.data || [];
  } catch (error) {
    console.error("Error al obtener wishlist:", error);
    return [];
  }
}

/**
 * Agrega un producto a la wishlist.
 * @param {number} productoId - ID del producto
 * @returns {Promise<Object|null>} Item creado o null si hubo error
 */
export async function addToWishlist(productoId) {
  try {
    const { data } = await axios.post("/wishlist", { productoId });
    return data?.data || null;
  } catch (error) {
    const message = error.response?.data?.message || "Error al agregar a la lista de deseos.";
    console.error("Error al agregar a wishlist:", message);
    throw new Error(message);
  }
}

/**
 * Elimina un producto de la wishlist.
 * @param {number} productoId - ID del producto
 * @returns {Promise<boolean>} true si se eliminó correctamente
 */
export async function removeFromWishlist(productoId) {
  try {
    await axios.delete(`/wishlist/${productoId}`);
    return true;
  } catch (error) {
    const message = error.response?.data?.message || "Error al eliminar de la lista de deseos.";
    console.error("Error al eliminar de wishlist:", message);
    throw new Error(message);
  }
}

/**
 * Verifica si un producto está en la wishlist del usuario.
 * @param {number} productoId - ID del producto
 * @returns {Promise<boolean>} true si el producto está en la wishlist
 */
export async function checkInWishlist(productoId) {
  try {
    const { data } = await axios.get(`/wishlist/check/${productoId}`);
    return data?.data?.isInWishlist || false;
  } catch (error) {
    console.error("Error al verificar wishlist:", error);
    return false;
  }
}
