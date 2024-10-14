

export default function ScrollingImages() {
  return (
    <section className="relative bg-[#001F54] py-16">
      <div className="overflow-hidden">
        <div className="flex items-center justify-start space-x-8 animate-scroll">
          {/* Imagenes usando import */}
          <img src="/images/BOE.png" alt="Image 1" className="w-48 h-48 object-cover shadow-lg rounded-md" />
          <img src="/images/REBT.png" alt="Image 1" className="w-48 h-48 object-cover shadow-lg rounded-md" />
          <img src="/images/RITE.png" alt="Image 1" className="w-48 h-48 object-cover shadow-lg rounded-md" />
          <img src="/images/CTE.png" alt="Image 1" className="w-48 h-48 object-cover shadow-lg rounded-md" />
          <img src="/images/HS.png" alt="Image 1" className="w-48 h-48 object-cover shadow-lg rounded-md" />
          <img src="/images/SE.png" alt="Image 1" className="w-48 h-48 object-cover shadow-lg rounded-md" />
          <img src="/images/SI.png" alt="Image 1" className="w-48 h-48 object-cover shadow-lg rounded-md" />
          <img src="/images/SUA.png" alt="Image 1" className="w-48 h-48 object-cover shadow-lg rounded-md" />
          <img src="/images/HR.png" alt="Image 1" className="w-48 h-48 object-cover shadow-lg rounded-md" />

        </div>
      </div>
    </section>
  );
}
