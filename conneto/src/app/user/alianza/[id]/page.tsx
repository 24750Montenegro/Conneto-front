"use client";

import { AiFillHome, AiOutlineTeam } from 'react-icons/ai'; // Importa AiOutlineTeam para Alianza
import { BsPlusCircle } from "react-icons/bs";
import { FaUserAstronaut, FaPlus, FaMinus } from 'react-icons/fa';  // Iconos de + y -
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Usuario {
    id: number;
    name: string;
    avatar: string;
}

interface Proyecto {
    id: number;
    title: string;
    descripcion: string;
}

interface Alianza {
    image: string;
    name: string;
    descripcion: string;
    usuarios: Usuario[];
    proyectos: Proyecto[];
}

const MostrarAlianza = () => {
    const router = useRouter();
    const { id } = useParams(); 
    const [alianzaData, setAlianzaData] = useState<Alianza | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isMember, setIsMember] = useState<boolean>(false);
    const [usuarioId, setUsuarioId] = useState<number | null>(null);

    const fetchAlianzaData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/alianza/${id}`);
            if (!response.ok) {
                setError("Error: No se pudo obtener la alianza. Verifica el ID o la conexión.");
                return;
            }

            const data: Alianza = await response.json();
            setAlianzaData(data);

            // Obtener el id del usuario desde el token (simulado aquí para simplificación)
            const token = localStorage.getItem('token');
            const match = token ? token.match(/"id":(\d+)/) : null;
            const userId = match ? parseInt(match[1], 10) : null;
            setUsuarioId(userId);

            if (userId && data.usuarios.some((user) => user.id === userId)) {
                setIsMember(true);
            }
        } catch (error) {
            console.error("Error fetching alianza:", error);
            setError("Ocurrió un error al intentar obtener los datos de la alianza.");
        }
    };

    useEffect(() => {
        fetchAlianzaData();
    }, [id]);

    const handleJoinOrLeave = async () => {
        if (!usuarioId) return;
        const url = `http://localhost:8080/alianza/${id}/${isMember ? 'salir' : 'unirse'}/${usuarioId}`;
        const method = isMember ? 'DELETE' : 'POST';

        try {
            const response = await fetch(url, { method });
            if (response.ok) {
                setIsMember(!isMember);
                await fetchAlianzaData(); // Actualizamos los datos de la alianza
            } else {
                setError("Error al intentar cambiar el estado de membresía.");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            setError("Ocurrió un error al intentar unirse/salir de la alianza.");
        }
    };

    if (!alianzaData) {
        return <p>{error || "Cargando..."}</p>;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">
            <div className="flex-grow">
                <div className="flex flex-col items-center py-10 px-4">
                    {/* Información de la alianza */}
                    <div className="relative w-full h-96">
                        <img
                            src={alianzaData.image}
                            alt="Imagen del proyecto"
                            className="w-full h-full object-cover rounded-b-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center">
                            <h1 className="text-4xl font-bold text-green-400 mb-2">{alianzaData.name}</h1>
                            <p className="max-w-2xl text-center text-gray-300">{alianzaData.descripcion}</p>
                        </div>
                    </div>

                    {/* Lista de Aliados con el Botón de Unirse/Salir */}
                    <div className="max-w-4xl w-full bg-gray-800 rounded-lg p-6 shadow-lg mt-10 relative">
                        <h2 className="text-2xl text-green-400 font-semibold mb-6 text-center">Aliados</h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {alianzaData.usuarios.map((allie: Usuario) => (
                                <div key={allie.id} className="bg-gray-700 p-4 rounded-lg">
                                    <img
                                        src={allie.avatar}
                                        alt={allie.name}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                    <p className="text-lg font-medium mb-2">{allie.name}</p>
                                </div>
                            ))}
                        </div>

                        {/* Botón de Unirse/Salir */}
                        <button
                            onClick={handleJoinOrLeave}
                            className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center ${
                                isMember ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                            } text-white transition duration-200`}
                            aria-label={isMember ? 'Salir de la Alianza' : 'Unirse a la Alianza'}
                        >
                            {isMember ? <FaMinus /> : <FaPlus />}
                        </button>
                    </div>

                    {/* Proyectos */}
                    <div className="flex-grow mt-10 px-4 max-w-4xl w-full">
                        <h2 className="text-3xl font-bold text-center text-green-400 mb-8">Proyectos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {alianzaData.proyectos.map((project: Proyecto) => (
                                <div key={project.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                                    <h3 className="text-xl font-semibold text-white mb-3">{project.title}</h3>
                                    <p className="text-gray-400">{project.descripcion}</p>
                                </div>
                            ))}
                        </div>
                    </div>
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

export default MostrarAlianza;
