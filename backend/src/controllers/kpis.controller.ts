import { Request, Response, NextFunction } from "express";
import {
    obtenerKpisUsuarios,
    obtenerKpisAsignacionesRuta,
    obtenerKpisAsistencias,
    obtenerKpisChoferes,
    obtenerKpisColegios,
    obtenerKpisEstudiantes,
    obtenerKpisIncidencias,
    obtenerKpisNotificaciones,
    obtenerKpisPagos,
    obtenerKpisParadas,
    obtenerKpisProveedores,
    obtenerKpisRutaParada,
    obtenerKpisRutas,
    obtenerKpisServicios,
    obtenerKpisUbicacionesBus,
    obtenerKpisValoraciones,
    obtenerKpisVehiculos,
    obtenerKpisViajes
} from "../services/kpis.service";

function responderKpis(fn: () => Promise<any>) {
    return async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const kpis = await fn();
            return res.status(200).json({
                success: true,
                message: "KPIs cargados correctamente",
                data: kpis
            });
        } catch (error) {
            next(error);
        }
    };
}

export const getKpisUsuarios = responderKpis(obtenerKpisUsuarios);
export const getKpisAsignacionesRuta = responderKpis(obtenerKpisAsignacionesRuta);
export const getKpisAsistencias = responderKpis(obtenerKpisAsistencias);
export const getKpisChoferes = responderKpis(obtenerKpisChoferes);
export const getKpisColegios = responderKpis(obtenerKpisColegios);
export const getKpisEstudiantes = responderKpis(obtenerKpisEstudiantes);
export const getKpisIncidencias = responderKpis(obtenerKpisIncidencias);
export const getKpisNotificaciones = responderKpis(obtenerKpisNotificaciones);
export const getKpisPagos = responderKpis(obtenerKpisPagos);
export const getKpisParadas = responderKpis(obtenerKpisParadas);
export const getKpisProveedores = responderKpis(obtenerKpisProveedores);
export const getKpisRutaParada = responderKpis(obtenerKpisRutaParada);
export const getKpisRutas = responderKpis(obtenerKpisRutas);
export const getKpisServicios = responderKpis(obtenerKpisServicios);
export const getKpisUbicacionesBus = responderKpis(obtenerKpisUbicacionesBus);
export const getKpisValoraciones = responderKpis(obtenerKpisValoraciones);
export const getKpisVehiculos = responderKpis(obtenerKpisVehiculos);
export const getKpisViajes = responderKpis(obtenerKpisViajes);