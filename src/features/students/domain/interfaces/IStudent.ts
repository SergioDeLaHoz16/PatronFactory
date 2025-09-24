/**
 * Entidad Student - Representa un estudiante del dominio
 * Principio SOLID aplicado: Single Responsibility Principle (SRP)
 * - Esta clase tiene una única responsabilidad: representar un estudiante
 */
export interface Student {
  id: string;
  nombre: string;
  parcial1: number;
  parcial2: number;
  parcial3: number;
  promedio?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

