'use client';

import React from 'react';

export default function ScrollingImages() {
  return (
    <section className="relative bg-[#1e3047]">
      <div className="overflow-hidden">
        {/* Contenedor de imágenes en bucle */}
        <div className="flex items-center justify-start space-x-20 animate-scroll pb-12">
          {/* Imágenes */}
          <img src="/images/BOE.webp" alt="Image 1" className="w-24 h-24 md:w-36 md:h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/REBT.webp" alt="Image 2" className="w-24 h-24 md:w-36 md:h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/RITE.webp" alt="Image 3" className="w-24 h-24 md:w-36 md:h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/CTE.webp" alt="Image 4" className="w-24 h-24 md:w-36 md:h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/HS.webp" alt="Image 5" className="w-24 h-24 md:w-36 md:h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/SE.webp" alt="Image 6" className="w-24 h-24 md:w-36 md:h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/SI.webp" alt="Image 7" className="w-24 h-24 md:w-36 md:h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/SUA.webp" alt="Image 8" className="w-24 h-24 md:w-36 md:h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/HR.webp" alt="Image 9" className="w-24 h-24 md:w-36 md:h-36 object-cover shadow-lg rounded-md inline-block" />

          {/* Duplicamos las imágenes para una animación continua */}
          <img src="/images/BOE.webp" alt="Image 1" className="w-24 h-24 md:w-36 md:h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/REBT.webp" alt="Image 2" className="w-24 h-24 md:w-36 md:h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/RITE.webp" alt="Image 3" className="w-24 h-24 md:w-36 md:h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/CTE.webp" alt="Image 4" className="w-24 h-24 md:w-36 md:h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/HS.webp" alt="Image 5" className="w-24 h-24 md:w-36 md:h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/SE.webp" alt="Image 6" className="w-24 h-24 md:w-36 md:h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/SI.webp" alt="Image 7" className="w-24 h-24 md:w-36 md:h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/SUA.webp" alt="Image 8" className="w-24 h-24 md:w-36 md:h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/HR.webp" alt="Image 9" className="w-24 h-24 md:w-36 md:h-36 object-cover shadow-lg rounded-md inline-block" />
        </div>
      </div>

      {/* Estilos para la animación */}
      <style jsx>{`
        .animate-scroll {
          display: flex;
          animation: scroll 15s linear infinite;
        }

        @media (min-width: 768px) {
          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </section>
  );
}
