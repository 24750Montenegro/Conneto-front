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
  const [isLoading, setIsLoading] = useState(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // Tamaño máximo: 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar el tipo de archivo
    if (!ALLOWED_TYPES.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Formato no permitido",
        text: `Solo se permiten archivos de tipo: ${ALLOWED_TYPES.join(", ")}.`,
        confirmButtonText: "Intentar de nuevo",
      });
      return;
    }

    // Validar el tamaño del archivo
    if (file.size > MAX_FILE_SIZE) {
      Swal.fire({
        icon: "error",
        title: "Archivo demasiado grande",
        text: "El archivo excede el tamaño máximo de 5MB. Por favor, selecciona un archivo más pequeño.",
        confirmButtonText: "Intentar de nuevo",
      });
      return;
    }

    // Previsualización de la imagen
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = () => {
      const aspectRatio = image.width / image.height;
      setImageAspectRatio(aspectRatio);
      setSelectedImage(image.src);
    };
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    
    // Crear un evento simulado y convertir a ChangeEvent
    const fakeEvent = {
      target: { files: [file] },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    handleImageUpload(fakeEvent);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handlePostCreation = async () => {
    if (!description || !selectedImage || selectedCategories.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos antes de publicar.",
        confirmButtonText: "Intentar de nuevo",
      });
      return;
    }

    setIsLoading(true); // Iniciar el estado de carga

    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("categories", JSON.stringify(selectedCategories));

      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const file = new File([blob], `image.${blob.type.split("/")[1]}`, { type: blob.type });
      formData.append("image", file);

      const res = await fetch("http://localhost:8080/publicaciones/crear", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Publicación creada con éxito",
          text: "Regresa al feed.",
        });
        router.push("/user/feed");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al crear la publicación",
          text: "Ocurrió un error al enviar los datos. Inténtalo de nuevo.",
          confirmButtonText: "Intentar de nuevo",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error de red",
        text: "Error al intentar crear la publicación. Verifica tu conexión.",
        confirmButtonText: "Intentar de nuevo",
      });
    } finally {
      setIsLoading(false); // Finalizar el estado de carga
    }
  };   

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4 flex flex-col justify-center items-center">
      {/* Botón para regresar al perfil */}
      <div className="w-full max-w-3xl mb-4">
        <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-300" 
        onClick={() =>  router.push('/user/feed')}>
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
          {isLoading ? "Publicando..." : "Publicar"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
