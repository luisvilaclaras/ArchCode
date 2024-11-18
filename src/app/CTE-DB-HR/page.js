// app/page.js

'use client';

import React from 'react';
import Head from 'next/head'; // Importamos el componente Head
import Menu from '@/components/LandingPage/Menu';
import Footer from '@/components/LandingPage/Footer';

export default function Page() {
  return (
    <>
      <Head>
        <title>CTE-DB-HR: Protección Frente al Ruido | ArchCode</title>
        <meta
          name="description"
          content="El Documento Básico de Protección Frente al Ruido (DB-HR) establece requisitos para el aislamiento acústico de los edificios, reduciendo la exposición al ruido y mejorando el confort."
        />
        <meta
          name="keywords"
          content="CTE, DB-HR, protección frente al ruido, aislamiento acústico, arquitectura, normativa, construcción, confort acústico"
        />
      </Head>
      <div className="bg-[#1e3047] overflow-x-hidden m-0 p-0 box-border">
        {/* Componente del Menú */}
        <Menu />

        <main className="font-personalizada min-h-screen flex flex-col">
          <section className="flex-grow">
            <div className="bg-[#F5F5F5] text-[#333333] py-12 mt-32">
              <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center">
                {/* Contenedor de imagen */}
                <div className="md:w-1/3 mt-8 md:mt-0 md:mr-16">
                  <img
                    src="images/codes/DB-HR.webp"
                    alt="Imagen relacionada con el CTE-DB-HR"
                    className="w-full h-auto object-cover"
                  />
                </div>
                {/* Contenedor de texto */}
                <div className="md:w-1/2">
                  <h1 className="text-4xl font-bold mb-6">
                    CTE-DB-HR: Protección Frente al Ruido
                  </h1>
                  <p className="text-lg leading-relaxed mb-4">
                    El Documento Básico de Protección Frente al Ruido (DB-HR) establece requisitos para el aislamiento acústico de los edificios, con el fin de reducir la exposición al ruido de los ocupantes y mejorar su confort.
                  </p>
                  <p className="text-lg leading-relaxed mb-4">
                    Este documento cubre el aislamiento acústico entre diferentes unidades de uso, la protección contra el ruido exterior y las instalaciones que generan sonido en el edificio.
                  </p>
                  <p className="text-lg leading-relaxed mb-4">
                    Define el nivel de insonorización necesario en paredes, techos y suelos para asegurar que el ruido no interfiera con las actividades cotidianas de los ocupantes.
                  </p>
                  <p className="text-lg leading-relaxed">
                    El DB-HR es esencial para crear ambientes habitables y proteger el bienestar y la tranquilidad en los espacios interiores.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Componente del Pie de Página */}
          <Footer />
        </main>
      </div>
    </>
  );
}
