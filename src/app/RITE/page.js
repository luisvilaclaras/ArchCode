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
        <title>RITE: Reglamento de Instalaciones Térmicas en los Edificios | ArchCode</title>
        <meta
          name="description"
          content="El Reglamento de Instalaciones Térmicas en los Edificios (RITE) regula el diseño, instalación y mantenimiento de las instalaciones térmicas en edificios, garantizando eficiencia energética, seguridad y confort."
        />
        <meta
          name="keywords"
          content="RITE, reglamento instalaciones térmicas, eficiencia energética, arquitectura, normativa, construcción, calefacción, refrigeración, ventilación"
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
                    src="images/codes/RITE.webp"
                    alt="Imagen relacionada con el RITE"
                    className="w-full h-auto object-cover"
                  />
                </div>
                {/* Contenedor de texto */}
                <div className="md:w-1/2">
                  <h1 className="text-4xl font-bold mb-6">
                    RITE: Reglamento de Instalaciones Térmicas en los Edificios
                  </h1>
                  <p className="text-lg leading-relaxed mb-4">
                    El Reglamento de Instalaciones Térmicas en los Edificios (RITE) es una normativa que regula el diseño, instalación y mantenimiento de las instalaciones térmicas en edificios, con el objetivo de garantizar la eficiencia energética, seguridad y confort de los usuarios.
                  </p>
                  <p className="text-lg leading-relaxed mb-4">
                    Este reglamento establece los requisitos para sistemas de calefacción, refrigeración, ventilación y agua caliente sanitaria, dictando criterios para la selección de equipos, materiales y sistemas que aseguren un rendimiento óptimo y un consumo energético responsable.
                  </p>
                  <p className="text-lg leading-relaxed mb-4">
                    El RITE también aborda las condiciones de funcionamiento y los controles necesarios para asegurar que las instalaciones operen de manera eficiente y cumplan con los estándares de sostenibilidad, promoviendo el uso de energías renovables y la reducción de emisiones contaminantes en el sector de la construcción.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Asimismo, incluye disposiciones sobre el mantenimiento preventivo y correctivo para alargar la vida útil de las instalaciones y mejorar la seguridad y eficiencia del edificio a lo largo del tiempo.
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
