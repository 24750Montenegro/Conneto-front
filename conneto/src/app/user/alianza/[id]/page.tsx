'use client'
import Swal from 'sweetalert2';
import { AiFillHome, AiOutlineTeam } from "react-icons/ai"; // Iconos de navegación
import { BsPlusCircle } from "react-icons/bs";// Iconos de navegación
import { FaUserAstronaut, FaPlus, FaMinus } from "react-icons/fa"; // Iconos + y -
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ModalForm from "../../../components/ModalForm"; // Importamos el modal

// Interfaces
interface Usuario {
    id: number;
    nombre: string;
    avatar: string;
}

interface Proyecto {
    id: number;
    nombre: string;
    descripcion: string;
}

interface Alianza {
    image: string;
    name: string;
    descripcion: string;
    usuarios: Usuario[];
    proyectos: Proyecto[];
}

/**
 * 
 * Obtener la alianza
 */
const MostrarAlianza = () => {
    const router = useRouter();
    const { id } = useParams();
    const [alianzaData, setAlianzaData] = useState<Alianza | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isMember, setIsMember] = useState<boolean>(false);
    const [usuarioId, setUsuarioId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Estado para el modal

    /**
     * 
     * Buscar la alianza espesifica
     */
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
            const token = localStorage.getItem("token");
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

    //Almacena los datos de la alianza
    useEffect(() => {
        fetchAlianzaData();
    }, [id]);


    //handle para unirse o salirse de una alianza
    const handleJoinOrLeave = async () => {
        if (!usuarioId) return;
        const url = `http://localhost:8080/alianza/${id}/${isMember ? "salir" : "unirse"}/${usuarioId}`;
        const method = isMember ? "DELETE" : "POST";

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

    //handle para crear un proyecto ligado a la alianza
    const handleCrearProyecto = async (nuevoProyecto: { nombre: string; descripcion: string; ods: string[] }) => {
        try {
            const response = await fetch(`http://localhost:8080/Proyecto/${id}/crearProyecto`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: nuevoProyecto.nombre,
                    descripcion: nuevoProyecto.descripcion,
                    ods: nuevoProyecto.ods,
                }),
            });

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Proyecto creado exitosamente",
                    text: "El proyecto ha sido agregado a la alianza.",
                });
                fetchAlianzaData(); // Refrescar la lista de proyectos
                setIsModalOpen(false); // Cerrar el modal
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error al crear proyecto",
                    text: "Hubo un problema al guardar el proyecto.",
                });
            }
        } catch (error) {
            console.error("Error al crear proyecto:", error);
            Swal.fire({
                icon: "error",
                title: "Error de red",
                text: "Ocurrió un error al intentar crear el proyecto.",
            });
        }
    };


    const verDetallesProyecto = (id: number, nombre: string) => {
        router.push(`/user/proyecto/${nombre}/${id}`);
    };
    //Muestra Cargando... mientras se cargan los datos de alianza
    if (!alianzaData) {
        return <p>{error || "Cargando..."}</p>;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">
            <div className="flex-grow">
                <div className="flex flex-col items-center py-10 px-4">

                    {/* Información de la alianza */}
                    <div className="relative w-full h-96">
                        {/*Imagen de la alianza*/}
                        <img
                            src={alianzaData.image}
                            alt="Imagen del proyecto"
                            className="w-full h-full object-cover rounded-b-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center">
                            {/*Titulo de la alianza*/}
                            <h1 className="text-4xl font-bold text-green-400 mb-2">{alianzaData.name}</h1>
                            {/*Descripcion de la alianza*/}
                            <p className="max-w-2xl text-center text-gray-300">{alianzaData.descripcion}</p>
                        </div>
                    </div>

                    {/* Lista de Aliados con el Botón de Unirse/Salir */}
                    <div className="max-w-4xl w-full bg-gray-800 rounded-lg p-6 shadow-lg mt-10 relative">
                        <h2 className="text-2xl text-green-400 font-semibold mb-6 text-center">Aliados</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {alianzaData.usuarios.map((allie: Usuario) => (
                                <div key={allie.id} className="bg-gray-700 p-4 rounded-lg">
                                    {/*avatar del usuario*/}
                                    <img
                                        src={allie.avatar}
                                        alt={allie.nombre}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                    {/*Nombre del usuario*/}
                                    <p className="text-lg font-medium mb-2">{allie.nombre}</p>
                                </div>
                            ))}
                        </div>

                        {/* Botón de Unirse/Salir */}
                        <button
                            onClick={handleJoinOrLeave}
                            className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center ${isMember ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                                } text-white transition duration-200`}
                            aria-label={isMember ? "Salir de la Alianza" : "Unirse a la Alianza"}
                        >
                            {isMember ? <FaMinus /> : <FaPlus />}
                        </button>
                    </div>

                    {/* Proyectos */}
                    <div className="flex-grow mt-10 px-4 max-w-4xl w-full">
                        <h2 className="text-3xl font-bold text-center text-green-400 mb-8">Proyectos</h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mb-6"
                        >
                            Crear Proyecto
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {alianzaData.proyectos.map((project: Proyecto) => (
                                <div key={project.id} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-600" onClick={() => verDetallesProyecto(project.id, project.nombre)}>
                                    <h3 className="text-xl font-semibold text-white mb-3">{project.nombre}</h3>
                                    {/*Descripcion del proyecto*/}
                                    <p className="text-gray-400">{project.descripcion}</p>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>

            {/* Modal */}
            {/*Form para crear proyecto*/}
            <ModalForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCrearProyecto} 
            />



            {/* Navegación */}
            <nav className="fixed bottom-0 w-full bg-neutral-900 py-2 flex justify-around items-center">
                {/*feed*/}
                <button className="group relative" onClick={() => router.push("/user/feed")}>
                    <AiFillHome
                        className="text-gray-500 group-hover:text-blue-500 group-active:text-blue-700 transition duration-300 ease-in-out"
                        size={24}
                    />
                </button>

                {/*post(crear publicacion)*/}
                <button className="group relative" onClick={() => router.push("/user/post")}>
                    <BsPlusCircle
                        className="text-gray-500 group-hover:text-blue-500 group-active:text-blue-700 transition duration-300 ease-in-out"
                        size={24}
                    />
                </button>

                {/*eleccion alianza*/}
                <button className="group relative" onClick={() => router.push("/user/eleccionalianza")}>
                    <AiOutlineTeam
                        className="text-blue-500 transition duration-300"
                        size={24}
                    />
                </button>

                {/*profile*/}
                <button className="group relative" onClick={() => router.push("/user/profile")}>
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
