import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const processText = (text) => {
    // Reemplazar **texto** por <strong>texto</strong>
    let boldText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Insertar saltos de línea antes y después de los ":"
    boldText = boldText.replace(/:\s*/g, ':\n');
    
    // Insertar saltos de línea antes de las partes en negrita
    boldText = boldText.replace(/(<strong>.*?<\/strong>)/g, '\n$1\n');
  
    return boldText;
};

export const UserMessage = ({ text }) => {
    return (
      <div className="flex justify-center mb-2">
        <div className="flex justify-end w-full max-w-lg items-center">
          <div className="bg-[#1E3A8A] text-white py-2 px-4 rounded-lg flex items-center shadow-md" style={{ maxWidth: '70%', wordBreak: 'break-word', whiteSpace: 'pre-line' }}>
            <FaUserCircle className="text-lg mr-2 flex-shrink-0" />
            <span className="text-sm" dangerouslySetInnerHTML={{ __html: processText(text) }}></span>
          </div>
        </div>
      </div>
    );
};