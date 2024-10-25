'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Traemos el contexto de autenticación
import { useRouter } from 'next/navigation';
import SignUpPopup from './SignUpPopUp'; // Popup de registro
import LogInPopup from './LogInPopUp'; // Popup de login

export default function Menu() {
  const [isSignUpPopupOpen, setIsSignUpPopupOpen] = useState(false);
  const [isLogInPopupOpen, setIsLogInPopupOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // Controlar menú de perfil
  const { currentUser, logout } = useAuth(); // Obtenemos el usuario actual y la función de logout desde el contexto
  const router = useRouter();

  const openSignUpPopup = () => setIsSignUpPopupOpen(true);
  const closeSignUpPopup = () => setIsSignUpPopupOpen(false);

  const openLogInPopup = () => setIsLogInPopupOpen(true);
  const closeLogInPopup = () => setIsLogInPopupOpen(false);

  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleDashboardClick = () => {
    if (currentUser) {
      router.push('/chat'); // Si el usuario está loggeado, lo redirigimos al chat
    } else {
      openLogInPopup(); // Si no está loggeado, mostramos el popup de login
    }
  };

  // Función para desplazarse a la sección correspondiente
  const handleScrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-[#344e6f] p-6 text-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <img 
            src="images/ArchCode.png" 
            alt="Logo" 
            className="h-10 cursor-pointer" 
            onClick={() => handleScrollToSection('home')} 
          />
          <ul className="flex space-x-8 text-base font-semibold"> {/* Cambiamos text-lg a text-base */}
            <li
              className="hover:text-lightBlue cursor-pointer font-personalizada"
              onClick={() => handleScrollToSection('home')}
            >
              Home
            </li>
            <li
              className="hover:text-lightBlue cursor-pointer"
              onClick={() => handleScrollToSection('producto')}
            >
              Producto
            </li>
            <li
              className="hover:text-lightBlue cursor-pointer"
              onClick={() => handleScrollToSection('como-se-usa')}
            >
              Cómo se usa
            </li>
            <li
              className="hover:text-lightBlue cursor-pointer"
              onClick={() => handleScrollToSection('precios')}
            >
              Beta
            </li>
            <li
              className="hover:text-lightBlue cursor-pointer"
              onClick={() => handleScrollToSection('faq')}
            >
              FAQ
            </li>
            <li
              className="hover:text-lightBlue cursor-pointer"
              onClick={() => handleScrollToSection('contacto')}
            >
              Contacto
            </li>
          </ul>
        </div>

        <div className="flex items-center space-x-4">
          {/* Botón de Dashboard */}
          <button
            onClick={handleDashboardClick}
            className="bg-[#344e6f] text-white py-2 px-6 rounded-full border border-blue-500 shadow-sm hover:shadow-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500"
          >
            Accede a la herramienta
          </button>


          {currentUser ? (
            <div className="relative">
              <img
                src={currentUser.photoURL || '/images/profile.png'} // Usar imagen de perfil del usuario o una imagen por defecto
                alt="Profile"
                className="h-10 w-10 rounded-full cursor-pointer"
                onClick={toggleProfileMenu}
              />

              {/* Menú desplegable */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#344e6f] text-white rounded-lg shadow-lg py-2 z-50">
                  <button
                    className="block w-full text-left px-4 py-2 text-white-700 hover:bg-[#344e6f]"
                    onClick={handleLogout}
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openSignUpPopup}
              className="bg-[#2563eb] text-white py-2 px-6 rounded-full shadow-md hover:shadow-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Pruébalo Gratis
            </button>
          )}
        </div>
      </div>

      {/* Mostrar Popups según sea necesario */}
      {isSignUpPopupOpen && <SignUpPopup closePopup={closeSignUpPopup} />}
      {isLogInPopupOpen && <LogInPopup closePopup={closeLogInPopup} />}
    </nav>
  );
}
