export interface Aula {
    nombre: string;
    ubicacion: string;
    temperatura: number;
    humedad: number;
    co2_ppm: number;
    no2_ppm: number;
    nh3_ppm: number;
    aforo: number;
    conteo_personas?: number;
    estado: string;
    createdAt?: string;
}