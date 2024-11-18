'use client';

import React, { useState } from 'react';
import NewsItem from './NewsItem';
import newsData from './NewsData'; // Asegúrate de que esta ruta sea correcta

const ITEMS_PER_PAGE = 6; // Número de elementos por página

export default function NewsGrid() {
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(newsData.length / ITEMS_PER_PAGE);

  // Obtener los datos para la página actual
  const currentData = newsData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Cambiar de página
  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Grid de noticias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentData.map((news) => (
          <NewsItem
            key={news.id}
            slug={news.slug}
            title={news.title}
            image={news.image}
            date={news.date}
          />
        ))}
      </div>

      {/* Controles de paginación */}
      <div className="flex justify-center items-center mt-8 space-x-2">
        <button
          className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page + 1}
            className={`px-4 py-2 rounded ${
              currentPage === page + 1
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-blue-400 hover:text-white'
            }`}
            onClick={() => changePage(page + 1)}
          >
            {page + 1}
          </button>
        ))}
        <button
          className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
