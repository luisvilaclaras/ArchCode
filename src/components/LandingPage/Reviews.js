'use client';

import { useState, useEffect } from 'react';

const reviews = [
  { 
    text: 'Muy útil para proyectos ejecutivos. Me ahorra tiempo en el despacho.', 
    user: 'Carlos Gonzalo', 
    institution: 'Ingeniero Industrial',
    profilePic: 'images/users/carlos_g.webp'
  },
  { 
    text: 'No solo me da la normativa, sino que te explica las normativas para que las puedas entender.', 
    user: 'Andrea García', 
    institution: 'Arquitecta',
    profilePic: 'images/users/Ana.webp'
  },
  { 
    text: 'Ya no tengo que estar comparando normativas. Esta herramienta hace todo mucho más rápido.', 
    user: 'Antonio Ruibal', 
    institution: 'Arquitecto Senior',
    profilePic: 'images/users/Antonio.webp'
  },
  { 
    text: 'Desde que uso esta herramienta, encontrar normativas y entenderlas es muchísimo más fácil. Me ha ahorrado un montón de tiempo.', 
    user: 'Nicolás Caliu', 
    institution: 'Arquitecto técnico',
    profilePic: 'images/users/Alex.webp'
  },
];

export default function Reviews() {
  const [currentReview, setCurrentReview] = useState(0);

  // Automáticamente rotar las reviews cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
  }, []);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const getReviewClass = (index) => {
    if (index === currentReview) return "opacity-100";
    return "opacity-50 blur-sm"; // Difuminado para los elementos no activos
  };

  return (
    <section className="bg-[#1e3047] text-white py-16 text-center">
      <h2 className="text-4xl font-bold mb-8">Lo que los usuarios dicen</h2>
      <div className="relative max-w-3xl mx-auto flex justify-center items-center space-x-6">
        {/* Review anterior */}
        <div className={`absolute left-0 transform -translate-x-1/3 transition-opacity duration-500 ${getReviewClass((currentReview - 1 + reviews.length) % reviews.length)}`}>
          <div className="flex items-center space-x-4">
            <img 
              src={reviews[(currentReview - 1 + reviews.length) % reviews.length].profilePic} 
              alt="Profile" 
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="text-left">
              <h3 className="text-lg font-semibold">{reviews[(currentReview - 1 + reviews.length) % reviews.length].user}</h3>
              <p className="text-sm text-gray-400">{reviews[(currentReview - 1 + reviews.length) % reviews.length].institution}</p>
            </div>
          </div>
        </div>

        {/* Review actual */}
        <div className="bg-[#1A1E36] p-6 rounded-lg shadow-lg flex items-center space-x-4 max-w-xl mx-auto">
          <img 
            src={reviews[currentReview].profilePic} 
            alt="Profile" 
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="text-left">
            <h3 className="text-xl font-semibold">{reviews[currentReview].user}</h3>
            <p className="text-sm text-gray-400">{reviews[currentReview].institution}</p>
            <p className="text-lg mt-2">"{reviews[currentReview].text}"</p>
          </div>
        </div>

        {/* Review siguiente */}
        <div className={`absolute right-0 transform translate-x-1/3 transition-opacity duration-500 ${getReviewClass((currentReview + 1) % reviews.length)}`}>
          <div className="flex items-center space-x-4">
            <img 
              src={reviews[(currentReview + 1) % reviews.length].profilePic} 
              alt="Profile" 
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="text-left">
              <h3 className="text-lg font-semibold">{reviews[(currentReview + 1) % reviews.length].user}</h3>
              <p className="text-sm text-gray-400">{reviews[(currentReview + 1) % reviews.length].institution}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6 space-x-4">
        <button 
          onClick={prevReview} 
          className="bg-[#344e6f] text-white py-2 px-4 rounded-lg shadow hover:bg-blue-500 transition"
        >
          Anterior
        </button>
        <button 
          onClick={nextReview} 
          className="bg-[#344e6f] text-white py-2 px-4 rounded-lg shadow hover:bg-blue-500 transition"
        >
          Siguiente
        </button>
      </div>
    </section>
  );
}
