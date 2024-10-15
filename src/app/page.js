import Menu from '@/components/LandingPage/Menu';
import TryForFree from '@/components/LandingPage/TryForFree';
import ScrollingImages from '@/components/LandingPage/ScrollingImages';
import Reviews from '@/components/LandingPage/Reviews';
import Pricing from '@/components/LandingPage/Pricing';
import FAQ from '@/components/LandingPage/FAQ';


export default function Home() {
  return (
    <div style={{ backgroundColor: '#001F54', transform: 'scale(1.1)', transformOrigin: 'top left', margin: 0, padding: 0, boxSizing: 'border-box', overflowX: 'hidden' }}>
    <div>
      {/* Menu Component */}
      <Menu />

      <section className="hero bg-[#001F54] text-white h-auto flex items-center justify-center pt-40 pb-20"> 
  <div className="grid grid-cols-2 gap-8 max-w-7xl mx-auto px-10 items-center"> {/* px-10 mantiene el mismo relleno en ambos lados */}
    <div className="text-left">
      <h1 className="text-4xl font-bold mb-4 leading-snug">La Herramienta Definitiva para las Normativas de Arquitectura</h1>
      <p className="text-xl mb-6">Acelera tus proyectos con la potencia de la IA y ahorra tiempo</p>
      <button className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 px-8 rounded-full shadow-md hover:shadow-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
        Try For Free
      </button>
      <div className="mt-8 flex space-x-8 text-lg text-gray-300">
        <div>
          <strong className="text-white text-2xl">250K+</strong>
          <p className="text-gray-400 text-sm">active users</p>
        </div>
        <div>
          <strong className="text-white text-2xl">20M+</strong>
          <p className="text-gray-400 text-sm">questions solved</p>
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

      {/* Video with explanation Section */}
      <section className="bg-[#001F54] text-white py-16">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6">
        {/* Video */}
        <div className="space-y-6">
        <video className="w-full rounded-md shadow-lg" autoPlay loop muted>
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
        </div>

        {/* Explicación del video */}
        <div className="max-w-sm"> 
          <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full mb-4">✔ Respuestas Instantáneas</span>
          <h2 className="text-lg font-bold mb-3 leading-snug">Encuentra Respuesta a Tus Preguntas al Instante</h2>
          <p className="mb-4 text-sm leading-relaxed">
            Con solo un clic, nuestra herramienta te proporciona la interpretación correcta de los códigos técnicos de arquitectura. Ya sea una normativa del CTE o un detalle específico sobre un sistema constructivo, nuestra IA te ofrece la guía adecuada.
          </p>
        </div>
      </div>
    </section>




      {/* Segunda Sección: Video a la derecha, Texto a la izquierda */}
      <section className="bg-[#001F54] text-white py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6">
          
          {/* Explicación del video */}
          <div>
            <span className="inline-block bg-green-500 text-white text-sm px-3 py-1 rounded-full mb-4">✔ Respuestas Precisas</span>
            <h2 className="text-3xl font-bold mb-4">Proporciona más detalles para obtener respuestas más precisas</h2>
            <p className="mb-4">
            Cuanta más información proporciones, más exactas serán las respuestas. Introduce etiquetas específicas sobre tu proyecto, como el tipo de edificación o ubicación, y nuestra IA se encargará de hacer el resto.            </p>
          
          </div>

          {/* Video */}
          <div className="space-y-6">
            <video className="w-full rounded-md shadow-lg" autoPlay loop muted>
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

        </div>
      </section>

            {/* Video with explanation Section */}
            <section className="bg-[#001F54] text-white py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6">
          {/* Video */}
          <div className="space-y-6">
            <video className="w-full rounded-md shadow-lg" autoPlay loop muted>
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Explicación del video */}
          <div>
            <span className="inline-block bg-green-500 text-white text-sm px-3 py-1 rounded-full mb-4">✔ Explicaciones detalladas</span>
            <h2 className="text-2xl font-bold mb-4">Entiende y Comprende la Normativa </h2>
            <p className="mb-4">
            Más que solo respuestas, nuestra IA te ayuda a interpretar y aplicar las normativas arquitectónicas con profundidad.
            </p>
            <p className="mb-4">
            Aprende a desglosar y entender cada código, para que puedas implementarlo fácilmente en tus proyectos, asegurando el cumplimiento de cada detalle técnico.
            </p>
         
          </div>
        </div>
      </section>


      {/* Information Section */}
      <section className="bg-[#001F54] py-20 text-center">
        <h2 className="text-3xl font-bold mb-6 text-white">Agiliza tu Proceso de Investigación</h2>
        <p className="text-base text-gray-300 max-w-2xl mx-auto mb-8">Transforma la complejidad normativa en respuestas claras y eficientes con la ayuda de la IA</p>
        
        <div className="flex justify-center space-x-6">
          <div className="bg-blue-800 p-6 shadow-lg rounded-lg w-64">
            {/* Imagen encima del título */}
            <img src="images/investigar.png" alt="Icon 1" className="mx-auto mb-3 w-12 h-12" />
            <h3 className="text-base font-semibold text-white">Investiga Más Rápido</h3>
            <p className="text-sm text-gray-300 mt-2">Supera la simple recopilación de secciones de códigos y asambleas. Encuentra respuestas con mayor agilidad.</p>
          </div>

          <div className="bg-blue-800 p-6 shadow-lg rounded-lg w-64">
            {/* Imagen encima del título */}
            <img src="images/tiempo.png" alt="Icon 2" className="mx-auto mb-3 w-12 h-12" />
            <h3 className="text-base font-semibold text-white">Sé más eficiente</h3>
            <p className="text-sm text-gray-300 mt-2">Identifica recursos valiosos que podrías haber pasado por alto en tu investigación, optimizando el tiempo y esfuerzo.</p>
          </div>

          <div className="bg-blue-800 p-6 shadow-lg rounded-lg w-64">
            {/* Imagen encima del título */}
            <img src="images/informacion valiosa.png" alt="Icon 3" className="mx-auto mb-3 w-12 h-12" />
            <h3 className="text-base font-semibold text-white">Sé más eficiente</h3>
            <p className="text-sm text-gray-300 mt-2">Desglosa y analiza grandes volúmenes de códigos y asambleas sin complicaciones.</p>
          </div>
        </div>

        <div className="flex justify-center space-x-6 mt-8">
          <div className="bg-blue-800 p-6 shadow-lg rounded-lg w-64">
            {/* Imagen encima del título */}
            <img src="images/ia.png" alt="Icon 4" className="mx-auto mb-3 w-12 h-12" />
            <h3 className="text-base font-semibold text-white">Aprovecha la IA</h3>
            <p className="text-sm text-gray-300 mt-2">Utiliza el poder de la inteligencia artificial para interpretar y aplicar normativas de manera más eficiente y precisa.</p>
          </div>

          <div className="bg-blue-800 p-6 shadow-lg rounded-lg w-64">
            {/* Imagen encima del título */}
            <img src="images/Simplifica.png" alt="Icon 5" className="mx-auto mb-3 w-12 h-12" />
            <h3 className="text-base font-semibold text-white">Simplifica la normativa</h3>
            <p className="text-sm text-gray-300 mt-2">Convierte la complejidad de los códigos técnicos en respuestas claras y fáciles de entender.</p>
          </div>
        </div>
      </section>





      {/* Try For Free Section */}
      <TryForFree />

      {/* Reviews Section */}
      <Reviews />

      {/* Satisfied Users Section */}
      <section className="bg-[#001F54] text-white py-16 text-center">
        <div className="max-w-md mx-auto"> {/* Hacemos el texto un poco más ancho */}
          <h2 className="text-2xl font-bold mb-4">
            "El éxito de un proyecto no solo está en su diseño, sino en su capacidad para cumplir con cada normativa. Contar con las respuestas correctas es tan esencial como los planos mismos."
          </h2>
        </div>
      </section>


      {/* Pricing Section */}
      <Pricing />

      {/* 3 Simple Steps Section */}
      <section className="bg-white py-20 text-center">
        <h2 className="text-4xl font-bold mb-8">3 Simple Steps to Get Started</h2>
        <video src="https://your-video-url.com" controls className="w-full max-w-lg mx-auto mb-8 shadow-lg rounded-lg"></video>
        <div className="flex justify-center space-x-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Step 1</h3>
            <p>Sign up for an account.</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Step 2</h3>
            <p>Choose your subscription plan.</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Step 3</h3>
            <p>Start getting instant homework help!</p>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <FAQ />

      {/* Footer Section */}
{/* Footer Section */}
<section className="bg-gradient-to-r from-lightBlue to-darkBlue text-white py-20 text-center">
  <h2 className="text-3xl font-bold mb-6">Start Boosting Your GPA Now</h2>
  <button className="bg-white text-blue-500 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out">
    Try For Free
  </button>
</section>


    </div>
    </div>
  );
}
