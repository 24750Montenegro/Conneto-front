"use client";


import { BsPlusCircle } from "react-icons/bs";// Iconos de navegación
import { FaUserAstronaut } from 'react-icons/fa';// Iconos de navegación
import { AiFillHome, AiOutlineTeam } from 'react-icons/ai'; // Iconos de navegación
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// Interfaces
interface AlianzaData {
    id: number;
    name: string;
    descripcion: string;
    image: string;
}

interface ProyectoData {
    id: number;
    nombre: string;
    descripcion: string;
}

//Obtener la lista de alianzas
const ListaAlianzas = () => {
    const router = useRouter();
    const [alianzas, setAlianzas] = useState<AlianzaData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [proyectos, setProyectos] = useState<ProyectoData[]>([]);

    //Almacena las alianzas
    useEffect(() => {
        obtenerAlianzas();
    }, []);

    //Obtener la lista de alianzas
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

    //Redirecciona a newAlianza(para crear una alianza)
    const manejarCrearAlianza = () => {
        router.push('/user/newAlianza');
    };

    //Redirecciona a la alianza elegida
    const verDetallesAlianza = (id: number) => {
        router.push(`/user/alianza/${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
            <h2 className="text-3xl font-semibold text-green-400 mb-6">Lista de Alianzas</h2>

            {/* Boton que redirecciona a newAlianza para crear alianza*/}
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
                            {/* Titula de la Alianza */}
                            <h2 className="text-xl font-semibold">{alianza.name}</h2>
                            {/* Descripcion de la alianza */}
                            <p className="text-gray-400">{alianza.descripcion}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No hay alianzas disponibles.</p>
                )}
            </div>


            {/* Navegación */}
            <nav className="fixed bottom-0 w-full bg-neutral-900 py-2 flex justify-around items-center">

                {/*feed*/}
                <button className="group relative" onClick={() => router.push('/user/feed')}>
                    <AiFillHome
                        className="text-gray-500 group-hover:text-blue-500 group-active:text-blue-700 transition duration-300 ease-in-out"
                        size={24}
                    />
                </button>

                {/*post(crear publicacion)*/}
                <button className="group relative" onClick={() => router.push('/user/post')}>
                    <BsPlusCircle
                        className="text-gray-500 group-hover:text-blue-500 group-active:text-blue-700 transition duration-300 ease-in-out"
                        size={24}
                    />
                </button>

                {/*eleccion alianza*/}
                <button className="group relative" onClick={() => router.push('/user/eleccionalianza')}>
                    <AiOutlineTeam
                        className="text-blue-500 transition duration-300"
                        size={24} /> {/* Usa el icono de apretón de manos */}
                </button>

                {/*profile*/}
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
