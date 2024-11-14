'use client'
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { FaHeart, FaComment, FaLink } from 'react-icons/fa';
import { AiFillHome } from 'react-icons/ai';
import { BsPlusCircle } from 'react-icons/bs';
import { FaUserAstronaut } from 'react-icons/fa';
import { IoMdNotifications } from 'react-icons/io';
import AlliesSection from '../../components/AlliesSection';
import { useRouter } from 'next/navigation';

interface ActiveCommentsState {
  [key: number]: boolean;
}

interface Comment {
  id: number;
  username: string;
  text: string;
}

interface LikeUser {
  id: number;
  nombre: string;
  email: string;
}

interface User extends LikeUser {
  avatar: string;
}

interface Post {
  id: number;
  time: string;
  contenido: string;
  imagenURL: string;
  comments: Comment[];
  autor: User;
  likes: LikeUser[];
}

export default function Feed() {
  const router = useRouter();
  const [activeComments, setActiveComments] = useState<ActiveCommentsState>({});
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  useEffect(() => {
    // Obtener el usuarioId desde el token
    const token = localStorage.getItem('token');
    const match = token ? token.match(/"id":(\d+)/) : null;
    setUsuarioId(match ? parseInt(match[1]) : null);

    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8080/publicaciones/todas');
        if (!response.ok) {
          throw new Error('Error al obtener las publicaciones');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const toggleLike = async (postId: number) => {
    if (!usuarioId) {
      console.error('No se pudo obtener el ID del usuario desde el token.');
      return;
    }
  
    // Verificamos si el usuario ya dio like
    const userAlreadyLiked = posts.find((post) => post.id === postId)?.likes.some((user) => user.id === usuarioId);
  
    try {
      const response = await fetch(`http://localhost:8080/publicaciones/${postId}/like/${usuarioId}`, {
        method: userAlreadyLiked ? 'DELETE' : 'POST',  // Usamos DELETE si ya dio like, POST si no ha dado like
        headers: {
          'Content-Type': 'application/json',
        }
       });
  
      if (!response.ok) {
        throw new Error('Error al dar/retirar like');
      }
  
      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          // Actualizamos los likes según el estado actual
          const updatedLikes = userAlreadyLiked
            ? post.likes.filter((user) => user.id !== usuarioId) // Eliminar like
            : [...post.likes, { id: usuarioId, nombre: 'TuNombre', email: 'TuEmail' }]; // Agregar like
  
          return { ...post, likes: updatedLikes };
        }
        return post;
      });
  
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
 

  if (loading) {
    return <div>Cargando publicaciones...</div>;
  }

  const toggleComments = (postId: number) => {
    setActiveComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  return (
    <>
      <Head>
        <title>Feed</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800">
        <header className="p-4 text-center">
          <h1 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-green-400 from-emerald-800">Conneto</span>
          </h1>
        </header>

        <AlliesSection allies={posts} />

        <section className="mt-6 space-y-6 grid items-center justify-center mb-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-gray-900 bg-zinc-900 p-4 rounded-3xl shadow-lg max-w-xl w-full">
              <img
                className="w-full h-full object-cover rounded-xl mt-2"
                src={post.imagenURL}
                alt="Post image"
              />
              <p className="text-gray-300 mt-2">{post.contenido}</p>
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={post.autor.avatar}
                alt={`${post.autor.nombre}'s avatar`}
              />

              <div className="flex items-center justify-between">
                <div className="flex-grow">
                  <p className="text-white font-semibold">{post.autor.nombre} <span className="text-blue-500">✔</span></p>
                  <p className="text-gray-500 text-sm">{post.time}</p>
                </div>
                <div className="flex space-x-4 items-center">
                  <button onClick={() => toggleLike(post.id)} className="group relative active flex items-center">
                    <FaHeart
                      className={`text-gray-500 group-hover:text-pink-500 ${usuarioId && post.likes.some((user) => user.id === usuarioId) ? 'text-pink-500' : ''} transition duration-300 ease-in-out`}
                      size={24}
                    />
                    <span className="ml-2 text-gray-400">{post.likes.length}</span>
                  </button>
                  <button onClick={() => toggleComments(post.id)} className="group relative">
                    <FaComment
                      className="text-gray-500 group-hover:text-green-400 group-active:text-emerald-700 transition duration-300 ease-in-out"
                      size={24}
                    />
                  </button>
                  <button className="group relative">
                    <FaLink
                      className="text-gray-500 group-hover:text-blue-500 group-active:text-blue-700 transition duration-300 ease-in-out"
                      size={24}
                    />
                  </button>
                </div>
              </div>

              {activeComments[post.id] && post.comments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-800 p-2 rounded-lg">
                      <p className="text-sm text-gray-400">
                        <span className="font-bold text-white">{comment.username}:</span> {comment.text}
                      </p>
                    </div>
                  ))}
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
            <AiFillHome className="text-blue-500 group-hover:text-blue-500 group-active:text-blue-700 transition duration-300 ease-in-out" size={24} />
          </button>
          <button className="group relative" onClick={() => router.push('/user/post')}>
            <BsPlusCircle className="text-gray-500 group-hover:text-blue-500 group-active:text-blue-700 transition duration-300 ease-in-out" size={24} />
          </button>
          <button className="group relative" onClick={() => router.push('/user/alianza')}>
            <IoMdNotifications className="text-gray-500 group-hover:text-blue-500 group-active:text-blue-700 transition duration-300 ease-in-out" size={24} />
          </button>
          <button className="group relative" onClick={() => router.push('/user/profile')}>
            <FaUserAstronaut className="text-gray-500 group-hover:text-blue-500 group-active:text-blue-700 transition duration-300 ease-in-out" size={24} />
          </button>
        </nav>
      </div>
    </>
  );
}
