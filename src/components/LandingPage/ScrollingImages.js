import React from 'react';

export default function ScrollingImages() {
  return (
    <section className="relative bg-darkBlue py-16">
      <div className="overflow-hidden">
        <div className="flex items-center justify-start space-x-8 animate-scroll">
          {/* Imagenes de ejemplo */}
          <img src="https://via.placeholder.com/150x100?text=Image+1" alt="Image 1" className="w-48 h-48 object-cover shadow-lg rounded-md" />
          <img src="https://via.placeholder.com/150x100?text=Image+2" alt="Image 2" className="w-48 h-48 object-cover shadow-lg rounded-md" />
          <img src="https://via.placeholder.com/150x100?text=Image+3" alt="Image 3" className="w-48 h-48 object-cover shadow-lg rounded-md" />
          <img src="https://via.placeholder.com/150x100?text=Image+4" alt="Image 4" className="w-48 h-48 object-cover shadow-lg rounded-md" />
          <img src="https://via.placeholder.com/150x100?text=Image+5" alt="Image 5" className="w-48 h-48 object-cover shadow-lg rounded-md" />
          <img src="https://via.placeholder.com/150x100?text=Image+6" alt="Image 6" className="w-48 h-48 object-cover shadow-lg rounded-md" />
          <img src="https://via.placeholder.com/150x100?text=Image+7" alt="Image 7" className="w-48 h-48 object-cover shadow-lg rounded-md" />
          <img src="https://via.placeholder.com/150x100?text=Image+8" alt="Image 8" className="w-48 h-48 object-cover shadow-lg rounded-md" />
          {/* Agrega más imágenes según sea necesario */}
        </div>
      </div>
    </section>
  );
}
