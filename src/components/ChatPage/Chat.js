import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { UserMessage } from './UserMessage';
import { AssistantMessage } from './AssistantMessage';

export default function Chat({ onSendMessage, onChatClick }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Pensando respuesta');
  const inputRef = useRef(null);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const question = input;

      // Añadir el mensaje del usuario a la conversación
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'user', text: question },
      ]);

      // Limpiar el input
      setInput('');

      // Añadir mensaje "Pensando respuesta..."
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'gpt', text: loadingMessage },
      ]);

      // Establecer indicador de espera
      setIsWaitingForResponse(true);

      try {
        // Llamar a onSendMessage en HomePage y esperar el resultado
        const response = await onSendMessage(question);

        if (response && response.sent) {
          // Reemplazar el mensaje "Pensando respuesta..." con el texto real o error
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            const lastAssistantMessageIndex = newMessages.length - 1;
            if (response.responseText && !response.error) {
              newMessages[lastAssistantMessageIndex] = { sender: 'gpt', text: '' };
              // Iniciar el efecto de escritura
              typeMessage(response.responseText, lastAssistantMessageIndex);
            } else {
              // Mostrar mensaje de error si no hay respuesta válida
              newMessages[lastAssistantMessageIndex] = { sender: 'gpt', text: response.responseText || 'No se recibió una respuesta válida.' };
            }
            return newMessages;
          });
        } else {
          // Si el mensaje no fue enviado, eliminar el mensaje del usuario y el de 'Pensando respuesta...'
          setMessages((prevMessages) => prevMessages.slice(0, -2));
        }
      } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        // Mostrar mensaje de error
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          const lastAssistantMessageIndex = newMessages.length - 1;
          newMessages[lastAssistantMessageIndex] = { sender: 'gpt', text: 'Error al obtener la respuesta.' };
          return newMessages;
        });
      } finally {
        // Restablecer indicador de espera
        setIsWaitingForResponse(false);
      }
    }
  };

  const typeMessage = (fullText, index) => {
    let currentText = '';
    let i = 0;
    const typingSpeed = 30;
    const interval = setInterval(() => {
      currentText += fullText.charAt(i);
      i++;
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[index] = { ...newMessages[index], text: currentText };
        return newMessages;
      });
      if (i >= fullText.length) {
        clearInterval(interval);
      }
    }, typingSpeed);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Evitar salto de línea
      handleSendMessage();
    }
  };

  // Ajustar la altura del textarea
  const adjustTextareaHeight = () => {
    const textarea = inputRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`; // Límite máximo de 200px de altura
  };

  useEffect(() => {
    adjustTextareaHeight(); // Ajustar al iniciar y cuando cambie el valor del input
  }, [input]);

  // Animación de los puntos en "Pensando respuesta..."
  useEffect(() => {
    let interval;
    if (isWaitingForResponse) {
      let count = 0;
      interval = setInterval(() => {
        const dots = '.'.repeat((count % 3) + 1);
        setLoadingMessage(`Pensando respuesta${dots}`);
        count++;
      }, 500);
    } else {
      setLoadingMessage('Pensando respuesta');
    }
    return () => clearInterval(interval);
  }, [isWaitingForResponse]);

  // Actualizar el mensaje del asistente con la animación
  useEffect(() => {
    if (isWaitingForResponse) {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        const lastAssistantMessageIndex = newMessages.length - 1;
        if (newMessages[lastAssistantMessageIndex]?.sender === 'gpt') {
          newMessages[lastAssistantMessageIndex] = {
            ...newMessages[lastAssistantMessageIndex],
            text: loadingMessage,
          };
        }
        return newMessages;
      });
    }
  }, [loadingMessage]);

  // Handler para el clic en el componente Chat
  const handleChatClick = () => {
    if (onChatClick) {
      onChatClick();
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden" onClick={handleChatClick}>
      <div className="flex-1 overflow-y-auto p-4 bg-[#001F54] rounded-lg shadow-md mb-4">
        {messages.map((msg, index) =>
          msg.sender === 'user' ? (
            <UserMessage key={index} text={msg.text} />
          ) : (
            <AssistantMessage key={index} text={msg.text} />
          )
        )}
      </div>
      <div className="p-2 border-t border-gray-200 flex justify-center bg-[#001F54]">
        <div className="relative w-full max-w-xl">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            rows="1"
            className="w-full py-2 pl-4 pr-10 rounded-lg bg-[#F5F5F5] border-none focus:outline-none text-sm resize-none overflow-hidden shadow-md"
            placeholder="Escribe un mensaje"
            disabled={isWaitingForResponse}
            style={{ maxHeight: '200px' }} // Limitar la altura máxima
          />
          <button
            onClick={handleSendMessage}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none ${isWaitingForResponse ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isWaitingForResponse}
          >
            <FaPaperPlane className="text-base" />
          </button>
        </div>
      </div>
    </div>
  );
}
