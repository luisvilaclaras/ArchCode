import React from 'react';
import Footer from '@/components/LandingPage/Footer';

export default function UserPolicy() {
  return (
    <div className="bg-[#1e3047] min-h-screen py-16 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8 text-center">Política de Usuario</h1>
        <div className="text-gray-300 space-y-8">
          <p>
            Nuestra plataforma está destinada únicamente para uso profesional y educativo en el campo de la arquitectura y la construcción. El uso de nuestra plataforma para fines comerciales o no relacionados con la arquitectura está estrictamente prohibido.
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Suspensión de Cuentas</h2>
            <div className="w-full h-px bg-white my-2"></div>
            <p>Nos reservamos el derecho de suspender cualquier cuenta que sea utilizada de manera indebida.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Uso Indebido</h2>
            <div className="w-full h-px bg-white my-2"></div>
            <p>
              Cualquier uso indebido o no autorizado de nuestra plataforma, incluyendo pero no limitado a la falsificación de datos o información, está estrictamente prohibido. Si se detecta el uso indebido de la plataforma, no seremos responsables y la responsabilidad recaerá únicamente sobre el usuario.
            </p>
          </section>
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
}
