import { useState } from 'react';

const ModalForm = ({ isOpen, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [selectedOds, setSelectedOds] = useState([]);

  if (!isOpen) return null;

  //Maneja el envio del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //Hace una solicitud al servidor conn los datos del proyecto
      const response = await fetch('http://localhost:3000/proyectos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre, //Envia el nombre del proyecto
          descripcion, //Envia la descripcion del proyecto
          ods: selectedOds, //Envia los ods seleccionados
        }),
      });
      if (response.ok) {
        const proyecto = await response.jason();
        alert('Se ha registrado su nuevo proyecto con éxito');
        onClose();
      } else {
        alert('Ocurrió un error al guardar su nuevo proyecto');
      }
    } catch (error) {
      console.error('Hubo un error al enviar su proyecto', error);
    }
  };

  //Maneja la selección de ODSs del modal
  const handleCheckboxChange = (ods) => {
    //Actualiza el estado selected ods, agregando o quitando la ODS seleccionada
    setSelectedOds(prev => 
      prev.includes(ods) ? prev.filter(o => o !== ods) : //Quita el ODS si ya esta seleccionada
       [...prev, ods] //Agrega ODS si no esta seleccionada
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
        <h2 className="text-xl font-semibold mb-4 text-green-600">Crea tu nuevo proyecto</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white-600 text-sm font-semibold mb-2">
              Nombre del proyecto
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-1 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white-600 text-sm font-semibold mb-2">
              Descripción del proyecto
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <label className="block text-white-600 text-sm font-semibold mb-2">
            ODS que trabaja el proyecto
          </label>
          {categories.map((cat, index) => (
            <div key={index} className="text-white flex items-center space-x-2">
              <input
                type="checkbox"
                id={`category-${index}`}
                onChange={() => handleCheckboxChange(cat)}
                className="h-5 w-5 text-green-500 bg-green-700 border-green-600 rounded"
              />
              <label htmlFor={`category-${index}`} className="text-sm">
                {cat}
              </label>
            </div>
          ))}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-800"
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
