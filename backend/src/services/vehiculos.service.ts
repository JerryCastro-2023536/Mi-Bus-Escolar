import { pool } from "../config/conexion";
import { NotFoundError } from "../errors/notFound.error";
import { ValidationError } from "../errors/validation.error";
import { Vehiculos } from "../models/Vehiculos";
import { ActualizarVehiculoProveedorDTO, EstadoVehiculo, NuevoVehiculoProveedorDTO } from "../models/vehiculosProveedorDTO";
import { errorThrower } from "../utils/middleware/errorThrower";

export async function listarVehiculos() {
    try {
        const consulta = await pool.query("SELECT * FROM sp_vehiculos_listar()");
        return consulta.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function agregarVehiculo(veh: Vehiculos) {
    try {
        const values = [veh.id_proveedor, veh.placa, veh.foto_vehiculo, veh.estado];
        const consulta = "SELECT * FROM sp_vehiculos_agregar($1, $2, $3, $4)";
        const resultado = await pool.query(consulta, values);
        return resultado.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function buscarVehiculo(id: number) {
    try {
        const resultado = await pool.query("SELECT * FROM sp_vehiculos_buscar_por_id($1)", [id]);
        if (!resultado.rows[0]) {
            throw new NotFoundError(`El vehiculo con el id ${id} no se encontro`);
        }
        return resultado.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function actualizarVehiculo(id: number, veh: Vehiculos) {
    try {
        const values = [veh.id_proveedor, veh.placa, veh.foto_vehiculo, veh.estado, id];
        const consulta = "SELECT * FROM sp_vehiculos_actualizar($1, $2, $3, $4, $5)";
        const resultado = await pool.query(consulta, values);

        if (!resultado.rows[0]) {
            throw new NotFoundError("No se pudo editar el vehiculo porque el id no existe");
        }

        return resultado.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function eliminarVehiculo(id: number) {
    try{
        const consulta = await pool.query("SELECT sp_vehiculos_eliminar($1) AS eliminadas", [id]);
        if (consulta.rows[0].eliminadas === 0) {
            throw new NotFoundError("No se pudo eliminar el vehiculo porque el id no existe");
        }
        return true;
    }catch (error) {
        errorThrower(error);
    }
}

const PLACA_MAX_LARGO = 20;
const ESTADOS_VEHICULO_VALIDOS: EstadoVehiculo[] = ['ACTIVO', 'INACTIVO'];
/**
 * El id_proveedor NUNCA viene del cliente: se obtiene a partir del usuario
 * logueado, igual que en servicios.service.ts.
 */
async function obtenerIdProveedorVehiculos(id_usuario: number): Promise<number> {
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

function validarIdVehiculo(id_vehiculo: number) {
    if (!Number.isInteger(id_vehiculo) || id_vehiculo <= 0) {
        throw new ValidationError('Vehículo inválido', [{
            campo: 'id_vehiculo',
            mensaje: 'No se pudo identificar el vehículo.'
        }]);
    }
}

async function validarDatosVehiculo(
    payload: Partial<ActualizarVehiculoProveedorDTO>,
    tituloError: string,
    id_vehiculo_excluir: number | null,
    requiereEstado = false
) {
    const errores: { campo: string; mensaje: string }[] = [];

    const placa = (payload.placa ?? '').toString().trim().toUpperCase();
    if (!placa) {
        errores.push({ campo: 'placa', mensaje: 'La placa es obligatoria.' });
    } else if (placa.length > PLACA_MAX_LARGO) {
        errores.push({ campo: 'placa', mensaje: `La placa no puede superar los ${PLACA_MAX_LARGO} caracteres.` });
    }

    const foto_vehiculo = payload.foto_vehiculo?.toString().trim() || null;

    const estado = String(payload.estado ?? '').toUpperCase() as EstadoVehiculo;
    if (requiereEstado && !ESTADOS_VEHICULO_VALIDOS.includes(estado)) {
        errores.push({ campo: 'estado', mensaje: 'El estado debe ser ACTIVO o INACTIVO.' });
    }

    if (errores.length === 0 && placa) {
        const existe = await pool.query(
            'SELECT sp_vehiculo_placa_existe($1, $2) AS existe',
            [placa, id_vehiculo_excluir]
        );
        if (existe.rows[0]?.existe) {
            errores.push({ campo: 'placa', mensaje: 'Ya existe un vehículo registrado con esa placa.' });
        }
    }

    if (errores.length > 0) {
        throw new ValidationError(tituloError, errores);
    }

    return { placa, foto_vehiculo, estado };
}

export async function listarVehiculosDelProveedor(id_usuario: number) {
    try {
        const res = await pool.query('SELECT * FROM sp_proveedor_vehiculos_listar($1)', [id_usuario]);
        return res.rows;
    } catch (error) {
        errorThrower(error);
    }
}

export async function registrarVehiculoProveedor(id_usuario: number, payload: NuevoVehiculoProveedorDTO) {
    try {
        const id_proveedor = await obtenerIdProveedorVehiculos(id_usuario);
        const datos = await validarDatosVehiculo(payload, 'Error al registrar el vehículo', null);

        const res = await pool.query(
            'SELECT * FROM sp_proveedor_vehiculo_registrar($1, $2, $3)',
            [id_proveedor, datos.placa, datos.foto_vehiculo]
        );

        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function actualizarVehiculoProveedor(
    id_usuario: number,
    id_vehiculo: number,
    payload: ActualizarVehiculoProveedorDTO
) {
    try {
        const id_proveedor = await obtenerIdProveedorVehiculos(id_usuario);
        validarIdVehiculo(id_vehiculo);
        const datos = await validarDatosVehiculo(payload, 'Error al actualizar el vehículo', id_vehiculo, true);

        const res = await pool.query(
            'SELECT * FROM sp_proveedor_vehiculo_actualizar($1, $2, $3, $4, $5)',
            [id_vehiculo, id_proveedor, datos.placa, datos.foto_vehiculo, datos.estado]
        );

        if (!res.rows[0]) {
            throw new NotFoundError('El vehículo no existe o no pertenece a este proveedor.');
        }

        return res.rows[0];
    } catch (error) {
        errorThrower(error);
    }
}

export async function eliminarVehiculoProveedor(id_usuario: number, id_vehiculo: number) {
    try {
        const id_proveedor = await obtenerIdProveedorVehiculos(id_usuario);
        validarIdVehiculo(id_vehiculo);

        const res = await pool.query(
            'SELECT sp_proveedor_vehiculo_eliminar($1, $2) AS filas_afectadas',
            [id_vehiculo, id_proveedor]
        );

        if (res.rows[0].filas_afectadas === 0) {
            throw new NotFoundError('El vehículo no existe o no pertenece a este proveedor.');
        }

        return true;
    } catch (error) {
        errorThrower(error);
    }
}
