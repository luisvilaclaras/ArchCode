import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function DocumentSelector({ availablePDFs, selectedRegion, onRegionSelect, onSelect }) {
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleRegionChange = (e) => {
    const region = e.target.value;
    onRegionSelect(region);
    setSelectedDocuments([]); // Reinicia los documentos seleccionados al cambiar la región
    onSelect([]); // Notifica al padre que la selección ha cambiado
  };

  const handleDocumentToggle = (doc) => {
    setSelectedDocuments((prevSelected) => {
      let updatedSelection;
      if (prevSelected.includes(doc)) {
        // Si el documento ya está seleccionado, lo deseleccionamos
        updatedSelection = prevSelected.filter((d) => d !== doc);
      } else {
        // Si no está seleccionado, lo añadimos
        updatedSelection = [...prevSelected, doc];
      }
      onSelect(updatedSelection);
      return updatedSelection;
    });
  };

  const regions = Object.keys(availablePDFs);

  // Filtrar documentos nacionales para no repetir si ya están en la comunidad seleccionada
  const nationalDocuments = availablePDFs['Nacionales'] || [];
  const regionalDocuments = availablePDFs[selectedRegion] || [];
  const uniqueDocuments = regionalDocuments.concat(
    nationalDocuments.filter((doc) => !regionalDocuments.includes(doc))
  );

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Cerrar el dropdown si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Estilos comunes para ambos selectores
  const commonSelectorClasses =
    'w-full py-2 px-3 rounded-md bg-[#001F54] text-white border border-white focus:outline-none focus:ring-2 focus:ring-white transition duration-200';

  return (
    <div className="flex gap-2 items-center bg-[#001F54] p-4 rounded-lg shadow-lg">
      {/* Selector de Región */}
      <div className="w-1/3 relative">
        <select
          className={`${commonSelectorClasses} appearance-none pr-10`}
          value={selectedRegion}
          onChange={handleRegionChange}
        >
          <option value="" disabled>
            Selecciona una región
          </option>
          {regions.map((region, index) => (
            <option key={index} value={region}>
              {region}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <FaChevronDown className="text-white" />
        </div>
      </div>

      {/* Selector de Documentos */}
      <div className="w-1/3 relative" ref={dropdownRef}>
        <button
          onClick={handleDropdownToggle}
          className={`${commonSelectorClasses} flex justify-between items-center pr-10`}
          disabled={!selectedRegion}
        >
          <span>
            {selectedDocuments.length > 0
              ? `${selectedDocuments.length} documento(s) seleccionado(s)`
              : 'Selecciona documentos'}
          </span>
        </button>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          {isDropdownOpen ? (
            <FaChevronUp className="text-white" />
          ) : (
            <FaChevronDown className="text-white" />
          )}
        </div>

        {isDropdownOpen && (
          <div className="absolute mt-1 w-full bg-[#001F54] text-white rounded-md shadow-lg border border-white z-10 max-h-60 overflow-auto">
            {uniqueDocuments.map((doc, index) => (
              <label key={index} className="flex items-center px-4 py-2 hover:bg-[#003366]">
                <input
                  type="checkbox"
                  checked={selectedDocuments.includes(doc)}
                  onChange={() => handleDocumentToggle(doc)}
                  className="form-checkbox h-5 w-5 text-blue-300"
                />
                <span className="ml-2">
                  {nationalDocuments.includes(doc) ? `★ ${doc}` : doc}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
