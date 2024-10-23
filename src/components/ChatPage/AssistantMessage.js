import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import DOMPurify from 'dompurify';

const processText = (text) => {
  // Reemplazar **texto** por <strong>texto</strong>
  let processedText = text.replace(/\*\*(.*?)\*\*/gs, '<strong>$1</strong>');
  
  // Reemplazar *texto* por <em>\n"texto"</em>, añadiendo un salto de línea, comillas y cursiva con marcadores temporales
  processedText = processedText.replace(/(?<!\*)\*(?!\*)(.*?)\*(?!\*)/gs, '<em>\n__QUOTE__$1__QUOTE__</em>');
  
  // Reemplazar "texto" por <strong>texto</strong>, quitando las comillas
  processedText = processedText.replace(/"([^"]+)"/g, '<strong>$1</strong>');
  
  // Reemplazar los marcadores __QUOTE__ por comillas reales
  processedText = processedText.replace(/__QUOTE__/g, '"');

  // Separar los párrafos entre medio y agregar \n entre párrafos
  const paragraphs = processedText.split(/\n{2,}/g);
  processedText = paragraphs.map(p => `<p>${p}</p>`).join('\n');

  // Sanitizar el HTML generado
  const sanitizedText = DOMPurify.sanitize(processedText);
  return sanitizedText;
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
            <img src="images/lupa.png" alt="Logo" className="h-6 mr-2 mt-1" />

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
