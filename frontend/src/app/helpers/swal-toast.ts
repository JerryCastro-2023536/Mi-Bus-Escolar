import Swal from "sweetalert2";
import { ApiResponse } from "../models/apiResponseDTO.interface";

const TOAST_BASE = {
    toast: true,               
    position: 'top-end' as const,
    showConfirmButton: false,   
    timer: 3500,                 
    timerProgressBar: true,      
    didOpen: (toast: HTMLElement) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
};

export function toastFromApi<T>(response: ApiResponse<T> | undefined | null): void {
    const ok = !!response?.success;
    const message =
        response?.message ||
        (ok ? 'Operación exitosa' : 'Ocurrió un error, intenta de nuevo');
    fireToast(ok, message);
}

export function toastSuccess(message = 'Operación exitosa'): void {
    fireToast(true, message);
}

export function toastError(message = 'Ocurrió un error, intenta de nuevo'): void {
    fireToast(false, message);
}

function fireToast(ok: boolean, message: string): void {
    Swal.fire({
        ...TOAST_BASE,
        icon: ok ? 'success' : 'error',
        title: message,
    });
}

export function extractMessage(err: unknown, fallback = 'Ocurrió un error'): string {
    const body = (err as { error?: unknown })?.error;
    if (typeof body === 'string' && body.trim()) return body;
    if (body && typeof (body as { message?: unknown }).message === 'string') {
        const msg = (body as { message: string }).message;
        if (msg.trim()) return msg;
    }
    return fallback;
}