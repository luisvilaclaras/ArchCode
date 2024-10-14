import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

export default function Chat({ onSendMessage }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false); // Estado para indicar si estamos esperando una respuesta

  const handleSendMessage = async () => {
    if (input.trim()) {
      const question = input;
      setInput('');

      // Establecer indicador de espera
      setIsWaitingForResponse(true);

      try {
        // Llamar a onSendMessage en HomePage y esperar el resultado
        const response = await onSendMessage(question);

        if (response && response.sent) {
          // Añadir el mensaje del usuario a la conversación
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'user', text: question },
          ]);

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
    const typingSpeed = 30; // Velocidad de escritura en milisegundos
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
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 bg-[#001F54] rounded-lg shadow-md mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === 'user' ? 'justify-end' : 'justify-center'
            } mb-2`}
          >
            <div
              className={`py-2 px-4 rounded-lg max-w-xs ${
                msg.sender === 'user'
                  ? 'bg-blue-300 text-black'
                  : 'bg-blue-700 text-white'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-2 border-t border-gray-200 flex justify-center bg-[#001F54]">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full py-1 pl-4 pr-8 rounded-full bg-[#F5F5F5] border-none focus:outline-none text-xs"
            placeholder="Escribe un mensaje"
            disabled={isWaitingForResponse} // Deshabilitar input mientras se espera respuesta
          />
          <button
            onClick={handleSendMessage}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none ${
              isWaitingForResponse ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isWaitingForResponse} // Deshabilitar botón mientras se espera respuesta
          >
            <FaPaperPlane className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
