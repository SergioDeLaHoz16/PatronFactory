import React from 'react';
import { StudentsPage } from './features/students/presentation/pages/StudentsPage';

/**
 * App Principal
 * 
 * Implementamos una Feature-based Clean Architecture:
 * 
 * src/
 *   features/
 *     students/
 *       domain/           -> Entidades e interfaces (reglas de negocio)
 *       infrastructure/   -> Implementaciones concretas y Factory
 *       presentation/     -> Componentes React
 *   shared/
 *     utils/             -> Utilidades compartidas
 * 
 * 🏛️ PRINCIPIOS SOLID IMPLEMENTADOS:
 * 
 * 1. Single Responsibility Principle (SRP):
 *    - Cada clase tiene una única responsabilidad
 *    - StudentValidator: solo valida
 *    - FileStudentCRUD: solo maneja archivos
 *    - DatabaseStudentCRUD: solo maneja BD
 *    - StudentFactory: solo crea instancias
 * 
 * 2. Open/Closed Principle (OCP):
 *    - Abierto para extensión: fácil agregar nuevas fuentes de datos
 *    - Cerrado para modificación: no necesitas cambiar código existente
 * 
 * 3. Liskov Substitution Principle (LSP):
 *    - FileStudentCRUD y DatabaseStudentCRUD son intercambiables
 *    - Ambas implementan IStudentCRUD correctamente
 * 
 * 4. Interface Segregation Principle (ISP):
 *    - IStudentCRUD contiene solo métodos relacionados a CRUD
 *    - No forzamos implementaciones innecesarias
 * 
 * 5. Dependency Inversion Principle (DIP):
 *    - Las clases de alto nivel dependen de IStudentCRUD (abstracción)
 *    - No dependen de implementaciones concretas
 * 
 * 🏭 PATRÓN FACTORY:
 * - StudentFactory encapsula la creación de objetos
 * - Permite intercambiar implementaciones sin cambiar código cliente
 * - Facilita la extensibilidad y el mantenimiento
 */
function App() {
  return (
    <div className="App">
      <StudentsPage />
    </div>
  );
}

export default App;