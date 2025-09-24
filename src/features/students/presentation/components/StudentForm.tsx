import React, { useState } from 'react';
import { Student } from '../../domain/entities/Student';
import { StudentValidator } from '../../../../shared/utils/validations/validation';
import { Save, X } from 'lucide-react';

interface StudentFormProps {
  student?: Student;
  onSubmit: (student: Omit<Student, 'id'>) => void;
  onCancel: () => void;
}

/**
 * Componente StudentForm - Formulario para crear/editar estudiantes
 * Implementa validaciones y manejo de estado
 */
export const StudentForm: React.FC<StudentFormProps> = ({ student, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: student?.nombre || '',
    parcial1: student?.parcial1 || 0,
    parcial2: student?.parcial2 || 0,
    parcial3: student?.parcial3 || 0
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = StudentValidator.validateStudent(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar errores al modificar campos
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-[#117a41]">
          {student ? 'Editar Estudiante' : 'Nuevo Estudiante'}
        </h2>

        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <ul className="list-disc list-inside text-sm">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#117a41] focus:border-transparent"
              placeholder="Ingrese el nombre del estudiante"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parcial 1 (0.0 - 5.0)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.parcial1}
                onChange={(e) => handleInputChange('parcial1', parseFloat(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#117a41] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parcial 2 (0.0 - 5.0)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.parcial2}
                onChange={(e) => handleInputChange('parcial2', parseFloat(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#117a41] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parcial 3 (0.0 - 5.0)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.parcial3}
                onChange={(e) => handleInputChange('parcial3', parseFloat(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#117a41] focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="p-3 bg-[#42a6402a] rounded-lg">
            <p className="text-sm text-[#117a41]">
                <strong>Promedio calculado:</strong> {
                formData.parcial1 || formData.parcial2 || formData.parcial3
                  ? (
                    formData.parcial1 * 0.3 +
                    formData.parcial2 * 0.3 +
                    formData.parcial3 * 0.4
                  ).toFixed(2)
                  : '0.00'
                }
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-[#43a542] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#117a41] transition-colors flex items-center justify-center gap-2 duration-700"
            >
              <Save size={18} />
              Guardar
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-[#43a542] hover:text-white font-semibold transition-colors flex items-center justify-center gap-2 duration-700"
            >
              <X size={18} />
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};