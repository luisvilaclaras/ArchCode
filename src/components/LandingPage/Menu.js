'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import SignUpPopup from './SignUpPopUp';
import LogInPopup from './LogInPopUp';
import AlertModal from '../Modals/AlertModal';

export default function Menu() {
  const [isSignUpPopupOpen, setIsSignUpPopupOpen] = useState(false);
  const [isLogInPopupOpen, setIsLogInPopupOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // NUEVO: controla si se muestra el modal en móvil
  const [showMobileAlertModal, setShowMobileAlertModal] = useState(false);

  const { currentUser, isAdmin, logout } = useAuth();
  const router = useRouter();

  // Detectar si es dispositivo móvil (breakpoint: <768px)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openSignUpPopup = () => setIsSignUpPopupOpen(true);
  const closeSignUpPopup = () => setIsSignUpPopupOpen(false);

  const openLogInPopup = () => setIsLogInPopupOpen(true);
  const closeLogInPopup = () => setIsLogInPopupOpen(false);

  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const switchToSignUpPopup = () => {
    closeLogInPopup();
    openSignUpPopup();
  };

  // Si el usuario está en escritorio y hace clic en "Accede a la herramienta"
  const handleDashboardClick = () => {
    if (currentUser) {
      // Usuario logueado: redirige al panel
      router.push('/herramienta');
    } else {
      // Usuario no logueado: abre popup de login
      openLogInPopup();
    }
  };

  // Si el usuario está en móvil y hace clic en "Accede a la herramienta"
  // Mostramos el AlertModal en lugar de redirigir
  const handleToolUnavailable = () => {
    setShowMobileAlertModal(true);
  };

  // Scroll a sección específica
  const handleScrollToSection = (id) => {
    if (window.location.pathname !== '/') {
      router.push(`/#${id}`);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // Cierra menú móvil al hacer clic en cualquier sección
    if (isMobile) setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-[#344e6f] p-6 text-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo e items de navegación (en escritorio) */}
        <div className="flex items-center space-x-8">
          <img 
            src="/images/ArchCode.webp" 
            alt="Logo" 
            className="h-10 cursor-pointer" 
            onClick={() => handleScrollToSection('home')}
          />
          {/* Menú horizontal sólo en escritorio */}
          {!isMobile && (
            <ul className="flex space-x-8 text-base font-semibold">
              <li className="hover:text-lightBlue cursor-pointer font-personalizada" onClick={() => handleScrollToSection('home')}>
                Home
              </li>
              <li className="hover:text-lightBlue cursor-pointer" onClick={() => handleScrollToSection('producto')}>
                Producto
              </li>
              <li className="hover:text-lightBlue cursor-pointer" onClick={() => handleScrollToSection('como-se-usa')}>
                Descubre cómo funciona
              </li>
              <li className="hover:text-lightBlue cursor-pointer" onClick={() => handleScrollToSection('precios')}>
                Beta
              </li>
              <li className="hover:text-lightBlue cursor-pointer" onClick={() => handleScrollToSection('faq')}>
                FAQ
              </li>
              <li className="hover:text-lightBlue cursor-pointer" onClick={() => handleScrollToSection('contacto')}>
                Contacto
              </li>
            </ul>
          )}
        </div>

        {/* Botones y menús de usuario (en escritorio) */}
        {!isMobile ? (
          <div className="flex items-center space-x-4">
            <button
              onClick={handleDashboardClick}
              className="bg-[#344e6f] text-white py-2 px-6 rounded-full border border-blue-500 shadow-sm hover:shadow-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500"
            >
              Accede a la herramienta
            </button>

            {isAdmin && (
              <button
                onClick={() => router.push('/admin')}
                className="bg-red-600 text-white py-2 px-6 rounded-full shadow-md hover:shadow-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
              >
                Admin
              </button>
            )}

            {currentUser ? (
              <div className="relative">
                <img
                  src={currentUser.photoURL || '/images/profile.webp'}
                  alt="Profile"
                  className="h-10 w-10 rounded-full cursor-pointer"
                  onClick={toggleProfileMenu}
                />
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#344e6f] text-white rounded-lg shadow-lg py-2 z-50">
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-[#2a3e5a]"
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
        ) : (
          // Versión móvil: botón hamburguesa + menú desplegable
          <div className="relative">
            <button
              onClick={toggleMobileMenu}
              className="focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {isMobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#344e6f] border border-gray-600 rounded-lg shadow-lg py-2 z-50">
                {/* Opciones de navegación en móvil */}
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-[#2a3e5a] border-b border-gray-600"
                  onClick={() => handleScrollToSection('home')}
                >
                  Home
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-[#2a3e5a] border-b border-gray-600"
                  onClick={() => handleScrollToSection('producto')}
                >
                  Producto
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-[#2a3e5a] border-b border-gray-600"
                  onClick={() => handleScrollToSection('como-se-usa')}
                >
                  Descubre cómo funciona
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-[#2a3e5a] border-b border-gray-600"
                  onClick={() => handleScrollToSection('precios')}
                >
                  Beta
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-[#2a3e5a] border-b border-gray-600"
                  onClick={() => handleScrollToSection('faq')}
                >
                  FAQ
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-[#2a3e5a]"
                  onClick={() => handleScrollToSection('contacto')}
                >
                  Contacto
                </button>

                {/* Opciones de usuario en móvil */}
                <div className="pt-2 border-t border-gray-600">
                  {currentUser ? (
                    <button
                      className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-full shadow-lg hover:opacity-90 transition duration-300"
                      onClick={handleLogout}
                    >
                      Cerrar Sesión
                    </button>
                  ) : (
                    <>
                      <button
                        className="w-full py-2 px-4 mb-2 bg-[#2563eb] text-white font-bold rounded-none shadow-lg hover:opacity-90 transition duration-300"
                        onClick={openSignUpPopup}
                      >
                        Regístrate
                      </button>
                      <button
                        className="w-full py-2 px-4 bg-[#2563eb] text-white font-bold rounded-none shadow-lg hover:opacity-90 transition duration-300"
                        onClick={handleToolUnavailable}
                      >
                        Accede a la herramienta
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Popups de registro y login */}
      {isSignUpPopupOpen && <SignUpPopup closePopup={closeSignUpPopup} />}
      {isLogInPopupOpen && (
        <LogInPopup
          closePopup={closeLogInPopup}
          switchToSignUpPopup={switchToSignUpPopup}
        />
      )}

      {/* Modal de alerta para móvil */}
      {showMobileAlertModal && (
        <AlertModal
          message="Por el momento, la versión de la herramienta solo está disponible en ordenador."
          onClose={() => setShowMobileAlertModal(false)}
        />
      )}
    </nav>
  );
}
