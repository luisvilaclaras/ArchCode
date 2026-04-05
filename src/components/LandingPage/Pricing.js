import React from 'react';

export default function Pricing({ openSignUpPopup }) {
  return (
    <section className="font-personalizada bg-[#1e3047] text-white py-16 px-4 md:px-0 text-center pt-28">
      {/* En móviles se reduce el tamaño del título a text-3xl, en escritorio se mantiene text-4xl */}
      <h2 className="text-3xl md:text-4xl font-bold mb-6">Periodo de Beta</h2>
      <div className="bg-[#2563eb] text-white p-8 rounded-lg shadow-lg inline-block max-w-md mx-auto">
        {/* Texto descriptivo: en móvil text-2xl, en escritorio text-3xl */}
        <p className="text-2xl md:text-3xl font-bold mb-4">Acceso ilimitado durante la beta</p>
        {/* Título de llamada a la acción: en móvil text-3xl, en escritorio text-5xl */}
        <p className="text-3xl md:text-5xl font-bold mb-6">Pruébalo Ahora</p>
        <ul className="text-left mb-6 space-y-2">
          <li className="flex items-center space-x-2">
            <span>✔️</span>
            <span>Responde a preguntas ilimitadas</span>
          </li>
          <li className="flex items-center space-x-2">
            <span>✔️</span>
            <span>Trabaja con los documentos oficiales actualizados en tiempo real</span>
          </li>
          <li className="flex items-center space-x-2">
            <span>✔️</span>
            <span>Respuestas explicadas y con referencias de los documentos</span>
          </li>
          <li className="flex items-center space-x-2">
            <span>✔️</span>
            <span>Respuestas adaptadas a los datos de tu proyecto</span>
          </li>
        </ul>
        {/* Botón que abre el popup de registro; se centra en móvil */}
        <button
          onClick={openSignUpPopup}
          className="bg-white text-blue-600 py-3 px-6 rounded-full font-semibold shadow hover:bg-gray-100 transition duration-300 block md:inline-block mx-auto md:mx-0"
        >
          Comenzar
        </button>
        {/* Texto final */}
        <p className="text-sm mt-4">Versión Beta abierta al público</p>
      </div>
    </section>
  );
}
