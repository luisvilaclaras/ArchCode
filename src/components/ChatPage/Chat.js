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
  // Ya no necesitaremos la ref para el ancla
  const assistantMessageIndexRef = useRef(null);

  useEffect(() => {
    setMessages(initialMessages || []);
  }, [initialMessages]);

  // Función para verificar la posición actual del scroll
  const isUserNearBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // Si el usuario está a menos de 100px del final, se considera cerca
      return scrollHeight - scrollTop - clientHeight < 100;
    }
    return false;
  };

  // Nueva función: desplazar hasta el último mensaje (bloque) usando block: 'nearest'
  const scrollToLastMessage = () => {
    const container = messagesContainerRef.current;
    if (container) {
      // Obtener el último elemento hijo (último mensaje)
      const lastMessage = container.lastElementChild;
      if (lastMessage) {
        // Primero, desplaza el último mensaje en vista de forma suave
        lastMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        // Luego, con un pequeño delay, desplaza unos píxeles extra hacia abajo
        setTimeout(() => {
          container.scrollBy({ top: 400, behavior: 'smooth' }); // desplaza 30px extra
        }, 1);
      }
    }
  };

  // Efecto: cada vez que se actualicen los mensajes se intenta hacer scroll hasta el último mensaje
  useEffect(() => {
    scrollToLastMessage();
    // Si el contenido tarda en renderizarse, se podría usar un pequeño timeout
    // setTimeout(scrollToLastMessage, 50);
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const question = input;
      onStartWaitingResponse && onStartWaitingResponse();

      let assistantMessageIndex;
      setMessages((prevMessages) => {
        const newMessages = [
          ...prevMessages,
          { sender: 'user', text: question },
          { sender: 'gpt', text: loadingMessage, isComplete: false },
        ];
        assistantMessageIndex = newMessages.length - 1;
        assistantMessageIndexRef.current = assistantMessageIndex;
        return newMessages;
      });

      try {
        const response = await onSendMessage(question);
        if (response && response.sent) {
          if (response.responseText && !response.error) {
            onEndWaitingResponse && onEndWaitingResponse();
            typeMessage(response.responseText, assistantMessageIndex, question);
          } else {
            setMessages((prevMessages) => {
              const newMessages = [...prevMessages];
              newMessages[assistantMessageIndex] = {
                sender: 'gpt',
                text: response.responseText || 'No se recibió una respuesta válida.',
                isComplete: true,
              };
              return newMessages;
            });
            onEndWaitingResponse && onEndWaitingResponse();
            setInput('');
          }
        } else {
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            newMessages.splice(assistantMessageIndex, 1);
            return newMessages;
          });
          onEndWaitingResponse && onEndWaitingResponse();
        }
      } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages.splice(assistantMessageIndex, 1);
          return newMessages;
        });
        onEndWaitingResponse && onEndWaitingResponse();
      }
    }
  };

  const handleAssistantFeedback = (type, content) => {
    onFeedback && onFeedback(type, content);
  };

  // La función typeMessage simula el tipeo progresivo de la respuesta
  const typeMessage = (fullText, index, question) => {
    let currentText = '';
    let i = 0;
    const typingSpeed = 10; // milisegundos
    const charsPerTick = 5;

    const interval = setInterval(() => {
      currentText += fullText.substring(i, i + charsPerTick);
      i += charsPerTick;
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
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[index] = {
            ...newMessages[index],
            isComplete: true,
          };
          return newMessages;
        });
        onSaveConversation && onSaveConversation(question, fullText);
        setInput('');
      }
    }, typingSpeed);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isWaitingForResponse) {
        handleSendMessage();
      }
    }
  };

  // Ajuste del área del textarea
  const adjustTextareaHeight = () => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  useEffect(() => {
    let interval;
    if (isWaitingForResponse) {
      let count = 0;
      interval = setInterval(() => {
        const dots = '.'.repeat((count % 3) + 1);
        const newLoadingMessage = `Pensando respuesta${dots}`;
        setLoadingMessage(newLoadingMessage);
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

  const handleChatClick = () => {
    onChatClick && onChatClick();
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden" onClick={handleChatClick}>
      {messages.length > 0 && (
        <div
          ref={messagesContainerRef}
          className="flex-1 p-4 bg-[#FFFFFF] rounded-lg shadow-md max-w-full mx-auto overflow-y-auto overflow-x-hidden mb-20 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          style={{ width: 'calc(100% - 1rem)' }}
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
      )}
      <div className="p-4 border-t border-gray-200 bg-[#FFFFFF] fixed bottom-0 left-0 right-0 flex justify-center">
        <div className="relative w-full max-w-2xl mx-auto flex items-center gap-3 px-4">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            rows="1"
            className="w-full py-2 px-4 rounded-md bg-[#F5F5F5] border-none focus:outline-none text-sm resize-none overflow-hidden shadow-md"
            placeholder="Escribe un mensaje"
            style={{ maxHeight: '120px' }}
          />
          <button
            onClick={handleSendMessage}
            className={`text-gray-600 hover:text-gray-800 focus:outline-none ${
              isWaitingForResponse ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isWaitingForResponse}
          >
            <FaPaperPlane className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
