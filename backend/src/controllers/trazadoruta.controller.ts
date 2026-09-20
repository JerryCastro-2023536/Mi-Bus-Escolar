import { Request, Response } from 'express';
import { ViajesService } from '../services/trazadorutas.service';

export const getChoferPorUsuario = async (req: Request, res: Response) => {
  try {
    const { idUsuario } = req.params;
    const chofer = await ViajesService.obtenerChoferPorUsuario(Number(idUsuario));
    if (!chofer) {
      return res.status(404).json({ error: 'No se encontró un perfil de chofer para este usuario' });
    }
    res.json(chofer);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el chofer' });
  }
};

export const getViajeHoy = async (req: Request, res: Response) => {
  try {
    const { idChofer } = req.params;
    const viaje = await ViajesService.obtenerViajeDelDia(Number(idChofer));
    
    if (!viaje) {
      return res.status(404).json({ message: 'No hay rutas programadas para hoy' });
    }
    res.json(viaje);
  } catch (error) {
    console.error('Error al obtener el viaje del día:', error);
    res.status(500).json({ error: 'Error al obtener el viaje' });
  }
};

export const getTrazado = async (req: Request, res: Response) => {
  try {
    const { idRuta } = req.params;
    const trazado = await ViajesService.obtenerTrazadoRuta(Number(idRuta));
    res.json(trazado);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el trazado' });
  }
};

export const getTrazadoAsistencia = async (req: Request, res: Response) => {
  try {
    const { idRuta, idViaje } = req.params;
    const tipo = (req.query.tipo as 'IDA' | 'VUELTA') || 'IDA';
    const trazado = await ViajesService.obtenerTrazadoRutaPorAsistencia(Number(idRuta), Number(idViaje), tipo);
    res.json(trazado);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el trazado por asistencia' });
  }
};

export const patchIniciarRuta = async (req: Request, res: Response) => {
  try {
    const idParam = req.params.idChofer || req.params.idViaje || req.body?.idChofer || req.body?.idViaje;
    if (!idParam) {
      return res.status(400).json({ error: 'Se requiere idChofer o idViaje' });
    }
    const viajeActualizado = await ViajesService.iniciarViaje(Number(idParam));
    res.json(viajeActualizado);
  } catch (error: any) {
    console.error('Error al iniciar la ruta:', error);
    res.status(500).json({ error: error.message || 'Error al iniciar la ruta' });
  }
};

export const patchFinalizarRuta = async (req: Request, res: Response) => {
  try {
    const idViaje = req.params.idViaje || req.body?.id_viaje || req.body?.idViaje;
    if (!idViaje) {
      return res.status(400).json({ error: 'Se requiere idViaje' });
    }
    const viajeFinalizado = await ViajesService.finalizarViaje(Number(idViaje));
    res.json(viajeFinalizado);
  } catch (error: any) {
    console.error('Error al finalizar la ruta:', error);
    res.status(500).json({ error: 'Error al finalizar la ruta' });
  }
};

export const postUbicacionGPS = async (req: Request, res: Response) => {
  try {
    const { id_viaje, latitud, longitud } = req.body;
    if (!id_viaje || latitud === undefined || longitud === undefined) {
      return res.status(400).json({ error: 'Parámetros incompletos para ubicación GPS' });
    }
    await ViajesService.registrarUbicacion(Number(id_viaje), Number(latitud), Number(longitud));
    res.json({ success: true, message: 'Ubicación guardada' });
  } catch (error: any) {
    console.error('Error registrando GPS:', error);
    res.status(500).json({ error: 'Error registrando ubicación GPS' });
  }
};

export const getEstudiantesConAsistencia = async (req: Request, res: Response) => {
  try {
    const { idChofer } = req.params;
    const idViaje = req.query.idViaje ? Number(req.query.idViaje) : undefined;
    const estudiantes = await ViajesService.obtenerEstudiantesConAsistencia(Number(idChofer), idViaje);
    res.json({ success: true, data: estudiantes });
  } catch (error: any) {
    console.error('Error al obtener estudiantes:', error);
    res.status(500).json({ error: 'Error al obtener estudiantes con asistencia' });
  }
};

export const patchAbordajeEstudiante = async (req: Request, res: Response) => {
  try {
    const { idViaje, idEstudiante } = req.params;
    const resultado = await ViajesService.marcarAbordaje(Number(idViaje), Number(idEstudiante));
    res.json({ success: true, data: resultado });
  } catch (error: any) {
    console.error('Error al marcar abordaje:', error);
    res.status(500).json({ error: 'Error al marcar abordaje' });
  }
};

export const patchDescensoEstudiante = async (req: Request, res: Response) => {
  try {
    const { idViaje, idEstudiante } = req.params;
    const resultado = await ViajesService.marcarDescenso(Number(idViaje), Number(idEstudiante));
    res.json({ success: true, data: resultado });
  } catch (error: any) {
    console.error('Error al marcar descenso:', error);
    res.status(500).json({ error: 'Error al marcar descenso' });
  }
};

export const patchAusenteEstudiante = async (req: Request, res: Response) => {
  try {
    const { idViaje, idEstudiante } = req.params;
    const resultado = await ViajesService.marcarAusente(Number(idViaje), Number(idEstudiante));
    res.json({ success: true, data: resultado });
  } catch (error: any) {
    res.status(500).json({ error: 'Error al marcar ausente' });
  }
};
