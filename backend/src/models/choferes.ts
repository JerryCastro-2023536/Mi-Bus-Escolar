import { EstadoChofer } from "../enums/estadoChofer";

export interface Choferes {
    id_chofer: number,
    id_usuario: number,
    id_proveedor: number,
    telefono_contacto: string,
    estado: EstadoChofer
}   