export interface Aula {
    nombre: string;
    ubicacion: string;
    temperatura: number;
    humedad: number;
    co2_ppm: number;
    aforo: number;
    conteo_personas?: number;
    createdAt?: string;
}