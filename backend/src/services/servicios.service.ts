import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { ValidationError } from "../errors/validation.error";
import { Servicios } from "../models/Servicios";
import { ActualizarServicioProveedorDTO, EstadoServicio, NuevoServicioProveedorDTO } from "../models/serviciosBusDTO";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarServicios(){
    try{
        const consulta = await pool.query("select * from sp_servicios_listar()");
        return consulta.rows;
    }catch(error){
        errorThrower(error)
    }
}

export async function agregarServicio(serv: Servicios){
    try{
        const fecha = serv.fecha_creacion ?? new Date();
        const values = [serv.id_proveedor, serv.nombre, serv.descripcion, serv.precio_mensual, serv.estado, fecha]
        const consulta = "select * from sp_servicios_agregar($1, $2, $3, $4, $5, $6)"
        const resultado = await pool.query(consulta, values)
        return resultado.rows[0];
    }catch(error){
        errorThrower(error)
    }
}

export async function buscarServicio(id: number){
    try{
        const resultado = await pool.query("select * from sp_servicios_buscar_por_id($1)", [id])
        if(!resultado.rows[0]){
            throw new NotFoundError(`el servicio con el id ${id} no se encontro`)
        }
        return resultado.rows[0]
    }catch(error){
        errorThrower(error)
    }
}

export async function actualizarServicio(id: number, serv: Servicios){
    try{
        const fecha = serv.fecha_creacion ?? new Date();
        const values = [serv.id_proveedor, serv.nombre, serv.descripcion, serv.precio_mensual, serv.estado, fecha, id]
        const consulta = "select * from sp_servicios_actualizar($1, $2, $3, $4, $5, $6, $7)"
        const resultado = await pool.query(consulta, values)

        if(!resultado.rows[0]){
            throw new NotFoundError("no se pudo editar el servicio porque el id no existe")
        }

        return resultado.rows[0];
    }catch(error){
        errorThrower(error)
    }
}

export async function eliminarServicio(id: number){
    try{
        const consulta = await pool.query("select sp_servicios_eliminar($1) as filas_afectadas", [id]);
        if(consulta.rows[0].filas_afectadas === 0){
            throw new NotFoundError("no se pudo eliminar el servicio porque el id no existe")
        }
        return true
    }catch(error){
        errorThrower(error)
    }
}

const PRECIO_MAXIMO = 99999999.99; // DECIMAL(10,2)
const ESTADOS_VALIDOS: EstadoServicio[] = ['ACTIVO', 'INACTIVO'];

/**
 * El id_proveedor NUNCA viene del cliente: se obtiene a partir del usuario logueado.
 * Si el usuario no está registrado como proveedor, se rechaza la operación.
 */
async function obtenerIdProveedor(id_usuario: number): Promise<number> {
    if (!Number.isInteger(id_usuario) || id_usuario <= 0) {
        throw new ValidationError('Usuario inválido', [{
            campo: 'id_usuario',
            mensaje: 'No se pudo identificar al usuario.'
        }]);
    }

    const res = await pool.query('SELECT sp_proveedor_id_por_usuario($1) AS id_proveedor', [id_usuario]);
    const id_proveedor = res.rows[0]?.id_proveedor;

    if (!id_proveedor) {
        throw new NotFoundError('No se encontró un proveedor asociado a este usuario.');
    }

    return id_proveedor;
}

function validarIdServicio(id_servicio: number) {
    if (!Number.isInteger(id_servicio) || id_servicio <= 0) {
        throw new ValidationError('Servicio inválido', [{
            campo: 'id_servicio',
            mensaje: 'No se pudo identificar el servicio.'
        }]);
    }
}

function validarDatosServicio(
    payload: Partial<ActualizarServicioProveedorDTO>,
    tituloError: string,
    requiereEstado = false
) {
    const errores: { campo: string; mensaje: string }[] = [];

    const nombre = (payload.nombre ?? '').toString().trim();
    if (!nombre) {
        errores.push({ campo: 'nombre', mensaje: 'El nombre del servicio es obligatorio.' });
    } else if (nombre.length > 150) {
        errores.push({ campo: 'nombre', mensaje: 'El nombre no puede superar los 150 caracteres.' });
    }

    const descripcion = (payload.descripcion ?? '').toString().trim() || null;

    const precioNumerico = Number(payload.precio_mensual);
    if (!Number.isFinite(precioNumerico) || precioNumerico <= 0) {
        errores.push({ campo: 'precio_mensual', mensaje: 'El precio mensual debe ser mayor a 0.' });
    } else if (precioNumerico > PRECIO_MAXIMO) {
        errores.push({ campo: 'precio_mensual', mensaje: 'El precio mensual es demasiado alto.' });
    }

    const estado = String(payload.estado ?? '').toUpperCase() as EstadoServicio;
    if (requiereEstado && !ESTADOS_VALIDOS.includes(estado)) {
        errores.push({ campo: 'estado', mensaje: 'El estado debe ser ACTIVO o INACTIVO.' });
    }

    if (errores.length > 0) {
        throw new ValidationError(tituloError, errores);
    }

    return {
        nombre,
        descripcion,
        precio_mensual: Math.round(precioNumerico * 100) / 100,
        estado
    };
}

export async function listarServiciosDelProveedor(id_usuario: number) {
    try {
        const id_proveedor = await obtenerIdProveedor(id_usuario);

        const res = await pool.query('SELECT * FROM sp_servicios_por_proveedor($1)', [id_proveedor]);
        return res.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function registrarServicioProveedor(id_usuario: number, payload: NuevoServicioProveedorDTO) {
    try {
        const id_proveedor = await obtenerIdProveedor(id_usuario);
        const datos = validarDatosServicio(payload, 'Error al registrar el servicio');

        const existe = await pool.query(
            'SELECT sp_servicios_nombre_existe($1, $2) AS existe',
            [id_proveedor, datos.nombre]
        );

        if (existe.rows[0]?.existe) {
            throw new ValidationError('Error al registrar el servicio', [{
                campo: 'nombre',
                mensaje: 'Ya tienes un servicio con ese nombre.'
            }]);
        }

        const res = await pool.query(
            'SELECT * FROM sp_servicios_registrar($1, $2, $3, $4)',
            [id_proveedor, datos.nombre, datos.descripcion, datos.precio_mensual]
        );

        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function actualizarServicioProveedor(
    id_usuario: number,
    id_servicio: number,
    payload: ActualizarServicioProveedorDTO
) {
    try {
        const id_proveedor = await obtenerIdProveedor(id_usuario);
        validarIdServicio(id_servicio);
        const datos = validarDatosServicio(payload, 'Error al actualizar el servicio', true);

        const existe = await pool.query(
            'SELECT sp_servicios_nombre_existe_otro($1, $2, $3) AS existe',
            [id_proveedor, datos.nombre, id_servicio]
        );

        if (existe.rows[0]?.existe) {
            throw new ValidationError('Error al actualizar el servicio', [{
                campo: 'nombre',
                mensaje: 'Ya tienes otro servicio con ese nombre.'
            }]);
        }

        const res = await pool.query(
            'SELECT * FROM sp_servicios_actualizar($1, $2, $3, $4, $5, $6)',
            [id_servicio, id_proveedor, datos.nombre, datos.descripcion, datos.precio_mensual, datos.estado]
        );

        if (!res.rows[0]) {
            throw new NotFoundError('El servicio no existe o no pertenece a este proveedor.');
        }

        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function eliminarServicioProveedor(id_usuario: number, id_servicio: number) {
    try {
        const id_proveedor = await obtenerIdProveedor(id_usuario);
        validarIdServicio(id_servicio);

        const dependencias = await pool.query(
            'SELECT * FROM sp_servicios_dependencias($1, $2)',
            [id_proveedor, id_servicio]
        );

        const dep = dependencias.rows[0];
        if (!dep) {
            throw new NotFoundError('El servicio no existe o no pertenece a este proveedor.');
        }

        if (dep.total_rutas > 0 || dep.total_pagos > 0) {
            throw new ValidationError('Error al eliminar el servicio', [{
                campo: 'servicio',
                mensaje: 'No se puede eliminar: el servicio tiene rutas o pagos registrados. Desactívalo en su lugar.'
            }]);
        }
        
        const res = await pool.query(
            'SELECT sp_servicios_eliminar($1, $2) AS filas_afectadas',
            [id_servicio, id_proveedor]
        );

        if (res.rows[0].filas_afectadas === 0) {
            throw new ValidationError('Error al eliminar el servicio', [{
                campo: 'servicio',
                mensaje: 'No se pudo eliminar: el servicio cambió mientras se procesaba. Recarga e intenta de nuevo.'
            }]);
        }

        return true;
    } catch (error) {
        errorThrower(error);
    }
}