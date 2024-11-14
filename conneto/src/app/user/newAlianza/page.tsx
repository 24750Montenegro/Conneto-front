"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

const CrearAlianza = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [descripcion, setDescripcion] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const manejarGuardarAlianza = async () => {
        setError(null);
        setSuccess(null);

        const token = localStorage.getItem('token');
        let Usuario_id;

        if (token) {
            const match = token.match(/"id":(\d+)/);
            if (match) {
                Usuario_id = match[1];
            }
        }

        if (!Usuario_id) {
            setError("No se pudo obtener el id del autor. Por favor, verifica tu sesión.");
            return;
        }

        if (!name || !selectedImage || !descripcion) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        try {
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
            const imageUrl = uploadData.secure_url;

            const nuevaAlianza = { 
                name, 
                image: imageUrl, 
                descripcion, 
                usuarios: [{ id: Usuario_id }],
                proyectos: [] 
            };

            const response = await fetch("http://localhost:8080/alianza/guardarAlianza", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevaAlianza)
            });

            if (response.ok) {
                setSuccess("Alianza creada con éxito.");
                setTimeout(() => {
                    router.push('/user/eleccionalianza');
                }, 2000);
            } else {
                setError("Error al guardar la alianza. Verifica los datos.");
            }
        } catch (error) {
            console.error("Error al guardar la alianza:", error);
            setError("Ocurrió un error al intentar guardar la alianza.");
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleImageUpload(e.dataTransfer.files);
        }
    };

    const handleImageUpload = (files: FileList | null) => {
        const file = files && files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center p-4 relative">
            {/* Botón de regreso en la esquina superior izquierda */}
            <button
                onClick={() => router.push('/user/eleccionalianza')}
                className="absolute top-6 left-6 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md flex items-center gap-2"
            >
                <FaArrowLeft />
                <span>Regresar</span>
            </button>

            <h2 className="text-3xl font-semibold mb-6 text-green-400">Crear Nueva Alianza</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}

            {/* Contenedor centrado */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
                <input
                    type="text"
                    placeholder="Nombre de la Alianza"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-700 text-white p-3 rounded-md mb-4 w-full border border-gray-600 focus:outline-none focus:border-green-400"
                />

                {/* Área de subir imagen con estilo unificado */}
                <div
                    className={`mb-6 border-2 border-dashed rounded-lg flex justify-center items-center ${
                        dragActive ? "border-green-500 bg-gray-700" : "border-gray-600"
                    }`}
                    style={{
                        aspectRatio: "16/9",
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
                                onChange={(e) => handleImageUpload(e.target.files)}
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

                <textarea
                    placeholder="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="bg-gray-700 text-white p-3 rounded-md mb-4 w-full border border-gray-600 focus:outline-none focus:border-green-400"
                ></textarea>

                <button
                    onClick={manejarGuardarAlianza}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md w-full transition-colors duration-200"
                >
                    Guardar Alianza
                </button>
            </div>
        </div>
    );
};

export default CrearAlianza;
