import { useState } from "react";

const ModalForm = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    const [isOds, setOds] = useState('');
    var ODS = []

    const handleSelectCategorie = ()=> {
      
    }
  
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
    ];
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Crea tu nuevo proyecto</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nombre del proyecto
              </label>
              <input
                type="text"
                id="nombre"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Descripcion del proyecto
              </label>
              <input
                type="textarea"
                id="correo"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
                ODS que trabaja el proyecto
              </label>
              {categories.map((cat, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`category-${index}`}
                  value={isOds}
                  onChange={() => setOds(isOds)}
                  className="h-5 w-5 text-green-500 bg-gray-700 border-gray-600 rounded"
                />
                <label htmlFor={`category-${index}`} className="text-sm text-black">
                  {cat}
                </label>
              </div>
            ))}
            <div className="flex justify-end">
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