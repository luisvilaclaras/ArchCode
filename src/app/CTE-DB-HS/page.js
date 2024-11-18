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
        <title>CTE-DB-HS: Salubridad | ArchCode</title>
        <meta
          name="description"
          content="El Documento Básico de Salubridad (DB-HS) se centra en las condiciones de higiene y salubridad que deben cumplir los edificios para garantizar un ambiente saludable para los ocupantes."
        />
        <meta
          name="keywords"
          content="CTE, DB-HS, salubridad, higiene, arquitectura, normativa, construcción, salud, edificios"
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
                    src="images/codes/DB-HS.webp"
                    alt="Imagen relacionada con el CTE-DB-HS"
                    className="w-full h-auto object-cover"
                  />
                </div>
                {/* Contenedor de texto */}
                <div className="md:w-1/2">
                  <h1 className="text-4xl font-bold mb-6">
                    CTE-DB-HS: Salubridad
                  </h1>
                  <p className="text-lg leading-relaxed mb-4">
                    El Documento Básico de Salubridad (DB-HS) se centra en las condiciones de higiene y salubridad que deben cumplir los edificios para garantizar un ambiente saludable para los ocupantes.
                  </p>
                  <p className="text-lg leading-relaxed mb-4">
                    Establece normativas sobre el control de la humedad, la calidad del aire interior, y la eliminación de residuos.
                  </p>
                  <p className="text-lg leading-relaxed mb-4">
                    Además, aborda el abastecimiento y la evacuación de agua potable y residual, asegurando que las instalaciones sanitarias cumplan con estándares de salubridad.
                  </p>
                  <p className="text-lg leading-relaxed">
                    El DB-HS contribuye a la creación de entornos saludables, evitando problemas como la humedad excesiva, la contaminación del aire y la presencia de moho, factores que pueden afectar la salud de los ocupantes.
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
