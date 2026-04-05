'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import AlertModal from '@/components/Modals/AlertModal';
import TooltipIcon from '@/components/Tooltip/TooltipIcon'; 

export default function DocumentSelector({ availablePDFs, selectedRegion, onRegionSelect, onSelect, userData }) {
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [isDocumentsDropdownOpen, setIsDocumentsDropdownOpen] = useState(false);
  const [isUserDocsDropdownOpen, setIsUserDocsDropdownOpen] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Referencias únicas para cada dropdown
  const regionDropdownRef = useRef(null);
  const documentsDropdownRef = useRef(null);
  const userDocsDropdownRef = useRef(null);

  const [userUploadedPdfs, setUserUploadedPdfs] = useState([]);

  useEffect(() => {
    if (userData && userData.uploadedPdfs) {
      setUserUploadedPdfs(userData.uploadedPdfs);
    } else {
      setUserUploadedPdfs([]);
    }
  }, [userData]);

  const handleRegionChange = (region) => {
    onRegionSelect(region);
    setSelectedDocuments((prevSelected) => {
      const regionalDocuments = availablePDFs[region] || [];
      const nationalDocuments = availablePDFs['Normativas nacionales'] || [];
      const validDocuments = [...regionalDocuments, ...nationalDocuments];
      return prevSelected.filter((doc) => validDocuments.includes(doc) || doc.startsWith('userDoc:'));
    });
    setIsRegionDropdownOpen(false);
  };

  const handleDocumentToggle = (doc) => {
    setSelectedDocuments((prevSelected) => {
      let updatedSelection;
      if (prevSelected.includes(doc)) {
        updatedSelection = prevSelected.filter((d) => d !== doc);
      } else {
        if (prevSelected.length >= 5) {
          setAlertMessage('Solo puedes seleccionar hasta 5 documentos a la vez.');
          setShowAlertModal(true);
          return prevSelected;
        } else {
          updatedSelection = [...prevSelected, doc];
        }
      }
      return updatedSelection;
    });
  };

  useEffect(() => {
    onSelect(selectedDocuments);
  }, [selectedDocuments, onSelect]);

  const regions = ['Normativas nacionales', ...Object.keys(availablePDFs).filter(r => r !== 'Normativas nacionales')];

  const nationalDocuments = availablePDFs['Normativas nacionales'] || [];
  const regionalDocuments = availablePDFs[selectedRegion] || [];
  const uniqueDocuments = regionalDocuments.concat(
    nationalDocuments.filter((doc) => !regionalDocuments.includes(doc))
  );

  const handleRegionDropdownToggle = () => {
    setIsRegionDropdownOpen(!isRegionDropdownOpen);
  };

  const handleDocumentsDropdownToggle = () => {
    if (selectedRegion && selectedRegion.trim() !== '') {
      setIsDocumentsDropdownOpen(!isDocumentsDropdownOpen);
    }
  };

  const handleUserDocsDropdownToggle = () => {
    setIsUserDocsDropdownOpen(!isUserDocsDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target)) {
        setIsRegionDropdownOpen(false);
      }
      if (documentsDropdownRef.current && !documentsDropdownRef.current.contains(event.target)) {
        setIsDocumentsDropdownOpen(false);
      }
      if (userDocsDropdownRef.current && !userDocsDropdownRef.current.contains(event.target)) {
        setIsUserDocsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const commonSelectorClasses =
    'py-2 px-3 rounded-md bg-gray-200 text-gray-700 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200';

  // Determinar si "Tus documentos subidos" está activo
  const isUserDocsActive = userUploadedPdfs && userUploadedPdfs.length > 0;

  // Contar solo los documentos seleccionados que no son de "Tus documentos subidos"
  const selectedNormalDocumentsCount = selectedDocuments.filter(doc => !doc.startsWith('userDoc:')).length;

  // Clases condicionales para "Selecciona Documentos"
  const documentsColSpan = isUserDocsActive ? 'md:col-span-1' : 'md:col-span-2';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Primer Selector: Normativas nacionales */}
      <div className={`md:col-span-2 lg:col-span-1`}>
        <div className="relative" ref={regionDropdownRef}>
        <button
          className={`${commonSelectorClasses} flex items-center w-full justify-between pr-4`}
          onClick={handleRegionDropdownToggle}
        >
          <div className="flex items-center">
            {selectedRegion && (
              <img
                src={`images/regions/${selectedRegion === 'Normativas nacionales' ? 'Normativas Nacionales.gif' : `${selectedRegion}.gif`}`}
                alt={`${selectedRegion} flag`}
                className="inline-block w-4 h-4 mr-2"
              />
            )}
            <span className="truncate">{selectedRegion || 'Selecciona región'}</span>
          </div>
          <div className="flex-shrink-0 ml-auto">
            <FaChevronDown className="text-gray-600" />
          </div>
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
      </div>

      {/* Segundo Selector: Selecciona Documentos */}
      <div className={`col-span-1 ${documentsColSpan}`}>
        <div className="relative" ref={documentsDropdownRef}>
          <button
            onClick={handleDocumentsDropdownToggle}
            className={`${commonSelectorClasses} flex justify-between items-center pr-4 w-full`}
            disabled={!selectedRegion || selectedRegion.trim() === ''}
            title={!selectedRegion || selectedRegion.trim() === '' ? 'Selecciona una región primero' : 'Selecciona documentos'}
          >
            <div className="flex items-center">
              <span className="truncate">
                {selectedNormalDocumentsCount > 0
                  ? `${selectedNormalDocumentsCount} documento(s) seleccionado(s)`
                  : 'Selecciona documentos'}
              </span>
            </div>
            <FaChevronDown className="text-gray-600" />
          </button>

          {isDocumentsDropdownOpen && selectedRegion && selectedRegion.trim() !== '' && (
            <div className="absolute mt-1 w-full bg-gray-200 text-gray-700 rounded-md shadow-lg border border-gray-400 z-10 max-h-96 overflow-auto">
              {uniqueDocuments.map((doc, index) => {
                let flagSrc = '';
                let flagAlt = '';

                if (regionalDocuments.includes(doc)) {
                  flagSrc = `images/regions/${selectedRegion === 'Normativas nacionales' ? 'Normativas Nacionales.gif' : `${selectedRegion}.gif`}`;
                  flagAlt = `${selectedRegion} flag`;
                } else if (nationalDocuments.includes(doc)) {
                  flagSrc = 'images/regions/Normativas Nacionales.gif';
                  flagAlt = 'Normativas Nacionales';
                }

                return (
                  <label
                    key={index}
                    className="grid grid-cols-[auto_auto_1fr] gap-x-2 items-center px-4 py-2 hover:bg-gray-300 w-full cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDocuments.includes(doc)}
                      onChange={() => handleDocumentToggle(doc)}
                      onClick={(e) => e.stopPropagation()}
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
      </div>

      {/* Tercer Selector: Tus documentos subidos */}
      {isUserDocsActive && (
        <div className="col-span-1">
          <div className="relative" ref={userDocsDropdownRef}>
            <button
              onClick={handleUserDocsDropdownToggle}
              className={`${commonSelectorClasses} flex justify-between items-center pr-4 w-full`}
            >
              <div className="flex items-center">
                <span className="truncate">
                  {selectedDocuments.filter(doc => doc.startsWith('userDoc:')).length > 0
                    ? `${selectedDocuments.filter(doc => doc.startsWith('userDoc:')).length} documento(s) seleccionado(s)`
                    : 'Tus documentos subidos'}
                </span>
              </div>
              <FaChevronDown className="text-gray-600" />
            </button>

            {isUserDocsDropdownOpen && (
              <div className="absolute mt-1 w-96 bg-gray-200 text-gray-700 rounded-md shadow-lg border border-gray-400 z-10 max-h-96 overflow-auto">
                {userUploadedPdfs.map((doc, index) => (
                  <label
                    key={index}
                    className="grid grid-cols-[auto_auto_1fr] gap-x-2 items-center px-4 py-2 hover:bg-gray-300 w-full cursor-pointer"
                  >
                    {doc.enabled ? (
                      <input
                        type="checkbox"
                        checked={selectedDocuments.includes(`userDoc:${doc.name}`)}
                        onChange={() => handleDocumentToggle(`userDoc:${doc.name}`)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                    ) : (
                      <div className="w-5 h-5 flex items-center justify-center text-gray-500">
                        {/* Icono de Información con Tooltip */}
                        <TooltipIcon
                          message="Este pdf está siendo procesado por el equipo de Archcode (Máximo plazo de 24h). Cuando el procesado termine, estará disponible para usar!"
                        />
                      </div>
                    )}
                    <span className="ml-2">{doc.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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
