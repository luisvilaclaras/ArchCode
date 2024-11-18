// app/page.js

import React from 'react';
import Head from 'next/head'; // Importamos el componente Head
import Menu from '@/components/LandingPage/Menu';
import Footer from '@/components/LandingPage/Footer';

export default function Page() {
  return (
    <>
      <Head>
        <title>CTE-DB-SI: Seguridad en Caso de Incendio | ArchCode</title>
        <meta
          name="description"
          content="El Documento Básico de Seguridad en Caso de Incendio (DB-SI) se centra en la protección de las personas y bienes en caso de un incendio en edificios."
        />
        <meta
          name="keywords"
          content="CTE, DB-SI, seguridad contra incendios, arquitectura, normativa, construcción, evacuación, protección"
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
                    src="images/codes/DB-SI.webp"
                    alt="Imagen relacionada con el CTE-DB-SI"
                    className="w-full h-auto object-cover"
                  />
                </div>
                {/* Contenedor de texto */}
                <div className="md:w-1/2">
                  <h1 className="text-4xl font-bold mb-6">
                    CTE-DB-SI: Seguridad en Caso de Incendio
                  </h1>
                  <p className="text-lg leading-relaxed mb-4">
                    El Documento Básico de Seguridad en Caso de Incendio (DB-SI) se centra en la protección de las personas y bienes en caso de un incendio en edificios.
                  </p>
                  <p className="text-lg leading-relaxed mb-4">
                    Este documento establece las medidas preventivas y las disposiciones técnicas necesarias para reducir el riesgo de incendio y facilitar una evacuación segura.
                  </p>
                  <p className="text-lg leading-relaxed mb-4">
                    Incluye normas sobre el diseño de rutas de evacuación, protección estructural contra el fuego y sistemas de detección y extinción.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Además, especifica la resistencia al fuego de los materiales constructivos y la sectorización de espacios para contener el incendio y evitar su propagación, asegurando que las personas puedan salir del edificio de manera rápida y segura en caso de emergencia.
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
