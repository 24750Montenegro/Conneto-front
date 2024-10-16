"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const CreatePost = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    "Fin de la pobreza",
    "Hambre cero",
    "Salud y bienestar",
    "Educación de calidad",
    "Igualdad de género",
    "Agua limpia y saneamiento",
    "Energía asequible y no contaminante",
    "Trabajo decente y crecimiento económico",
    "Industria, innovación e infraestructura",
    "Reducción de desigualdades",
    "Ciudades y comunidades sostenibles",
    "Producción y consumo responsables",
    "Acción por el clima",
    "Vida submarina",
    "Vida de ecosistemas terrestres",
    "Paz, justicia e instituciones sólidas",
    "Alianzas para lograr los objetivos"
  ];

  // Manejar la subida de imagen y obtener la relación de aspecto
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        const aspectRatio = image.width / image.height;
        setImageAspectRatio(aspectRatio);
        setSelectedImage(image.src);
      };
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        const aspectRatio = image.width / image.height;
        setImageAspectRatio(aspectRatio);
        setSelectedImage(image.src);
      };
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  // Manejar la selección múltiple de categorías
  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handlePostCreation = async () => 
  {
    if (!description || !selectedImage || selectedCategories.length === 0) 
      {
      alert("Por favor, completa todos los campos antes de publicar.");
      return;
    }
  
    try 
    {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("categories", JSON.stringify(selectedCategories));
      
      const response = await fetch(selectedImage);
      const blob = await response.blob();

    // Verificar si el tipo de archivo es una imagen permitida
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/bmp'];
    
    if (!allowedImageTypes.includes(blob.type)) 
    {
      Swal.fire(
      {
        icon: 'error',
        title: 'Formato de imagen no permitido',
        text: `El formato de imagen ` + blob.type + ` no es soportado. Por favor, selecciona un archivo válido (png, jpg, jpeg, webp, etc.).`,
        confirmButtonText: 'Intentar de nuevo'
      });
      return;
    }

    const file = new File([blob], `image.${blob.type.split('/')[1]}`, { type: blob.type });
    formData.append("image", file);
  
      const res = await fetch('http://localhost:8080/publicaciones/crear', 
      {
        method: 'POST',
        body: formData,
      });
  
      if (res.ok) 
        {
        Swal.fire(
        {
          icon: 'success',
          title: 'Publicación creada con éxito',
          text: 'Regresa al feed.',
          
        });
        router.push('/user/feed'); 
      } 
      else 
      {
        Swal.fire(
        {
          icon: 'error',
          title: 'Credenciales faltantes',
          text: 'Por favor, revisa que hayas completado todo lo solicitado.',
          confirmButtonText: 'Intentar de nuevo'
        });
      }
    } 
    catch (error) 
    {
      console.error("Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error en la solicitud',
        text: 'Error al crear la publicación.',
        confirmButtonText: 'Intentar de nuevo'
      });
    }
  };    

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4 flex flex-col justify-center items-center">
      {/* Botón para regresar al perfil */}
      <div className="w-full max-w-3xl mb-4">
        <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-300" onClick={() =>   router.push('/user/feed')}>
          ← Regresar al feed
        </button>
      </div>

      <div className="max-w-3xl w-full bg-gray-800 rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl text-green-400 font-semibold mb-6 text-center">
          Crear nueva publicación
        </h1>

        {/* Área de subir imagen con relación de aspecto */}
        <div
          className={`mb-6 border-2 border-dashed rounded-lg flex justify-center items-center ${
            dragActive ? "border-green-500 bg-gray-700" : "border-gray-600"
          }`}
          style={{
            aspectRatio: imageAspectRatio ? `${imageAspectRatio}` : "16/9", // Aspect ratio dinámico
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Selected"
              className="object-cover h-full w-full rounded-lg"
            />
          ) : (
            <div className="text-center">
              <input
                type="file"
                accept="image/*"
                id="imageUpload"
                className="hidden"
                onChange={handleImageUpload}
              />
              <label
                htmlFor="imageUpload"
                className="cursor-pointer text-green-400 font-semibold"
              >
                Haz clic o arrastra una imagen aquí
              </label>
            </div>
          )}
        </div>

        {/* Descripción */}
        <div className="mb-6">
          <label className="block text-lg mb-2">Descripción:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Agrega una descripción a tu publicación"
            className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Selección de categorías (múltiple) */}
        <div className="mb-6">
          <label className="block text-lg mb-2">ODS Requerido/s:</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`category-${index}`}
                  value={cat}
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                  className="h-5 w-5 text-green-500 bg-gray-700 border-gray-600 rounded"
                />
                <label htmlFor={`category-${index}`} className="text-sm">
                  {cat}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Botón de publicar */}
        <button
          onClick={handlePostCreation}
          className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-lg text-lg font-semibold transition duration-300"
        >
          Publicar
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
