'use client'; 


import React from 'react';

export default function Footer() {

  // Función para desplazarse a la sección correspondiente
  const handleScrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#1e3047] py-12 px-6 text-white">
      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-4">
        
        {/* Logo and tagline section */}
        <div className="mb-4 md:-ml-48 text-center">
          <img src="/images/ArchCode.png" alt="ArchCode Logo" className="h-12 w-auto mx-auto cursor-pointer" onClick={() => handleScrollToSection('home')} />
          <p className="text-sm mt-1 text-gray-300 max-w-[200px] mx-auto text-center leading-tight">
            Acelera tus proyectos con la potencia de la IA y ahorra tiempo
          </p>
        </div>

        {/* Navigation links */}
        <div className="md:col-span-1 text-sm space-y-2">
          <h3 className="text-lg font-semibold mb-4">Navigation</h3>
          <ul className="text-gray-300 space-y-2">
            <li
              className="hover:text-white transition cursor-pointer"
              onClick={() => handleScrollToSection('producto')}
            >
              Producto
            </li>
            <li
              className="hover:text-white transition cursor-pointer"
              onClick={() => handleScrollToSection('ventajas')}
            >
              Ventajas
            </li>
            <li
              className="hover:text-white transition cursor-pointer"
              onClick={() => handleScrollToSection('reviews')}
            >
              Opinión
            </li>
            <li
              className="hover:text-white transition cursor-pointer"
              onClick={() => handleScrollToSection('nuestro-lema')}
            >
              Nuestro Lema
            </li>
            <li
              className="hover:text-white transition cursor-pointer"
              onClick={() => handleScrollToSection('precios')}
            >
              Beta
            </li>
            <li
              className="hover:text-white transition cursor-pointer"
              onClick={() => handleScrollToSection('como-se-usa')}
            >
              Cómo se Usa
            </li>
            <li
              className="hover:text-white transition cursor-pointer"
              onClick={() => handleScrollToSection('faq')}
            >
              FAQ
            </li>
          </ul>
        </div>

        {/* Support links */}
        <div className="md:col-span-1 text-sm space-y-2">
          <h3 className="text-lg font-semibold mb-4">Ayuda</h3>
          <ul className="text-gray-300 space-y-2">
            <li><a href="#" className="hover:text-white transition">Centro de Ayuda</a></li>
          </ul>
        </div>

        {/* Legal links */}
        <div className="md:col-span-1 text-sm space-y-2">
          <h3 className="text-lg font-semibold mb-4">Legal</h3>
          <ul className="text-gray-300 space-y-2">
            <li><a href="/terminos" className="hover:text-white transition">Términos y Condiciones</a></li>
            <li><a href="/privacidad" className="hover:text-white transition">Política de Privacidad</a></li>
            <li><a href="/politicas-usuario" className="hover:text-white transition">Uso Aceptable</a></li>
          </ul>
        </div>
      </div>

      {/* Social media and final touch */}
      <div className="mt-8 flex items-center justify-between text-gray-400 border-t border-gray-700 pt-6">
        <div className="text-sm">&copy; 2024 ArchCode. Todos los derechos reservados.</div>
        <div className="flex space-x-4">
          <a href="#"><img src="/images/instagram.svg" alt="Instagram" className="h-6 w-6 hover:text-white transition" /></a>
          <a href="#"><img src="/images/tiktok.svg" alt="TikTok" className="h-6 w-6 hover:text-white transition" /></a>
          <a href="#"><img src="/images/twitter.svg" alt="X" className="h-6 w-6 hover:text-white transition" /></a>
        </div>
      </div>
    </footer>
  );
}