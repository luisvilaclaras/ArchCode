import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { UserMessage } from './UserMessage';
import { AssistantMessage } from './AssistantMessage';

export default function Chat({ onSendMessage, onChatClick, messages, setMessages }) {
  // Removed the local state declaration of messages and setMessages
  // const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Pensando respuesta');
  const inputRef = useRef(null);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const question = input;

      // Add the user's message to the conversation
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'user', text: question },
      ]);

      // Clear the input
      setInput('');

      // Add "Thinking response..." message
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'gpt', text: loadingMessage },
      ]);

      // Set waiting indicator
      setIsWaitingForResponse(true);

      try {
        // Call onSendMessage in HomePage and wait for the result
        const response = await onSendMessage(question);

        if (response && response.sent) {
          // Replace "Thinking response..." with the actual text or error
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            const lastAssistantMessageIndex = newMessages.length - 1;
            if (response.responseText && !response.error) {
              newMessages[lastAssistantMessageIndex] = { sender: 'gpt', text: '' };
              // Start typing effect
              typeMessage(response.responseText, lastAssistantMessageIndex);
            } else {
              // Show error message if no valid response
              newMessages[lastAssistantMessageIndex] = {
                sender: 'gpt',
                text: response.responseText || 'No se recibió una respuesta válida.',
              };
            }
            return newMessages;
          });
        } else {
          // If the message was not sent, remove the user's message and the "Thinking response..."
          setMessages((prevMessages) => prevMessages.slice(0, -2));
        }
      } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        // Show error message
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          const lastAssistantMessageIndex = newMessages.length - 1;
          newMessages[lastAssistantMessageIndex] = {
            sender: 'gpt',
            text: 'Error al obtener la respuesta.',
          };
          return newMessages;
        });
      } finally {
        // Reset waiting indicator
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
      e.preventDefault(); // Prevent newline
      handleSendMessage();
    }
  };

  // Adjust the height of the textarea
  const adjustTextareaHeight = () => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`; // Maximum height limit of 200px
    }
  };

  useEffect(() => {
    adjustTextareaHeight(); // Adjust on start and when input value changes
  }, [input]);

  // Animation of the dots in "Thinking response..."
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

  // Update the assistant's message with the animation
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

  // Handler for click on the Chat component
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
            style={{ maxHeight: '200px' }} // Limit the maximum height
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
