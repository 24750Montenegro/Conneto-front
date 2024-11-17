"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const CreatePost = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null); // Estado para la vista previa
  const [imageAspectRatio] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // Tamaño máximo: 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

  // Aquí ajustamos las categorías para incluir sus IDs
  const categories = [
    { id: 1, name: "Fin de la pobreza" },
    { id: 2, name: "Hambre cero" },
    { id: 3, name: "Salud y bienestar" },
    { id: 4, name: "Educación de calidad" },
    { id: 5, name: "Igualdad de género" },
    { id: 6, name: "Agua limpia y saneamiento" },
    { id: 7, name: "Energía asequible y no contaminante" },
    { id: 8, name: "Trabajo decente y crecimiento económico" },
    { id: 9, name: "Industria, innovación e infraestructura" },
    { id: 10, name: "Reducción de desigualdades" },
    { id: 11, name: "Ciudades y comunidades sostenibles" },
    { id: 12, name: "Producción y consumo responsables" },
    { id: 13, name: "Acción por el clima" },
    { id: 14, name: "Vida submarina" },
    { id: 15, name: "Vida de ecosistemas terrestres" },
    { id: 16, name: "Paz, justicia e instituciones sólidas" },
    { id: 17, name: "Alianzas para lograr los objetivos" }
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

    // Establecer el archivo seleccionado
    setSelectedImage(file);
  };

  useEffect(() => {
    // Crear una URL de vista previa si hay una imagen seleccionada
    if (selectedImage) {
      const imageUrl = URL.createObjectURL(selectedImage);
      setImagePreviewUrl(imageUrl);

      // Liberar la URL de la imagen cuando se desmonte el componente o se cambie la imagen
      return () => {
        URL.revokeObjectURL(imageUrl);
      };
    } else {
      setImagePreviewUrl(null); // Resetear la URL si no hay imagen
    }
  }, [selectedImage]);


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

  const handleCategoryChange = (id: number) => {
    if (selectedCategories.includes(String(id))) {
      setSelectedCategories(selectedCategories.filter((catId) => catId !== String(id)));
    } else {
      setSelectedCategories([...selectedCategories, String(id)]);
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
      // Primero, subir la imagen a Cloudinary
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);
      imageFormData.append("upload_preset", "conneto"); 
  
      const uploadResponse = await fetch("https://api.cloudinary.com/v1_1/duryihjrl/image/upload", {
        method: "POST",
        body: imageFormData,
      });
  
      if (!uploadResponse.ok) {
        throw new Error("Error al subir la imagen a Cloudinary");
      }
  
      const uploadData = await uploadResponse.json();
      const imageUrl = uploadData.secure_url; // La URL de la imagen subida a Cloudinary
      console.log(imageUrl);
      const token = localStorage.getItem('token');
      console.log(token)
      if (token) {
        // Extraer el id utilizando una expresión regular
        const match = token.match(/"id":(\d+)/);
        
        // Comprobar si se encontró el id
        if (match) {
          const idAutor = match[1]; // El id se encuentra en el primer grupo capturado
        

      const postData = {
        contenido: description,
        imagenURL: imageUrl,
        autor: { id: idAutor },
        categorias: selectedCategories.map((id) => ({ id })) // Mapeo de IDs para categorías
      };

      console.log("Datos a enviar:", postData);

  
      const res = await fetch("http://localhost:8080/publicaciones/crear", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData), // Convertir a JSON
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

    }}//
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
          {imagePreviewUrl ? (
            <img
              src={imagePreviewUrl}
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
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`category-${cat.id}`}
                value={cat.id}
                checked={selectedCategories.includes(String(cat.id))}
                onChange={() => handleCategoryChange(cat.id)}
                className="h-5 w-5 text-green-500 bg-gray-700 border-gray-600 rounded"
              />
              <label htmlFor={`category-${cat.id}`} className="text-sm">
                {cat.name}
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
