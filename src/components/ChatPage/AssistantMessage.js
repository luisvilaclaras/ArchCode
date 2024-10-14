import React from 'react';

// Función para procesar el texto y aplicar los cambios
const processText = (text) => {
    // Reemplazar **texto** por <strong>texto</strong>
    let boldText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Insertar saltos de línea antes y después de los ":"
    boldText = boldText.replace(/:\s*/g, ':\n');
    
    // Insertar saltos de línea antes de las partes en negrita
    boldText = boldText.replace(/(<strong>.*?<\/strong>)/g, '\n$1\n');
  
    return boldText;
};

export const AssistantMessage = ({ text }) => {
    const archicodeLogo = 'ruta-a-tu-logo-de-archicode.png'; // Cambia esto por la URL del logo de Archicode

    return (
        <div className="flex justify-center mb-2">
        <div className="flex justify-center w-full max-w-lg items-center">
            <div className="bg-[#0B1A2A] text-white py-2 px-4 rounded-lg flex items-center shadow-md" style={{ maxWidth: '70%', wordBreak: 'break-word', whiteSpace: 'pre-line' }}>
            <img
                src={archicodeLogo}
                alt="Archicode"
                className="w-6 h-6 mr-2 rounded-full object-cover flex-shrink-0"
            />
            <span className="text-sm" dangerouslySetInnerHTML={{ __html: processText(text) }}></span>
            </div>
        </div>
        </div>
    );
};
