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
        <title>REBT: Reglamento Electrotécnico para Baja Tensión | ArchCode</title>
        <meta
          name="description"
          content="El Reglamento Electrotécnico para Baja Tensión (REBT) regula las instalaciones eléctricas de baja tensión en los edificios, asegurando la seguridad de las personas, los bienes y el entorno."
        />
        <meta
          name="keywords"
          content="REBT, reglamento electrotécnico, baja tensión, instalaciones eléctricas, arquitectura, normativa, construcción, seguridad eléctrica"
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
                    src="images/codes/REBT.webp"
                    alt="Imagen relacionada con el REBT"
                    className="w-full h-auto object-cover"
                  />
                </div>
                {/* Contenedor de texto */}
                <div className="md:w-1/2">
                  <h1 className="text-4xl font-bold mb-6">
                    REBT: Reglamento Electrotécnico para Baja Tensión
                  </h1>
                  <p className="text-lg leading-relaxed mb-4">
                    El Reglamento Electrotécnico para Baja Tensión (REBT) regula las instalaciones eléctricas de baja tensión en los edificios y su objetivo principal es asegurar la seguridad de las personas, los bienes y el entorno.
                  </p>
                  <p className="text-lg leading-relaxed mb-4">
                    Este reglamento establece las condiciones de diseño, ejecución y mantenimiento que deben cumplir las instalaciones eléctricas para minimizar riesgos de incendio, cortocircuito o electrocución.
                  </p>
                  <p className="text-lg leading-relaxed mb-4">
                    A través de diferentes Instrucciones Técnicas Complementarias (ITC), el REBT cubre aspectos como la protección contra sobretensiones, la distribución de energía en el edificio, el dimensionamiento de los conductores y el uso de dispositivos de seguridad como interruptores diferenciales y sistemas de puesta a tierra.
                  </p>
                  <p className="text-lg leading-relaxed mb-4">
                    También promueve la eficiencia energética mediante la optimización del consumo eléctrico y la incorporación de tecnologías de bajo consumo y energías renovables, cuando sea posible.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Además, el REBT especifica los requisitos para el mantenimiento periódico de las instalaciones, asegurando que continúen siendo seguras y cumplan con la normativa vigente a lo largo del tiempo.
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
