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

  return (
    <nav className="bg-darkBlue p-6 text-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <img src="images/ArchCode.png" alt="Logo" className="h-10" />
          <ul className="flex space-x-8 text-lg font-semibold">
            <li className="hover:text-lightBlue cursor-pointer">Home</li>
            <li className="hover:text-lightBlue cursor-pointer">Features</li>
            <li className="hover:text-lightBlue cursor-pointer">Pricing</li>
            <li className="hover:text-lightBlue cursor-pointer">FAQ</li>
            <li className="hover:text-lightBlue cursor-pointer">Contact</li>
          </ul>
        </div>

        <div className="flex items-center space-x-4">
          {/* Botón de Dashboard */}
          <button
            onClick={handleDashboardClick}
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-6 rounded-full shadow-md hover:shadow-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
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
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg py-2 z-50">
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => router.push('/profile')}
                  >
                    Profile
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openSignUpPopup}
              className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 px-6 rounded-full shadow-md hover:shadow-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Try For Free
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
