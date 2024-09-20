"use client";
import Head from 'next/head';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import 'sweetalert2/dist/sweetalert2.min.css';

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=> {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/usuario/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, contrasena, nombre, ubicacion }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Registro exitoso', data);
        Swal.fire({
          icon: 'success',
          title: 'Signup exitoso',
          text: 'Now you can log in your account.',
          
        });
        router.push('login');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Campos incorrectos',
          text: 'Por favor, revisa tus datos, es probable que ya exista una cuenta con este email.',
          confirmButtonText: 'Intentar de nuevo'
        });
        const errorData = await response.json();
        console.error('Error en el registro:', errorData);
      }
    } catch (error) {
      console.error('Error de red:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'Ocurrió un problema con el servidor. Inténtalo más tarde.',
        confirmButtonText: 'Entendido'
    });
    }
  };
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-500 via-black to-stone-950	">
        <form onSubmit={handleSubmit} className="bg-zinc-900	p-8 rounded-3xl shadow-lg max-w-md w-full shadow-purple-700		">
          <h2 className="text-center text-white text-3xl font-bold mb-2">Hello buddy!</h2>
          <p className="text-center text-gray-400 mb-6">Welcome to conneto</p>

          <div className="mb-4">
            <h2 className="text-emerald-400 font-semibold text-xl mb-2">Sign up</h2>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Name 
            </label>
            <input
              className="w-full px-4 py-2 text-gray-100 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              type="text"
              id="name"
              placeholder="guess123"
              onChange={(e) => setNombre(e.target.value)} 
              required
            />
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Location 
            </label>
            <input
              className="w-full px-4 py-2 text-gray-100 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              type="text"
              id="location"
              placeholder="Guatemala, United States, Spain ..."
              onChange={(e) => setUbicacion(e.target.value)} 
              required

            />
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
              Email 
            </label>
            <input
              className="w-full px-4 py-2 text-gray-100 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              type="email"
              id="email"
              placeholder="example@gmail.com"
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-4 py-2 text-gray-100 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              type="password"
              id="password"
              placeholder="Must have at least 8 characters"
              onChange={(e) => setContrasena(e.target.value)} 
              required
            />
            
          </div>

          <button  type="submit" className="w-full py-2 bg-fuchsia-400	 text-fuchsia-950	text-2xl font-semibold rounded-xl hover:bg-fuchsia-500	 transition duration-500">
            Sign Up
          </button>

          <p className="text-center text-gray-400 mt-4">
            Already have an account? <a href="login" className="text-blue-500 hover:underline">LogIn</a>
          </p>
        </form>
      </div>
    </>
  );
}
