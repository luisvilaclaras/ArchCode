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
        <title>CTE-DB-SE: Seguridad Estructural | ArchCode</title>
        <meta
          name="description"
          content="El Documento Básico de Seguridad Estructural (DB-SE) garantiza la estabilidad y seguridad de los edificios, protegiendo a los ocupantes frente a riesgos estructurales."
        />
        <meta
          name="keywords"
          content="CTE, DB-SE, seguridad estructural, arquitectura, normativa, construcción, estabilidad, edificios"
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
                    src="images/codes/DB-SE.webp"
                    alt="Imagen relacionada con el CTE-DB-SE"
                    className="w-full h-auto object-cover"
                  />
                </div>
                {/* Contenedor de texto */}
                <div className="md:w-1/2">
                  <h1 className="text-4xl font-bold mb-6">
                    CTE-DB-SE: Seguridad Estructural
                  </h1>
                  <p className="text-lg leading-relaxed mb-4">
                    El Documento Básico de Seguridad Estructural (DB-SE) se encarga de garantizar la estabilidad y seguridad estructural de los edificios, protegiendo a los ocupantes frente a riesgos de colapso o fallos estructurales.
                  </p>
                  <p className="text-lg leading-relaxed mb-4">
                    Este documento incluye normas de diseño y construcción para soportar cargas, ya sean permanentes, como el peso del edificio, o variables, como el peso de los ocupantes y muebles, además de cargas accidentales como las provocadas por terremotos o fuertes vientos.
                  </p>
                  <p className="text-lg leading-relaxed mb-4">
                    También establece requisitos para la resistencia de materiales y la durabilidad de los sistemas estructurales, asegurando que la construcción sea segura y cumpla con los estándares de estabilidad a lo largo del tiempo.
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
