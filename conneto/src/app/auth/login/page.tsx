"use client";

import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(contrasena)

    try {
      const response = await fetch(`http://localhost:8080/usuario/login?email=${encodeURIComponent(email)}&contrasena=${encodeURIComponent(contrasena)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
            const usuario = await response.json();
            // Crear el token con id y email
            const token = {
              id: usuario.id,  
              email: usuario.email,
            };

          // Guardar el token como un string JSON en el localStorage
          localStorage.setItem('token', JSON.stringify(token));
        Swal.fire({
          icon: 'success',
          title: 'Login exitoso',
          text: 'Welcome to conneto.',
          
        });
        router.push('/user/feed');

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Credenciales incorrectas',
          text: 'Por favor, revisa tu email y contraseña.',
          confirmButtonText: 'Intentar de nuevo'
        });
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
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
          <h2 className="text-center text-white text-3xl font-bold mb-2">Hello Again!</h2>
          <p className="text-center text-gray-400 mb-6">Welcome back to conneto</p>

          <div className="mb-4">
            <h2 className="text-emerald-400 font-semibold text-xl mb-2">Login</h2>
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
            <div className="text-right mt-2">
              <a href="#" className="text-sm text-emerald-500 hover:underline">Forgot Password?</a>
            </div>
          </div>

          <button className="w-full py-2 bg-fuchsia-400	 text-fuchsia-950	text-2xl font-semibold rounded-xl hover:bg-fuchsia-500	 transition duration-500">
            Login
          </button>

          <p className="text-center text-gray-400 mt-4">
            Don’t have an account? <a href="singup" className="text-blue-500 hover:underline">Sign In</a>
          </p>
        </form>
      </div>
    </>
  );
}
