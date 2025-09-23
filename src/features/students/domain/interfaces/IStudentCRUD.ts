import { Student } from '../entities/Student';

/**
 * Interfaz IStudentCRUD - Define el contrato para las operaciones CRUD
 * Principios SOLID aplicados:
 * - Interface Segregation Principle (ISP): Interfaz específica para operaciones CRUD
 * - Dependency Inversion Principle (DIP): Las clases de alto nivel dependen de esta abstracción
 */
export interface IStudentCRUD {
  create(student: Omit<Student, 'id'>): Promise<Student>;
  read(id: string): Promise<Student | null>;
  readAll(): Promise<Student[]>;
  update(id: string, student: Partial<Student>): Promise<Student | null>;
  delete(id: string): Promise<boolean>;
}