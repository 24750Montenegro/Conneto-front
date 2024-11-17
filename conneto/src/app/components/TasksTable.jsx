'use client'
import React from 'react'
import { FaTrash } from 'react-icons/fa';

export function TasksTable({ tasks, onDeleteTask, onToggleComplete }) {
  if (!tasks || tasks.length === 0) {
    return <p className="text-center text-gray-500 my-4">No hay tareas disponibles.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 text-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-600 text-left">Completada</th>
            <th className="py-2 px-4 border-b border-gray-600 text-left">Nombre</th>
            <th className="py-2 px-4 border-b border-gray-600 text-left">Descripción</th>
            <th className="py-2 px-4 border-b border-gray-600 text-left">Asignado a</th>
            <th className="py-2 px-4 border-b border-gray-600 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-700">
              <td className="py-2 px-4 border-b border-gray-600">
                <input
                  type="checkbox"
                  checked={task.completada}
                  onChange={() => onToggleComplete(task.id)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
              </td>
              <td className="py-2 px-4 border-b border-gray-600">{task.nombre}</td>
              <td className="py-2 px-4 border-b border-gray-600">{task.descripcion}</td>
              <td className="py-2 px-4 border-b border-gray-600">{task.asignadoa}</td>
              <td className="py-2 px-4 border-b border-gray-600 text-right">
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="text-red-500 hover:text-red-700 text-left"
                >

                  <FaTrash
                        className="text-#dc2626 group-hover:text-#7f1d1d group-active:text-blue-700 transition duration-300 ease-in-out"
                        size={24}
                    />

                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}