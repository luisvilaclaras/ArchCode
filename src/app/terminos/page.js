import React from 'react';
import Footer from '@/components/LandingPage/Footer';
export default function TermsAndConditions() {
  return (
    <div className="bg-[#1e3047] min-h-screen py-16 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8 text-center">Términos y Condiciones</h1>
        <div className="text-gray-300 space-y-8">
          <p>
            Bienvenido a ArchCode, una plataforma de software diseñada para ayudar a profesionales de la arquitectura y la construcción a encontrar respuestas en el Código Técnico de la Edificación y otras normativas relacionadas. Al utilizar nuestra plataforma, aceptas los siguientes términos y condiciones.
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Disponibilidad del Servicio y Responsabilidad</h2>
            <div className="w-full h-px bg-white my-2"></div>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nos esforzamos por mantener la plataforma disponible en todo momento, pero no garantizamos que esté libre de interrupciones o errores.</li>
              <li>No asumimos responsabilidad por la exactitud o precisión de las respuestas proporcionadas por la plataforma.</li>
              <li>La plataforma se ofrece en su estado actual sin garantías de funcionalidad, rendimiento o disponibilidad. El uso de la plataforma es bajo tu propio riesgo, y no somos responsables de cualquier pérdida o daño derivado de su uso o imposibilidad de uso.</li>
              <li>Bajo ninguna circunstancia la empresa será responsable por cualquier daño derivado del uso de la plataforma.</li>
              <li>Nos reservamos el derecho de actualizar o discontinuar nuestra plataforma en cualquier momento sin previo aviso.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Derechos de Propiedad Intelectual</h2>
            <div className="w-full h-px bg-white my-2"></div>
            <ul className="list-disc pl-6 space-y-2">
              <li>La plataforma y todo su contenido, incluidos pero no limitados a texto, software, scripts, códigos, diseños, gráficos, fotos, sonidos, música, videos, aplicaciones, funciones interactivas y otros materiales, son propiedad de la empresa y están protegidos por leyes de propiedad intelectual.</li>
              <li>No puedes utilizar ninguno de los contenidos con fines comerciales o para cualquier propósito ilegal o no autorizado.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Política de Privacidad</h2>
            <div className="w-full h-px bg-white my-2"></div>
            <ul className="list-disc pl-6 space-y-2">
              <li>Tomamos muy en serio la protección de la información personal de nuestros usuarios.</li>
              <li>Nuestra política de privacidad, que puedes encontrar en nuestra página web, explica cómo recopilamos, utilizamos, protegemos y divulgamos la información personal.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Pagos y Facturación</h2>
            <div className="w-full h-px bg-white my-2"></div>
            <ul className="list-disc pl-6 space-y-2">
              <li>La plataforma se ofrece mediante suscripción, con tarifas cobradas de forma mensual o anual.</li>
              <li>Nos reservamos el derecho de cambiar nuestras tarifas de suscripción en cualquier momento. El usuario puede cancelar su suscripción en cualquier momento, pero no tendrá derecho a un reembolso por el período ya pagado.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Cambios en los Términos del Servicio</h2>
            <div className="w-full h-px bg-white my-2"></div>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nos reservamos el derecho de modificar estos términos del servicio en cualquier momento.</li>
              <li>Si realizamos cambios, publicaremos los nuevos términos en esta página. Al continuar utilizando la plataforma después de que se realicen los cambios, aceptas los nuevos términos del servicio.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Contáctanos</h2>
            <div className="w-full h-px bg-white my-2"></div>
            <p>Si tienes alguna pregunta o inquietud respecto a estos términos del servicio, por favor contáctanos en <a href="mailto:info@archcode.io" className="text-blue-400 hover:underline">info@archcode.io</a>.</p>
          </section>
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
}
