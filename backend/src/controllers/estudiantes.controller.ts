import { Request, Response, NextFunction } from "express";
import { actualizarEstudiante, agregarEstudiantes, buscarEstudiantePorId, eliminarEstudiante, listarEstudiantes } from "../services/estudiantes.service";
import { Estudiantes } from "../models/estudiantes";

export async function getEstudiantes(req: Request, res: Response, next: NextFunction){
    try{
        const datos = await listarEstudiantes();
        return res.status(200).json({
            success: true,
            message: "Estudiantes cargados",
            data: datos
        });
    }catch(error){
        next(error)
    }
}

export async function postEstudiantes(req: Request, res: Response, next: NextFunction) {
    const { id_usuario_tutor, id_colegio, nombre, apellido, fecha_nacimiento, foto_estudiante, grado } = req.body
    const nuevoEstudiante : Estudiantes = { id_estudiante: 0, id_usuario_tutor, id_colegio, nombre, apellido, fecha_nacimiento, foto_estudiante, grado }
    const estudianteCreado = await agregarEstudiantes(nuevoEstudiante);
    try{
        return res.status(201).json({
            success: true,
            message: "Estudiante creado",
            data: estudianteCreado
        });
    }catch(error){
        next(error);
    }
}

export async function getEstudianteById(req: Request, res: Response, next: NextFunction) {
    try{
        const id = Number(req.params.id);
        const estudianteEncontrado = await buscarEstudiantePorId(id);
        return res.status(200).json({
            success: true,
            message: `Estudiante con id: ${id} encontrado`,
            data: estudianteEncontrado
        });
    }catch(error){
        next(error);
    }
}

export async function putEstudiante(req: Request, res: Response, next: NextFunction) {
    try{
        const id = Number(req.params.id);
        const { id_usuario_tutor, id_colegio, nombre, apellido, fecha_nacimiento, foto_estudiante, grado } = req.body;
        const estudianteActualizar : Estudiantes = { id_estudiante: id, id_usuario_tutor, id_colegio, nombre, apellido, fecha_nacimiento, foto_estudiante, grado }
        const estudianteEditado = await actualizarEstudiante(estudianteActualizar, id);

        return res.status(200).json({
            success: true,
            message: "Estudiante editado",
            data: estudianteEditado
        })
    }catch(error){
        next(error);
    }
}

export async function deleteEstudiante(req: Request, res: Response, next: NextFunction){
    try{
        const id = Number(req.params.id);
        const resultado = await eliminarEstudiante(id);
         
        return res.status(200).json({
            success: true,
            message: "Estudiante eliminado",
            data: resultado
        })
    }catch(error){
        next(error);
    }
}