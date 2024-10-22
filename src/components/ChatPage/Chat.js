import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { UserMessage } from './UserMessage';
import { AssistantMessage } from './AssistantMessage';

export default function Chat({ onSendMessage, onChatClick, initialMessages, onSaveConversation, onFeedback }) {

  // Manejamos el estado de mensajes internamente
  const [messages, setMessages] = useState(() => initialMessages || []);

  const [input, setInput] = useState('');
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Pensando respuesta');
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null); // Referencia al final de los mensajes

  // Actualizar los mensajes cuando initialMessages cambie
  useEffect(() => {
    if (JSON.stringify(messages) !== JSON.stringify(initialMessages)) {
      setMessages(initialMessages || []);
    }
  }, [initialMessages]);

  // Función para desplazarse al final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Desplazarse al final cuando los mensajes cambien
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const question = input;
      let assistantMessageIndex;

      // Agregamos ambos mensajes en una sola llamada a setMessages
      setMessages((prevMessages) => {
        const newMessages = [
          ...prevMessages,
          { sender: 'user', text: question },
          { sender: 'gpt', text: loadingMessage, isComplete: false },
        ];
        assistantMessageIndex = newMessages.length - 1; // Índice del mensaje del asistente
        return newMessages;
      });

      // Limpiar el input
      setInput('');

      // Indicar que estamos esperando una respuesta
      setIsWaitingForResponse(true);

      try {
        const response = await onSendMessage(question);

        if (response && response.sent) {
          // Reemplazar el mensaje de 'Pensando respuesta...'
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            const lastAssistantMessageIndex = assistantMessageIndex; // Usamos el índice correcto
            if (response.responseText && !response.error) {
              newMessages[lastAssistantMessageIndex] = {
                sender: 'gpt',
                text: '',
                isComplete: false,
              };
              // Iniciar efecto de tipeo
              typeMessage(response.responseText, lastAssistantMessageIndex, question);
            } else {
              // Mostrar mensaje de error si no hay respuesta válida
              newMessages[lastAssistantMessageIndex] = {
                sender: 'gpt',
                text: response.responseText || 'No se recibió una respuesta válida.',
                isComplete: true, // Marcamos como completa
              };
            }
            return newMessages;
          });
        } else {
          // Si no se envió el mensaje, eliminar los mensajes agregados
          setMessages((prevMessages) => prevMessages.slice(0, -2));
        }
      } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        // Mostrar mensaje de error
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          const lastAssistantMessageIndex = assistantMessageIndex; // Usamos el índice correcto
          newMessages[lastAssistantMessageIndex] = {
            sender: 'gpt',
            text: 'Error al obtener la respuesta.',
            isComplete: true, // Marcamos como completa
          };
          return newMessages;
        });
      } finally {
        // Restablecer indicador de espera
        setIsWaitingForResponse(false);
      }
    }
  };

  const handleAssistantFeedback = (type, content) => {
    if (onFeedback) {
      onFeedback(type, content);
    }
  };

  const typeMessage = (fullText, index, question) => {
    let currentText = '';
    let i = 0;
    const typingSpeed = 100;
    const interval = setInterval(() => {
      currentText += fullText.charAt(i);
      i++;
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[index] = {
          ...newMessages[index],
          text: currentText,
        };
        return newMessages;
      });
      if (i >= fullText.length) {
        clearInterval(interval);
        // Una vez que el mensaje está completo, marcamos 'isComplete' como true
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[index] = {
            ...newMessages[index],
            isComplete: true,
          };
          return newMessages;
        });

        // Llamar a onSaveConversation
        if (onSaveConversation) {
          onSaveConversation(question, fullText);
        }
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
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`; // Limitar altura máxima a 200px
    }
  };

  useEffect(() => {
    adjustTextareaHeight(); // Ajustar al inicio y cuando cambia el valor de input
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

  // Manejador para clic en el componente Chat
  const handleChatClick = () => {
    if (onChatClick) {
      onChatClick();
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden" onClick={handleChatClick}>
      <div className="flex-1 overflow-y-auto p-4 bg-[#FFFFFF] rounded-lg shadow-md mb-4">
        {messages.map((msg, index) =>
          msg.sender === 'user' ? (
            <UserMessage key={index} text={msg.text} />
          ) : (
            <AssistantMessage
              key={index}
              text={msg.text}
              isComplete={msg.isComplete}
              onFeedback={handleAssistantFeedback}
            />
          )
        )}
        <div ref={messagesEndRef} /> {/* Elemento para referencia */}
      </div>
      <div className="p-2 border-t border-gray-200 flex justify-center bg-[#FFFFFF]">
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
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none ${
              isWaitingForResponse ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isWaitingForResponse}
          >
            <FaPaperPlane className="text-base" />
          </button>
        </div>
      </div>
    </div>
  );
}
