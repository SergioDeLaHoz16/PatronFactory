// import { createClient } from '@supabase/supabase-js';
// import { IStudentCRUD } from '../../domain/interfaces/IStudentCRUD';
// import { Student } from '../../domain/interfaces/IStudent';
// import { StudentValidator } from '../../../../shared/utils/validations/validation';
import { SupabaseClient } from '@supabase/supabase-js';
import { IStudentCRUD } from '../../domain/interfaces/IStudentCRUD';
import { Student } from '../../domain/interfaces/IStudent';
import { StudentValidator } from '../../../../shared/utils/validations/validation';
/**
 * DatabaseStudentCRUD - Implementación concreta para manejo de datos desde Supabase
 * 
 * Principios SOLID aplicados:
 * - Single Responsibility Principle (SRP): Solo maneja datos desde base de datos
 * - Open/Closed Principle (OCP): Implementa la interfaz sin modificar código existente
 * - Liskov Substitution Principle (LSP): Puede sustituir cualquier IStudentCRUD
 * - Dependency Inversion Principle (DIP): Implementa la abstracción IStudentCRUD
 */
export class DatabaseStudentCRUD implements IStudentCRUD {
  constructor(
    private supabase: SupabaseClient,
    private validator: typeof StudentValidator
  ) { }

  async create(studentData: Omit<Student, 'id'>): Promise<Student> {
    const validation = StudentValidator.validateStudent(studentData);
    if (!validation.isValid) {
      throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
    }
    const promedio = (studentData.parcial1 * 0.3) +
      (studentData.parcial2 * 0.3) +
      (studentData.parcial3 * 0.4);

    const { data, error } = await this.supabase
      .from('estudiante')
      .insert([
        {
          nombre: studentData.nombre,
          parcial1: studentData.parcial1,
          parcial2: studentData.parcial2,
          parcial3: studentData.parcial3,
          promedio: promedio
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('🗄️ Error creando estudiante en BD:', error);
      throw new Error(`Error en base de datos: ${error.message}`);
    }

    console.log('🗄️ Estudiante creado en BD:', data);
    return data as Student;
  }

  async read(id: string): Promise<Student | null> {
    const { data } = await this.supabase
      .from('estudiante')
      .select('*')
      .eq('id', id)
      .single();

    return data as Student;
  }

  async readAll(): Promise<Student[]> {
    const { data } = await this.supabase
      .from('estudiante')
      .select('*')
      .order('created_at', { ascending: false });
    return data as Student[] || [];
  }

  async update(id: string, studentData: Partial<Student>): Promise<Student | null> {
    // ✅ Solo acceso a datos - SRP compliant
    const { data, error } = await this.supabase
      .from('estudiante')
      .update(studentData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error en base de datos: ${error.message}`);
    }

    return data as Student;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('estudiante')
      .delete()
      .eq('id', id);

    if (error) return false;
    return true;
  }
}
