import React, { useState } from 'react';

export default function DocumentSelector({ availablePDFs, selectedRegion, onRegionSelect, onSelect }) {
  const [selectedDocument, setSelectedDocument] = useState('');

  const handleRegionChange = (e) => {
    const region = e.target.value;
    onRegionSelect(region);
    setSelectedDocument(''); // Reinicia el documento seleccionado al cambiar la región
  };

  const handleDocumentChange = (e) => {
    const doc = e.target.value;
    setSelectedDocument(doc);
    onSelect(doc);
  };

  const regions = Object.keys(availablePDFs);

  // Filtrar documentos nacionales para no repetir si ya están en la comunidad seleccionada
  const nationalDocuments = availablePDFs['Nacionales'] || [];
  const regionalDocuments = availablePDFs[selectedRegion] || [];
  const uniqueDocuments = regionalDocuments.concat(
    nationalDocuments.filter((doc) => !regionalDocuments.includes(doc))
  );

  return (
    <div className="flex gap-2 items-center">
      <div className="w-1/3">
        <select
          className="w-full py-2 px-3 rounded-md bg-[#F0F0F0] border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          value={selectedRegion}
          onChange={handleRegionChange}
        >
          <option value="" disabled>Select a region</option>
          {regions.map((region, index) => (
            <option key={index} value={region}>{region}</option>
          ))}
        </select>
      </div>

      <div className="w-1/3">
        <select
          className="w-full py-2 px-3 rounded-md bg-[#F0F0F0] border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          value={selectedDocument}
          onChange={handleDocumentChange}
          disabled={!selectedRegion}
        >
          <option value="" disabled>Select a document</option>
          {uniqueDocuments.map((pdf, index) => (
            <option key={index} value={pdf}>
              {nationalDocuments.includes(pdf) ? `★ ${pdf}` : pdf}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
