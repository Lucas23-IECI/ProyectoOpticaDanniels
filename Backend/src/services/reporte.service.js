"use strict";
import { AppDataSource } from "../config/configDb.js";
import User from "../entity/user.entity.js";
import Producto from "../entity/producto.entity.js";

export async function getEstadisticasGeneralesService() {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const productoRepository = AppDataSource.getRepository(Producto);

        // Estadísticas de usuarios
        const totalUsuarios = await userRepository.count();
        const usuariosAdmin = await userRepository.count({ where: { rol: 'administrador' } });
        const usuariosRegulares = await userRepository.count({ where: { rol: 'usuario' } });

        // Usuarios registrados en los últimos 30 días
        const fecha30Dias = new Date();
        fecha30Dias.setDate(fecha30Dias.getDate() - 30);
        
        const usuariosUltimos30Dias = await userRepository
            .createQueryBuilder("user")
            .where("user.createdAt >= :fecha", { fecha: fecha30Dias })
            .getCount();

        // Usuarios por género
        const usuariosPorGenero = await userRepository
            .createQueryBuilder("user")
            .select("user.genero", "genero")
            .addSelect("COUNT(*)", "cantidad")
            .where("user.genero IS NOT NULL")
            .groupBy("user.genero")
            .getRawMany();

        // Estadísticas de productos
        const totalProductos = await productoRepository.count();
        const productosActivos = await productoRepository.count({ where: { activo: true } });
        const productosInactivos = await productoRepository.count({ where: { activo: false } });
        const productosEnOferta = await productoRepository.count({ where: { oferta: true, activo: true } });
        
        console.log('Productos en oferta:', productosEnOferta);
        console.log('Total productos activos:', productosActivos);

        // Productos por categoría
        const productosPorCategoria = await productoRepository
            .createQueryBuilder("producto")
            .select("producto.categoria", "categoria")
            .addSelect("COUNT(*)", "cantidad")
            .groupBy("producto.categoria")
            .getRawMany();

        // Productos con stock bajo (menos de 10 unidades o stock = 0)
        const productosStockBajo = await productoRepository
            .createQueryBuilder("producto")
            .where("(producto.stock < :stock OR producto.stock = 0) AND producto.activo = :activo", { stock: 10, activo: true })
            .getCount();

        // Debug: obtener productos con stock bajo para verificar
        const productosStockBajoDebug = await productoRepository
            .createQueryBuilder("producto")
            .select(["producto.nombre", "producto.stock", "producto.activo"])
            .where("(producto.stock < :stock OR producto.stock = 0) AND producto.activo = :activo", { stock: 10, activo: true })
            .getMany();
        
        console.log('Productos con stock bajo:', productosStockBajoDebug);

        // Debug: obtener todos los productos para verificar stock
        const todosProductosDebug = await productoRepository
            .createQueryBuilder("producto")
            .select(["producto.nombre", "producto.stock", "producto.activo"])
            .orderBy("producto.stock", "ASC")
            .limit(10)
            .getMany();
        
        console.log('Top 10 productos con menor stock:', todosProductosDebug);

        // Valor total del inventario (solo productos activos con stock > 0)
        const valorInventario = await productoRepository
            .createQueryBuilder("producto")
            .select("SUM(producto.precio * producto.stock)", "total")
            .where("producto.activo = :activo AND producto.stock > 0", { activo: true })
            .getRawOne();

        console.log('Valor del inventario raw:', valorInventario);
        console.log('Valor del inventario parsed:', parseFloat(valorInventario.total) || 0);

        // Registros por mes en los últimos 6 meses
        const fecha6Meses = new Date();
        fecha6Meses.setMonth(fecha6Meses.getMonth() - 6);

        const registrosPorMes = await userRepository
            .createQueryBuilder("user")
            .select("EXTRACT(YEAR FROM user.createdAt)", "año")
            .addSelect("EXTRACT(MONTH FROM user.createdAt)", "mes")
            .addSelect("COUNT(*)", "cantidad")
            .where("user.createdAt >= :fecha", { fecha: fecha6Meses })
            .groupBy("EXTRACT(YEAR FROM user.createdAt), EXTRACT(MONTH FROM user.createdAt)")
            .orderBy("año", "ASC")
            .addOrderBy("mes", "ASC")
            .getRawMany();

        return [{
            usuarios: {
                total: totalUsuarios,
                administradores: usuariosAdmin,
                regulares: usuariosRegulares,
                ultimos30Dias: usuariosUltimos30Dias,
                porGenero: usuariosPorGenero
            },
            productos: {
                total: totalProductos,
                activos: productosActivos,
                inactivos: productosInactivos,
                enOferta: productosEnOferta,
                stockBajo: productosStockBajo,
                valorInventario: parseFloat(valorInventario.total) || 0,
                porCategoria: productosPorCategoria
            },
            tendencias: {
                registrosPorMes: registrosPorMes.map(item => ({
                    año: parseInt(item.año),
                    mes: parseInt(item.mes),
                    cantidad: parseInt(item.cantidad)
                }))
            }
        }, null];
    } catch (error) {
        console.error("Error al obtener estadísticas generales:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getEstadisticasUsuariosService() {
    try {
        const userRepository = AppDataSource.getRepository(User);

        // Usuarios por rol
        const usuariosPorRol = await userRepository
            .createQueryBuilder("user")
            .select("user.rol", "rol")
            .addSelect("COUNT(*)", "cantidad")
            .groupBy("user.rol")
            .getRawMany();

        // Usuarios por género
        const usuariosPorGenero = await userRepository
            .createQueryBuilder("user")
            .select("user.genero", "genero")
            .addSelect("COUNT(*)", "cantidad")
            .where("user.genero IS NOT NULL")
            .groupBy("user.genero")
            .getRawMany();

        // Usuarios registrados por mes en el último año
        const fechaUnAño = new Date();
        fechaUnAño.setFullYear(fechaUnAño.getFullYear() - 1);

        const registrosPorMes = await userRepository
            .createQueryBuilder("user")
            .select("EXTRACT(YEAR FROM user.createdAt)", "año")
            .addSelect("EXTRACT(MONTH FROM user.createdAt)", "mes")
            .addSelect("COUNT(*)", "cantidad")
            .where("user.createdAt >= :fecha", { fecha: fechaUnAño })
            .groupBy("EXTRACT(YEAR FROM user.createdAt), EXTRACT(MONTH FROM user.createdAt)")
            .orderBy("año", "ASC")
            .addOrderBy("mes", "ASC")
            .getRawMany();

        // Últimos usuarios registrados
        const ultimosUsuarios = await userRepository
            .createQueryBuilder("user")
            .select([
                "user.id",
                "user.primerNombre",
                "user.segundoNombre", 
                "user.apellidoPaterno",
                "user.apellidoMaterno",
                "user.email",
                "user.rol",
                "user.createdAt"
            ])
            .orderBy("user.createdAt", "DESC")
            .limit(10)
            .getMany();

        // Distribución por edad (calculada)
        const usuariosConEdad = await userRepository
            .createQueryBuilder("user")
            .select("user.fechaNacimiento")
            .where("user.fechaNacimiento IS NOT NULL")
            .getMany();

        const distribucionPorEdad = {
            "18-25": 0,
            "26-35": 0,
            "36-45": 0,
            "46-55": 0,
            "56-65": 0,
            "65+": 0
        };

        usuariosConEdad.forEach(usuario => {
            const edad = new Date().getFullYear() - new Date(usuario.fechaNacimiento).getFullYear();
            
            if (edad >= 18 && edad <= 25) distribucionPorEdad["18-25"]++;
            else if (edad >= 26 && edad <= 35) distribucionPorEdad["26-35"]++;
            else if (edad >= 36 && edad <= 45) distribucionPorEdad["36-45"]++;
            else if (edad >= 46 && edad <= 55) distribucionPorEdad["46-55"]++;
            else if (edad >= 56 && edad <= 65) distribucionPorEdad["56-65"]++;
            else if (edad > 65) distribucionPorEdad["65+"]++;
        });

        return [{
            porRol: usuariosPorRol.map(item => ({
                rol: item.rol,
                cantidad: parseInt(item.cantidad)
            })),
            porGenero: usuariosPorGenero.map(item => ({
                genero: item.genero,
                cantidad: parseInt(item.cantidad)
            })),
            registrosPorMes: registrosPorMes.map(item => ({
                año: parseInt(item.año),
                mes: parseInt(item.mes),
                cantidad: parseInt(item.cantidad)
            })),
            ultimosUsuarios: ultimosUsuarios,
            distribucionPorEdad: Object.entries(distribucionPorEdad).map(([rango, cantidad]) => ({
                rango,
                cantidad
            }))
        }, null];
    } catch (error) {
        console.error("Error al obtener estadísticas de usuarios:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getEstadisticasProductosService() {
    try {
        const productoRepository = AppDataSource.getRepository(Producto);

        // Productos por categoría
        const productosPorCategoria = await productoRepository
            .createQueryBuilder("producto")
            .select("producto.categoria", "categoria")
            .addSelect("COUNT(*)", "cantidad")
            .groupBy("producto.categoria")
            .getRawMany();

        // Productos por marca (top 10)
        const productosPorMarca = await productoRepository
            .createQueryBuilder("producto")
            .select("producto.marca", "marca")
            .addSelect("COUNT(*)", "cantidad")
            .where("producto.marca IS NOT NULL")
            .groupBy("producto.marca")
            .orderBy("cantidad", "DESC")
            .limit(10)
            .getRawMany();

        // Productos con stock bajo
        const productosStockBajo = await productoRepository
            .createQueryBuilder("producto")
            .where("producto.stock < :stock", { stock: 10 })
            .getMany();

        // Productos más caros
        const productosMasCaros = await productoRepository
            .createQueryBuilder("producto")
            .select([
                "producto.id",
                "producto.nombre",
                "producto.marca",
                "producto.categoria",
                "producto.precio",
                "producto.stock"
            ])
            .orderBy("producto.precio", "DESC")
            .limit(10)
            .getMany();

        // Distribución de precios
        const distribucionPrecios = {
            "0-50000": 0,
            "50001-100000": 0,
            "100001-200000": 0,
            "200001-500000": 0,
            "500000+": 0
        };

        const todosProductos = await productoRepository.find({ select: ["precio"] });
        
        todosProductos.forEach(producto => {
            const precio = producto.precio;
            
            if (precio <= 50000) distribucionPrecios["0-50000"]++;
            else if (precio <= 100000) distribucionPrecios["50001-100000"]++;
            else if (precio <= 200000) distribucionPrecios["100001-200000"]++;
            else if (precio <= 500000) distribucionPrecios["200001-500000"]++;
            else distribucionPrecios["500000+"]++;
        });

        // Estado de productos
        const estadoProductos = await productoRepository
            .createQueryBuilder("producto")
            .select("producto.activo", "activo")
            .addSelect("COUNT(*)", "cantidad")
            .groupBy("producto.activo")
            .getRawMany();

        // Productos en oferta
        const productosOferta = await productoRepository
            .createQueryBuilder("producto")
            .select("producto.oferta", "oferta")
            .addSelect("COUNT(*)", "cantidad")
            .groupBy("producto.oferta")
            .getRawMany();

        return [{
            porCategoria: productosPorCategoria.map(item => ({
                categoria: item.categoria,
                cantidad: parseInt(item.cantidad)
            })),
            porMarca: productosPorMarca.map(item => ({
                marca: item.marca,
                cantidad: parseInt(item.cantidad)
            })),
            stockBajo: productosStockBajo,
            masCaros: productosMasCaros,
            distribucionPrecios: Object.entries(distribucionPrecios).map(([rango, cantidad]) => ({
                rango,
                cantidad
            })),
            porEstado: estadoProductos.map(item => ({
                estado: item.activo ? 'Activo' : 'Inactivo',
                cantidad: parseInt(item.cantidad)
            })),
            porOferta: productosOferta.map(item => ({
                estado: item.oferta ? 'En oferta' : 'Sin oferta',
                cantidad: parseInt(item.cantidad)
            }))
        }, null];
    } catch (error) {
        console.error("Error al obtener estadísticas de productos:", error);
        return [null, "Error interno del servidor"];
    }
}