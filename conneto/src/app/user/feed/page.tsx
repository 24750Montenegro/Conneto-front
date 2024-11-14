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
import { motion } from 'framer-motion';
import axios from 'axios';

// Interfaces
interface ActiveCommentsState {
  [key: number]: boolean;
}

interface CommentsState {
  [key: number]: Comment[];
}

interface Comment {
  id: number;
  username: string;
  text: string;
  avatar: string; // Añade un campo para el avatar
}

interface Post {
  id: number;
  time: string;
  contenido: string;
  imagenURL: string; 
  comments: Comment[];
  autor: { id: number; avatar: string; nombre: string; };
}

export default function Feed() {
  const router = useRouter();
  const [activeComments, setActiveComments] = useState<ActiveCommentsState>({});
  const [comments, setComments] = useState<CommentsState>({});
  const [newCommentText, setNewCommentText] = useState<{ [key: number]: string }>({});
  // Estado para controlar si se muestran los comentarios de cada post
  const [posts, setPosts] = useState<Post[]>([]); // Estado para almacenar las publicaciones
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  const fetchComments = async (postId: number) => {
    try {
      const response = await axios.get(`http://localhost:8080/comentarios/${postId}?cantidad=3`);
      setComments((prev) => ({
        ...prev,
        [postId]: response.data as Comment[],
      }));
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8080/publicaciones/todas'); // Cambia a tu URL real
        if (!response.ok) throw new Error('Error al obtener las publicaciones');
        const data = await response.json(); // Convertir la respuesta a JSON
        setPosts(data); // Actualizar el estado con las publicaciones
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

  const toggleComments = async (postId: number) => {
    if (!activeComments[postId]) {
      await fetchComments(postId);
    }
    setActiveComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };
  

  const handleAddComment = async (postId: number) => {
    const text = newCommentText[postId]?.trim();
    if (!text) return; // Evita enviar comentarios vacíos

    // Obtén el token del localStorage
    const token = localStorage.getItem('token');
    let idAutor;

    if (token) {
        // Extrae el id del token usando una expresión regular
        const match = token.match(/"id":(\d+)/);
        
        // Si encuentra el id, lo guarda en idAutor
        if (match) {
            idAutor = match[1]; // Captura el id del primer grupo
        }
    }

    // Si no se encontró un id, no envía el comentario
    if (!idAutor) {
        console.error("No se pudo obtener el id del autor");
        return;
    }

    try {
        // Envío de la solicitud para guardar el comentario
        await axios.post("http://localhost:8080/comentarios/guardarComentario", {
            publicacion: { id: postId },
            autor: { id: idAutor }, // Usa el id extraído del token
            contenido: text
        });

        // Limpia el campo de texto después de enviar el comentario
        setNewCommentText((prev) => ({ ...prev, [postId]: '' }));
        fetchComments(postId); // Actualiza los comentarios después de agregar uno nuevo
    } catch (error) {
        console.error("Error al agregar comentario:", error);
    }
  };

  


  return (
    <>
      <Head>
        <title>Feed</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800">
        <header className="p-4 text-center">
          <h1 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-green-400 from-emerald-800">
              Conneto
            </span>
          </h1>
        </header>

        <AlliesSection allies={posts} />


        <section className="mt-6 space-y-6 grid items-center justify-center mb-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-gray-900 bg-zinc-900 p-4 rounded-3xl shadow-lg max-w-xl w-full">
              <img className="w-full h-full object-cover rounded-xl mt-2" src={post.imagenURL} alt="Post image" />
              <p className="text-gray-300 mt-2">{post.contenido}</p>

              <img className="w-10 h-10 rounded-full object-cover" src={post.autor.avatar} alt={`${post.autor.nombre}'s avatar`} />
              <div className="flex items-center justify-between">
                <div className="flex-grow">
                  <p className="text-white font-semibold">{post.autor.nombre} <span className="text-blue-500">✔</span></p>
                  <p className="text-gray-500 text-sm">{post.time}</p>
                </div>
                <div className="flex space-x-4 items-center">
                  <button className='group relative active'>
                    <FaHeart className="text-gray-500 group-hover:text-pink-500 group-active:text-pink-700 transition duration-300 ease-in-out" size={24} />
                  </button>
                  <button className='group relative' onClick={() => toggleComments(post.id)}>
                    <FaComment className="text-gray-500 group-hover:text-green-400 group-active:text-emerald-700 transition duration-300 ease-in-out" size={24} />
                  </button>
                  <button className='group relative'>
                    <FaLink className="text-gray-500 group-hover:text-blue-500 group-active:text-blue-700 transition duration-300 ease-in-out" size={24} />
                  </button>
                </div>
              </div>

              {activeComments[post.id] && comments[post.id] && (
    <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-4 space-y-4"
    >
        {comments[post.id].map((comment) => (
            <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.1 * comment.id }}
                className="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition duration-300 ease-in-out"
            >
                <img 
                    src={comment.avatar || "/default-avatar.jpg"} 
                    alt={`${comment.username}'s avatar`} 
                    className="w-10 h-10 rounded-full object-cover" 
                />
                <div>
                    <p className="text-sm font-semibold text-white">{comment.username}</p>
                    <p className="text-gray-400 text-sm">{comment.text}</p>
                </div>
            </motion.div>
        ))}
        <textarea
            className="w-full p-2 mt-2 text-gray-300 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Escribe un comentario..."
            value={newCommentText[post.id] || ''}
            onChange={(e) => setNewCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))}
        />
        <button
            onClick={() => handleAddComment(post.id)}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
        >
            Guardar comentario
        </button>
    </motion.div>
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

          <button className="group relative" onClick={() =>   router.push('/user/eleccionalianza')}>
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
