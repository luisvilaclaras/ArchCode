"use client"; // Asegura que este componente se ejecute en el lado del cliente


export default function ScrollingImages() {
  return (
    <section className="relative bg-[#1e3047]">
      <div className="overflow-hidden">
        {/* Contenedor de imágenes en bucle */}
        <div className="flex items-center justify-start space-x-20 animate-scroll pb-12 ">
          {/* Imágenes */}
          <img src="/images/BOE.png" alt="Image 1" className="w-36 h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/REBT.png" alt="Image 2" className="w-36 h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/RITE.png" alt="Image 3" className="w-36 h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/CTE.png" alt="Image 4" className="w-36 h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/HS.png" alt="Image 5" className="w-36 h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/SE.png" alt="Image 6" className="w-36 h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/SI.png" alt="Image 7" className="w-36 h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/SUA.png" alt="Image 8" className="w-36 h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/HR.png" alt="Image 9" className="w-36 h-36 object-cover shadow-lg rounded-md inline-block" />

          {/* Duplicamos las imágenes para que la animación sea continua */}
          <img src="/images/BOE.png" alt="Image 1" className="w-36 h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/REBT.png" alt="Image 2" className="w-36 h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/RITE.png" alt="Image 3" className="w-36 h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/CTE.png" alt="Image 4" className="w-36 h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/HS.png" alt="Image 5" className="w-36 h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/SE.png" alt="Image 6" className="w-36 h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/SI.png" alt="Image 7" className="w-36 h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/SUA.png" alt="Image 8" className="w-36 h-36 object-cover shadow-lg rounded-md inline-block" />
          <img src="/images/HR.png" alt="Image 9" className="w-36 h-36 object-cover shadow-lg rounded-md inline-block" />
        </div>
      </div>

      {/* Añadimos los estilos para la animación */}
      <style jsx>{`
        .animate-scroll {
          display: flex;
          animation: scroll 30s linear infinite;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </section>
  );
}
