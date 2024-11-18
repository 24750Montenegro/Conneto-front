'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera } from 'lucide-react'
import { useRouter } from 'next/navigation';

interface User {
  nombre: string
  avatar: string
  email: string
  contrasena: string
  ubicacion: string
}

export default function ProfileUpdateForm() {
  const router = useRouter();
  const [hovering, setHovering] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [userData, setUserData] = useState<User | null>(null); // Estado para los datos del usuario

  // Estados individuales para los campos
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [avatar, setAvatar] = useState('/placeholder.svg?height=100&width=100');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const match = token.match(/"id":(\d+)/);
      const userId = match ? match[1] : null;

      if (userId) {
        fetch(`http://localhost:8080/usuario/${userId}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Error al obtener los datos del usuario');
            }
            return response.json();
          })
          .then((data) => {
            setUserData(data); // Guarda los datos completos del usuario
            // Actualiza los estados con los datos obtenidos
            setNombre(data.nombre || '');
            setEmail(data.email || '');
            setContrasena(data.contrasena || ''); 
            setUbicacion(data.ubicacion || '');
            setAvatar(data.avatar || '/placeholder.svg?height=100&width=100');
          })
          .catch((error) => console.error('Error:', error));
      }
    }
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedAvatar(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let avatarUrl = avatar;

    if (selectedAvatar) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedAvatar);
      imageFormData.append("upload_preset", "conneto");

      try {
        const uploadResponse = await fetch("https://api.cloudinary.com/v1_1/duryihjrl/image/upload", {
          method: "POST",
          body: imageFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Error al subir el avatar");
        }

        const uploadData = await uploadResponse.json();
        avatarUrl = uploadData.secure_url;
      } catch (error) {
        console.error("Error:", error);
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      const match = token && token.match(/"id":(\d+)/);
      const userId = match ? match[1] : null;

      if (userId) {
        const updateData = {
          nombre,
          email,
          avatar: avatarUrl,
          contrasena,
          ubicacion,
        };

        const res = await fetch(`http://localhost:8080/usuario/update/${userId}`, {
          method: "PUT",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        });

        if (res.ok) {
          console.log("Perfil actualizado correctamente");
          router.push("/user/feed");
        } else {
          throw new Error("Error al actualizar el perfil");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-gray-800 text-gray-100 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-center text-green-400">Actualizar Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center mb-6">
              <div 
                className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-600"
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
              >
                <img 
                  src={selectedAvatar ? URL.createObjectURL(selectedAvatar) : avatar} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
                {hovering && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-green-400" />
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                  aria-label="Cambiar avatar"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="nombre" className="text-sm font-medium text-green-400">Nombre</Label>
              <Input 
                id="nombre" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white focus:ring-green-400 focus:border-green-400"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-medium text-green-400">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white focus:ring-green-400 focus:border-green-400"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="contrasena" className="text-sm font-medium text-green-400">Contraseña</Label>
              <Input 
                id="contrasena" 
                type="password" 
                value={contrasena} 
                onChange={(e) => setContrasena(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white focus:ring-green-400 focus:border-green-400"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="ubicacion" className="text-sm font-medium text-green-400">Ubicación</Label>
              <Input 
                id="ubicacion" 
                value={ubicacion} 
                onChange={(e) => setUbicacion(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white focus:ring-green-400 focus:border-green-400"
              />
            </div>

            <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white mt-6">
              Actualizar Perfil
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
