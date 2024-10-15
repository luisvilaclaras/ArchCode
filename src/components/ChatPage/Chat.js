import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { UserMessage } from './UserMessage';
import { AssistantMessage } from './AssistantMessage';

export default function Chat({ onSendMessage }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const inputRef = useRef(null);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const question = input;
      setInput('');

      // Añadir el mensaje del usuario a la conversación inmediatamente
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'user', text: question },
      ]);

      // Establecer indicador de espera
      setIsWaitingForResponse(true);

      try {
        // Llamar a onSendMessage en HomePage y esperar el resultado
        const response = await onSendMessage(question);

        if (response && response.sent) {
          // Añadir el mensaje del asistente con texto vacío inicialmente
          setMessages((prevMessages) => {
            const newMessages = [
              ...prevMessages,
              { sender: 'gpt', text: '' },
            ];
            const assistantMessageIndex = newMessages.length - 1;

            // Iniciar el efecto de escritura
            typeMessage(response.responseText, assistantMessageIndex);
            return newMessages;
          });
        }
      } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'gpt', text: 'Error al obtener la respuesta.' },
        ]);
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

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 bg-[#001F54] rounded-lg shadow-md mb-4">
        {messages.map((msg, index) => (
          msg.sender === 'user' ? (
            <UserMessage key={index} text={msg.text} />
          ) : (
            <AssistantMessage key={index} text={msg.text} />
          )
        ))}
      </div>
      <div className="p-2 border-t border-gray-200 flex justify-center bg-[#001F54]">
        <div className="relative w-full max-w-xl"> {/* Cambié de max-w-lg a max-w-xl */}
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
