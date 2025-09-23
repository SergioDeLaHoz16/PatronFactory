import { IStudentCRUD } from '../../domain/interfaces/IStudentCRUD';
import { FileStudentCRUD } from '../data-sources/FileStudentCRUD';
import { DatabaseStudentCRUD } from '../data-sources/DatabaseStudentCRUD';

/**
 * PATRÓN FACTORY IMPLEMENTADO AQUÍ 🏭
 * 
 * StudentFactory - Implementa el patrón Factory Method
 * 
 * ¿Qué es el patrón Factory?
 * Es un patrón de diseño creacional que proporciona una interfaz para crear objetos
 * sin especificar exactamente qué clase de objeto se creará.
 * 
 * ¿Por qué usarlo aquí?
 * - Permite crear diferentes implementaciones de IStudentCRUD sin que el código cliente
 *   conozca los detalles de construcción
 * - Facilita el intercambio entre fuentes de datos (archivo vs base de datos)
 * - Cumple con el principio Open/Closed: podemos agregar nuevas fuentes sin modificar código existente
 * 
 * Principios SOLID aplicados:
 * - Single Responsibility Principle (SRP): Solo se encarga de crear instancias de IStudentCRUD
 * - Open/Closed Principle (OCP): Abierto para extensión (nuevas fuentes), cerrado para modificación
 * - Dependency Inversion Principle (DIP): Devuelve abstracciones, no implementaciones concretas
 */

export type DataSourceType = 'file' | 'database';

export class StudentFactory {
  /**
   * Método Factory que crea la implementación adecuada según el tipo de fuente
   * 
   * @param sourceType - Tipo de fuente de datos ('file' o 'database')
   * @returns Implementación concreta de IStudentCRUD
   * 
   * 🏭 PATRÓN FACTORY EN ACCIÓN:
   * - El código cliente solo llama a createStudentCRUD('file' o 'database')
   * - No necesita conocer las clases FileStudentCRUD o DatabaseStudentCRUD
   * - Puede cambiar fácilmente entre fuentes de datos
   */
  static createStudentCRUD(sourceType: DataSourceType): IStudentCRUD {
    console.log(`🏭 Factory creando instancia para tipo: ${sourceType}`);
    
    switch (sourceType) {
      case 'file':
        return new FileStudentCRUD();
      case 'database':
        return new DatabaseStudentCRUD();
      default:
        throw new Error(`Tipo de fuente de datos no soportado: ${sourceType}`);
    }
  }

  /**
   * Método adicional para obtener los tipos disponibles
   * Útil para interfaces de usuario dinámicas
   */
  static getAvailableDataSources(): DataSourceType[] {
    return ['file', 'database'];
  }

  /**
   * Método para validar si un tipo de fuente es válido
   */
  static isValidDataSource(sourceType: string): sourceType is DataSourceType {
    return ['file', 'database'].includes(sourceType as DataSourceType);
  }
}

/**
 * 📝 VENTAJAS DEL PATRÓN FACTORY IMPLEMENTADO:
 * 
 * 1. FLEXIBILIDAD: Cambiar entre archivo y base de datos con un solo parámetro
 * 2. MANTENIBILIDAD: Agregar nuevas fuentes de datos es fácil
 * 3. TESTABILIDAD: Fácil crear mocks para pruebas
 * 4. DESACOPLAMIENTO: El código cliente no depende de clases concretas
 * 5. CONFIGURABILIDAD: Se puede cambiar la fuente desde configuración
 * 
 * 📝 EJEMPLO DE USO:
 * 
 * // Cambiar entre fuentes es tan simple como cambiar un parámetro:
 * const fileService = StudentFactory.createStudentCRUD('file');
 * const dbService = StudentFactory.createStudentCRUD('database');
 * 
 * // El resto del código es idéntico para ambas fuentes:
 * const students = await fileService.readAll(); // O dbService.readAll()
 */