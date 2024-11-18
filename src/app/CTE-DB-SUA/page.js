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
        <title>
          CTE-DB-SUA: Seguridad de Utilización y Accesibilidad | ArchCode
        </title>
        <meta
          name="description"
          content="El Documento Básico de Seguridad de Utilización y Accesibilidad (DB-SUA) minimiza el riesgo de accidentes y asegura la accesibilidad para todas las personas en los edificios."
        />
        <meta
          name="keywords"
          content="CTE, DB-SUA, seguridad de utilización, accesibilidad, arquitectura, normativa, construcción, movilidad reducida"
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
                    src="images/codes/DB-SUA.webp"
                    alt="Imagen relacionada con el CTE-DB-SUA"
                    className="w-full h-auto object-cover"
                  />
                </div>
                {/* Contenedor de texto */}
                <div className="md:w-1/2">
                  <h1 className="text-4xl font-bold mb-6">
                    CTE-DB-SUA: Seguridad de Utilización y Accesibilidad
                  </h1>
                  <p className="text-lg leading-relaxed mb-4">
                    El Documento Básico de Seguridad de Utilización y
                    Accesibilidad (DB-SUA) tiene como objetivo minimizar el
                    riesgo de accidentes durante el uso normal de los edificios y
                    asegurar que estos sean accesibles para todas las personas,
                    independientemente de sus capacidades físicas.
                  </p>
                  <p className="text-lg leading-relaxed mb-4">
                    Este documento aborda aspectos como la accesibilidad para
                    personas con movilidad reducida, la protección frente a
                    caídas y el riesgo de atrapamiento en puertas y ventanas.
                  </p>
                  <p className="text-lg leading-relaxed mb-4">
                    Incluye también disposiciones para el diseño seguro de
                    escaleras, rampas y pasarelas, así como la instalación de
                    barandillas y elementos de apoyo en las zonas de tránsito.
                  </p>
                  <p className="text-lg leading-relaxed">
                    De esta manera, se asegura un uso seguro y accesible para
                    todos los usuarios del edificio.
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
