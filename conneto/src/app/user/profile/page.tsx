'use client'
import { AiFillHome } from "react-icons/ai";
import { IoMdNotifications } from "react-icons/io";
import { BsPlusCircle } from "react-icons/bs";
import  AlliesSection  from '../../components/AlliesSection'
import { FaUserAstronaut } from 'react-icons/fa';  
import { useRouter } from 'next/navigation';

const UserProfile = () => {
  const router = useRouter();

  const userData = {  //cambiar esto por llamada al api
    avatar: "https://image.ondacero.es/clipping/cmsimages02/2014/09/16/079B0F2D-A354-4878-86F1-B1375A99C804/98.jpg?crop=800,450,x0,y42&width=1900&height=1069&optimize=high&format=webply",
    name: "Conneto CEO",
    bio: "Desarrollador apasionado por las tecnologías web. y CEO de conneto",
    posts: [
      //reemplazar los siguientes datos con llamada al api
      {
        id: 1,
        username: "James",
        time: "1 hour ago",
        text: "Nuevo proyecto de infraestructura e innovación enfocado en el desarrollo sostenible...",
        image: "https://media.licdn.com/dms/image/v2/C5112AQGo5l3-KAnMDA/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1520179677776?e=2147483647&v=beta&t=OdR4prUuAWvXWcFKZJJwk8GbJD5vTgdW15QLMz4liiE", // reemplazar con la URL de la imagen real
        avatar: "https://portal.bilardo.gov.tr/assets/pages/media/profile/profile_user.jpg",  // reemplazar con la URL del avatar
        categories: ["Salud y bienestar", "Educación de calidad"],

      },
      {
        id: 2,
        username: "Anna",
        time: "2 hours ago",
        text: "Increíble proyecto de conservación marina...",
        image: "https://image.isu.pub/140225055437-5426fdab6f7587eb5fd4b7ccedf38aea/jpg/page_1_thumb_large.jpg", 
        avatar: "https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?b=1&s=612x612&w=0&k=20&c=hEPh7-WEAqHTHdQtPrfEN9-yYCiPGKvD32VZ5lcL6SU=",
        categories: ["Fin de la pobreza", "Trabajo decente y crecimiento económico"],
  
      },
    ],
    allies: [
      {
        avatar: "https://portal.bilardo.gov.tr/assets/pages/media/profile/profile_user.jpg",  // reemplazar con la URL del avatar
      },
      {
        avatar: "https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?b=1&s=612x612&w=0&k=20&c=hEPh7-WEAqHTHdQtPrfEN9-yYCiPGKvD32VZ5lcL6SU=",  
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Contenedor principal del perfil */}
      <div className="flex-grow">
        <div className="flex flex-col items-center py-10 px-4">
          {/* Sección del perfil */}
          <div className="max-w-4xl w-full bg-gray-800 rounded-lg p-6 shadow-lg mb-10">
            <div className="flex items-center mb-6">
              <img
                src={userData.avatar}
                alt="User Avatar"
                className="w-32 h-32 rounded-full border-4 border-green-500 mr-6 object-cover"
              />
              <div>
                <h1 className="text-3xl font-semibold text-green-400">
                  {userData.name}
                </h1>
                <p className="text-lg text-gray-300 mt-2">{userData.bio}</p>
              </div>
            </div>
          </div>

          {/* Sección de aliados */}
          <AlliesSection allies={userData.allies} />

          {/* Publicaciones del usuario */}
          <div className="max-w-4xl w-full bg-gray-800 rounded-lg p-6 shadow-lg mt-10">
            <h2 className="text-2xl text-green-400 font-semibold mb-6 text-center">
              Mis publicaciones
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {userData.posts.map((post) => (
                <div key={post.id} className="bg-gray-700 p-4 rounded-lg">
                  <img
                    src={post.image}
                    alt={`Post ${post.id}`}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <p className="text-lg font-medium mb-2">{post.text}</p>
                  <div className="flex flex-wrap gap-2">
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
      </div>

      <nav className="fixed bottom-0 w-full bg-neutral-900 py-2 flex justify-around items-center">
        <button className="group relative"  onClick={() =>   router.push('/user/feed')}>
            <AiFillHome
              className="text-gray-500 group-hover:text-blue-500 group-active:text-blue-700 transition duration-300 ease-in-out"
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
              className="text-blue-500 group-hover:text-blue-500 group-active:text-blue-700 transition duration-300 ease-in-out"
              size={24}
            />
          </button>

        </nav>
    </div>
  );
};

export default UserProfile;
