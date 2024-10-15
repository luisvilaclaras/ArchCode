import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaChevronUp, FaEdit } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import TagItem from './TagItem';

export const initialMandatoryTags = [
  {
    id: uuidv4(),
    name: 'Uso de edificio',
    value: '',
    type: 'select',
    options: [
      'Vivienda unifamiliar',
      'Edificio de viviendas',
      'Edificio de oficinas',
      'Centro comercial',
      'Industrial',
      'Patrimonio histórico',
      'Equipamiento público',
      'Otro',
    ],
  },
  {
    id: uuidv4(),
    name: 'Zona climática',
    value: '',
    type: 'select',
    options: ['A', 'B', 'C', 'D', 'E'],
  },
  {
    id: uuidv4(),
    name: 'Altura',
    value: '',
    type: 'input',
  },
  {
    id: uuidv4(),
    name: 'Núm. plantas',
    value: '',
    type: 'input',
  },
  {
    id: uuidv4(),
    name: 'Superficie del edificio',
    value: '',
    type: 'input',
  },
];

export default function ProjectInfo({
  info,
  onUpdateInfo,
  onManualEdit,
  onSave,
  setIsProjectInfoUpdated,
  onGenerateAutomaticTags,
  isGenerating,
  projectName,
  onProjectNameChange,
  resetTags,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const projectInfoRef = useRef(null); // Referencia para el componente

  const [mandatoryTags, setMandatoryTags] = useState(
    initialMandatoryTags.map(tag => ({ ...tag }))
  );
  
  const [customTags, setCustomTags] = useState([]);
  const [displayedTags, setDisplayedTags] = useState([]);
  const [inputMode, setInputMode] = useState('automatic');
  const [newTag, setNewTag] = useState({ name: '', value: '' });
  const [automaticText, setAutomaticText] = useState('');
  const [localProjectName, setLocalProjectName] = useState(projectName);

  useEffect(() => {
    setLocalProjectName(projectName);
  }, [projectName]);

  useEffect(() => {
    if (resetTags) {
      setMandatoryTags(
        initialMandatoryTags.map(tag => ({ ...tag, value: '' }))
      );
      setCustomTags([]);
      setDisplayedTags([]);
    }
  }, [resetTags]);

  useEffect(() => {
    // Reiniciar etiquetas personalizadas y mostradas
    setCustomTags([]);
    setDisplayedTags([]);
  
    if (info && info.length > 0) {
      const defaultTagIds = initialMandatoryTags.map(tag => tag.id);
  
      // Actualizar etiquetas obligatorias con valores de 'info' sin cambiar los IDs
      const updatedMandatoryTags = initialMandatoryTags.map(tag => {
        const foundTag = info.find(t => t.id === tag.id);
        return {
          ...tag,
          value: foundTag ? foundTag.value : '',
        };
      });
  
      // Obtener etiquetas personalizadas de 'info' manteniendo los IDs
      const newCustomTags = info.filter(
        tag => !defaultTagIds.includes(tag.id)
      );
  
      setMandatoryTags(updatedMandatoryTags);
      setCustomTags(newCustomTags);
    } else {
      // Si 'info' está vacío, reiniciar las etiquetas obligatorias
      setMandatoryTags(
        initialMandatoryTags.map(tag => ({ ...tag, value: '' }))
      );
      setCustomTags([]);
    }
  }, [info]);
  

  useEffect(() => {
    // Combinar etiquetas obligatorias y personalizadas
    setDisplayedTags([...mandatoryTags, ...customTags]);
  }, [mandatoryTags, customTags]);

  const handleClickOutside = (event) => {
    if (projectInfoRef.current && !projectInfoRef.current.contains(event.target)) {
      setIsOpen(false); // Cerrar el desplegable si se hace clic fuera
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleAddTag = () => {
    if (newTag.name.trim() && newTag.value.trim()) {
      const isMandatoryTag = initialMandatoryTags.some(
        tag => tag.name === newTag.name
      );
      const isExistingTag = customTags.some(
        tag => tag.name === newTag.name
      );

      if (isMandatoryTag) {
        alert('No puedes añadir una etiqueta que ya es obligatoria.');
        return;
      }

      if (isExistingTag) {
        alert('Ya existe una etiqueta con este nombre.');
        return;
      }

      const newTagWithId = {
        ...newTag,
        id: uuidv4(),
        type: 'input',
      };

      const updatedTags = [...customTags, newTagWithId];
      setCustomTags(updatedTags);
      setNewTag({ name: '', value: '' });
      onUpdateInfo([...mandatoryTags, ...updatedTags]);
      setIsProjectInfoUpdated(true);
    }
  };

  const handleCustomTagChange = (field, value) => {
    setNewTag({ ...newTag, [field]: value });
  };

  const handleTagEdit = (tagName, field, value) => {
    let updated = false;

    const updatedMandatoryTags = mandatoryTags.map(tag => {
      if (tag.name === tagName) {
        updated = true;
        return { ...tag, [field]: value };
      }
      return tag;
    });

    const updatedCustomTags = customTags.map(tag => {
      if (tag.name === tagName) {
        updated = true;
        return { ...tag, [field]: value };
      }
      return tag;
    });

    if (updated) {
      setMandatoryTags(updatedMandatoryTags);
      setCustomTags(updatedCustomTags);
      onUpdateInfo([...updatedMandatoryTags, ...updatedCustomTags]);
      setIsProjectInfoUpdated(true);
    }
  };

  const handleDeleteTag = (tagName) => {
    if (initialMandatoryTags.some(tag => tag.name === tagName)) {
      alert('No puedes eliminar una etiqueta obligatoria.');
      return;
    }

    const updatedCustomTags = customTags.filter(tag => tag.name !== tagName);
    setCustomTags(updatedCustomTags);
    onUpdateInfo([...mandatoryTags, ...updatedCustomTags]);
    setIsProjectInfoUpdated(true);
    onManualEdit();
  };

  const handleModeSwitch = (mode) => {
    setInputMode(mode);
  };

  const handleSave = () => {
    const projectData = [...mandatoryTags, ...customTags];
    onSave(projectData, localProjectName);
  };

  const handleProjectNameEdit = () => {
    const newName = prompt('Edita el nombre del proyecto:', localProjectName);
    if (newName) {
      setLocalProjectName(newName);
      onProjectNameChange(newName);
    }
  };

  return (
    <div
      ref={projectInfoRef} // Aplica la referencia aquí
      className="bg-gray-200 p-4 rounded-lg shadow-lg border border-gray-300 relative overflow-x-hidden"
    >
      {/* Encabezado */}
      <div className="flex justify-center items-center mb-2">
        <h2 className="text-lg font-semibold text-[#001F54] flex items-center gap-2">
          Información del proyecto:
        </h2>
        <h2 className="text-lg font-semibold text-[#001F54] flex items-center gap-2 ml-4">
          {localProjectName}
          <button onClick={handleProjectNameEdit} className="text-gray-600 hover:text-gray-800">
            <FaEdit />
          </button>
        </h2>
        <button
          onClick={toggleOpen}
          className="ml-4 text-gray-600 hover:text-gray-800"
        >
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
  
      {/* Contenido */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex mt-2 gap-8">
              {/* Columna Izquierda */}
              <div className="flex flex-col w-1/3 pr-4 border-r border-gray-300">
                {/* Botones de Modo como Toggle */}
                <div className="flex mb-4 gap-0">
                  <button
                    onClick={() => handleModeSwitch('automatic')}
                    className={`flex-1 px-4 py-2 rounded-l-full ${
                      inputMode === 'automatic'
                        ? 'bg-gradient-to-r from-blue-700 to-blue-900 text-white'
                        : 'bg-blue-300 text-gray-700'
                    } hover:bg-blue-800 transition-all duration-300 text-sm`}
                  >
                    Automático
                  </button>
                  <button
                    onClick={() => handleModeSwitch('manual')}
                    className={`flex-1 px-4 py-2 rounded-r-full ${
                      inputMode === 'manual'
                        ? 'bg-gradient-to-r from-blue-700 to-blue-900 text-white'
                        : 'bg-blue-300 text-gray-700'
                    } hover:bg-blue-800 transition-all duration-300 text-sm`}
                  >
                    Manual
                  </button>
                </div>
  
                {/* Campos de Entrada */}
                <div className="flex flex-col items-center gap-2 mt-2" style={{ minHeight: '140px' }}>
                  {inputMode === 'manual' && (
                    <>
                      <input
                        type="text"
                        placeholder="Nombre de la etiqueta"
                        className="w-full p-1 border border-gray-300 rounded-lg bg-gray-50"
                        value={newTag.name}
                        onChange={(e) => handleCustomTagChange('name', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Valor de la etiqueta"
                        className="w-full p-1 border border-gray-300 rounded-lg bg-gray-50"
                        value={newTag.value}
                        onChange={(e) => handleCustomTagChange('value', e.target.value)}
                      />
                      <button
                        onClick={handleAddTag}
                        className="button-common-style mt-2"
                      >
                        Crear Etiqueta
                      </button>
                    </>
                  )}
  
                  {inputMode === 'automatic' && (
                    <>
                      <textarea
                        placeholder="Ingresa una descripción del proyecto"
                        className="w-full p-1 border border-gray-300 rounded-lg bg-gray-50"
                        style={{ height: '100px' }}
                        value={automaticText}
                        onChange={(e) => setAutomaticText(e.target.value)}
                      />
                      <button
                        onClick={() => onGenerateAutomaticTags(automaticText)}
                        className="button-common-style mt-2"
                        disabled={isGenerating}
                      >
                        {isGenerating ? 'Cargando...' : 'Generar Etiquetas'}
                      </button>
                    </>
                  )}
                </div>
              </div>
  
              {/* Columna Derecha - Deslizable */}
              <div className="overflow-y-auto max-h-[160px] grid grid-cols-4 gap-2 w-2/3 custom-scrollbar ml-2 mb-4">
                <AnimatePresence>
                  {displayedTags.map((tag) => (
                    <TagItem
                      key={tag.id}
                      tag={tag}
                      initialMandatoryTags={initialMandatoryTags}
                      handleDeleteTag={handleDeleteTag}
                      handleTagEdit={handleTagEdit}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
  
            {/* Botón Guardar Proyecto */}
            <div className="absolute bottom-0 right-4">
              <button
                onClick={handleSave}
                className="button-common-style mt-6"
              >
                Guardar Proyecto
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
  
      {/* Estilos comunes para los botones */}
      <style jsx>{`
        .button-common-style {
          width: 120px;
          height: 32px;
          font-size: 0.75rem;
          padding: 0.25rem;
          background: linear-gradient(to right, #1e3a8a, #2563eb);
          color: white;
          border-radius: 9999px;
          text-align: center;
          display: inline-block;
          transition: opacity 0.3s;
        }
        .button-common-style:hover {
          opacity: 0.9;
        }
  
        .custom-scrollbar {
          overflow-x: hidden;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-image: linear-gradient(to bottom, #1A3D7C, #164375);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-image: linear-gradient(to bottom, #164375, #123456);
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background-color: #f0f0f0;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}  