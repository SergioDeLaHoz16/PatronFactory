import { Student } from "../interfaces/IStudent";
/**
 * Clase para crear instancias de Student con validaciones
 * Principio SOLID aplicado: Single Responsibility Principle (SRP)
 * - Esta clase tiene la única responsabilidad gestionar los datos de un estudiante
 */

export class StudentEntity implements Student {
  id: string;
  nombre: string;
  parcial1: number;
  parcial2: number;
  parcial3: number;
  promedio: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Omit<Student, 'promedio' | 'createdAt' | 'updatedAt'>) {
    this.id = data.id;  
    this.nombre = data.nombre;
    this.parcial1 = data.parcial1;
    this.parcial2 = data.parcial2;
    this.parcial3 = data.parcial3;
    this.promedio = this.calculateAverage();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
  /**
  * - Responsabilidad: Parte integral de los datos del estudiante
  * - Proposito: Calcular el promedio de las calificaciones
  * - Razón de cambio: Solo cambia si cambia la lógica de cálculo de promedio
  */
  private calculateAverage(): number {
    return (this.parcial1 + this.parcial2 + this.parcial3) / 3;
  }
  /**
  * - Responsabilidad: Mantener la consistencia de los datos del estudiante
  * - Proposito: Actualizar las calificaciones y recalcular el promedio
  * - Razón de cambio: Solo cambia si cambia la forma de actualizar calificaciones
  */
  updateGrades(parcial1: number, parcial2: number, parcial3: number): void {
    this.parcial1 = parcial1;
    this.parcial2 = parcial2;
    this.parcial3 = parcial3;
    this.promedio = this.calculateAverage();
    this.updatedAt = new Date();
  }
}