// pages/user/profile.tsx
'use client';
import { useState, useEffect } from 'react';
import { AiFillHome } from 'react-icons/ai';
import { IoMdNotifications } from 'react-icons/io';
import { BsPlusCircle } from 'react-icons/bs';
import { FaUserAstronaut } from 'react-icons/fa';
import AlliesSection from '../../components/AlliesSection';
import { useRouter } from 'next/navigation';

interface Post {
  id: number;
  text: string;
  image: string;
  categories: string[];
}

interface UserProfileData {
  avatar: string;
  name: string;
  bio: string;
  posts: Post[];
  allies: { avatar: string }[];
}

export default function UserProfile() {
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:8080/user/profile');
        if (!response.ok) throw new Error('Error al cargar el perfil');
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) return <div>Cargando perfil...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white relative">
      <button
        onClick={() => {
          localStorage.removeItem('token');
          router.push('/auth/login');
        }}
        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
      >
        Cerrar sesión
      </button>

      <div className="flex flex-col items-center py-10 px-4">
        {/* Información del usuario */}
        <div className="flex items-center bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-2xl mb-6">
          <img
            src={userData?.avatar}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-4 border-green-500 object-cover mr-6"
          />
          <div>
            <h1 className="text-2xl font-semibold text-green-400">{userData?.name}</h1>
            <p className="text-gray-300 mt-2">{userData?.bio}</p>
          </div>
        </div>

        {/* Sección de aliados y botón "Crear Proyecto" */}
        <div className="flex items-center mb-8">
          <h2 className="text-xl font-semibold text-green-400 mr-4">Tus Aliados</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full font-semibold mr-4">
            Crear proyecto
          </button>
          {userData?.allies.slice(0, 3).map((ally, index) => (
            <img
              key={index}
              src={ally.avatar}
              alt="Ally Avatar"
              className="w-10 h-10 rounded-full border-2 border-green-500 mr-2"
            />
          ))}
        </div>

        {/* Área de Publicaciones (actualizada) */}
        <div className="max-w-4xl w-full bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl text-green-400 font-semibold mb-6 text-center">Mis publicaciones</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {userData?.posts.map((post) => (
              <div key={post.id} className="bg-gray-900 p-4 rounded-lg shadow-lg">
                {/* Imagen de la publicación */}
                <img
                  src={post.image}
                  alt={`Post ${post.id}`}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                {/* Texto de la publicación */}
                <p className="text-lg font-medium mb-2 text-gray-300">{post.text}</p>
                {/* Categorías de ODS */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.categories.map((category, index) => (
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
      </div>

      {/* Barra de navegación */}
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
            className="text-gray-500 group-hover:text-blue-500 group-active:text-blue-700 transition duration-300 ease-in-out"
            size={24}
          />
        </button>

        <button className="group relative" onClick={() => router.push('/user/profile')}>
          <FaUserAstronaut
            className="text-blue-500 group-hover:text-blue-500 group-active:text-blue-700 transition duration-300 ease-in-out"
            size={24}
          />
        </button>
      </nav>
    </div>
  );
}
