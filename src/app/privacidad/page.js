import React from 'react';
import Footer from '@/components/LandingPage/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="bg-[#1e3047] min-h-screen py-16 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8 text-center">Política de Privacidad</h1>
        <div className="text-gray-300 space-y-8">
          <p>
            Esta Política de Privacidad se refiere a la plataforma ArchCode y detalla cómo recopilamos, utilizamos y divulgamos tu información personal cuando usas la plataforma. Al utilizar ArchCode, consientes los términos y condiciones de esta Política. Si no estás de acuerdo con los términos de esta Política, debes abstenerte de utilizar la plataforma.
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Información que Recopilamos</h2>
            <div className="w-full h-px bg-white my-2"></div>
            <ul className="list-disc pl-6 space-y-2">
              <li>Datos de uso de la plataforma: Recopilamos información sobre cómo interactúas con la plataforma, incluidos los tipos de consultas que realizas, el contenido accedido y el tiempo de uso.</li>
              <li>Datos de suscripción y facturación: Si te suscribes a nuestro servicio, podemos recopilar información sobre tus pagos y facturación, como los productos comprados y la fecha de transacción.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Uso de la Información</h2>
            <div className="w-full h-px bg-white my-2"></div>
            <ul className="list-disc pl-6 space-y-2">
              <li>Proporcionar y mejorar la plataforma: Usamos los datos para operar y mantener ArchCode, mejorar sus características y funcionalidad, y personalizar tu experiencia de usuario.</li>
              <li>Comunicarnos contigo: Podemos utilizar tus datos para enviarte actualizaciones sobre la plataforma, responder a tus consultas o comentarios y ofrecer asistencia técnica.</li>
              <li>Cumplir con obligaciones legales: Podemos usar tus datos para cumplir con las leyes, regulaciones o solicitudes legales aplicables.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Servicios de Terceros</h2>
            <div className="w-full h-px bg-white my-2"></div>
            <p>Podemos utilizar servicios de terceros para procesar pagos o autenticar usuarios, y dichos servicios estarán sujetos a sus propias políticas de privacidad. Te recomendamos revisar las políticas de privacidad de estos servicios.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Divulgación de Información</h2>
            <div className="w-full h-px bg-white my-2"></div>
            <ul className="list-disc pl-6 space-y-2">
              <li>Con tu consentimiento: Podemos compartir tus datos cuando nos hayas dado tu consentimiento explícito para hacerlo.</li>
              <li>Razones legales: Podremos divulgar tus datos si creemos de buena fe que es necesario para cumplir con la ley, proteger nuestros derechos o la seguridad de nuestros usuarios.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Retención de Datos</h2>
            <div className="w-full h-px bg-white my-2"></div>
            <p>Conservaremos tus datos personales mientras sea necesario para cumplir con los propósitos para los que fueron recopilados, según se describe en esta Política. También retendremos tus datos personales según lo exijan las leyes o regulaciones aplicables.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Tus Derechos de Protección de Datos</h2>
            <div className="w-full h-px bg-white my-2"></div>
            <p>Tienes el derecho de acceder, corregir, actualizar o solicitar la eliminación de tus datos personales. También puedes oponerte al procesamiento de tus datos, solicitar la restricción del procesamiento o solicitar la portabilidad de tus datos. Puedes ejercer estos derechos contactándonos en <a href="mailto:info@archcode.io" className="text-blue-400 hover:underline">info@archcode.io</a>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Cambios en la Política</h2>
            <div className="w-full h-px bg-white my-2"></div>
            <p>Podemos modificar esta Política periódicamente. Si realizamos cambios sustanciales, te notificaremos a través de la plataforma o por otros medios, como el correo electrónico. El uso continuado de ArchCode después de que entren en vigor los cambios indicará tu aceptación de estos.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Información de Contacto</h2>
            <div className="w-full h-px bg-white my-2"></div>
            <p>Si tienes alguna pregunta o inquietud sobre esta Política o sobre ArchCode, por favor contáctanos en <a href="mailto:info@archcode.io" className="text-blue-400 hover:underline">info@archcode.io</a>.</p>
          </section>
        </div>
      </div>
        <Footer></Footer>
    </div>
  );
}
