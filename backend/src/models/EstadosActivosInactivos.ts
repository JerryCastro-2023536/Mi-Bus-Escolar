export const Estados = {
    ACTIVO: "ACTIVO",
    INACTIVO: "INACTIVO"
} as const;

export type Estados = typeof Estados[keyof typeof Estados];
