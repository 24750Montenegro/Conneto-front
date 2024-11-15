import { useState } from 'react';
import Swal from 'sweetalert2';

const ModalForm = ({ isOpen, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [selectedOds, setSelectedOds] = useState([]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!nombre || !descripcion || selectedOds.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Existen campos incompletos",
          text: "Complete todos los campos de su nuevo proyecto",
          confirmButtonText: "Intente de nuevo",
        });
        return;
      }

      const response = await fetch('http://localhost:8080/Proyecto/crearProyecto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion, ods: selectedOds }),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Su proyecto se creó con éxito",
          text: "Regresar al feed, puedes ver tu proyecto en la pestaña de alianzas",
        });
        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al crear el nuevo proyecto",
          text: "Ocurrió un error al enviar los datos de su proyecto. Inténtalo de nuevo.",
          confirmButtonText: "Intentar de nuevo",
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error de red",
        text: "Error al intentar crear su nuevo proyecto. Verifica tu conexión.",
        confirmButtonText: "Intentar de nuevo",
      });
    }
  };

  const handleCheckboxChange = (ods) => {
    setSelectedOds(prev =>
      prev.includes(ods) ? prev.filter(o => o !== ods) : [...prev, ods]
    );
  };

  const categories = [
    "Fin de la pobreza",
    "Hambre cero",
    "Salud y bienestar",
    "Educación de calidad",
    "Igualdad de género",
    "Agua limpia y saneamiento",
    "Energía asequible y no contaminante",
    "Trabajo decente y crecimiento económico",
    "Industria, innovación e infraestructura",
    "Reducción de desigualdades",
    "Ciudades y comunidades sostenibles",
    "Producción y consumo responsables",
    "Acción por el clima",
    "Vida submarina",
    "Vida de ecosistemas terrestres",
    "Paz, justicia e instituciones sólidas",
    "Alianzas para lograr los objetivos"
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-slate-900 p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-green-500">Crea tu nuevo proyecto</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Nombre del proyecto
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Descripción del proyecto
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full p-3 bg-gray-800 text-gray-200 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            ODS que trabaja el proyecto
          </label>
          <div className="max-h-48 overflow-y-auto mb-4">
            {categories.map((cat, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  id={`category-${index}`}
                  onChange={() => handleCheckboxChange(cat)}
                  className="h-5 w-5 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-0"
                />
                <label htmlFor={`category-${index}`} className="text-sm text-gray-300">
                  {cat}
                </label>
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
  );
};

export default ModalForm;
