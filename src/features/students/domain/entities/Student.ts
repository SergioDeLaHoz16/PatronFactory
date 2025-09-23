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
  promedio?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Clase para crear instancias de Student con validaciones
 * Principio SOLID aplicado: Single Responsibility Principle (SRP)
 */
export class StudentEntity implements Student {
  id: string;
  nombre: string;
  parcial1: number;
  parcial2: number;
  promedio: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Omit<Student, 'promedio' | 'createdAt' | 'updatedAt'>) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.parcial1 = data.parcial1;
    this.parcial2 = data.parcial2;
    this.promedio = this.calculateAverage();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  private calculateAverage(): number {
    return (this.parcial1 + this.parcial2) / 2;
  }

  updateGrades(parcial1: number, parcial2: number): void {
    this.parcial1 = parcial1;
    this.parcial2 = parcial2;
    this.promedio = this.calculateAverage();
    this.updatedAt = new Date();
  }
}