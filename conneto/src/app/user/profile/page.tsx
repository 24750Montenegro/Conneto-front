import { FaBook } from 'react-icons/fa';
import{ AiFillHome } from 'react-icons/ai'
import{BsSearch } from 'react-icons/bs'
import  AlliesSection  from '../../components/AlliesSection'


export default function UserProfile() {
    const posts = [
        //reemplazar los siguientes datos con llamada al api
        {
          id: 1,
          username: "James",
          time: "1 hour ago",
          text: "Nuevo proyecto de infraestructura e innovación enfocado en el desarrollo sostenible...",
          image: "https://media.licdn.com/dms/image/v2/C5112AQGo5l3-KAnMDA/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1520179677776?e=2147483647&v=beta&t=OdR4prUuAWvXWcFKZJJwk8GbJD5vTgdW15QLMz4liiE", // reemplazar con la URL de la imagen real
          avatar: "https://portal.bilardo.gov.tr/assets/pages/media/profile/profile_user.jpg",  // reemplazar con la URL del avatar
        },
        {
          id: 2,
          username: "Anna",
          time: "2 hours ago",
          text: "Increíble proyecto de conservación marina...",
          image: "https://image.isu.pub/140225055437-5426fdab6f7587eb5fd4b7ccedf38aea/jpg/page_1_thumb_large.jpg", 
          avatar: "https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?b=1&s=612x612&w=0&k=20&c=hEPh7-WEAqHTHdQtPrfEN9-yYCiPGKvD32VZ5lcL6SU=",  
        },
      ];    
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-white shadow-lg flex justify-between p-4">
        <h1 className="text-green-600 text-3xl font-bold">conneto</h1>
        <div className="bg-gray-300 p-2 rounded-full">
          {/* Icono de usuario */}
          <img
            src="/path-to-user-icon.svg"
            alt="User Icon"
            className="w-8 h-8 object-cover"
          />
        </div>
      </header>

      <AlliesSection allies={posts} />


      {/* Publicaciones */}
      <section className="w-full px-4 mb-6">
        <h2 className="text-gray-600 mb-2">tus publicaciones</h2>
        <div className="grid grid-cols-3 gap-2">
          {/* Ejemplo de publicaciones */}
          {Array(9)
            .fill('')
            .map((_, idx) => (
              <div
                key={idx}
                className="w-full bg-gray-400 aspect-square"
              />
            ))}
        </div>
      </section>

      {/* Controles (home, buscar, alianzas) */}
      <footer className="w-full bg-white p-4 shadow-lg flex justify-around">
        <button className="text-gray-500 hover:text-green-600 transition duration-300">
          <AiFillHome size={30} />
        </button>
        <button className="text-gray-500 hover:text-green-600 transition duration-300">
          <BsSearch size={30} />
        </button>
        <button className="text-gray-500 hover:text-green-600 transition duration-300">
          <FaBook size={30} />
        </button>
      </footer>
    </div>
  );
}
