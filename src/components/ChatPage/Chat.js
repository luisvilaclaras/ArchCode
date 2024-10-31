import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { UserMessage } from './UserMessage';
import { AssistantMessage } from './AssistantMessage';

export default function Chat({
  onSendMessage,
  onChatClick,
  initialMessages,
  onSaveConversation,
  onFeedback,
  isWaitingForResponse,
  onStartWaitingResponse,
  onEndWaitingResponse,
}) {
  const [messages, setMessages] = useState(() => initialMessages || []);
  const [input, setInput] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('Pensando respuesta');
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const assistantMessageIndexRef = useRef(null); // Referencia al índice del mensaje del asistente

  useEffect(() => {
    setMessages(initialMessages || []);
  }, [initialMessages]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const question = input;

      // Indicar que estamos esperando una respuesta
      if (onStartWaitingResponse) {
        onStartWaitingResponse();
      }

      // Agregar el mensaje del usuario y el mensaje de 'Pensando...' al chat
      let assistantMessageIndex;
      setMessages((prevMessages) => {
        const newMessages = [
          ...prevMessages,
          { sender: 'user', text: question },
          { sender: 'gpt', text: loadingMessage, isComplete: false },
        ];
        assistantMessageIndex = newMessages.length - 1;
        assistantMessageIndexRef.current = assistantMessageIndex; // Guardar el índice en la referencia
        return newMessages;
      });

      // **Eliminar la limpieza del input aquí**
      // setInput('');

      try {
        const response = await onSendMessage(question);

        if (response && response.sent) {
          // Reemplazar el placeholder con la respuesta real
          if (response.responseText && !response.error) {
            typeMessage(response.responseText, assistantMessageIndex, question);
          } else {
            // Manejar error: actualizar el mensaje del asistente con el error
            setMessages((prevMessages) => {
              const newMessages = [...prevMessages];
              newMessages[assistantMessageIndex] = {
                sender: 'gpt',
                text: response.responseText || 'No se recibió una respuesta válida.',
                isComplete: true,
              };
              return newMessages;
            });
            if (onEndWaitingResponse) {
              onEndWaitingResponse();
            }

            // **Limpiar el input después de manejar el error**
            setInput('');
          }
        } else {
          // Si el mensaje no se envió, eliminar el mensaje de 'Pensando...'
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            newMessages.splice(assistantMessageIndex, 1); // Eliminar el último mensaje
            return newMessages;
          });
          if (onEndWaitingResponse) {
            onEndWaitingResponse();
          }
          // **Mantener el input con el mensaje para que el usuario pueda corregirlo**
        }
      } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        // Eliminar el mensaje de 'Pensando...'
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages.splice(assistantMessageIndex, 1);
          return newMessages;
        });
        if (onEndWaitingResponse) {
          onEndWaitingResponse();
        }
        // **Mantener el input con el mensaje para que el usuario pueda corregirlo**
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
    const typingSpeed = 1; // Velocidad de tipeo en milisegundos

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

      // Scroll al final después de actualizar el mensaje
      setTimeout(() => {
        scrollToBottom();
      }, 0);

      if (i >= fullText.length) {
        clearInterval(interval);
        // Marcar el mensaje como completo
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[index] = {
            ...newMessages[index],
            isComplete: true,
          };
          return newMessages;
        });

        // Guardar la conversación
        if (onSaveConversation) {
          onSaveConversation(question, fullText);
        }

        // Indicar que ya no estamos esperando una respuesta
        if (onEndWaitingResponse) {
          onEndWaitingResponse();
        }

        // **Limpiar el input después de completar la respuesta**
        setInput('');
      }
    }, typingSpeed);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Evitar salto de línea
      if (!isWaitingForResponse) {
        handleSendMessage();
      }
    }
  };

  // Ajustar la altura del textarea
  const adjustTextareaHeight = () => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  // Animación de los puntos en "Pensando respuesta..."
  useEffect(() => {
    let interval;
    if (isWaitingForResponse) {
      let count = 0;
      interval = setInterval(() => {
        const dots = '.'.repeat((count % 3) + 1);
        const newLoadingMessage = `Pensando respuesta${dots}`;
        setLoadingMessage(newLoadingMessage);

        // Actualizar el mensaje del asistente con la nueva animación
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          const assistantMessageIndex = assistantMessageIndexRef.current;
          if (
            assistantMessageIndex !== null &&
            newMessages[assistantMessageIndex]?.sender === 'gpt' &&
            !newMessages[assistantMessageIndex]?.isComplete
          ) {
            newMessages[assistantMessageIndex] = {
              ...newMessages[assistantMessageIndex],
              text: newLoadingMessage,
            };
          }
          return newMessages;
        });

        count++;
      }, 800);
    } else {
      setLoadingMessage('Pensando respuesta');
    }
    return () => clearInterval(interval);
  }, [isWaitingForResponse]);

  // Handler para clic en el componente Chat
  const handleChatClick = () => {
    if (onChatClick) {
      onChatClick();
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden" onClick={handleChatClick}>
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-[#FFFFFF] rounded-lg shadow-md mb-4"
      >
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
            style={{ maxHeight: '200px' }}
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
