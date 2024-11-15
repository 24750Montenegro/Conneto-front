"use client";


import { BsPlusCircle } from "react-icons/bs";
import { FaUserAstronaut } from 'react-icons/fa';
import { AiFillHome, AiOutlineTeam } from 'react-icons/ai'; // Importa AiOutlineTeam para Alianza

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface AlianzaData {
    id: number;
    name: string;
    descripcion: string;
    image: string;
}

const ListaAlianzas = () => {
    const router = useRouter();
    const [alianzas, setAlianzas] = useState<AlianzaData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [proyectos, setProyectos] = useState<any[]>([]);


    useEffect(() => {
        obtenerAlianzas();
    }, []);

    const obtenerAlianzas = async () => {
        try {
            const response = await fetch("http://localhost:8080/alianza");
            const data = await response.json();
            if (Array.isArray(data)) {
                setAlianzas(data);
                setError(null);
            } else {
                setError("La respuesta no es una lista de alianzas.");
            }
        } catch (error) {
            console.error("Error al obtener alianzas:", error);
            setError("No se pudieron cargar las alianzas. Inténtalo nuevamente.");
        }
    };

    const manejarCrearAlianza = () => {
        router.push('/user/newAlianza');
    };

    const verDetallesAlianza = (id: number) => {
        router.push(`/user/alianza/${id}`);
    };

    useEffect(() => {
        const fetchProyectos = async () => {
            try {
                const response = await fetch('http://localhost:8080/Proyecto/obtenerProyectos');
                if (response.ok) {
                    const proyectosData = await response.json();
                    setProyectos(proyectosData);
                } else {
                    console.error("Error al obtener los proyectos");
                }
            } catch (error) {
                console.error("Error de red al cargar los proyectos:", error);
            }
        };
        fetchProyectos();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
            <h2 className="text-3xl font-semibold text-green-400 mb-6">Lista de Alianzas</h2>

            <button
                onClick={manejarCrearAlianza}
                className="bg-green-500 text-white px-6 py-2 rounded-md mb-6"
            >
                Crear Nueva Alianza
            </button>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Lista de Alianzas */}
            <div className="space-y-4 w-full max-w-2xl">
                {alianzas.length > 0 ? (
                    alianzas.map((alianza) => (
                        <div
                            key={alianza.id}
                            onClick={() => verDetallesAlianza(alianza.id)}
                            className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition duration-200"
                        >
                            <h2 className="text-xl font-semibold">{alianza.name}</h2>
                            <p className="text-gray-400">{alianza.descripcion}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No hay alianzas disponibles.</p>
                )}
            </div>

                                {/* Proyectos */}
                <div className="flex-grow mt-10 px-4">
                        <h2 className="text-3xl font-bold text-center text-green-400 mb-8">Proyectos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {proyectos.map((project) => (
                                <div key={project.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                                    <h3 className="text-xl font-semibold text-white mb-3">{project.nombre}</h3>
                                    <p className="text-gray-400 break-words">{project.descripcion}</p>
                                </div>
                            ))}
                        </div>
                    </div>

            {/* Navegación */}
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
    );
};

export default ListaAlianzas;
