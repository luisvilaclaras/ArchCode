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
        <title>CTE-DB-HE: Ahorro de Energía | ArchCode</title>
        <meta
          name="description"
          content="El Documento Básico de Ahorro de Energía (DB-HE) establece los requisitos mínimos de eficiencia energética en los edificios para reducir el consumo de energía y promover el uso de fuentes de energía renovable."
        />
        <meta
          name="keywords"
          content="CTE, DB-HE, ahorro de energía, eficiencia energética, arquitectura, normativa, construcción, energías renovables"
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
                    src="images/codes/DB-HE.webp"
                    alt="Imagen relacionada con el CTE-DB-HE"
                    className="w-full h-auto object-cover"
                  />
                </div>
                {/* Contenedor de texto */}
                <div className="md:w-1/2">
                  <h1 className="text-4xl font-bold mb-6">
                    CTE-DB-HE: Ahorro de Energía
                  </h1>
                  <p className="text-lg leading-relaxed mb-4">
                    El Documento Básico de Ahorro de Energía (DB-HE) establece los requisitos mínimos de eficiencia energética en los edificios para reducir el consumo de energía y promover el uso de fuentes de energía renovable.
                  </p>
                  <p className="text-lg leading-relaxed mb-4">
                    Este documento abarca la envolvente térmica del edificio, la eficiencia de los sistemas de calefacción, refrigeración e iluminación, y la instalación de energías renovables, como paneles solares.
                  </p>
                  <p className="text-lg leading-relaxed mb-4">
                    El DB-HE busca que los edificios sean energéticamente sostenibles y cumplan con los estándares europeos de eficiencia.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Con ello, se pretende reducir las emisiones de gases de efecto invernadero y contribuir a la sostenibilidad a largo plazo.
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
