import { Request, Response } from 'express';
import { ViajesService } from '../services/trazadorutas.service';

export const getChoferPorUsuario = async (req: Request, res: Response) => {
  try {
    const { idUsuario } = req.params;

    const chofer = await ViajesService.obtenerChoferPorUsuario(
      Number(idUsuario)
    );

    if (!chofer) {
      return res.status(404).json({
        error: 'No se encontró un perfil de chofer para este usuario'
      });
    }

    return res.json(chofer);

  } catch (error) {
    console.error('Error al obtener el chofer:', error);

    return res.status(500).json({
      error: 'Error al obtener el chofer'
    });
  }
};


export const getViajeHoy = async (req: Request, res: Response) => {
  try {
    const { idChofer } = req.params;

    const viaje = await ViajesService.obtenerViajeDelDia(
      Number(idChofer)
    );

    if (!viaje) {
      return res.status(404).json({
        message: 'No hay rutas programadas para hoy'
      });
    }

    return res.json(viaje);

  } catch (error) {
    console.error('Error al obtener el viaje del día:', error);

    return res.status(500).json({
      error: 'Error al obtener el viaje'
    });
  }
};


export const getTrazado = async (req: Request, res: Response) => {
  try {
    const { idRuta } = req.params;

    const trazado = await ViajesService.obtenerTrazadoRuta(
      Number(idRuta)
    );

    return res.json(trazado);

  } catch (error) {
    console.error('Error al obtener el trazado:', error);

    return res.status(500).json({
      error: 'Error al obtener el trazado'
    });
  }
};


export const getTrazadoAsistencia = async (
  req: Request,
  res: Response
) => {
  try {
    const { idRuta, idViaje } = req.params;

    const tipo =
      (req.query.tipo as 'IDA' | 'VUELTA') || 'IDA';

    const trazado =
      await ViajesService.obtenerTrazadoRutaPorAsistencia(
        Number(idRuta),
        Number(idViaje),
        tipo
      );

    return res.json(trazado);

  } catch (error) {
    console.error(
      'Error al obtener el trazado por asistencia:',
      error
    );

    return res.status(500).json({
      error: 'Error al obtener el trazado por asistencia'
    });
  }
};


export const patchIniciarRuta = async (
  req: Request,
  res: Response
) => {
  try {
    /*
     * iniciarViaje() espera idChofer.
     * Aceptamos el parámetro de ruta o body.
     */
    const idChofer =
      req.params.idChofer ||
      req.body?.idChofer;

    if (!idChofer) {
      return res.status(400).json({
        error: 'Se requiere idChofer'
      });
    }

    const idChoferNum = Number(idChofer);

    if (
      !Number.isInteger(idChoferNum) ||
      idChoferNum <= 0
    ) {
      return res.status(400).json({
        error: 'ID de chofer inválido'
      });
    }

    const viajeActualizado =
      await ViajesService.iniciarViaje(
        idChoferNum
      );

    return res.json(viajeActualizado);

  } catch (error: any) {
    console.error(
      'Error al iniciar la ruta:',
      error
    );

    return res.status(500).json({
      error:
        error?.message ||
        'Error al iniciar la ruta'
    });
  }
};


export const patchFinalizarRuta = async (
  req: Request,
  res: Response
) => {
  try {
    const idViaje =
      req.params.idViaje ||
      req.body?.id_viaje ||
      req.body?.idViaje;

    if (!idViaje) {
      return res.status(400).json({
        error: 'Se requiere idViaje'
      });
    }

    const idViajeNum = Number(idViaje);

    if (
      !Number.isInteger(idViajeNum) ||
      idViajeNum <= 0
    ) {
      return res.status(400).json({
        error: 'ID de viaje inválido'
      });
    }

    const viajeFinalizado =
      await ViajesService.finalizarViaje(
        idViajeNum
      );

    return res.json(viajeFinalizado);

  } catch (error: any) {
    console.error(
      'Error al finalizar la ruta:',
      error
    );

    return res.status(500).json({
      error: 'Error al finalizar la ruta'
    });
  }
};


export const postUbicacionGPS = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      id_viaje,
      latitud,
      longitud
    } = req.body;

    if (
      !id_viaje ||
      latitud === undefined ||
      longitud === undefined
    ) {
      return res.status(400).json({
        error:
          'Parámetros incompletos para ubicación GPS'
      });
    }

    await ViajesService.registrarUbicacion(
      Number(id_viaje),
      Number(latitud),
      Number(longitud)
    );

    return res.json({
      success: true,
      message: 'Ubicación guardada'
    });

  } catch (error: any) {
    console.error(
      'Error registrando GPS:',
      error
    );

    return res.status(500).json({
      error:
        error?.message ||
        'Error registrando ubicación GPS'
    });
  }
};


export const getUltimaUbicacionViaje = async (
  req: Request,
  res: Response
) => {
  try {
    const { idViaje } = req.params;

    const idViajeNum = Number(idViaje);

    if (
      !Number.isInteger(idViajeNum) ||
      idViajeNum <= 0
    ) {
      return res.status(400).json({
        error: 'ID de viaje inválido'
      });
    }

    /*
     * obtenerUltimaUbicacion debe devolver también id_ruta.
     */
    const data =
      await ViajesService.obtenerUltimaUbicacion(
        idViajeNum
      );

    const idRuta =
      data?.id_ruta !== undefined &&
      data?.id_ruta !== null
        ? Number(data.id_ruta)
        : undefined;

    /*
     * No usamos obtenerTrazadoActivo() porque solamente
     * consulta el Map en memoria.
     *
     * obtenerTrazadoActivoAsync() busca:
     * 1. caché
     * 2. Ubicaciones_Bus
     * 3. Ruta_Parada
     */
    const trazadoActivo =
      await ViajesService.obtenerTrazadoActivoAsync(
        idViajeNum,
        idRuta
      );

    return res.json({
      success: true,
      data: {
        ...(data ?? {}),
        trazado_activo: trazadoActivo
      }
    });

  } catch (error: any) {
    console.error(
      'Error al obtener última ubicación:',
      error
    );

    return res.status(500).json({
      error:
        'Error al obtener última ubicación del viaje'
    });
  }
};


export const postTrazadoActivo = async (
  req: Request,
  res: Response
) => {
  try {
    const { idViaje } = req.params;
    const { puntos } = req.body;

    if (
      !idViaje ||
      !Array.isArray(puntos)
    ) {
      return res.status(400).json({
        error: 'Parámetros inválidos'
      });
    }

    ViajesService.guardarTrazadoActivo(
      Number(idViaje),
      puntos
    );

    return res.json({
      success: true,
      message: 'Trazado activo actualizado'
    });

  } catch (error: any) {
    console.error(
      'Error guardando trazado activo:',
      error
    );

    return res.status(500).json({
      error: 'Error al guardar trazado activo'
    });
  }
};


export const getTrazadoActivo = async (
  req: Request,
  res: Response
) => {
  try {
    const { idViaje } = req.params;

    const idViajeNum = Number(idViaje);

    if (
      !Number.isInteger(idViajeNum) ||
      idViajeNum <= 0
    ) {
      return res.status(400).json({
        error: 'ID de viaje inválido'
      });
    }

    /*
     * Primero obtenemos el idRuta automáticamente
     * a partir del viaje.
     */
    const ubicacion =
      await ViajesService.obtenerUltimaUbicacion(
        idViajeNum
      );

    let idRuta =
      ubicacion?.id_ruta !== undefined &&
      ubicacion?.id_ruta !== null
        ? Number(ubicacion.id_ruta)
        : undefined;

    /*
     * Si el frontend manda ?idRuta=X,
     * se puede usar como override.
     */
    if (req.query.idRuta) {
      const queryRuta = Number(req.query.idRuta);

      if (
        Number.isInteger(queryRuta) &&
        queryRuta > 0
      ) {
        idRuta = queryRuta;
      }
    }

    const trazado =
      await ViajesService.obtenerTrazadoActivoAsync(
        idViajeNum,
        idRuta
      );

    return res.json({
      success: true,
      data: {
        trazado_activo: trazado
      }
    });

  } catch (error: any) {
    console.error(
      'Error obteniendo trazado activo:',
      error
    );

    return res.status(500).json({
      error: 'Error al obtener trazado activo'
    });
  }
};


export const getEstudiantesConAsistencia = async (
  req: Request,
  res: Response
) => {
  try {
    const { idChofer } = req.params;

    const idViaje =
      req.query.idViaje
        ? Number(req.query.idViaje)
        : undefined;

    const estudiantes =
      await ViajesService.obtenerEstudiantesConAsistencia(
        Number(idChofer),
        idViaje
      );

    return res.json({
      success: true,
      data: estudiantes
    });

  } catch (error: any) {
    console.error(
      'Error al obtener estudiantes:',
      error
    );

    return res.status(500).json({
      error:
        'Error al obtener estudiantes con asistencia'
    });
  }
};


export const patchAbordajeEstudiante = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      idViaje,
      idEstudiante
    } = req.params;

    const resultado =
      await ViajesService.marcarAbordaje(
        Number(idViaje),
        Number(idEstudiante)
      );

    return res.json({
      success: true,
      data: resultado
    });

  } catch (error: any) {
    console.error(
      'Error al marcar abordaje:',
      error
    );

    return res.status(500).json({
      error: 'Error al marcar abordaje'
    });
  }
};


export const patchDescensoEstudiante = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      idViaje,
      idEstudiante
    } = req.params;

    const resultado =
      await ViajesService.marcarDescenso(
        Number(idViaje),
        Number(idEstudiante)
      );

    return res.json({
      success: true,
      data: resultado
    });

  } catch (error: any) {
    console.error(
      'Error al marcar descenso:',
      error
    );

    return res.status(500).json({
      error: 'Error al marcar descenso'
    });
  }
};


export const patchAusenteEstudiante = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      idViaje,
      idEstudiante
    } = req.params;

    const resultado =
      await ViajesService.marcarAusente(
        Number(idViaje),
        Number(idEstudiante)
      );

    return res.json({
      success: true,
      data: resultado
    });

  } catch (error: any) {
    console.error(
      'Error al marcar ausente:',
      error
    );

    return res.status(500).json({
      error: 'Error al marcar ausente'
    });
  }
};
