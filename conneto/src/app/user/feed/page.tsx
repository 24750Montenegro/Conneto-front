'use client'
import Head from 'next/head';
import { useState, useEffect } from 'react'; // Importar el hook useState para el manejo de estado
import { FaHeart, FaComment, FaLink } from 'react-icons/fa';
import { AiFillHome } from 'react-icons/ai';   // Icono para Home
import { BsPlusCircle } from 'react-icons/bs'; // Icono para Plus con Círculo
import { FaUserAstronaut } from 'react-icons/fa';   
import { IoMdNotifications } from 'react-icons/io'; // Icono para Notificaciones
import  AlliesSection  from '../../components/AlliesSection'
import { useRouter } from 'next/navigation';

// Definir el tipo de activeComments
interface ActiveCommentsState {
  [key: number]: boolean;  // Las claves son números (post.id) y los valores son booleanos
}

interface Comment {
  id: number;
  username: string;
  text: string;
}

interface User {
  id: number;
  avatar: string;
  nombre: string;

}

interface Post {
  id: number;
  time: string;
  contenido: string;
  imagenURL: string; // Asegúrate de que esto coincide con la propiedad de tu API
  comments: Comment[];
  autor: User;
}

export default function Feed() {
  const router = useRouter();

  // Estado para controlar si se muestran los comentarios de cada post
  const [activeComments, setActiveComments] = useState<ActiveCommentsState>({}); // Se inicializa como un objeto vacío
  const [posts, setPosts] = useState<Post[]>([]); // Estado para almacenar las publicaciones
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8080/publicaciones/todas'); // Cambia a tu URL real
        if (!response.ok) {
          throw new Error('Error al obtener las publicaciones');
        }
        const data = await response.json(); // Convertir la respuesta a JSON
        setPosts(data); // Actualizar el estado con las publicaciones
        console.log(data)
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    fetchPosts();
  }, []); // El array vacío significa que este efecto se ejecuta una vez al montar el componente

  if (loading) {
    return <div>Cargando publicaciones...</div>; // Mensaje de carga
  }



  // Función para alternar el menú de comentarios
  const toggleComments = (postId: number) => {
    console.log(`Toggling comments for post ${postId}`); // Para verificar si se activa correctamente
    setActiveComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId], // Cambia el valor booleano del postId
    }));
  };

  return (
    <>
      <Head>
        <title>Feed</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800">
        <header className="p-4 text-center">
          <h1 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl"><span className=" text-transparent bg-clip-text bg-gradient-to-r to-green-400 from-emerald-800">Conneto</span></h1>
        </header>

        <AlliesSection allies={posts} />


        <section className="mt-6 space-y-6 grid items-center justify-center mb-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-gray-900 bg-zinc-900 p-4 rounded-3xl shadow-lg max-w-xl w-full">
              <div className="flex items-center space-x-4">
               
              </div> 
              <img
                className="w-full h-full object-cover rounded-xl mt-2"
                src={post.imagenURL}
                alt="Post image"
              />
              <p className="text-gray-300 mt-2">{post.contenido} </p>
             
              <img
                  className="w-10 h-10 rounded-full object-cover	"
                  src={post.autor.avatar}
                  alt={`${post.autor.nombre}'s avatar`}
                />
               
                <div className="flex items-center justify-between">
                    <div className="flex-grow">
                        <p className="text-white font-semibold">{post.autor.nombre} <span className="text-blue-500">✔</span></p>
                        <p className="text-gray-500 text-sm">{post.time}</p>
                    </div>
                    <div className="flex space-x-4 items-center">
                      <button className='group relative active'>
                        <FaHeart  className="text-gray-500 group-hover:text-pink-500 group-active:text-pink-700 transition duration-300 ease-in-out"
                        size={24} />
                      </button>
                    <button className='group relative' onClick={() => toggleComments(post.id)}>
                      <FaComment className="text-gray-500 group-hover:text-green-400 group-active:text-emerald-700 transition duration-300 ease-in-out"
                      size={24} />
                    </button>
                    <button className='group relative'>
                      <FaLink  className="text-gray-500 group-hover:text-blue-500 group-active:text-blue-700 transition duration-300 ease-in-out"
                      size={24} />
                    </button>
                    
                    </div>
                </div>

              {/* Renderizar los comentarios si están activos */}
              {activeComments[post.id] && post.comments && post.comments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-800 p-2 rounded-lg">
                      <p className="text-sm text-gray-400">
                        <span className="font-bold text-white">{comment.username}:</span> {comment.text}
                      </p>
                    </div>
                  ))}
                  {/* Caja de texto para agregar nuevo comentario */}
                  <div className="mt-4">
                    <textarea
                      className="w-full bg-gray-800 text-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Escribe un comentario..."
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>

        <nav className="fixed bottom-0 w-full bg-neutral-900 py-2 flex justify-around items-center">
        <button className="group relative">
            <AiFillHome
              className="text-blue-500 group-hover:text-blue-500 group-active:text-blue-700 transition duration-300 ease-in-out"
              size={24}
            />
          </button>

          <button className="group relative" onClick={() =>   router.push('/user/post')}>
            <BsPlusCircle
              className="text-gray-500 group-hover:text-blue-500 group-active:text-blue-700 transition duration-300 ease-in-out"
              size={24}
            />
          </button>

          <button className="group relative" onClick={() =>   router.push('/user/alianza')}>
            <IoMdNotifications
              className="text-gray-500 group-hover:text-blue-500 group-active:text-blue-700 transition duration-300 ease-in-out"
              size={24}
            />
          </button>

          <button className="group relative" onClick={() =>   router.push('/user/profile')}>
            <FaUserAstronaut
              className="text-gray-500 group-hover:text-blue-500 group-active:text-blue-700 transition duration-300 ease-in-out"
              size={24}
            />
          </button>

        </nav>
      </div>
    </>
  );
}
