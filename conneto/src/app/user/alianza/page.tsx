"use client";

import { AiFillHome } from "react-icons/ai";
import { IoMdNotifications } from "react-icons/io";
import { BsPlusCircle } from "react-icons/bs";
import { FaUserAstronaut } from 'react-icons/fa';  
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

//Definir estruccura de alianza
interface Usuario {
    id: number;
    name: string;
    avatar: string;
    categories: string[];
}

interface Proyecto {
    id: number;
    title: string;
    descripcion: string;
}

interface AlianzaData {
    image: string;
    name: string;
    descripcion: string;
    usuarios: Usuario[];
    proyectos: Proyecto[];
}


const UserAlianza = () =>{
    const router = useRouter();
    const [alianzaData, setAlianzaData] = useState<AlianzaData | null>(null);

    useEffect(() => {
        obtenerAlianzas();
    }, []);

    const obtenerAlianzas = async () => {
        try {
            const response = await fetch("http://localhost:8080/alianza");
            const data: AlianzaData[] = await response.json();
            setAlianzaData(data[0]); // Asume que quieres la primera alianza de la lista
        } catch (error) {
            console.error("Error al obtener alianzas:", error);
        }
    };

    if (!alianzaData) return <div>Loading...</div>;


    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">
            <div className="flex-grow">
                <div className="flex flex-col items-center py-10 px-4">

                    {/* Parte superior con la imagen, nombre y texto */}
                    <div className="relative w-full h-96">
                        {/* Renderiza la imagen y el nombre directamente desde alianzaData */}
                        <img src={alianzaData.image || 'default-image-url.jpg'} alt="Imagen del proyecto" className="w-full h-full object-cover rounded-b-lg" />
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center">
                            <h1 className="text-4xl font-bold text-green-400 mb-2">{alianzaData.name}</h1>
                            <p className="max-w-2xl text-center text-gray-300">{alianzaData.descripcion}</p>
                        </div>
                    </div>

                    {/* Publicaciones del usuario */}
                    <div className="max-w-4xl w-full bg-gray-800 rounded-lg p-6 shadow-lg mt-10">
                        <h2 className="text-2xl text-green-400 font-semibold mb-6 text-center">
                            Aliados
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {alianzaData.usuarios.map((usuario) => (
                                <div key={usuario.id} className="bg-gray-700 p-4 rounded-lg">
                                    <img src={usuario.avatar || 'default-avatar-url.jpg'} alt={`Post ${usuario.id}`} className="w-full h-48 object-cover rounded-lg mb-4" />
                                    <p className="text-lg font-medium mb-2">{usuario.name}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {usuario.categories.map((category, index) => (
                                            <span key={index} className="bg-green-500 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                                                {category}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* Sección de proyectos */}
                    <div className="flex-grow mt-10 px-4">
                        <h2 className="text-3xl font-bold text-center text-green-400 mb-8">Proyectos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {alianzaData.proyectos.map((proyecto) => (
                                <div key={proyecto.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                                    <h3 className="text-xl font-semibold text-white mb-3">{proyecto.title}</h3>
                                    <p className="text-gray-400">{proyecto.descripcion}</p>
                                </div>
                            ))}
                        </div>
                    </div>


                </div>
            </div>

            

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

                <button className="group relative" onClick={() => router.push('/user/alianza')}>
                    <IoMdNotifications
                        className="text-blue-500 group-hover:text-blue-500 group-active:text-blue-700 transition duration-300 ease-in-out"
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

export default UserAlianza;