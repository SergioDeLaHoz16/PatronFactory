import { StudentValidator } from "./validation";

export type ValidationResult = { isValid: boolean; errors: string[] };

export class StudentJSONValidator {
  /**
   * Valida que `data` sea un arreglo de estudiantes correctos.
   * Devuelve { isValid, errors } en lugar de lanzar, para que el caller decida.
   */
  static validate(data: any): ValidationResult {
    const errors: string[] = [];

    if (!Array.isArray(data)) {
      return { isValid: false, errors: ['El JSON debe ser un arreglo de estudiantes.'] };
    }

    const ids = new Set<string>();

    data.forEach((raw: any, i: number) => {
      const row = i + 1;
      if (typeof raw !== 'object' || raw === null) {
        errors.push(`Fila ${row}: No es un objeto válido.`);
        return;
      }

      // --- ID ---
      if (!('id' in raw) || raw.id === null || raw.id === undefined) {
        errors.push(`Fila ${row}: Falta 'id'.`);
      } else {
        const idStr = String(raw.id).trim();
        if (!idStr) {
          errors.push(`Fila ${row}: 'id' vacío.`);
        } else if (ids.has(idStr)) {
          errors.push(`Fila ${row}: 'id' duplicado (${idStr}).`);
        } else {
          ids.add(idStr);
        }
      }

      // --- Nombre ---
      if (!('nombre' in raw) || typeof raw.nombre !== 'string' || raw.nombre.trim() === '') {
        errors.push(`Fila ${row}: 'nombre' faltante o inválido.`);
      }

      // --- Parciales (numéricos y rango 0..5) ---
      const p1 = Number(raw.parcial1);
      const p2 = Number(raw.parcial2);
      if (Number.isNaN(p1)) errors.push(`Fila ${row}: 'parcial1' debe ser numérico.`);
      if (Number.isNaN(p2)) errors.push(`Fila ${row}: 'parcial2' debe ser numérico.`);
      if (!Number.isNaN(p1) && (p1 < 0 || p1 > 5)) errors.push(`Fila ${row}: 'parcial1' fuera de rango (0-5).`);
      if (!Number.isNaN(p2) && (p2 < 0 || p2 > 5)) errors.push(`Fila ${row}: 'parcial2' fuera de rango (0-5).`);

      // --- Promedio ---
      const prom = Number(raw.promedio);
      if (Number.isNaN(prom)) {
        errors.push(`Fila ${row}: 'promedio' debe ser numérico.`);
      } else if (!Number.isNaN(p1) && !Number.isNaN(p2)) {
        const expected = Math.round(((p1 + p2) / 2) * 100) / 100; // 2 decimales
        if (Math.abs(expected - prom) > 0.05) {
          errors.push(
            `Fila ${row}: 'promedio' (${prom}) no coincide con el calculado (${expected}).`
          );
        }
      }

      // --- Fechas (ISO) ---
      if ('createdAt' in raw && raw.createdAt !== undefined && raw.createdAt !== null) {
        const d = new Date(raw.createdAt);
        if (isNaN(d.getTime())) errors.push(`Fila ${row}: 'createdAt' no es una fecha válida ISO.`);
      }
      if ('updatedAt' in raw && raw.updatedAt !== undefined && raw.updatedAt !== null) {
        const d = new Date(raw.updatedAt);
        if (isNaN(d.getTime())) errors.push(`Fila ${row}: 'updatedAt' no es una fecha válida ISO.`);
      }

      // --- Reusar validaciones por entidad (nombre/parciales/demas reglas) ---
      const entityValidation = StudentValidator.validateStudent({
        nombre: raw.nombre,
        parcial1: Number.isNaN(p1) ? 0 : p1,
        parcial2: Number.isNaN(p2) ? 0 : p2
      });
      if (!entityValidation.isValid) {
        errors.push(`Fila ${row}: ${entityValidation.errors.join(', ')}`);
      }
    });

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Helper que lanza en caso de error para usar cuando prefieras excepciones.
   */
  static validateOrThrow(data: any): void {
    const res = this.validate(data);
    if (!res.isValid) throw new Error(res.errors.join(' | '));
  }
}
