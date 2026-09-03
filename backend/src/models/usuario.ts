import { userRol } from "../enums/userRol";

export interface Usuario{
    id_usuario?: number;
    nombre: string;
    apellido: string;
    correo: string;
    password: string;
    telefono: string;
    foto_usuario: string | null;
    rol: userRol;
    correo_verificado: boolean;
    fecha_creacion?: Date;
    fecha_actualizacion?: Date;
}

export interface UsuarioLoginDTO{
    correo: string;
    password: string;
}

