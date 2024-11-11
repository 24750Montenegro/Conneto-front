// components/TasksTable.jsx
import React from "react";

const TasksTable = ({ tasks }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 text-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-600">Nombre de la Tarea</th>
            <th className="py-2 px-4 border-b border-gray-600">Encargado</th>
            <th className="py-2 px-4 border-b border-gray-600">Estado</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index} className="hover:bg-gray-700">
              <td className="py-2 px-4 border-b border-gray-600">{task.name}</td>
              <td className="py-2 px-4 border-b border-gray-600">{task.assignee}</td>
              <td className="py-2 px-4 border-b border-gray-600">{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TasksTable;