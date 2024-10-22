import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function DocumentSelector({ availablePDFs, selectedRegion, onRegionSelect, onSelect }) {
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 }); // Estado para el tooltip
  const dropdownRef = useRef(null);
  const regionDropdownRef = useRef(null);
  let tooltipTimeout = useRef(null); // Para manejar el tiempo del tooltip

  const handleRegionChange = (region) => {
    onRegionSelect(region);
    setSelectedDocuments([]); // Reinicia los documentos seleccionados al cambiar la región
    onSelect([]); // Notifica al padre que la selección ha cambiado
    setIsRegionDropdownOpen(false); // Cerrar el dropdown de regiones
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

  const regions = ['Normativas nacionales', ...Object.keys(availablePDFs).filter(r => r !== 'Normativas nacionales')];

  // Filtrar documentos nacionales para no repetir si ya están en la comunidad seleccionada
  const nationalDocuments = availablePDFs['Normativas nacionales'] || [];
  const regionalDocuments = availablePDFs[selectedRegion] || [];
  const uniqueDocuments = regionalDocuments.concat(
    nationalDocuments.filter((doc) => !regionalDocuments.includes(doc))
  );

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleRegionDropdownToggle = () => {
    setIsRegionDropdownOpen(!isRegionDropdownOpen);
  };

  // Cerrar el dropdown si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target)) {
        setIsRegionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Función para mostrar el tooltip después de 1 segundo
  const showTooltip = (event, text) => {
    tooltipTimeout.current = setTimeout(() => {
      setTooltip({
        show: true,
        text,
        x: event.clientX + 10,
        y: event.clientY + 10,
      });
    }, 1000); // Mostrar después de 1 segundo
  };

  // Función para ocultar el tooltip
  const hideTooltip = () => {
    clearTimeout(tooltipTimeout.current); // Cancelar el timeout si el mouse sale antes del tiempo
    setTooltip({ ...tooltip, show: false });
  };

  // Estilos comunes para ambos selectores
  const commonSelectorClasses =
    'py-2 px-3 rounded-md bg-gray-200 text-gray-700 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200';

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Tooltip */}
      {tooltip.show && (
        <div
          style={{
            position: 'fixed',
            top: `${tooltip.y}px`,
            left: `${tooltip.x}px`,
            backgroundColor: 'black',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
            zIndex: 1000,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Selector de Región */}
      <div className="relative" ref={regionDropdownRef}>
        <button
          className={`${commonSelectorClasses} flex justify-between items-center pr-10 w-72`} // Aumentar el ancho del botón de selección
          onClick={handleRegionDropdownToggle}
        >
          <div className="flex items-center">
            {/* Mostrar la bandera seleccionada */}
            {selectedRegion && (
              <img
                src={`images/regions/${selectedRegion === 'Normativas nacionales' ? 'Normativas Nacionales.gif' : `${selectedRegion}.gif`}`}
                alt={`${selectedRegion} flag`}
                className="inline-block w-4 h-4 mr-2"
              />
            )}
            <span>{selectedRegion || 'Selecciona región'}</span>
          </div>
          <FaChevronDown className="text-gray-600" />
        </button>

        {isRegionDropdownOpen && (
          <div className="absolute mt-1 w-full bg-gray-200 text-gray-700 rounded-md shadow-lg border border-gray-400 z-10 max-h-96 overflow-auto"> {/* Aumentar la altura máxima */}
            {regions.map((region, index) => (
              <div
                key={index}
                className="flex items-center px-4 py-2 hover:bg-gray-300 cursor-pointer"
                onClick={() => handleRegionChange(region)}
              >
                <div className="w-6 h-6 flex justify-center items-center">
                  <img
                    src={`images/regions/${region === 'Normativas nacionales' ? 'Normativas Nacionales.gif' : `${region}.gif`}`}
                    alt={`${region} flag`}
                    className="inline-block w-4 h-4"
                  />
                </div>
                <span className="ml-2">{region}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selector de Documentos */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={handleDropdownToggle}
          className={`${commonSelectorClasses} flex justify-between items-center pr-10 w-96`} // Aumentar el ancho del botón de selección a w-96
          disabled={!selectedRegion}
        >
          <span className="truncate">
            {selectedDocuments.length > 0
              ? `${selectedDocuments.length} documento(s) seleccionado(s)`
              : 'Selecciona documentos'}
          </span>
        </button>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          {isDropdownOpen ? (
            <FaChevronUp className="text-gray-600" />
          ) : (
            <FaChevronDown className="text-gray-600" />
          )}
        </div>

        {isDropdownOpen && (
          <div className="absolute mt-1 w-full bg-gray-200 text-gray-700 rounded-md shadow-lg border border-gray-400 z-10 max-h-96 overflow-auto"> {/* Aumentar la altura máxima */}
            {uniqueDocuments.map((doc, index) => (
              <label
                key={index}
                className="flex items-center px-4 py-2 hover:bg-gray-300 w-full"
                onMouseEnter={(event) => showTooltip(event, doc)}
                onMouseLeave={hideTooltip}
              > {/* Aumentar el ancho de los elementos */}
                <input
                  type="checkbox"
                  checked={selectedDocuments.includes(doc)}
                  onChange={() => handleDocumentToggle(doc)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <div className="ml-2 flex items-center w-6 h-6 justify-center">
                  {nationalDocuments.includes(doc) && (
                    <img
                      src="images/regions/Normativas Nacionales.gif"
                      alt="Normativas Nacionales"
                      className="inline-block w-4 h-4"
                    />
                  )}
                </div>
                <span className="ml-2 truncate w-full">{doc}</span> {/* Asegurarse de que el texto no se salga de la línea */}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
