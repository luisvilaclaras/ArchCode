import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation'; // Para redirigir al usuario

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth(); // Obtener la función de logout desde el contexto
  const router = useRouter(); // Usar el router para redirigir al menú principal

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await logout(); // Cierra la sesión del usuario
      router.push('/'); // Redirige al usuario al menú principal
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="relative inline-block text-left">
      {/* Botón para abrir el menú */}
      <div>
        <button
          onClick={toggleMenu}
          className="inline-flex justify-center w-full rounded-md border border-gray-700 shadow-sm px-4 py-2 bg-[#344e6f] text-sm font-medium text-white hover:bg-gray-700 focus:outline-none"
        >
          <FaUserCircle className="mr-2" />
          Usuario
        </button>
      </div>

      {/* Opciones del menú */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button
              onClick={handleLogout} // Llama a la función de logout
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left"
              role="menuitem"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
