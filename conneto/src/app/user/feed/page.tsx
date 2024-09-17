import Head from 'next/head';
import { FaHeart, FaComment, FaLink } from 'react-icons/fa';
import { AiFillHome } from 'react-icons/ai';   // Icono para Home
import { BsPlusCircle } from 'react-icons/bs'; // Icono para Plus con Círculo
import { FaInbox } from 'react-icons/fa';      // Icono para Bandeja de Entrada
import { IoMdNotifications } from 'react-icons/io'; // Icono para Notificaciones



export default function Feed() {
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
    <>
      <Head>
        <title>Feed</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800">
        <header className="p-4 text-center">
          <h1 className="text-3xl font-bold text-green-500">conneto</h1>
        </header>

        <section className="px-4 mx-10">
          <h2 className="text-green-400 font-semibold text-lg">Tus Aliados</h2>
          <div className="flex items-center space-x-4 mt-4 overflow-x-auto scrollbar-hide">
            <button className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-2xl text-white hover:bg-gray-800">
              +
            </button>
            {/* Lista de aliados, reemplazar con llamada al api */}
            {["https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?b=1&s=612x612&w=0&k=20&c=hEPh7-WEAqHTHdQtPrfEN9-yYCiPGKvD32VZ5lcL6SU=",
             "https://portal.bilardo.gov.tr/assets/pages/media/profile/profile_user.jpg", 
             "https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?cs=srgb&dl=pexels-george-dolgikh-551816-1310522.jpg&fm=jpg"
            ].map((ally, index) => (
              <div key={index} className="flex-shrink-0">
                <img
                  className="w-12 h-12 rounded-full border-2 border-gray-700 object-cover	"
                  src={ally}
                  alt={`Aliado ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </section>

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
                      <button>
                        <FaHeart className="text-gray-500" size={24} />
                      </button>
                    <button>
                      <FaComment className="text-gray-500" size={24} />
                    </button>
                    <button>
                      <FaLink className="text-gray-500" size={24} />
                    </button>
                    
                    </div>
                </div>

            </div>
          ))}
        </section>

        <nav className="fixed bottom-0 w-full bg-gray-900 py-2 flex justify-around items-center">
          <button className="text-blue-500">
            <AiFillHome className="text-gray-500" size={24}></AiFillHome>
          </button>
          <button className="text-white">
            <BsPlusCircle className="text-gray-500" size={24} />
          </button>
          <button className="text-white">
            <IoMdNotifications className="text-gray-500" size={24} />
          </button>
          <button className="text-white">
            <FaInbox className="text-gray-500" size={24} />
          </button>
        </nav>
      </div>
    </>
  );
}
