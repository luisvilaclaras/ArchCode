import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation'; 
import { useAuth } from '../context/AuthContext'; 

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const router = useRouter(); 

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      router.push('/'); 
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleSignUp = () => {
    setIsOpen(false);
    router.push('/signup'); 
  };

  const handleLogin = () => {
    setIsOpen(false);
    router.push('/login'); 
  };

  return (
    <div className="relative">
      <button 
        className="absolute top-2 right-4 flex items-center space-x-2 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 focus:outline-none"
        onClick={toggleMenu}
      >
        <FaUserCircle className="text-2xl" />
        {/* Correo electrónico visible solo en pantallas medianas o mayores */}
        {currentUser && (
          <span className="hidden lg:inline ml-2">{currentUser.email}</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-12 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
          {currentUser ? (
            <>
              <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Configuración</a>
              <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Acceder al plan premium</a>
              <div className="border-t my-2"></div>
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSignUp}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Crear cuenta
              </button>
              <button
                onClick={handleLogin}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Iniciar sesión
              </button>
              
            </>
          )}
        </div>
      )}
    </div>
  );
}
