import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import DOMPurify from 'dompurify';
import 'katex/dist/katex.min.css';
import katex from 'katex';

const processText = (text) => {
  let cleanedText = text.replace(/^>+\s?/gm, '');
  let processedText = cleanedText.replace(/^Referencia:/gm, '<strong>Referencia:</strong>');
  let isQuotedReference = /^<strong>Referencia:<\/strong>\s*"/.test(processedText);

  if (isQuotedReference) {
    processedText = processedText.replace(/<strong>Referencia:<\/strong>\s*"(.*?)"/g, '<strong>Referencia:</strong> <strong>$1</strong>');
  } else {
    processedText = processedText.replace(/<strong>Referencia:<\/strong>\s*(.*)$/gm, '<strong>Referencia:</strong> <strong>$1</strong>');
  }

  processedText = processedText.replace(/\*\*(.*?)\*\*/gs, '<strong>$1</strong>');

  // Modificación aquí para poner ':' en negrita, luego un salto de línea y texto en cursiva con comillas
  processedText = processedText.replace(/(?<!\*)\*(?!\*)(.*?)\*(?!\*)/gs, '<strong>:</strong><br><em>"$1"</em>');
  processedText = processedText.replace(/_(.*?)_/g, '<strong>:</strong><br><em>"$1"</em>');

  processedText = processedText.replace(/"(DB-HS.*?agua)"/g, '<strong>$1</strong>');
  processedText = processedText.replace(/"([^"]+)"/g, '$1');
  processedText = processedText.replace(/【.*?】/gs, '');
  processedText = processedText.replace(/(\d+)\.\s/g, '<strong>$1.</strong> ');

  const paragraphs = processedText.split(/\n{2,}/g);
  processedText = paragraphs
    .map((p, index) => `<p key=${index}>${p}</p>`)
    .join('\n');

  return processedText;
};



const renderContent = (text) => {
  const parts = [];
  let lastIndex = 0;

  const regex = /\$\$(.*?)\$\$|\\\[(.*?)\\\]|\\\((.*?)\\\)|\$(.*?)\$/gs;
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

    const mathContent = match[1] || match[2] || match[3] || match[4];

    try {
      const mathHTML = katex.renderToString(mathContent, {
        throwOnError: false,
        displayMode: !!match[1] || !!match[2],
      });

      parts.push(
        <span
          key={`math-${match.index}`}
          dangerouslySetInnerHTML={{ __html: mathHTML }}
          className={!!match[1] || !!match[2] ? 'block-math scaleable-math' : 'inline-math'}
        />
      );
    } catch (error) {
      console.error("Error rendering LaTeX:", error);
      parts.push(<span key={`error-${match.index}`}>[Math Error]</span>);
    }

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

export const AssistantMessage = ({ text, isComplete, onFeedback }) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleFeedback = (type) => {
    if (onFeedback) {
      onFeedback(type, text);
    }
    setFeedbackGiven(true);
  };

  return (
    <div className="assistant-message-container flex justify-center w-full mt-4 mb-4">
      <style>{styles}</style>
      <div
        className="bg-[#eff6ff] text-[#333333] py-3 px-6 rounded-lg shadow-md flex flex-col items-start max-w-2xl"
        style={{
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          maxWidth: '42rem',
          overflowWrap: 'break-word',
          overflow: 'hidden',
        }}
      >
        <div className="flex items-start w-full">
          <img src="/images/lupa.webp" alt="Logo" className="h-6 mr-4 mt-1" />
          <div
            className="text-base w-full"
            style={{
              wordBreak: 'break-word',
              whiteSpace: 'normal',
              maxWidth: '100%',
              overflowWrap: 'break-word',
            }}
          >
            {renderContent(text)}
          </div>
        </div>

        {isComplete && (
          <div className="mt-4 border-t border-gray-600 pt-2 w-full flex flex-col items-center">
            {feedbackGiven ? (
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

const styles = `
  *, *::before, *::after {
    box-sizing: border-box;
  }
  .assistant-message-container p {
    margin: 0 0 1em 0;
    max-width: 100%;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  .block-math {
    display: block;
    width: 100%;
    max-width: 100%;
    text-align: center;
    margin: 1em 0;
    overflow-x: auto;
  }
  .inline-math {
    display: inline;
    font-size: 1em;
  }
  .scaleable-math {
    font-size: 1em;
    max-width: 100%;
    overflow-wrap: break-word;
    word-break: break-word;
  }
  .scaleable-math img {
    max-width: 100%;
    height: auto;
  }
`;
