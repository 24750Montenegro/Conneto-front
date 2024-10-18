"use client"

import { useState } from "react";

const ModalForm = ({ isOpen, onClose }) => {
  const [isOds, setOds] = useState('');

    if (!isOpen) return null;

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
      "Ciudades y comunidades sotenibles",
      "Producción y consumo responables",
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
          <form>
            <div className="mb-4">
              <label className="block text-white-600 text-sm font-semibold mb-2">
                Nombre del proyecto
              </label>
              <input
                type="text"
                id="nombre"
                className="w-full p-1 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white-600 text-sm font-semibold mb-2">
                Descripcion del proyecto
              </label>
              <input
                type="textarea"
                id="correo"
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <label className="block text-white-600 text-sm font-semibold mb-2">
                ODS que trabaja el proyecto
              </label>
              {categories.map((cat, index) => (
              <div key={index} className="text-white flex items-center space-x-2 ">
                <input
                  type="checkbox"
                  id={`category-${index}`}
                  value={isOds}
                  onChange={() => setOds(isOds)}
                  className="h-5 w-5 text-green-500 bg-green-700 border-green-600 rounded "
                />
                <label htmlFor={`category-${index}`} className="text-sm">
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