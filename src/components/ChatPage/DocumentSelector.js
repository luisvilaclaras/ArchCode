import React, { useState } from 'react';

export default function DocumentSelector({ onSelect }) {
  const [selectedDocument, setSelectedDocument] = useState('');

  const handleSelect = (e) => {
    const doc = e.target.value;
    setSelectedDocument(doc);
    onSelect(doc); // Devuelve la string con el PDF seleccionado
  };

  return (
    <div className="relative inline-block w-64">
      <select 
        className="w-full py-2 px-4 rounded-lg bg-[#F5F5F5] border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
        value={selectedDocument}
        onChange={handleSelect}
      >
        <option value="" disabled>Select a document</option>
        <option value="SE - Seguridad Estructural">SE - Seguridad Estructural</option>
        <option value="Seguridad_En_Caso_De_Incendios">SI - Seguridad en caso de incendio</option>
        <option value="SUA - Seguridad de utilización y accesibilidad">SUA - Seguridad de utilización y accesibilidad</option>
        <option value="HE - Ahorro de energía">HE - Ahorro de energía</option>
      </select>
    </div>
  );
}
