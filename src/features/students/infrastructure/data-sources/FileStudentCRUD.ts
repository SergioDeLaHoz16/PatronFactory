import { IStudentCRUD } from '../../domain/interfaces/IStudentCRUD';
import { Student, StudentEntity } from '../../domain/entities/Student';
import { StudentValidator } from '../../../../shared/utils/validations/validation';
import studentsData from '../../../../data/students.json';

/**
 * FileStudentCRUD - Implementación concreta para manejo de datos desde archivo JSON
 * Principios SOLID aplicados:
 * - Single Responsibility Principle (SRP): Solo maneja datos desde archivo
 * - Open/Closed Principle (OCP): Implementa la interfaz sin modificar código existente
 * - Liskov Substitution Principle (LSP): Puede sustituir cualquier IStudentCRUD
 * - Dependency Inversion Principle (DIP): Implementa la abstracción IStudentCRUD
 */
export class FileStudentCRUD implements IStudentCRUD {
  private students: Student[] = [];

  constructor() {
    // Convertir los datos del JSON a objetos Student con fechas correctas
    this.students = studentsData.map(student => ({
      ...student,
      createdAt: new Date(student.createdAt),
      updatedAt: new Date(student.updatedAt)
    }));
    console.log('📁 FileStudentCRUD initialized - Datos cargados desde archivo JSON');
  }

  /**
   * Simula la escritura al archivo JSON
   * En un entorno real, esto escribiría al sistema de archivos
   * En el navegador, mantenemos los datos en memoria
   */
  private async saveToFile(): Promise<void> {
    try {
      // En un entorno de navegador, no podemos escribir archivos directamente
      // Pero podemos simular la operación y mostrar los datos actualizados
      const jsonData = JSON.stringify(this.students, null, 2);
      console.log('📁 Datos actualizados (simulando escritura a archivo):', jsonData);

      // En un entorno Node.js real, usarías:
      // await fs.writeFile('src/data/students.json', jsonData, 'utf8');

      // Para demostración, creamos un blob descargable
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      // Opcional: crear enlace de descarga automática
      const link = document.createElement('a');
      link.href = url;
      link.download = 'students-updated.json';

      console.log('📁 Archivo JSON actualizado disponible para descarga');

    } catch (error) {
      console.error('📁 Error simulando escritura de archivo:', error);
    }
  }

  async create(studentData: Omit<Student, 'id'>): Promise<Student> {
    const validation = StudentValidator.validateStudent(studentData);
    if (!validation.isValid) {
      throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
    }

    // Generar nuevo ID único
    const newId = (Math.max(...this.students.map(s => parseInt(s.id ?? '0')), 0) + 1).toString();
    const student = new StudentEntity({ ...studentData, id: newId });

    this.students.push(student);

    // Guardar cambios al archivo
    await this.saveToFile();

    console.log('📁 Estudiante creado en archivo:', student);
    return student;
  }

  async read(id: string): Promise<Student | null> {
    const student = this.students.find(s => s.id === id) || null;
    console.log('📁 Estudiante leído desde archivo:', student?.nombre || 'No encontrado');
    return student;
  }

  async readAll(): Promise<Student[]> {
    console.log('📁 Leyendo todos los estudiantes desde archivo:', this.students.length);
    return [...this.students];
  }

  async update(id: string, studentData: Partial<Student>): Promise<Student | null> {
    const index = this.students.findIndex(s => s.id === id);
    if (index === -1) return null;

    if (studentData.parcial1 !== undefined || studentData.parcial2 !== undefined) {
      const validation = StudentValidator.validateStudent({
        nombre: studentData.nombre || this.students[index].nombre,
        parcial1: studentData.parcial1 ?? this.students[index].parcial1,
        parcial2: studentData.parcial2 ?? this.students[index].parcial2
      });

      if (!validation.isValid) {
        throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
      }
    }

    // Calcular nuevo promedio si se actualizan los parciales
    let newPromedio = this.students[index].promedio;
    if (studentData.parcial1 !== undefined || studentData.parcial2 !== undefined) {
      const parcial1 = studentData.parcial1 ?? this.students[index].parcial1;
      const parcial2 = studentData.parcial2 ?? this.students[index].parcial2;
      newPromedio = (parcial1 + parcial2) / 2;
    }

    this.students[index] = {
      ...this.students[index],
      ...studentData,
      promedio: newPromedio,
      updatedAt: new Date()
    };

    // Guardar cambios al archivo
    await this.saveToFile();

    console.log('📁 Estudiante actualizado en archivo:', this.students[index]);
    return this.students[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.students.findIndex(s => s.id === id);
    if (index === -1) return false;

    this.students.splice(index, 1);

    // Guardar cambios al archivo
    await this.saveToFile();

    console.log('📁 Estudiante eliminado del archivo, ID:', id);
    return true;
  }

  /**
   * Método adicional para descargar el archivo JSON actualizado
   * Útil para desarrollo y testing
   */
  downloadUpdatedJSON(): void {
    const jsonData = JSON.stringify(this.students, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'students-updated.json';
    link.click();

    URL.revokeObjectURL(url);
    console.log('📁 Archivo JSON descargado');
  }


}