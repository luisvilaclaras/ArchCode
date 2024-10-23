import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import AlertModal from '@/components/Modals/AlertModal'; // Importamos el AlertModal

export default function DocumentSelector({ availablePDFs, selectedRegion, onRegionSelect, onSelect }) {
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false); // Estado para controlar la visibilidad del AlertModal
  const [alertMessage, setAlertMessage] = useState(''); // Estado para almacenar el mensaje del AlertModal
  const dropdownRef = useRef(null);
  const regionDropdownRef = useRef(null);

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
        onSelect(updatedSelection);
        return updatedSelection;
      } else {
        if (prevSelected.length >= 5) {
          // Si ya hay 5 documentos seleccionados, mostramos el AlertModal
          setAlertMessage('Solo puedes seleccionar hasta 5 documentos a la vez.');
          setShowAlertModal(true);
          return prevSelected; // No actualizamos la selección
        } else {
          // Si no está seleccionado y no se ha alcanzado el límite, lo añadimos
          updatedSelection = [...prevSelected, doc];
          onSelect(updatedSelection);
          return updatedSelection;
        }
      }
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

  // Estilos comunes para ambos selectores
  const commonSelectorClasses =
    'py-2 px-3 rounded-md bg-gray-200 text-gray-700 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200';

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Selector de Región */}
      <div className="relative" ref={regionDropdownRef}>
        <button
          className={`${commonSelectorClasses} flex justify-between items-center pr-10 w-72`}
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
          <div className="absolute mt-1 w-full bg-gray-200 text-gray-700 rounded-md shadow-lg border border-gray-400 z-10 max-h-96 overflow-auto">
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
          className={`${commonSelectorClasses} flex justify-between items-center pr-4 custom:pr-10 w-75 custom:w-96`}
          disabled={!selectedRegion}
        >
          <div className="flex items-center">
            <span className="truncate">
              {selectedDocuments.length > 0
                ? `${selectedDocuments.length} documento(s) seleccionado(s)`
                : 'Selecciona documentos'}
            </span>
          </div>
          <FaChevronDown className="text-gray-600" />
        </button>




        {isDropdownOpen && (
          <div className="absolute mt-1 w-full bg-gray-200 text-gray-700 rounded-md shadow-lg border border-gray-400 z-10 max-h-96 overflow-auto">
            {uniqueDocuments.map((doc, index) => {
              // Determinar la bandera a mostrar
              let flagSrc = '';
              let flagAlt = '';

              if (regionalDocuments.includes(doc)) {
                // Documento de la región seleccionada
                flagSrc = `images/regions/${selectedRegion === 'Normativas nacionales' ? 'Normativas Nacionales.gif' : `${selectedRegion}.gif`}`;
                flagAlt = `${selectedRegion} flag`;
              } else if (nationalDocuments.includes(doc)) {
                // Documento nacional
                flagSrc = 'images/regions/Normativas Nacionales.gif';
                flagAlt = 'Normativas Nacionales';
              }

              return (
                <label
                  key={index}
                  className="grid grid-cols-[auto_auto_1fr] gap-x-2 items-start px-4 py-2 hover:bg-gray-300 w-full"
                >
                  <input
                    type="checkbox"
                    checked={selectedDocuments.includes(doc)}
                    onChange={() => handleDocumentToggle(doc)}
                    onClick={(e) => e.stopPropagation()} // Añadido para evitar que el clic cierre el dropdown
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />

                  <div className="flex items-center w-6 h-6 justify-center">
                    {flagSrc && (
                      <img
                        src={flagSrc}
                        alt={flagAlt}
                        className="inline-block w-4 h-4"
                      />
                    )}
                  </div>
                  <span>{doc}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de alerta */}
      {showAlertModal && (
        <AlertModal
          message={alertMessage}
          onClose={() => setShowAlertModal(false)}
        />
      )}
    </div>
  );
}
