'use client';
import { IoMdNotifications } from "react-icons/io";
import { BsPlusCircle } from "react-icons/bs";
import { AiFillHome, AiOutlineTeam } from 'react-icons/ai'; // Importa AiOutlineTeam para Alianza
import AlliesSection from '../../components/AlliesSection';
import { FaUserAstronaut } from 'react-icons/fa';  
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';

// Define la estructura de userData
interface Publicaciones {
  id: number;
  contenido: string;
  imagenURL: string;
  categories: string[]; 
  autor: UserData;
}

interface Ally {
  avatar: string;
}

interface UserData {
  id: number;
  avatar: string;
  nombre: string;
  publicaciones: Publicaciones[];
  allies: Ally[];
}




const UserProfile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  // Realizar la petición al backend cuando el componente se monta
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const match = token && token.match(/"id":(\d+)/);
      const userId = match ? match[1] : null;

      fetch(`http://localhost:8080/usuario/${userId}`)
        .then((response) => {
          if (!response.ok) {

            throw new Error('Error al obtener los datos del usuario');
            
          }
          return response.json();
        })
        .then((data) => setUserData(data))
        .catch((error) => console.error('Error:', error));
    }
  }, []);
  console.log(userData)


  const handleLogout = () => {
    Swal.fire({
      icon: 'question',
      title: '¿Seguro que quieres cerrar sesión?',
      showCancelButton: true,
      confirmButtonText: 'Cerrar sesión',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        router.push('/auth/login');
      }
    });
  };

  if (!userData) {
    return <div className="text-center text-white">Cargando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white relative">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
      >
        Cerrar sesión
      </button>
      <div className="flex-grow">
        <div className="flex flex-col items-center py-10 px-4">
          <div className="max-w-4xl w-full bg-gray-800 rounded-lg p-6 shadow-lg mb-10">
            <div className="flex items-center mb-6">
              <button onClick={() => router.push('/user/profile/update')}>
                <img
                  src={userData.avatar}
                  alt="User Avatar"
                  className="w-32 h-32 rounded-full border-4 border-green-500 mr-6 object-cover cursor-pointer"
                />
              </button>
              <div>
                <h1 className="text-3xl font-semibold text-green-400">
                  {userData.nombre}
                </h1>
                <p className="text-lg text-gray-300 mt-2">{}</p>
              </div>
            </div>
          </div>

          <AlliesSection allies={userData.allies || []} />

          <div className="max-w-4xl w-full bg-gray-800 rounded-lg p-6 shadow-lg mt-10">
            <h2 className="text-2xl text-green-400 font-semibold mb-6 text-center">
              Mis publicaciones
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {(userData.publicaciones || []).map((post) => (
                <div key={post.id} className="bg-gray-700 p-4 rounded-lg">
                  <img
                    src={post.imagenURL}
                    alt={`Post ${post.id}`}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <p className="text-lg font-medium mb-2">{post.contenido}</p>
                  <div className="flex flex-wrap gap-2">
                    {/* {post.categories.map((category, index) => (
                      <span
                        key={index}
                        className="bg-green-500 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold"
                      >
                        {category}
                      </span>
                    ))} */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 w-full bg-neutral-900 py-2 flex justify-around items-center">
        <button className="group relative" onClick={() => router.push('/user/feed')}>
          <AiFillHome className="text-gray-500 group-hover:text-blue-500 transition duration-300" size={24} />
        </button>
        <button className="group relative" onClick={() => router.push('/user/post')}>
          <BsPlusCircle className="text-gray-500 group-hover:text-blue-500 transition duration-300" size={24} />
        </button>
        <button className="group relative" onClick={() => router.push('/user/eleccionalianza')}>
          <AiOutlineTeam className="text-gray-500 group-hover:text-blue-500 transition duration-300" size={24} />
        </button>
        <button className="group relative" onClick={() => router.push('/user/profile')}>
          <FaUserAstronaut className="text-blue-500 transition duration-300" size={24} />
        </button>
      </nav>
    </div>
  );
};

export default UserProfile;
