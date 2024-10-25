import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';


const processText = (text) => {
  // Reemplazar **texto** por <strong>texto</strong>
  let processedText = text.replace(/\*\*(.*?)\*\*/gs, '<strong>$1</strong>');

  // Reemplazar *texto* por <em>\n"texto"</em>, añadiendo un salto de línea, comillas y cursiva con marcadores temporales
  processedText = processedText.replace(
    /(?<!\*)\*(?!\*)(.*?)\*(?!\*)/gs,
    '<em>\n__QUOTE__$1__QUOTE__</em>'
  );

  // Reemplazar "texto" por <strong>texto</strong>, quitando las comillas
  processedText = processedText.replace(/"([^"]+)"/g, '<strong>$1</strong>');

  // Ocultar cualquier texto entre "【" y "】"
  processedText = processedText.replace(/【.*?】/gs, '');

  // Reemplazar los marcadores __QUOTE__ por comillas reales
  processedText = processedText.replace(/__QUOTE__/g, '"');

  // Reemplazar números al principio de los apartados por negrita (ejemplo: "1. Texto")
  processedText = processedText.replace(/(\d+)\.\s/g, '<strong>$1.</strong> ');

  // Separar los párrafos entre medio y agregar <p> entre párrafos
  const paragraphs = processedText.split(/\n{2,}/g);
  processedText = paragraphs.map((p) => `<p>${p}</p>`).join('\n');

  return processedText;
};






export const AssistantMessage = ({ text, isComplete, onFeedback }) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleFeedback = (type) => {
    if (onFeedback) {
      onFeedback(type, text);
    }
    setFeedbackGiven(true);
  };

  const renderContent = () => {
    const parts = [];
    let lastIndex = 0;
    const regex = /\\\[(.*?)\\\]/gs;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const textPart = text.substring(lastIndex, match.index);
        const processedText = processText(textPart);
        parts.push(
          <span
            key={`text-${lastIndex}`}
            dangerouslySetInnerHTML={{ __html: processedText }}
          />
        );
      }
      const mathContent = match[1];
      parts.push(
        <div
          key={`math-${lastIndex}`}
          style={{ maxWidth: '100%', overflowX: 'auto' }}
        >
          <BlockMath>{mathContent}</BlockMath>
        </div>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      const processedText = processText(remainingText);
      parts.push(
        <span
          key={`text-${lastIndex}`}
          dangerouslySetInnerHTML={{ __html: processedText }}
        />
      );
    }

    return parts;
  };

  return (
    <div className="font-personalizada flex justify-center mb-2">
      <div className="w-full max-w-2xl">
        <div
          className="bg-[#eff6ff] text-[#333333] py-2 px-6 rounded-lg shadow-md flex flex-col items-start"
          style={{
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            maxWidth: '100%',
            overflowWrap: 'break-word',
          }}
        >
          {/* Contenedor para el logo y el texto */}
          <div className="flex items-start w-full">
            {/* Logo a la izquierda con tamaño más pequeño */}
            <img src="/images/lupa.png" alt="Logo" className="h-6 mr-2 mt-1" />

            {/* Texto alineado al lado del logo */}
            <div
              className="text-sm w-full"
              style={{
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
                maxWidth: '100%',
                overflowWrap: 'break-word',
              }}
            >
              {renderContent()}
            </div>
          </div>

          {/* Mostrar la sección de retroalimentación solo si la respuesta está completa */}
          {isComplete && (
            <div className="mt-4 border-t border-gray-600 pt-2 w-full flex flex-col items-center">
              {feedbackGiven ? (
                // Mostrar mensaje de agradecimiento con animación
                <p className="text-sm text-gray-500 mb-2 text-center animate-fade-in">
                  Muchas gracias. Tu opinión nos ayuda a mejorar.
                </p>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-2 text-center">
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
