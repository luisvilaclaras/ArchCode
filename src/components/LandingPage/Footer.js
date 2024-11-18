// Footer.js

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const router = useRouter();

  // Función para desplazarse a la sección correspondiente
  const handleScrollToSection = (id) => {
    if (window.location.pathname !== '/') {
      router.push(`/#${id}`);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-[#1e3047] py-12 px-6 text-white font-personalizada">
      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-4">
        {/* Logo y lema */}
        <div className="mb-4 md:-ml-48 text-center">
          <img
            src="/images/ArchCode.webp"
            alt="ArchCode Logo"
            className="h-12 w-auto mx-auto cursor-pointer"
            onClick={() => handleScrollToSection('home')}
          />
          <p className="text-sm mt-1 text-gray-300 max-w-[200px] mx-auto text-center leading-tight">
            Acelera tus proyectos con la potencia de la IA y ahorra tiempo
          </p>
        </div>

        {/* Navegación */}
        <div className="md:col-span-1 text-sm space-y-2">
          <h3 className="text-lg font-semibold mb-4">Navegación</h3>
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
              Descubre cómo funciona
            </li>
            <li
              className="hover:text-white transition cursor-pointer"
              onClick={() => handleScrollToSection('faq')}
            >
              FAQ
            </li>
            <li>
              <a href="/blog" className="hover:text-white transition">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Ayuda y Legal */}
        <div className="md:col-span-1 text-sm space-y-6">
          {/* Ayuda */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Ayuda</h3>
            <ul className="text-gray-300 space-y-2">
              <li>
                <a href="#" className="hover:text-white transition">
                  Centro de Ayuda
                </a>
              </li>
            </ul>
          </div>
          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="text-gray-300 space-y-2">
              <li>
                <a href="/terminos" className="hover:text-white transition">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="/privacidad" className="hover:text-white transition">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="/politicas-usuario" className="hover:text-white transition">
                  Uso Aceptable
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Documents */}
        <div className="md:col-span-1 text-sm space-y-2">
          <h3 className="text-lg font-semibold mb-4">Documentos</h3>
          <ul className="text-gray-300 space-y-2">
            <li>
              <a href="/CTE-DB-SI" className="hover:text-white transition">
                CTE-DB-SI
              </a>
            </li>
            <li>
              <a href="/CTE-DB-SUA" className="hover:text-white transition">
                CTE-DB-SUA
              </a>
            </li>
            <li>
              <a href="/CTE-DB-HE" className="hover:text-white transition">
                CTE-DB-HE
              </a>
            </li>
            <li>
              <a href="/CTE-DB-HS" className="hover:text-white transition">
                CTE-DB-HS
              </a>
            </li>
            <li>
              <a href="/CTE-DB-HR" className="hover:text-white transition">
                CTE-DB-HR
              </a>
            </li>
            <li>
              <a href="/CTE-DB-SE" className="hover:text-white transition">
                CTE-DB-SE
              </a>
            </li>
            <li>
              <a href="/RITE" className="hover:text-white transition">
                RITE
              </a>
            </li>
            <li>
              <a href="/REBT" className="hover:text-white transition">
                REBT
              </a>
            </li>
          </ul>
        </div>
      </div>

      
    </footer>
  );
}
