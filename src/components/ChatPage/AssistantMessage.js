import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import DOMPurify from 'dompurify';

// Función para procesar el texto
const processText = (text) => {
  // Reemplazar **texto** por <strong>texto</strong>
  let processedText = text.replace(/\*\*(.*?)\*\*/gs, '<strong>$1</strong>');

  // Reemplazar *texto* por <em>"texto"</em>, añadiendo comillas y cursiva
  processedText = processedText.replace(
    /(?<!\*)\*(?!\*)(.*?)\*(?!\*)/gs,
    '<em>"$1"</em>'
  );

  // Reemplazar "texto" por <strong>texto</strong>, quitando las comillas
  processedText = processedText.replace(/"([^"]+)"/g, '<strong>$1</strong>');

  // Ocultar cualquier texto entre "【" y "】"
  processedText = processedText.replace(/【.*?】/gs, '');

  // Reemplazar números al principio de los apartados por negrita (ejemplo: "1. Texto")
  processedText = processedText.replace(/(\d+)\.\s/g, '<strong>$1.</strong> ');

  // Separar los párrafos y agregar <p> entre párrafos
  const paragraphs = processedText.split(/\n{2,}/g);
  processedText = paragraphs.map((p, index) => `<p key=${index}>${p}</p>`).join('\n');

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
    // Regex para detectar expresiones matemáticas en bloque ($$...$$ o \[...\])
    const regex = /\$\$(.*?)\$\$|\\\[(.*?)\\\]/gs;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const textPart = text.substring(lastIndex, match.index);
        const processedText = processText(textPart);
        const sanitizedHTML = DOMPurify.sanitize(processedText);
        parts.push(
          <span
            key={`text-${lastIndex}`}
            dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
          />
        );
      }
      // Obtener el contenido matemático capturado (grupo 1 o grupo 2)
      const mathContent = match[1] || match[2];
      const encodedMath = encodeURIComponent(mathContent);
      // Usar un servicio externo para generar la imagen de la expresión matemática
      // Por ejemplo, usando LaTeX.codecogs.com
      const mathImageURL = `https://latex.codecogs.com/svg.image?${encodedMath}`;

      parts.push(
        <div key={`math-${match.index}`} className="math-container">
          <img
            src={mathImageURL}
            alt={`math-${match.index}`}
            className="math-image"
          />
        </div>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      const processedText = processText(remainingText);
      const sanitizedHTML = DOMPurify.sanitize(processedText);
      parts.push(
        <span
          key={`text-${lastIndex}`}
          dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        />
      );
    }

    return parts;
  };

  // Estilos CSS específicos para el componente
  const styles = `
    /* Aplicar box-sizing globalmente */
    *, *::before, *::after {
      box-sizing: border-box;
    }

    /* Estilo para los párrafos dentro del componente */
    .assistant-message-container p {
      margin: 0 0 1em 0; /* Ajusta los márgenes según necesites */
      max-width: 100%;
      word-break: break-word;
      overflow-wrap: break-word;
    }

    /* Estilos para el contenedor de matemáticas */
    .math-container {
      display: block;
      width: 100%;
      max-width: 100%;
      overflow-x: auto; /* Permitir desplazamiento horizontal solo dentro del contenedor */
      margin: 1em 0;
      padding: 0.5em 0; /* Opcional: añade padding para mejorar la legibilidad */
      background-color: #f9f9f9; /* Opcional: resalta el contenedor matemático */
      border-radius: 4px; /* Opcional: esquinas redondeadas */
      overflow-wrap: break-word;
      word-wrap: break-word;
      word-break: break-word;
    }

    /* Estilos para las imágenes matemáticas */
    .math-image {
      max-width: 100%;
      height: auto;
    }

    /* Prevenir que el contenedor principal permita desbordamientos horizontales */
    .assistant-message-container {
      overflow: hidden;
    }

    /* Opcional: reducir el tamaño de fuente en dispositivos pequeños */
    @media (max-width: 768px) {
      .math-container {
        font-size: 0.9em;
      }
    }
  `;

  return (
    <div className="assistant-message-container flex justify-center w-full mt-4 mb-4"> {/* Añadido flex, justify-center, w-full y mt-4 */}
      {/* Incluir los estilos directamente en el componente */}
      <style>{styles}</style>
      <div
        className="bg-[#eff6ff] text-[#333333] py-3 px-6 rounded-lg shadow-md flex flex-col items-start max-w-2xl" // Ajuste en padding y ancho máximo
        style={{
          wordBreak: 'break-word',
          whiteSpace: 'normal', // Cambiado de 'pre-wrap' a 'normal'
          maxWidth: '42rem', // Equivale a max-w-2xl en Tailwind (~672px)
          overflowWrap: 'break-word',
          overflow: 'hidden',
        }}
      >
        {/* Contenedor para el logo y el texto */}
        <div className="flex items-start w-full">
          {/* Logo a la izquierda con tamaño más pequeño */}
          <img src="/images/lupa.webp" alt="Logo" className="h-6 mr-4 mt-1" /> {/* Incrementado mr de 2 a 4 para mayor separación */}

          {/* Texto alineado al lado del logo */}
          <div
            className="text-base w-full" // Cambiado text-sm a text-base para mayor legibilidad
            style={{
              wordBreak: 'break-word',
              whiteSpace: 'normal', // Cambiado de 'pre-wrap' a 'normal'
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
  );
};
