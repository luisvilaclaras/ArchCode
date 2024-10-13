import React, { useState, useEffect } from 'react';
import { FaTimes, FaChevronDown, FaChevronUp, FaEdit } from 'react-icons/fa';
import { motion, AnimatePresence, usePresence } from 'framer-motion';

export const initialMandatoryTags = [
  { name: 'Uso de edificio', value: '', type: 'select', options: ['Vivienda unifamiliar', 'Edificio de viviendas', 'Edificio de oficinas', 'Centro comercial', 'Industrial', 'Patrimonio histórico', 'Equipamiento público', 'Otro'] },
  { name: 'Zona climática', value: '', type: 'select', options: ['A', 'B', 'C', 'D', 'E'] },
  { name: 'Altura', value: '', type: 'input' },
  { name: 'Núm. plantas', value: '', type: 'input' },
  { name: 'Superficie del edificio', value: '', type: 'input' },
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
  resetTags, // Added resetTags prop
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [customTags, setCustomTags] = useState([]);
  const [displayedTags, setDisplayedTags] = useState([]);
  const [inputMode, setInputMode] = useState('manual');
  const [newTag, setNewTag] = useState({ name: '', value: '' });
  const [automaticText, setAutomaticText] = useState('');
  const [localProjectName, setLocalProjectName] = useState(projectName);

  useEffect(() => {
    setLocalProjectName(projectName);
  }, [projectName]);

  // useEffect to handle resetTags and reset tags
  useEffect(() => {
    if (resetTags) {
      setCustomTags(initialMandatoryTags.map(tag => ({ ...tag, value: '' })));
      setDisplayedTags([]);
    }
  }, [resetTags]);


  useEffect(() => {
    if (info) {
      // Mapear nombres de etiquetas obligatorias
      const defaultTagNames = initialMandatoryTags.map(tag => tag.name);

      // Actualizar etiquetas obligatorias con valores de 'info' o mantenerlas vacías si no hay valores
      const updatedMandatoryTags = initialMandatoryTags.map(tag => {
        const foundTag = info.find(t => t.name === tag.name);
        return {
          ...tag,
          value: foundTag ? foundTag.value : '',
        };
      });

      // Obtener etiquetas personalizadas de 'info'
      const newCustomTags = info.filter(tag => !defaultTagNames.includes(tag.name));

      // Actualizar estado de 'customTags' combinando etiquetas obligatorias y personalizadas
      setCustomTags([...updatedMandatoryTags, ...newCustomTags]);
    }
  }, [info]);

  // Manejo de animaciones y aparición incremental de etiquetas
  useEffect(() => {
    let isCancelled = false;

    if (customTags.length > 0) {
      const existingTagNames = displayedTags.map(tag => tag.name);

      // Identificar nuevas etiquetas que no están en 'displayedTags'
      const newTags = customTags.filter(tag => !existingTagNames.includes(tag.name));

      // Función para agregar etiquetas una por una con retraso
      const addTagsIncrementally = async () => {
        for (let i = 0; i < newTags.length; i++) {
          if (isCancelled) break;
          await new Promise(resolve => setTimeout(resolve, 500)); // Esperar medio segundo
          if (isCancelled) break;
          setDisplayedTags(prevTags => [newTags[i], ...prevTags]);
        }
      };

      addTagsIncrementally();

      // Actualizar valores de etiquetas existentes sin re-renderizar
      const updatedExistingTags = displayedTags.map(tag => {
        const updatedTag = customTags.find(t => t.name === tag.name);
        return updatedTag ? { ...tag, value: updatedTag.value } : tag;
      });

      setDisplayedTags(prevTags => {
        // Evitar duplicados y mantener el orden
        const uniqueTags = [...updatedExistingTags];
        return uniqueTags;
      });
    }

    return () => {
      isCancelled = true;
    };
  }, [customTags]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleAddTag = () => {
    if (newTag.name.trim() && newTag.value.trim()) {
      const isMandatoryTag = initialMandatoryTags.some(tag => tag.name === newTag.name);
      const isExistingTag = customTags.some(tag => tag.name === newTag.name);

      if (isMandatoryTag) {
        alert('No puedes añadir una etiqueta que ya es obligatoria.');
        return;
      }

      if (isExistingTag) {
        alert('Ya existe una etiqueta con este nombre.');
        return;
      }

      const updatedTags = [...customTags, { ...newTag, type: 'input' }];
      setCustomTags(updatedTags);
      setNewTag({ name: '', value: '' });
      onUpdateInfo(updatedTags);
      setIsProjectInfoUpdated(true);
    }
  };

  const handleCustomTagChange = (field, value) => {
    setNewTag({ ...newTag, [field]: value });
  };

  const handleTagEdit = (index, field, value) => {
    const updatedTags = [...customTags];
    updatedTags[index][field] = value;

    setCustomTags(updatedTags);

    // Actualizar 'info' para reflejar los cambios
    onUpdateInfo(updatedTags);
    setIsProjectInfoUpdated(true);
  };

  const handleDeleteTag = (tagName) => {
    const tagToDelete = customTags.find(tag => tag.name === tagName);

    if (initialMandatoryTags.some(tag => tag.name === tagToDelete.name)) {
      // No permitir eliminar etiquetas obligatorias
      alert('No puedes eliminar una etiqueta obligatoria.');
      return;
    }

    const updatedTags = customTags.filter(tag => tag.name !== tagName);
    setCustomTags(updatedTags);
    onUpdateInfo(updatedTags);
    setIsProjectInfoUpdated(true);
    onManualEdit();

    // También actualizar 'displayedTags'
    setDisplayedTags(prevTags => prevTags.filter(tag => tag.name !== tagName));
  };

  const handleModeSwitch = (mode) => {
    setInputMode(mode);
  };

  const handleSave = () => {
    const mandatoryTagsWithValues = initialMandatoryTags.map(tag => ({
      name: tag.name,
      value: customTags.find(t => t.name === tag.name)?.value || '',
      type: tag.type,
      options: tag.options || [],
    }));

    const customTagsOnly = customTags.filter(
      tag => !initialMandatoryTags.some(mTag => mTag.name === tag.name) && tag.value.trim() !== ''
    );

    const projectData = [...mandatoryTagsWithValues, ...customTagsOnly];

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
    <div className="bg-[#001F54] p-4 rounded-lg shadow-lg border border-white relative">
      {/* Encabezado */}
      <div className="flex justify-center items-center mb-2">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          Información del proyecto:
        </h2>
        <h2 className="text-lg font-semibold text-white flex items-center gap-2 ml-4">
          {localProjectName}
          <button onClick={handleProjectNameEdit} className="text-gray-200 hover:text-gray-400">
            <FaEdit />
          </button>
        </h2>
        <button
          onClick={toggleOpen}
          className="ml-4 text-gray-200 hover:text-gray-400"
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

                {/* Campos de Entrada con altura fija */}
                <div className="flex flex-col items-center gap-2 mt-2" style={{ minHeight: '140px' }}>
                  {inputMode === 'manual' && (
                    <>
                      <input
                        type="text"
                        placeholder="Nombre de la etiqueta"
                        className="w-full p-1 border border-gray-300 rounded-lg bg-[#F4EDE4]"
                        value={newTag.name}
                        onChange={(e) => handleCustomTagChange('name', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Valor de la etiqueta"
                        className="w-full p-1 border border-gray-300 rounded-lg bg-[#F4EDE4]"
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
                        className="w-full p-1 border border-gray-300 rounded-lg bg-[#F4EDE4]"
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
              <div className="overflow-y-auto max-h-[160px] grid grid-cols-3 gap-2 w-2/3 custom-scrollbar ml-2 mb-4">
                {displayedTags.map((tag) => {
                  const [isPresent] = usePresence();

                  return (
                    <motion.div
                      key={tag.name}
                      initial={isPresent ? { opacity: 0, x: -50 } : false}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.6 }}
                      className="relative flex flex-col p-2 border border-gray-300 rounded-lg bg-[#003366] text-white shadow-md"
                      style={{ fontSize: '0.75rem' }}
                    >
                      {!initialMandatoryTags.some(mTag => mTag.name === tag.name) && (
                        <button
                          onClick={() => handleDeleteTag(tag.name)}
                          className="absolute top-1 right-1 text-red-200 hover:text-red-400"
                        >
                          <FaTimes />
                        </button>
                      )}
                      <label className="block mb-1 text-xs font-semibold">{tag.name}</label>
                      {tag.type === 'select' ? (
                        <select
                          value={tag.value}
                          onChange={(e) =>
                            handleTagEdit(
                              customTags.findIndex(t => t.name === tag.name),
                              'value',
                              e.target.value
                            )
                          }
                          className="p-1 mt-1 border border-gray-300 rounded-md text-xs bg-white text-black"
                        >
                          <option value="">Selecciona una opción</option>
                          {tag.options.map((option, idx) => (
                            <option key={idx} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={tag.value}
                          onChange={(e) =>
                            handleTagEdit(
                              customTags.findIndex(t => t.name === tag.name),
                              'value',
                              e.target.value
                            )
                          }
                          className="p-1 mt-1 border border-gray-300 rounded-md text-xs bg-white text-black"
                        />
                      )}
                    </motion.div>
                  );
                })}
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
