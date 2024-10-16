import React from 'react';

export default function Pricing({ openSignUpPopup }) {
  return (
    <section className="bg-[#001F54] text-white py-16 text-center pt-28">
      <h2 className="text-4xl font-bold mb-6">Precios</h2>
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-8 rounded-lg shadow-lg inline-block max-w-md mx-auto">
        <p className="text-3xl font-bold mb-4">3 días de acceso ilimitado</p>
        <p className="text-5xl font-bold mb-6">Pruébalo Gratis</p>
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
        {/* Eliminamos los testimonios y estadísticas */}
        {/* Botón que abre el popup de registro */}
        <button
          onClick={openSignUpPopup}
          className="bg-white text-blue-600 py-3 px-6 rounded-full font-semibold shadow hover:bg-gray-100 transition duration-300"
        >
          Comenzar
        </button>
        {/* Eliminamos los métodos de pago */}
        {/* Texto final */}
        <p className="text-sm mt-4">3 días gratis | Sin meter tu tarjeta.</p>
      </div>
    </section>
  );
}
