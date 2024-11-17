'use client'
import React, { useState } from 'react'
import { TasksTable } from '../../../components/TasksTable'
import { BsPlusCircle } from "react-icons/bs";
import { FaUserAstronaut } from 'react-icons/fa';
import { AiFillHome, AiOutlineTeam } from 'react-icons/ai';
import { useRouter, useParams } from "next/navigation";


interface Task {
  id: string
  nombre: string
  descripcion: string
  asignadoa: string
  completada: boolean
}

export default function TasksPage() {
    const router = useRouter();


  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', nombre: 'Tarea 1', descripcion: 'Descripción de la tarea 1', asignadoa: 'Usuario 1', completada: false },
    { id: '2', nombre: 'Tarea 2', descripcion: 'Descripción de la tarea 2', asignadoa: 'Usuario 2', completada: true },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'completada'>>({
    nombre: '',
    descripcion: '',
    asignadoa: '',
  })

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completada: !task.completada } : task
    ))
  }

  const handleAddTask = () => {
    const newTaskWithId: Task = {
      ...newTask,
      id: Date.now().toString(),
      completada: false,
    }
    setTasks([...tasks, newTaskWithId])
    setNewTask({ nombre: '', descripcion: '', asignadoa: '' })
    setIsModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestor de Tareas</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="display flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Agregar Tarea   &nbsp;
            <BsPlusCircle
                        className=" group-active:text-blue-700 transition duration-300 ease-in-out"
                        size={24}
                    />
          </button>
        </div>
        <TasksTable
          tasks={tasks}
          onDeleteTask={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
        />
      </div>

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
                value={newTask.nombre}
                onChange={(e) => setNewTask({ ...newTask, nombre: e.target.value })}
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
                value={newTask.descripcion}
                onChange={(e) => setNewTask({ ...newTask, descripcion: e.target.value })}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                placeholder="Descripción de la tarea"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="asignadoa">
                Asignado a
              </label>
              <input
                id="asignadoa"
                type="text"
                value={newTask.asignadoa}
                onChange={(e) => setNewTask({ ...newTask, asignadoa: e.target.value })}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                placeholder="Nombre del responsable"
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
                        size={24} /> {/* Usa el icono de apretón de manos */}
                </button>

                <button className="group relative" onClick={() => router.push('/user/profile')}>
                    <FaUserAstronaut
                        className="text-gray-500 group-hover:text-blue-500 group-active:text-blue-700 transition duration-300 ease-in-out"
                        size={24}
                    />
                </button>

            </nav>
    </div>

    
  )
}