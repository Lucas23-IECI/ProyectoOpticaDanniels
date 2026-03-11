"use strict";
import {
    getEstadisticasGeneralesService,
    getEstadisticasOrdenesService,
    getEstadisticasProductosService,
    getEstadisticasUsuariosService,
} from "../services/reporte.service.js";
import {
    generarReporteCSV,
    generarReporteExcel,
    generarReportePDF,
} from "../services/reporteExport.service.js";
import {
    handleErrorClient,
    handleErrorServer,
} from "../handlers/responseHandlers.js";

const TIPOS_VALIDOS = ["generales", "usuarios", "productos", "ordenes"];
const FORMATOS_VALIDOS = ["pdf", "excel", "csv"];

const DATA_FETCHERS = {
    generales: getEstadisticasGeneralesService,
    usuarios: getEstadisticasUsuariosService,
    productos: getEstadisticasProductosService,
    ordenes: getEstadisticasOrdenesService,
};

const CONTENT_TYPES = {
    pdf: "application/pdf",
    excel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    csv: "text/csv; charset=utf-8",
};

const EXTENSIONS = {
    pdf: "pdf",
    excel: "xlsx",
    csv: "csv",
};

export async function exportarReporte(req, res) {
    try {
        const { tipo, formato } = req.query;

        if (!tipo || !TIPOS_VALIDOS.includes(tipo)) {
            return handleErrorClient(
                res,
                400,
                `Tipo inválido. Valores permitidos: ${TIPOS_VALIDOS.join(", ")}`,
            );
        }
        if (!formato || !FORMATOS_VALIDOS.includes(formato)) {
            return handleErrorClient(
                res,
                400,
                `Formato inválido. Valores permitidos: ${FORMATOS_VALIDOS.join(", ")}`,
            );
        }

        // 1. Fetch data
        const [datos, fetchError] = await DATA_FETCHERS[tipo]();
        if (fetchError) return handleErrorClient(res, 404, fetchError);

        // 2. Generate export
        let buffer;
        const filename = `reporte-${tipo}-${Date.now()}.${EXTENSIONS[formato]}`;

        if (formato === "pdf") {
            buffer = await generarReportePDF(tipo, datos);
        } else if (formato === "excel") {
            buffer = await generarReporteExcel(tipo, datos);
        } else {
            buffer = Buffer.from(generarReporteCSV(tipo, datos), "utf-8");
        }

        // 3. Send file
        res.setHeader("Content-Type", CONTENT_TYPES[formato]);
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Length", buffer.length);
        return res.end(buffer);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
