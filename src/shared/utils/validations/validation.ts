/**
 * Utilidades de validación
 * Principio SOLID aplicado: Single Responsibility Principle (SRP)
 * - Esta clase tiene una única responsabilidad: validar datos de estudiantes
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class StudentValidator {
  static validateGrade(grade: number): boolean {
    return grade >= 0.0 && grade <= 5.0;
  }

  static validateName(name: string): boolean {
    return name.trim().length >= 2;
  }

  static validateStudent(student: { nombre: string; parcial1: number; parcial2: number }): ValidationResult {
    const errors: string[] = [];

    if (!this.validateName(student.nombre)) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    if (!this.validateGrade(student.parcial1)) {
      errors.push('El parcial 1 debe estar entre 0.0 y 5.0');
    }

    if (!this.validateGrade(student.parcial2)) {
      errors.push('El parcial 2 debe estar entre 0.0 y 5.0');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}