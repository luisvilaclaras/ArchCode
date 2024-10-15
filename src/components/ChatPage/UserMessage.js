import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const processText = (text) => {
  // Reemplazar **texto** por <strong>texto</strong>
  let boldText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Insertar saltos de línea antes y después de los ":"
  boldText = boldText.replace(/:\s*/g, ':\n');

  // Insertar saltos de línea antes de las partes en negrita
  boldText = boldText.replace(/(<strong>.*?<\/strong>)/g, '\n$1\n');

  return boldText;
};

export const UserMessage = ({ text }) => {
  return (
    <div className="flex justify-center mb-2 relative">
      <div className="flex justify-end w-full max-w-2xl items-start relative">
        {/* Cuadro del mensaje con más espacio horizontal y margen para el ícono */}
        <div className="bg-[#1E3A8A] text-white py-2 px-6 rounded-lg shadow-md relative" style={{ maxWidth: '80%', wordBreak: 'break-word', whiteSpace: 'pre-line' }}>
          {/* Agregamos margen a la derecha para evitar superposición con el ícono */}
          <span className="text-sm mr-10" dangerouslySetInnerHTML={{ __html: processText(text) }}></span>
          {/* Ícono alineado a la esquina superior derecha */}
          <FaUserCircle className="absolute top-2 right-2 text-lg" />
        </div>
      </div>
    </div>
  );
};
