"use client";

import { AiFillHome } from "react-icons/ai";
import { IoMdNotifications } from "react-icons/io";
import { BsPlusCircle } from "react-icons/bs";
import { FaUserAstronaut } from 'react-icons/fa';  
import { useRouter } from 'next/navigation';
import TasksTable from '../../components/TasksTable';


const UserAlianza = () => {
    const router = useRouter();

    const alianzaData = {
        image: "https://media.licdn.com/dms/image/v2/C5112AQGo5l3-KAnMDA/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1520179677776?e=2147483647&v=beta&t=OdR4prUuAWvXWcFKZJJwk8GbJD5vTgdW15QLMz4liiE",
        name: "Desarrollo Sostenible",
        text: "Nuevo proyecto de infraestructura e innovación enfocado en el desarrollo sostenible...",
        allies: [
            {
                id: 1,
                name: "James",
                avatar: "https://portal.bilardo.gov.tr/assets/pages/media/profile/profile_user.jpg",
                categories: ["Diseñador", "Ingeniero Industrial"]
            },
            {
                id: 2,
                name: "Ana",
                avatar: "https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?b=1&s=612x612&w=0&k=20&c=hEPh7-WEAqHTHdQtPrfEN9-yYCiPGKvD32VZ5lcL6SU=",
                categories: ["Arquitecto", "Ambientalista"]
            },
        ],
        projects: [
            {
                id: 1,
                title: "Innovación Energética",
                descripcion: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos reprehenderit, aperiam omnis maxime nesciunt, distinctio neque maiores in blanditiis minus error. Ratione, dolorum. Saepe laudantium eligendi ratione dolore, suscipit iusto!",
            },
            {
                id: 2,
                title: "Conservación del Agua",
                descripcion: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos reprehenderit, aperiam omnis maxime nesciunt, distinctio neque maiores in blanditiis minus error. Ratione, dolorum. Saepe laudantium eligendi ratione dolore, suscipit iusto!",
            },
        ],
        tasks: [
            {
                name: "Diseñar interfaz",
                assignee: "James",
                status: "En progreso"
            },
            {
                name: "Implementar backend",
                assignee: "Ana",
                status: "En progreso"
            },
            {
                name: "Pruebas de funcionalidad",
                assignee: "James",
                status: "Completado"
            }
        ]
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">
            <div className="flex-grow">
                <div className="flex flex-col items-center py-10 px-4">
                    {/* Parte superior con la imagen, nombre y texto */}
                    <div className="relative w-full h-96">
                        <img
                            src={alianzaData.image}
                            alt="Imagen del proyecto"
                            className="w-full h-full object-cover rounded-b-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center">
                            <h1 className="text-4xl font-bold text-green-400 mb-2">{alianzaData.name}</h1>
                            <p className="max-w-2xl text-center text-gray-300">{alianzaData.text}</p>
                        </div>
                    </div>

                    {/* Aliados */}
                    <div className="max-w-4xl w-full bg-gray-800 rounded-lg p-6 shadow-lg mt-10">
                        <h2 className="text-2xl text-green-400 font-semibold mb-6 text-center">Aliados</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {alianzaData.allies.map((allie) => (
                                <div key={allie.id} className="bg-gray-700 p-4 rounded-lg">
                                    <img
                                        src={allie.avatar}
                                        alt={allie.name}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                    <p className="text-lg font-medium mb-2">{allie.name}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {allie.categories.map((category, index) => (
                                            <span
                                                key={index}
                                                className="bg-green-500 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold"
                                            >
                                                {category}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Proyectos */}
                    <div className="flex-grow mt-10 px-4">
                        <h2 className="text-3xl font-bold text-center text-green-400 mb-8">Proyectos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {alianzaData.projects.map((project) => (
                                <div key={project.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                                    <h3 className="text-xl font-semibold text-white mb-3">{project.title}</h3>
                                    <p className="text-gray-400">{project.descripcion}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tareas */}
                    <div className="flex-grow mt-10 px-4">
                        <h2 className="text-3xl font-bold text-center text-green-400 mb-8">Tareas</h2>
                        <TasksTable tasks={alianzaData.tasks} />
                    </div>
                </div>
            </div>

            {/* Navegación */}
            <nav className="fixed bottom-0 w-full bg-neutral-900 py-2 flex justify-around items-center">
                <button onClick={() => router.push('/user/feed')}><AiFillHome size={24} /></button>
                <button onClick={() => router.push('/user/post')}><BsPlusCircle size={24} /></button>
                <button onClick={() => router.push('/user/alianza')}><IoMdNotifications size={24} /></button>
                <button onClick={() => router.push('/user/profile')}><FaUserAstronaut size={24} /></button>
            </nav>
        </div>
    );
};

export default UserAlianza;