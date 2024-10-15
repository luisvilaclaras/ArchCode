import React from 'react';

// Función para procesar el texto y aplicar los cambios
const processText = (text) => {
  // Reemplazar **texto** por <strong>texto</strong>
  let boldText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Insertar saltos de línea antes y después de los ":"
  boldText = boldText.replace(/:\s*/g, ':\n');
  
  // Insertar saltos de línea antes de las partes en negrita
  boldText = boldText.replace(/(<strong>.*?<\/strong>)/g, '\n$1\n');

  return boldText;
};

export const AssistantMessage = ({ text }) => {
  return (
    <div className="flex justify-center mb-2">
      <div className="flex justify-center w-full max-w-2xl items-start">
        <div className="bg-[#0B1A2A] text-white py-2 px-6 rounded-lg flex items-start shadow-md" style={{ maxWidth: '80%', wordBreak: 'break-word', whiteSpace: 'pre-line' }}>
          {/* Logo a la izquierda con tamaño más pequeño */}
          <img src="images/ArchCode.png" alt="Logo" className="h-6 mr-2 mt-1" />
          
          {/* Texto alineado al lado del logo */}
          <span className="text-sm" dangerouslySetInnerHTML={{ __html: processText(text) }}></span>
        </div>
      </div>
    </div>
  );
};
