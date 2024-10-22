'use client';

import React, { useState } from 'react';
import Menu from '@/components/LandingPage/Menu';
import TryForFree from '@/components/LandingPage/TryForFree';
import ScrollingImages from '@/components/LandingPage/ScrollingImages';
import Reviews from '@/components/LandingPage/Reviews';
import Pricing from '@/components/LandingPage/Pricing';
import FAQ from '@/components/LandingPage/FAQ';
import Footer from '@/components/LandingPage/Footer';
import SignUpPopup from '@/components/LandingPage/SignUpPopUp'; // Importamos el popup de registro
import LogInPopup from '@/components/LandingPage/LogInPopUp'; // Importamos el popup de login (si es necesario)

export default function Home() {
  // Estado para controlar el popup de registro
  const [isSignUpPopupOpen, setIsSignUpPopupOpen] = useState(false);
  const [isLogInPopupOpen, setIsLogInPopupOpen] = useState(false);

  const openSignUpPopup = () => setIsSignUpPopupOpen(true);
  const closeSignUpPopup = () => setIsSignUpPopupOpen(false);

  const openLogInPopup = () => setIsLogInPopupOpen(true);
  const closeLogInPopup = () => setIsLogInPopupOpen(false);

  return (
    <div
      style={{
        backgroundColor: '#1e3047',
        overflowX: 'hidden',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
      }}
    >
      <div>
        {/* Menu Component */}
        <Menu
          openSignUpPopup={openSignUpPopup}
          openLogInPopup={openLogInPopup}
        />

        {/* SignUpPopup */}
        {isSignUpPopupOpen && <SignUpPopup closePopup={closeSignUpPopup} />}
        {isLogInPopupOpen && <LogInPopup closePopup={closeLogInPopup} />}

        
         
        <section id="home" className="font-personalizada hero bg-[#1e3047] text-white h-auto flex items-center justify-center pt-40 pb-20"> 
          <div className="grid grid-cols-2 gap-8 max-w-7xl mx-auto px-10 items-center"> {/* px-10 mantiene el mismo relleno en ambos lados */}
            <div className="text-left">
              <h1 className="font-personalizada text-4xl font-bold mb-4 leading-snug">La Herramienta Definitiva para las Normativas de Arquitectura</h1>
              <p className="text-xl mb-6 font-personalizada">Acelera tus proyectos con la potencia de la IA y ahorra tiempo</p>
              <button
                      onClick={openSignUpPopup}
                      className="bg-[#2563eb] text-white py-3 px-8 rounded-full shadow-md hover:shadow-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    >
                      Prueba gratis la Beta
                    </button>
              <div className="mt-8 flex space-x-8 text-lg text-gray-300">
                <div>
                  <strong className="text-white text-2xl">250+</strong>
                  <p className="text-gray-400 text-sm">Usuarios Activos</p>
                </div>
                <div>
                  <strong className="text-white text-2xl">10000+</strong>
                  <p className="text-gray-400 text-sm">Preguntas solucionadas</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <video 
                src="https://www.w3schools.com/html/mov_bbb.mp4" 
                className="w-full max-w-xl rounded-lg shadow-lg"  
                autoPlay 
                loop 
                muted
                playsInline
              />
            </div>
          </div>
        </section>
          

        {/* Scrolling Images Section */}
        <ScrollingImages />
        
        <section id="producto" className="bg-[#1e3047] text-white py-20 pt-32">
          <div className="text-center mb-5">
            <h1 className="text-5xl font-bold">
              Simplifica el cumplimiento normativo en tus proyectos
            </h1>
          </div>
          <section className="bg-[#1e3047] text-white py-20">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6">
              {/* Video */}
              <div className="space-y-6">
                <video
                  className="w-full rounded-md shadow-lg"
                  autoPlay
                  loop
                  muted
                >
                  <source
                    src="https://www.w3schools.com/html/mov_bbb.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Explicación del video */}
              <div className="max-w-md">
                <span className="inline-block bg-green-500 text-white text-sm px-3 py-1 rounded-full mb-4">
                  ✔ Respuestas Instantáneas
                </span>
                <h2 className="text-3xl font-bold mb-4 leading-snug">
                  Encuentra Respuesta a Tus Preguntas al Instante
                </h2>
                <p className="mb-4 text-lg leading-relaxed">
                  Con solo un clic, nuestra herramienta te proporciona la interpretación correcta de los códigos técnicos de arquitectura. Ya sea una normativa del CTE o un detalle específico sobre un sistema constructivo, nuestra IA te ofrece la guía adecuada.
                </p>
              </div>
            </div>
          </section>

          {/* Segunda Sección: Video a la derecha, Texto a la izquierda */}
          <section className="bg-[#1e3047] text-white py-20">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6">
              {/* Explicación del video */}
              <div className="max-w-md">
                <span className="inline-block bg-green-500 text-white text-sm px-3 py-1 rounded-full mb-4">
                  ✔ Respuestas Precisas
                </span>
                <h2 className="text-3xl font-bold mb-4 leading-snug">
                  Proporciona más detalles para obtener respuestas más precisas
                </h2>
                <p className="mb-4 text-lg leading-relaxed">
                  Cuanta más información proporciones, más exactas serán las respuestas. Introduce etiquetas específicas sobre tu proyecto, como el tipo de edificación o ubicación, y nuestra IA se encargará de hacer el resto.
                </p>
              </div>

              {/* Video */}
              <div className="space-y-6">
                <video
                  className="w-full rounded-md shadow-lg"
                  autoPlay
                  loop
                  muted
                >
                  <source
                    src="https://www.w3schools.com/html/mov_bbb.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </section>

          {/* Tercera Sección */}
          <section className="bg-[#1e3047] text-white py-20">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6">
              {/* Video */}
              <div className="space-y-6">
                <video
                  className="w-full rounded-md shadow-lg"
                  autoPlay
                  loop
                  muted
                >
                  <source
                    src="https://www.w3schools.com/html/mov_bbb.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Explicación del video */}
              <div className="max-w-md">
                <span className="inline-block bg-green-500 text-white text-sm px-3 py-1 rounded-full mb-4">
                  ✔ Explicaciones detalladas
                </span>
                <h2 className="text-3xl font-bold mb-4 leading-snug">
                  Entiende y Comprende la Normativa
                </h2>
                <p className="mb-4 text-lg leading-relaxed">
                  Más que solo respuestas, nuestra IA te ayuda a interpretar y aplicar las normativas arquitectónicas con profundidad. Aprende a desglosar y entender cada código, para que puedas implementarlo fácilmente en tus proyectos, asegurando el cumplimiento de cada detalle técnico.
                </p>
              </div>
            </div>
          </section>
        </section>


        {/* Information Section */}
        <section id="ventajas" className="bg-[#1e3047] py-20  text-center">
          <h2 className="text-3xl font-bold mb-6 text-white pt-20">
            Agiliza tu Proceso de Investigación
          </h2>
          <p className="text-base text-gray-300 max-w-2xl mx-auto mb-8">
            Transforma la complejidad normativa en respuestas claras y
            eficientes con la ayuda de la IA
          </p>

          <div className="flex justify-center space-x-6">
          <div className="bg-[#344e6f] p-6 shadow-lg rounded-lg w-64">
            {/* Imagen encima del título */}
            <img src="images/investigar.png" alt="Icon 1" className="mx-auto mb-3 w-12 h-12" />
            <h3 className="text-base font-semibold text-white">Investiga Más Rápido</h3>
            <p className="text-sm text-gray-300 mt-2">Supera la simple recopilación de secciones de códigos y asambleas. Encuentra respuestas con mayor agilidad.</p>
          </div>
          <div className="bg-[#344e6f] p-6 shadow-lg rounded-lg w-64">
            {/* Imagen encima del título */}
            <img src="images/tiempo.png" alt="Icon 2" className="mx-auto mb-3 w-12 h-12" />
            <h3 className="text-base font-semibold text-white">Sé más eficiente</h3>
            <p className="text-sm text-gray-300 mt-2">Identifica recursos valiosos que podrías haber pasado por alto en tu investigación, optimizando el tiempo y esfuerzo.</p>
          </div>
          <div className="bg-[#344e6f] p-6 shadow-lg rounded-lg w-64">
            {/* Imagen encima del título */}
            <img src="images/informacion valiosa.png" alt="Icon 3" className="mx-auto mb-3 w-12 h-12" />
            <h3 className="text-base font-semibold text-white">Sé más eficiente</h3>
            <p className="text-sm text-gray-300 mt-2">Desglosa y analiza grandes volúmenes de códigos y asambleas sin complicaciones.</p>
          </div>
        </div>
        <div className="flex justify-center space-x-6 mt-8">
          <div className="bg-[#344e6f] p-6 shadow-lg rounded-lg w-64">
            {/* Imagen encima del título */}
            <img src="images/ia.png" alt="Icon 4" className="mx-auto mb-3 w-12 h-12" />
            <h3 className="text-base font-semibold text-white">Aprovecha la IA</h3>
            <p className="text-sm text-gray-300 mt-2">Utiliza el poder de la inteligencia artificial para interpretar y aplicar normativas de manera más eficiente y precisa.</p>
          </div>
          <div className="bg-[#344e6f] p-6 shadow-lg rounded-lg w-64">
            {/* Imagen encima del título */}
            <img src="images/Simplifica.png" alt="Icon 5" className="mx-auto mb-3 w-12 h-12" />
            <h3 className="text-base font-semibold text-white">Simplifica la normativa</h3>
            <p className="text-sm text-gray-300 mt-2">Convierte la complejidad de los códigos técnicos en respuestas claras y fáciles de entender.</p>
          </div>
        </div>
      </section>


        {/* Try For Free Section */}
        <section
          className="bg-gradient-to-r from-lightBlue to-darkBlue text-white py-20 text-center"
        >
          <h2 className="text-3xl font-bold mb-6">
            ¡Empieza a agilizar tus proyectos ahora!
          </h2>
          <button
            onClick={openSignUpPopup}
            className="bg-white text-blue-500 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out"
          >
            Pruébalo Gratis
          </button>
        </section>

        {/* Reviews Section */}
        <section id="reviews" className="pt-40">
          <Reviews />
        </section>

        {/* Satisfied Users Section */}
        <section id="nuestro-lema"  className=" pt-40 bg-[#1e3047] text-white py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 leading-relaxed">
              "El éxito de un proyecto no solo está en su diseño, sino en su capacidad para cumplir con cada normativa. Contar con las respuestas correctas es tan esencial como los planos mismos."
            </h2>
          </div>
        </section>


        {/* Pricing Section */}
        <section id="precios">
          <Pricing />
        </section>

        {/* 3 Simple Steps Section */}
        <section 
          id="como-se-usa"
          className="bg-[#1e3047] py-20 text-center pt-30 scroll-mt-20"
          >
          <h2 className="text-4xl font-bold mb-8 text-white">Cómo se Usa</h2>
          <video
            src="https://your-video-url.com"
            controls
            className="w-full max-w-3xl h-auto mx-auto mb-8 shadow-lg rounded-lg"
          ></video>
          <div className="flex flex-wrap justify-center space-x-8">
            {/* Pasos */}
            {/* ... (contenido de los pasos) ... */}
          </div>
        </section>



        {/* FAQ Section */}
        <section id="faq">
          <div className='pt-20'>
            <FAQ />
          </div>
        </section>

        {/* Footer Section */}
        <section
          id="contacto"
          className="bg-gradient-to-r from-lightBlue to-darkBlue text-white py-20 text-center"
        >
          <h2 className="text-3xl font-bold mb-6">
            ¡Empieza a agilizar tus proyectos ahora!
          </h2>
          <button
            onClick={openSignUpPopup}
            className="bg-white text-blue-500 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out"
          >
            Pruébalo Gratis
          </button>
        </section>
        <Footer>
          
          </Footer>
      </div>
    </div>
  );
}
