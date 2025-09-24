import React from 'react';
import { Student } from '../../domain/entities/Student';
import { Edit, Trash2, User, Award } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

/**
 * Componente StudentList - Lista de estudiantes con acciones
 */
export const StudentList: React.FC<StudentListProps> = ({ 
  students, 
  onEdit, 
  onDelete, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando estudiantes...</span>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <User size={48} className="mx-auto mb-4 text-gray-300" />
        <p className="text-lg">No hay estudiantes registrados</p>
        <p className="text-sm">Agrega el primer estudiante usando el botón superior</p>
      </div>
    );
  }

  const getGradeColor = (grade: number) => {
    if (grade > 4.4) return 'text-green-600 bg-green-100';
    if (grade >= 3.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getGradeNumber = (grade: number) => {
    if (grade > 4.4) return 'text-green-600';
    if (grade >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeLabel = (grade: number) => {
    if (grade > 4.4) return 'Excelente';
    if (grade >= 3.5) return 'Bueno';
    if (grade >= 3.0) return 'Aceptable';
    return 'Deficiente';
  };

  return (
    <div className="space-y-4">
      {students.map((student) => (
        <div key={student.id} className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#117a4051] rounded-full flex items-center justify-center">
                  <User size={20} className="text-[#117a41]" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl text-gray-900">{student.nombre}</h3>
              
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-500 mb-1">Parcial 1</p>
                  <p className={`text-xl font-bold ${getGradeNumber(student.parcial1)}`}>{student.parcial1.toFixed(1)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-500 mb-1">Parcial 2</p>
                  <p  className={`text-xl font-bold ${getGradeNumber(student.parcial2)}`}>{student.parcial2.toFixed(1)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-500 mb-1">Parcial 3</p>
                  <p  className={`text-xl font-bold ${getGradeNumber(student.parcial3)}`}>{student.parcial2.toFixed(1)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-500 mb-1">Promedio</p>
                  <div className="flex items-center justify-center gap-2">
                    <p className={`text-xl font-bold ${getGradeNumber(student.promedio || 0)}`}>{(student.promedio || 0).toFixed(1)}</p>
                    <Award size={16} className={getGradeColor(student.promedio || 0).replace('bg-', 'text-').replace('100', '600')} />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-500 mb-1">Estado</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getGradeColor(student.promedio || 0)}`}>
                    {getGradeLabel(student.promedio || 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 ml-4">
              <button
                onClick={() => onEdit(student)}
                className="p-2 text-[#8cce6c] hover:bg-blue-100 rounded-lg transition-colors"
                title="Editar estudiante"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => onDelete(student.id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                title="Eliminar estudiante"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};