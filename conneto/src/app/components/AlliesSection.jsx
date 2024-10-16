"use client"
import React, { useState } from "react";
import ModalForm from "./ModalForm.jsx"

const AlliesSection = ({ allies }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <section className="px-4 mx-10">
      <h2 className="text-green-400 font-semibold text-lg">Tus Aliados</h2>
      <div className="flex items-center space-x-4 mt-4 overflow-x-auto scrollbar-hide">
        <button
          onClick={toggleModal}
          className="bg-gray-700 text-white py-1 px-4 rounded hover:bg-gray-800"
        >
          Crear proyecto
        </button>
        {/* Botón para agregar un aliado */}

        <button className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-2xl text-white hover:bg-gray-800">
          +
        </button>
        
        {/* Lista de aliados */}
        {allies.map((ally, index) => (
          <div key={index} className="flex-shrink-0">
            <img
              className="w-12 h-12 rounded-full border-2 border-gray-700 object-cover"
              src={ally.avatar}
              alt={`Aliado ${index + 1}`}
            />
          </div>
        ))}
      </div>
      {isModalOpen ? <ModalForm isOpen={isModalOpen} onClose={toggleModal} />: <></>}
    </section>
  );
};
export default AlliesSection;