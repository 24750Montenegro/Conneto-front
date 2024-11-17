//Se importa el useState para manejar el estado dentro del componente
import { useState } from 'react';
//Se importa el swal para mostrar alertas personalizadas al usuario
import Swal from 'sweetalert2';
// Se define el componente ModalForm y recibimos tres props: isOpen (estado del modal, abierto o cerrado), onClose (cierra el modal) y onSubmit (función al enviar la info para crear el proeycto)
const ModalForm = ({ isOpen, onClose, onSubmit }) => {
  // Definimos el estado para almacenar el nombre y la descripción del proyecto, tambien los ODS marcados
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [selectedOds, setSelectedOds] = useState([]);

  //Si el modal no está abierto, se devuelve un null para que no muestre nada
  if (!isOpen) return null;

  //Funcion para enviar el formulario con la info del proyecto para crearlo
  const handleSubmit = async (e) => {
    e.preventDefault();
    //En caso de algun campo vacío, se muestra la alerta de campos vacios
    if (!nombre || !descripcion || selectedOds.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Existen campos incompletos",
        text: "Complete todos los campos de su nuevo proyecto",
        confirmButtonText: "Intente de nuevo",
      });
      return;
    }

    // Llamamos al método `onSubmit` que viene como prop de `MostrarAlianza.tsx`
    onSubmit({ nombre, descripcion, ods: selectedOds });
  };

  //Funcion que maneja la seleccion de los checkboxes
  const handleCheckboxChange = (ods) => {
    // Si el ODS ya está seleccionado se quita si no, se agrega
    setSelectedOds(prev =>
      prev.includes(ods) ? prev.filter(o => o !== ods) : [...prev, ods]
    );
  };

  //Array de categorias de ODS a mostrar para elegir en el modal
  const categories = [
    "Fin de la pobreza", "Hambre cero", "Salud y bienestar",
    "Educación de calidad", "Igualdad de género", "Agua limpia y saneamiento",
    "Energía asequible y no contaminante", "Trabajo decente y crecimiento económico",
    "Industria, innovación e infraestructura", "Reducción de desigualdades",
    "Ciudades y comunidades sostenibles", "Producción y consumo responsables",
    "Acción por el clima", "Vida submarina", "Vida de ecosistemas terrestres",
    "Paz, justicia e instituciones sólidas", "Alianzas para lograr los objetivos"
  ];

  //Se devuelve el diseño del Modal para exportarse
  return (
    <>
      
      <style>
        {`
          .scrollbar-custom::-webkit-scrollbar {
            width: 8px;
          }
          .scrollbar-custom::-webkit-scrollbar-track {
            background: #374151;
            border-radius: 8px;
          }
          .scrollbar-custom::-webkit-scrollbar-thumb {
            background-color: #10B981;
            border-radius: 8px;
            border: 2px solid #374151;
          }
          .scrollbar-custom::-webkit-scrollbar-thumb:hover {
            background-color: #059669;
          }
        `}
      </style>

      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
        <div className="bg-slate-900 p-6 rounded-lg w-96">
          <h2 className="text-xl font-semibold mb-4 text-green-500">Crea tu nuevo proyecto</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-semibold mb-2">Nombre del proyecto</label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-semibold mb-2">Descripción del proyecto</label>
              <textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full p-3 bg-gray-800 text-gray-200 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">ODS que trabaja el proyecto</label>
            <div className="max-h-48 overflow-y-auto mb-4 scrollbar-custom">
              {categories.map((cat, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    id={`category-${index}`}
                    onChange={() => handleCheckboxChange(cat)}
                    className="h-4 w-4 rounded-full appearance-none bg-gray-800 border border-gray-600 checked:bg-green-500 checked:border-green-500 checked:focus:ring-0 checked:ring-green-600"
                  />
                  <label htmlFor={`category-${index}`} className="text-2x2 text-gray-300">{cat}</label>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="bg-gray-700 text-gray-200 py-2 px-4 rounded hover:bg-gray-800"
                onClick={onClose}
              >
                Cerrar
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-4 ml-2 rounded hover:bg-green-600"
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
// Se exporta el modal para que pueda utilizarse en otras areas
export default ModalForm;