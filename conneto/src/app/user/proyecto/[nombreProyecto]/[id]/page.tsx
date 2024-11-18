'use client'

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { TasksTable } from '../../../../components/TasksTable';
import { BsPlusCircle } from 'react-icons/bs';
import { FaUserAstronaut } from 'react-icons/fa';
import { AiFillHome, AiOutlineTeam } from 'react-icons/ai';
import { useRouter, useParams } from 'next/navigation';

interface Task {
  id: string;
  nombre: string;
  descripcion: string;
  asignado_id: number;
  completada: boolean;
}

export default function TasksPage() {
  const router = useRouter();
  const { id, nombreProyecto } = useParams(); // Obtener el projectId desde los parámetros de la URL
  const proyectoNombreDecodificado = typeof nombreProyecto === 'string' ? decodeURIComponent(nombreProyecto) : '';
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [isLoading, setIsLoading] = useState(true)

  // Obtener asignado_id desde el token almacenado en localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const match = token ? token.match(/"id":(\d+)/) : null;
    setUsuarioId(match ? parseInt(match[1]) : null);
  }, []);


  const handleDeleteProject = async () => {
    try {
      const confirm = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará el proyecto y todas sus tareas asociadas.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
      });
  
      if (confirm.isConfirmed) {
        console.log('ID del proyecto:', id); // Verifica que el id se obtiene correctamente
  
        const response = await fetch(`http://localhost:8080/Proyecto/eliminarproyecto/${id}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          Swal.fire('Eliminado', 'El proyecto ha sido eliminado correctamente', 'success');
          router.push('/user/eleccionalianza'); // Redirige al feed o página principal
        } else {
          throw new Error(`Error al eliminar el proyecto. Status: ${response.status}`);
        }
      }
    } catch (error) {
      console.error('Error al eliminar el proyecto:', error);
      Swal.fire('Error', 'No se pudo eliminar el proyecto', 'error');
    }
  };
  
  // Cargar tareas del proyecto al iniciar la página
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:8080/tarea/proyecto/${id}`);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        Swal.fire('Advertencia', 'No se pudieron cargar las tareas, o no hay tareas', 'warning');
      }
    };

    if (isLoading) {
      setTimeout(async () => {
        await fetchTasks();
        setIsLoading(false); // Finalizar el efecto de carga
      }, 500); // Retrasar la petición 1/2 segundo
    }
  }, [isLoading, id]);

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/tarea/delete/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== id));
        Swal.fire('Eliminado', 'La tarea ha sido eliminada', 'success');
      } else {
        throw new Error('Error al eliminar');
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar la tarea', 'error');
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/tarea/${id}/alternar-estado`, { method: 'PUT' });
      if (response.ok) {
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, completada: !task.completada } : task
          )
        );
        Swal.fire('Éxito', 'El estado de la tarea ha sido cambiado', 'success');
      } else {
        throw new Error('Error al alternar estado');
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo alternar el estado de la tarea', 'error');
    }
  };

  
  const handleAddTask = async () => {
    try {
      if (!usuarioId) {
        Swal.fire('Error', 'No se pudo determinar el usuario asignado', 'error');
        return;
      }

      const data = {
        nombre,
        descripcion,
        asignado: { id: usuarioId },
        proyecto: { id: id },
      };

      setIsLoading(true); // Activar el loading y hacer la petición GET después

      const response = await fetch(`http://localhost:8080/tarea/agregar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newTask = await response.json(); // Obtener la nueva tarea creada
        // Actualizar el estado local con la nueva tarea agregada
        setTasks((prevTasks) => [...prevTasks, newTask]);
        Swal.fire('Éxito', 'La tarea ha sido agregada correctamente', 'success');
        setNombre('');
        setDescripcion('');
        setIsModalOpen(false);
      } else {
        throw new Error('Error al agregar tarea');
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo agregar la tarea', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r to-green-400 from-emerald-800">
                Gestor de Tareas
              </span>
          </h1> <br />
          <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{proyectoNombreDecodificado}</h1>
          <div className="flex space-x-4">
            <button
              onClick={handleDeleteProject}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Eliminar Proyecto
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="display flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Agregar Tarea &nbsp;
              <BsPlusCircle
                className="group-active:text-blue-700 transition duration-300 ease-in-out"
                size={24}
              />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="spinner-border animate-spin border-4 border-t-4 border-blue-500 rounded-full w-8 h-8" />
          </div>
        ) : (
        <TasksTable
          tasks={tasks}
          onDeleteTask={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
        />)}
      </div>

      {/* Modal para agregar tarea */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Agregar Nueva Tarea</h2>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="nombre">
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                placeholder="Nombre de la tarea"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="descripcion">
                Descripción
              </label>
              <input
                id="descripcion"
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                placeholder="Descripción de la tarea"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAddTask}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Agregar
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 w-full bg-neutral-900 py-2 flex justify-around items-center">
        {/* Navegación */}
        <button className="group relative" onClick={() => router.push('/user/feed')}>
          <AiFillHome
            className="text-gray-500 group-hover:text-blue-500 group-active:text-blue-700 transition duration-300 ease-in-out"
            size={24}
          />
        </button>
        <button className="group relative" onClick={() => router.push('/user/post')}>
          <BsPlusCircle
            className="text-gray-500 group-hover:text-blue-500 group-active:text-blue-700 transition duration-300 ease-in-out"
            size={24}
          />
        </button>
        <button className="group relative" onClick={() => router.push('/user/eleccionalianza')}>
          <AiOutlineTeam
            className="text-blue-500 transition duration-300"
            size={24}
          />
        </button>
        <button className="group relative" onClick={() => router.push('/user/profile')}>
          <FaUserAstronaut
            className="text-gray-500 group-hover:text-blue-500 group-active:text-blue-700 transition duration-300 ease-in-out"
            size={24}
          />
        </button>
      </nav>
    </div>
  );
}
