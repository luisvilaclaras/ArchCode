import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

export default function Chat({ projectInfo, selectedDocument, onSendMessage }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (input.trim()) {
        const newMessages = [...messages, { sender: 'user', text: input }];
        setMessages(newMessages);
        setInput('');

        // Pasar la consulta al componente principal para obtener la respuesta
        try {
            const responseText = await onSendMessage(input);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'gpt', text: responseText }
            ]);
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'gpt', text: 'Error al obtener la respuesta.' }
            ]);
        }
    }
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
          <div key={index} className={`py-2 rounded-md p-2 mb-2 ${msg.sender === 'user' ? 'bg-[#F5F5F5] ml-10' : 'bg-[#E0E0E0] text-center'}`}>
            {msg.text}
            {msg.sender === 'gpt' && (
              <button
                className="mt-2 px-2 py-1 bg-green-500 text-white rounded"
                onClick={() => onSendMessage(msg.text)}
              >
                Actualizar la información actual del proyecto
              </button>
            )}
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
            placeholder="Type message"
          />
          <button 
            onClick={handleSendMessage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <FaPaperPlane className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
