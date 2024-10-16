'use client'
import Head from 'next/head';
import { FaHeart, FaComment, FaLink } from 'react-icons/fa';
import { AiFillHome } from 'react-icons/ai';   // Icono para Home
import { BsPlusCircle } from 'react-icons/bs'; // Icono para Plus con Círculo
import { FaUserAstronaut } from 'react-icons/fa';   
import { IoMdNotifications } from 'react-icons/io'; // Icono para Notificaciones
import  AlliesSection  from '../../components/AlliesSection'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Feed() 
{
  const router = useRouter();

  //Estado inicial de los valores como ejemplo
  const [posts, setPosts] = useState([
  {
    id: 1,
    username: "James",
    time: "1 hour ago",
    text: "Nuevo proyecto de infraestructura e innovación enfocado en el desarrollo sostenible...",
    image: "https://media.licdn.com/dms/image/v2/C5112AQGo5l3-KAnMDA/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1520179677776?e=2147483647&v=beta&t=OdR4prUuAWvXWcFKZJJwk8GbJD5vTgdW15QLMz4liiE", // reemplazar con la URL de la imagen real
    avatar: "https://portal.bilardo.gov.tr/assets/pages/media/profile/profile_user.jpg",
  },
  {
    id: 2,
    username: "Anna",
    time: "2 hours ago",
    text: "Increíble proyecto de conservación marina...",
    image: "https://image.isu.pub/140225055437-5426fdab6f7587eb5fd4b7ccedf38aea/jpg/page_1_thumb_large.jpg", 
    avatar: "https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?b=1&s=612x612&w=0&k=20&c=hEPh7-WEAqHTHdQtPrfEN9-yYCiPGKvD32VZ5lcL6SU=",  
  },
  ]);

  // Llamada a la API cuando ya tiene valores
  useEffect(() => 
  {
    const fetchPosts = async () => 
    {
      try 
      {
        const response = await fetch('http://localhost:8080/publicaciones/todas');
        const data = await response.json();

        // Mapea los datos obtenidos y asegúrate de que coincidan con la estructura requerida
        const updatedPosts = data.map((post: { id: any; username: any; time: any; text: any; image: any; avatar: any; }) => (
        {
          id: post.id,
          username: post.username,
          time: post.time,
          text: post.text,
          image: post.image,
          avatar: post.avatar
        }));

        // Actualizar
        setPosts(updatedPosts);
      } 
      catch (error) 
      {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

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
                src={post.image}
                alt="Post image"
              />
              <p className="text-gray-300 mt-2">{post.text} <span className="text-blue-500 cursor-pointer">ver más</span></p>
              
              <img
                  className="w-10 h-10 rounded-full object-cover	"
                  src={post.avatar}
                  alt={`${post.username}'s avatar`}
                />
                
                <div className="flex items-center justify-between">
                    <div className="flex-grow">
                        <p className="text-white font-semibold">{post.username} <span className="text-blue-500">✔</span></p>
                        <p className="text-gray-500 text-sm">{post.time}</p>
                    </div>
                    <div className="flex space-x-4 items-center">
                      <button className='group relative active'>
                        <FaHeart  className="text-gray-500 group-hover:text-pink-500 group-active:text-pink-700 transition duration-300 ease-in-out"
                        size={24} />
                      </button>
                    <button className='group relative'>
                      <FaComment className="text-gray-500 group-hover:text-green-400 group-active:text-emerald-700 transition duration-300 ease-in-out"
                      size={24} />
                    </button>
                    <button className='group relative'>
                      <FaLink  className="text-gray-500 group-hover:text-blue-500 group-active:text-blue-700 transition duration-300 ease-in-out"
                      size={24} />
                    </button>
                    
                    </div>
                </div>

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

          <button className="group relative">
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
