import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

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




// Asegúrate de que 'processText' está definido en tu código
export const AssistantMessage = ({ text, isComplete, onFeedback }) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleFeedback = (type) => {
    if (onFeedback) {
      onFeedback(type, text); // Pasamos el tipo de feedback y el contenido del mensaje
    }
    setFeedbackGiven(true);
  };

  return (
    <div className="font-personalizada flex justify-center mb-2">
      <div className="w-full max-w-2xl">
        <div
          className="bg-[#eff6ff] text-[#333333] py-2 px-6 rounded-lg shadow-md flex flex-col items-center"
          style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}
        >
          {/* Contenedor para el logo y el texto */}
          <div className="flex items-start w-full">
            {/* Logo a la izquierda con tamaño más pequeño */}
            <img src="images/logo.png" alt="Logo" className="h-6 mr-2 mt-1" />

            {/* Texto alineado al lado del logo */}
            <span
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: processText(text) }}
            ></span>
          </div>

          {/* Mostrar la sección de retroalimentación solo si la respuesta está completa */}
          {isComplete && (
            <div className="mt-4 border-t border-gray-600 pt-2 w-full flex flex-col items-center">
              {feedbackGiven ? (
                // Mostrar mensaje de agradecimiento con animación
                <p className="text-sm text-gray-300 mb-2 text-center animate-fade-in">
                  Muchas gracias. Tu opinión nos ayuda a mejorar.
                </p>
              ) : (
                <>
                  <p className="text-sm text-gray-300 mb-2 text-center">
                    ¿Qué te ha parecido la respuesta?
                  </p>
                  <div className="flex space-x-8 animate-fade-in">
                    <button
                      className="flex items-center text-black hover:text-gray-300 focus:outline-none"
                      onClick={() => handleFeedback('positive')}
                    >
                      <FaThumbsUp className="mr-2" size={20} />
                    </button>
                    <button
                      className="flex items-center text-black hover:text-gray-300 focus:outline-none"
                      onClick={() => handleFeedback('negative')}
                    >
                      <FaThumbsDown className="mr-2" size={20} />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
