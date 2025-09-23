import { createClient } from '@supabase/supabase-js';
import { IStudentCRUD } from '../../domain/interfaces/IStudentCRUD';
import { Student } from '../../domain/entities/Student';
import { StudentValidator } from '../../../../shared/utils/validations/validation';

/**
 * DatabaseStudentCRUD - Implementación concreta para manejo de datos desde Supabase
 * 
 * 🔐 BUENAS PRÁCTICAS DE SEGURIDAD:
 * - Usa variables de entorno para credenciales sensibles
 * - Las variables de Vite deben empezar con VITE_ para ser accesibles en el frontend
 * - Nunca hardcodear credenciales en el código fuente
 * 
 * Principios SOLID aplicados:
 * - Single Responsibility Principle (SRP): Solo maneja datos desde base de datos
 * - Open/Closed Principle (OCP): Implementa la interfaz sin modificar código existente
 * - Liskov Substitution Principle (LSP): Puede sustituir cualquier IStudentCRUD
 * - Dependency Inversion Principle (DIP): Implementa la abstracción IStudentCRUD
 */
export class DatabaseStudentCRUD implements IStudentCRUD {
  private supabase;

  constructor() {
    // 🔐 Obtener credenciales desde variables de entorno
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    // Validar que las variables de entorno estén configuradas
    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        '🚨 Error de configuración: Las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY deben estar definidas en el archivo .env'
      );
    }
    
    // Validar formato básico de URL
    if (!supabaseUrl.includes('supabase.co')) {
      throw new Error('🚨 Error: VITE_SUPABASE_URL debe ser una URL válida de Supabase');
    }
    
    this.supabase = createClient(
      supabaseUrl,
      supabaseKey
    );
    
    console.log('🗄️ DatabaseStudentCRUD initialized - Conectado a Supabase:', supabaseUrl);
  }

  async create(studentData: Omit<Student, 'id'>): Promise<Student> {
    const validation = StudentValidator.validateStudent(studentData);
    if (!validation.isValid) {
      throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
    }

    const promedio = (studentData.parcial1 + studentData.parcial2) / 2;
    
    const { data, error } = await this.supabase
      .from('estudiante')
      .insert([
        {
          nombre: studentData.nombre,
          parcial1: studentData.parcial1,
          parcial2: studentData.parcial2,
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
    const { data, error } = await this.supabase
      .from('estudiante')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.log('🗄️ Estudiante no encontrado en BD:', id);
      return null;
    }

    console.log('🗄️ Estudiante leído desde BD:', data?.nombre);
    return data as Student;
  }

  async readAll(): Promise<Student[]> {
    const { data, error } = await this.supabase
      .from('estudiante')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('🗄️ Error leyendo estudiantes de BD:', error);
      throw new Error(`Error en base de datos: ${error.message}`);
    }

    console.log('🗄️ Estudiantes leídos desde BD:', data?.length || 0);
    return data as Student[] || [];
  }

  async update(id: string, studentData: Partial<Student>): Promise<Student | null> {
    if (studentData.parcial1 !== undefined || studentData.parcial2 !== undefined) {
      // Primero obtenemos el estudiante actual para validar
      const current = await this.read(id);
      if (!current) return null;

      const validation = StudentValidator.validateStudent({
        nombre: studentData.nombre || current.nombre,
        parcial1: studentData.parcial1 ?? current.parcial1,
        parcial2: studentData.parcial2 ?? current.parcial2
      });
      
      if (!validation.isValid) {
        throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
      }

      // Recalcular promedio si se actualizan los parciales
      if (studentData.parcial1 !== undefined || studentData.parcial2 !== undefined) {
        studentData.promedio = ((studentData.parcial1 ?? current.parcial1) + 
                               (studentData.parcial2 ?? current.parcial2)) / 2;
      }
    }

    const { data, error } = await this.supabase
      .from('estudiante')
      .update(studentData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('🗄️ Error actualizando estudiante en BD:', error);
      throw new Error(`Error en base de datos: ${error.message}`);
    }

    console.log('🗄️ Estudiante actualizado en BD:', data);
    return data as Student;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('estudiante')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('🗄️ Error eliminando estudiante de BD:', error);
      return false;
    }

    console.log('🗄️ Estudiante eliminado de BD, ID:', id);
    return true;
  }

//   async importStudentsFromJSON(jsonInput: string | File): Promise<void> {
//   // 1) Leer contenido
//   const content = typeof jsonInput === "string" ? jsonInput : await jsonInput.text();

//   // 2) Parsear
//   let parsed: any;
//   try {
//     parsed = JSON.parse(content);
//   } catch (err) {
//     throw new Error("JSON inválido: " + (err instanceof Error ? err.message : String(err)));
//   }

//   // 3) Validar
//   const validation = StudentJSONValidator.validate(parsed);
//   if (!validation.isValid) {
//     throw new Error("Errores de validación: " + validation.errors.join(" | "));
//   }

//   // 4) Convertir usando Factory / Entidades
//   const students = parsed.map(
//     (raw: any) =>
//       new StudentEntity({
//         // 🚨 Omitimos el id para que Supabase genere UUID
//         id: undefined,
//         nombre: String(raw.nombre),
//         parcial1: Number(raw.parcial1),
//         parcial2: Number(raw.parcial2),
//       })
//   );

//   // 5) Guardar en Supabase con UPSERT (basado en nombre para evitar duplicados)
//   const { error } = await this.supabase
//     .from("estudiante")
//     .upsert(
//       students.map((s: StudentEntity) => ({
//         // ❌ No incluimos id
//         nombre: s.nombre,
//         parcial1: s.parcial1,
//         parcial2: s.parcial2,
//         promedio: (s.parcial1 + s.parcial2) / 2,
//       })),
//       { onConflict: "nombre" } // 👈 Usa "nombre" como clave única
//     );

//   if (error) {
//     throw new Error(`Error guardando estudiantes en Supabase: ${error.message}`);
//   }

//   console.log(`🗄️ ${students.length} estudiantes insertados/actualizados desde JSON.`);
// }


}