import React, { useState, useEffect } from 'react';
import { Student } from '../../domain/entities/Student';
import { IStudentCRUD } from '../../domain/interfaces/IStudentCRUD';
import { StudentFactory, DataSourceType } from '../../infrastructure/factories/StudentFactory';
import { StudentList } from '../components/StudentList';
import { StudentForm } from '../components/StudentForm';
import { Plus, Database, FileText, Settings, Download } from 'lucide-react';

/**
 * StudentsPage - Página principal para gestión de estudiantes
 * 
 * 🏭 AQUÍ SE USA EL PATRÓN FACTORY:
 * - Permite cambiar entre fuentes de datos (archivo/base de datos) dinámicamente
 * - El resto del código no cambia independientemente de la fuente seleccionada
 * - Demuestra la potencia del patrón Factory para intercambiar implementaciones
 */
export const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>();
  const [dataSource, setDataSource] = useState<DataSourceType>('file');
  const [studentService, setStudentService] = useState<IStudentCRUD>(
    StudentFactory.createStudentCRUD('file')
  );

  /**
   * 🏭 PATRÓN FACTORY EN ACCIÓN:
   * Cuando cambia el tipo de fuente de datos, se crea una nueva instancia
   * sin que el resto del código necesite cambios
   */
  const changeDataSource = (newSource: DataSourceType) => {
    console.log(`🔄 Cambiando fuente de datos de ${dataSource} a ${newSource}`);
    setDataSource(newSource);

    // 🏭 Factory crea la implementación apropiada
    const newService = StudentFactory.createStudentCRUD(newSource);
    setStudentService(newService);

    // Recargar datos con la nueva fuente
    loadStudents(newService);
  };

  const loadStudents = async (service: IStudentCRUD = studentService) => {
    try {
      setLoading(true);
      const data = await service.readAll();
      setStudents(data);
    } catch (error) {
      console.error('Error cargando estudiantes:', error);
      alert('Error cargando estudiantes: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleCreateStudent = async (studentData: Omit<Student, 'id'>) => {
    try {
      await studentService.create(studentData);
      setShowForm(false);
      await loadStudents();
    } catch (error) {
      alert('Error creando estudiante: ' + (error as Error).message);
    }
  };

  const handleUpdateStudent = async (studentData: Omit<Student, 'id'>) => {
    if (!editingStudent) return;

    try {
      await studentService.update(editingStudent.id, studentData);
      setEditingStudent(undefined);
      setShowForm(false);
      await loadStudents();
    } catch (error) {
      alert('Error actualizando estudiante: ' + (error as Error).message);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este estudiante?')) return;

    try {
      await studentService.delete(id);
      await loadStudents();
    } catch (error) {
      alert('Error eliminando estudiante: ' + (error as Error).message);
    }
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingStudent(undefined);
  };

  const handleDownloadJSON = () => {
    if (dataSource === 'file' && 'downloadUpdatedJSON' in studentService) {
      (studentService as any).downloadUpdatedJSON();
    }
  };

// const handleImportJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
//   const file = event.target.files?.[0];
//   if (!file) return;

//   try {
//     // 🔑 Solo si studentService es DatabaseStudentCRUD
//     if (studentService instanceof DatabaseStudentCRUD) {
//       await studentService.importStudentsFromJSON(file);
//       alert("✅ Estudiantes importados/actualizados en Supabase correctamente");
//     } else {
//       alert("⚠️ Esta operación solo está disponible para DatabaseStudentCRUD");
//     }
//   } catch (error) {
//     alert(`❌ Error al importar: ${(error as Error).message}`);
//   }
// };



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header con selector de fuente de datos */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-900 mb-4">
            Sistema de Gestión de Estudiantes
          </h1>

          {/* 🏭 SELECTOR DE FUENTE DE DATOS - DEMUESTRA EL PATRÓN FACTORY */}
          <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white rounded-lg border">
            <div className="flex items-center gap-2">
              <Settings className="text-gray-600" size={20} />
              <span className="font-medium text-gray-700">Fuente de datos:</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => changeDataSource('file')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${dataSource === 'file'
                  ? 'bg-[#117a41] text-white font-semibold shadow-md'
                  : 'bg-gray-100 font-semibold text-gray-700 hover:bg-[#f0ffee] hover:text-gray-600'
                  }`}
              >

                <FileText size={16} />
                Archivo JSON
              </button>

              <button
                onClick={() => changeDataSource('database')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${dataSource === 'database'
                  ? 'bg-[#117a41] text-white font-semibold shadow-md'
                  : 'bg-gray-100 font-semibold text-gray-700 hover:bg-[#f0ffee] hover:text-gray-600'
                  }`}
              >
                <Database size={16} />
                Base de Datos
              </button>
            </div>

            <div className="text-sm text-black ml-auto">
              <strong>Fuente activa:</strong>{' '}
              {dataSource === 'file' ? (
                <span className="font-semibold">📁 Archivo JSON</span>
              ) : (
                <span className="font-semibold">🗄️ Supabase</span>
              )}
              {dataSource === 'database' && (
                <div className="text-xs text-gray-900 mt-1">
                  {import.meta.env.VITE_SUPABASE_URL ?
                    `Conectado en Base de Datos` :
                    '⚠️ Configurar .env'
                  }
                </div>
              )}
            </div>
          </div>

          {/* Botón para agregar estudiante */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#43a542] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#117a41] duration-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Agregar Estudiante
            </button>



            {dataSource === 'file' && (
              <>
                <button
                  onClick={handleDownloadJSON}
                  className="bg-[#43a542] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#117a41] duration-700 transition-colors flex items-center gap-2"
                  title="Descargar JSON actualizado"
                >
                  <Download size={20} />
                  Descargar JSON
                </button>
              </>
            )}

            {dataSource === 'database' && (
              <>
                {/* Subir JSON a la base de datos */}
                {/* <label className="bg-[#43a542] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#117a41] duration-700 transition-colors flex items-center gap-2 cursor-pointer">
                  <input
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={handleImportJSON}
                  />
                  📤 Subir JSON
                </label> */}
              </>
            )}

          </div>
        </div>

        {/* Lista de estudiantes */}
        <StudentList
          students={students}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
          loading={loading}
        />

        {/* Formulario modal */}
        {showForm && (
          <StudentForm
            student={editingStudent}
            onSubmit={editingStudent ? handleUpdateStudent : handleCreateStudent}
            onCancel={handleCancelForm}
          />
        )}

        {/* Footer informativo */}
        <div className="mt-12 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
          <h3 className="font-bold text-blue-900 mb-2">🏭 Patrón Factory en Acción</h3>
          <p className="text-blue-800 text-sm mb-2">
            Este sistema demuestra el <strong>Patrón Factory</strong> permitiendo cambiar entre diferentes fuentes de datos:
          </p>
          <ul className="text-blue-700 text-sm list-disc list-inside space-y-1">
            <li><strong>Archivo JSON:</strong> Los datos se manejan en memoria simulando un archivo</li>
            <li><strong>Base de Datos:</strong> Los datos se almacenan en Supabase</li>
            <li><strong>Intercambiable:</strong> Cambiar fuente no requiere modificar el código de negocio</li>
            <li><strong>Extensible:</strong> Fácil agregar nuevas fuentes (API, LocalStorage, etc.)</li>
          </ul>

          {/* Información de configuración de Supabase */}
          <div className="mt-4 p-3 bg-blue-100 rounded border">
            <h4 className="font-semibold text-blue-900 mb-2">🔐 Configuración de Supabase:</h4>
            <div className="text-xs text-blue-800 space-y-1">
              <p><strong>Estado:</strong> {
                import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
                  ? '✅ Variables configuradas'
                  : '⚠️ Configurar archivo .env'
              }</p>
              {!import.meta.env.VITE_SUPABASE_URL && (
                <p className="text-orange-700">
                  📝 Para usar Supabase: configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};