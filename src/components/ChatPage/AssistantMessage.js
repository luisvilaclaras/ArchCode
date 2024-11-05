import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

const processText = (text) => {
  // Reemplazar **texto** por <strong>texto</strong>
  let processedText = text.replace(/\*\*(.*?)\*\*/gs, '<strong>$1</strong>');

  // Reemplazar *texto* por <em>"texto"</em>
  processedText = processedText.replace(
    /(?<!\*)\*(?!\*)(.*?)\*(?!\*)/gs,
    '<em>"$1"</em>'
  );

  // Ocultar cualquier texto entre "【" y "】"
  processedText = processedText.replace(/【.*?】/gs, '');

  // Procesar listas numeradas
  processedText = processedText.replace(
    /^(\d+)\.\s+(.*)$/gm,
    '<li style="margin-bottom: 1em;"><strong>$1.</strong> $2</li>'
  );

  // Envolver los elementos de la lista en un solo <ol>
  processedText = processedText.replace(
    /(<li[\s\S]*?<\/li>)/gs,
    '<ol>$1</ol>'
  );

  // Combinar múltiples <ol> en uno solo
  processedText = processedText.replace(/<\/ol>\s*<ol>/g, '');

  // Separar los párrafos y agregar <p> entre párrafos que no sean listas o referencias
  processedText = processedText.replace(/(?:\n\s*\n)+/g, '</p><p>');

  // Añadir etiquetas <p> al principio y al final si no existen
  if (!processedText.startsWith('<p>')) {
    processedText = '<p>' + processedText;
  }
  if (!processedText.endsWith('</p>')) {
    processedText += '</p>';
  }

  // Eliminar etiquetas <p> alrededor de <ol>
  processedText = processedText.replace(
    /<p>\s*(<ol>[\s\S]*?<\/ol>)\s*<\/p>/g,
    '$1'
  );

  // Hacer que la palabra "Referencia" siempre esté en negrita y subrayada
  processedText = processedText.replace(
    /(Referencia:)/g,
    '<strong><u>$1</u></strong>'
  );

  // Añadir un salto de línea antes de "Referencia"
  processedText = processedText.replace(
    /(<strong><u>Referencia:<\/u><\/strong>)/g,
    '<br/><br/>$1'
  );

  // Separar el apartado de referencia con párrafos adicionales
  processedText = processedText.replace(
    /(<br\/><br\/><strong><u>Referencia:<\/u><\/strong>.*)/gs,
    '<div class="referencia">$1</div><p></p><p></p>'
  );

  // Procesar la sección de referencia
  processedText = processedText.replace(
    /(<div class="referencia">[\s\S]*?<\/div>)/g,
    (match) => {
      let refText = match;

      // Reemplazar _texto_ por <em>texto</em>
      refText = refText.replace(/_([^_]+)_/g, '<em>$1</em>');

      // Reemplazar "texto" por <strong>texto</strong>, quitando las comillas
      refText = refText.replace(/"([^"]+)"/g, '<strong>$1</strong>');

      return refText;
    }
  );

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

    // Expresión regular actualizada para incluir \[...\], \(...\), $$...$$, y $...$
    const regex =
      /\$\$([\s\S]*?)\$\$|\$([^$]+)\$|\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/g;
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

      const blockMath = match[1] || match[3];
      const inlineMath = match[2] || match[4];

      if (blockMath) {
        // Expresión matemática en bloque
        parts.push(
          <MathJax
            key={`math-${lastIndex}`}
            dynamic
            style={{
              width: '100%',
              overflowX: 'auto',
              textAlign: 'center',
              margin: '16px 0',
            }}
          >
            <div>{`\\[${blockMath}\\]`}</div>
          </MathJax>
        );
      } else if (inlineMath) {
        // Expresión matemática en línea
        parts.push(
          <MathJax key={`math-${lastIndex}`} inline dynamic>
            {`\\(${inlineMath}\\)`}
          </MathJax>
        );
      }

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
        <div className="bg-[#eff6ff] text-[#333333] py-2 px-6 rounded-lg shadow-md">
          {/* Contenedor para el logo y el texto */}
          <div className="flex items-start">
            {/* Logo a la izquierda con tamaño más pequeño */}
            <img src="/images/lupa.webp" alt="" className="h-6 mr-2 mt-1" />

            {/* Texto alineado al lado del logo */}
            <div className="text-sm overflow-hidden">
              <MathJaxContext>{renderContent()}</MathJaxContext>
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
