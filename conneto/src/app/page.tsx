'use client'
import { useState } from 'react';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Actualizar la posición del cursor
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] text-gray-100 overflow-hidden"
      style={{
        backgroundColor: '#1a1a1a',
        backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(31, 184, 151, 0.15), transparent 80%)`, // Efecto de luz en el fondo
      }}
    >
      <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start relative">
        <h1 className="mb-2 text-3xl font-extrabold text-gray-100 md:text-5xl lg:text-6xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
            Conneto
          </span>
        </h1>
        <p className="mb-8 text-center text-lg font-normal text-gray-300 lg:text-xl">
          Conectando personas, creando alianzas que cambian el futuro.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="shadow-lg shadow-green-500 rounded-full border border-transparent transition-colors flex items-center justify-center bg-emerald-600 text-white gap-2 hover:bg-emerald-500 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/auth/login"
          >
            Login
          </a>
          <a
            className="shadow-lg shadow-gray-700 rounded-full border border-gray-700 transition-colors flex items-center justify-center bg-gray-800 text-gray-100 hover:bg-gray-700 hover:border-gray-600 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="/auth/singup"
          >
            Sign Up
          </a>
        </div>
      </main>
    </div>
  );
}
