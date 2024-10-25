import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { FaChevronDown, FaChevronUp, FaEdit } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import TagItem from './TagItem';
import AlertModal from '@/components/Modals/AlertModal';

const MAX_CHARACTERS = 500;

export const initialMandatoryTags = [
  {
    id: 'uso-de-edificio',
    name: 'Uso de edificio',
    value: '',
    type: 'input',
  },
  {
    id: 'zona-climatica',
    name: 'Zona climática',
    value: '',
    type: 'input',
  },
  {
    id: 'altura',
    name: 'Altura',
    value: '',
    type: 'input',
  },
  {
    id: 'num-plantas',
    name: 'Núm. plantas',
    value: '',
    type: 'input',
  },
  {
    id: 'superficie-del-edificio',
    name: 'Superficie del edificio',
    value: '',
    type: 'input',
  },
];

const ProjectInfo = forwardRef(function ProjectInfo(
  {
    isOpen,
    setIsOpen,
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
    isProjectSaved,
  },
  ref
) {
  const projectInfoRef = ref || useRef(null);
  const tagsContainerRef = useRef(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [mandatoryTags, setMandatoryTags] = useState(
    initialMandatoryTags.map(tag => ({ ...tag }))
  );
  const [customTags, setCustomTags] = useState([]);
  const [displayedTags, setDisplayedTags] = useState([]);
  const [inputMode, setInputMode] = useState('automatic');
  const [newTag, setNewTag] = useState({ name: '', value: '' });
  const [automaticText, setAutomaticText] = useState('');
  const [localProjectName, setLocalProjectName] = useState(projectName);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    setCharacterCount(automaticText.length);
  }, [automaticText]);

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
      setAutomaticText('');
    }
  }, [resetTags]);

  useEffect(() => {
    setCustomTags([]);
    setDisplayedTags([]);

    if (info && info.length > 0) {
      const defaultTagNames = initialMandatoryTags.map(tag => tag.name);

      const updatedMandatoryTags = initialMandatoryTags.map(tag => {
        const foundTag = info.find(t => t.name === tag.name);
        if (foundTag) {
          return {
            ...tag,
            value: foundTag.value,
            id: foundTag.id || tag.id,
          };
        } else {
          return {
            ...tag,
            value: '',
            id: tag.id,
          };
        }
      });

      const newCustomTags = info
        .filter(tag => !defaultTagNames.includes(tag.name))
        .map(tag => ({
          ...tag,
          id: tag.id || uuidv4(),
        }));

      setMandatoryTags(updatedMandatoryTags);
      setCustomTags(newCustomTags);
    } else {
      setMandatoryTags(
        initialMandatoryTags.map(tag => ({ ...tag, value: '' }))
      );
      setCustomTags([]);
    }
  }, [info]);

  useEffect(() => {
    setDisplayedTags([...mandatoryTags, ...customTags]);
  }, [mandatoryTags, customTags]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARACTERS) {
      setAutomaticText(text);
    }
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

      setTimeout(() => {
        if (tagsContainerRef.current) {
          tagsContainerRef.current.scrollTo({
            top: tagsContainerRef.current.scrollHeight,
            behavior: 'smooth',
          });
        }
      }, 100);
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

    const isProjectEmpty = projectData.every(
      tag => !tag.value || tag.value.trim() === ''
    );

    if (isProjectEmpty) {
      setAlertMessage(
        'No se puede guardar un proyecto vacío. Por favor, añade información al proyecto o realiza alguna pregunta, antes de guardarlo.'
      );
      setShowAlertModal(true);
    } else {
      onSave(projectData, localProjectName);
    }
  };

  const handleProjectNameClick = (e) => {
    e.stopPropagation();
    if (!isProjectSaved) {
      setAlertMessage('Guarda primero el proyecto para poder cambiarle el nombre. Para poder guardarlo, el proyecto no puede estar vacío.');
      setShowAlertModal(true);
    } else {
      setIsEditingName(true);
    }
  };

  const handleNameBlur = () => {
    setIsEditingName(false);
    const trimmedName = localProjectName.trim();

    if (trimmedName !== '') {
      onProjectNameChange(trimmedName);
    } else {
      setLocalProjectName(projectName);
    }
  };

  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNameBlur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setLocalProjectName(projectName);
      setIsEditingName(false);
    }
  };

  return (
    <div
      ref={projectInfoRef}
      className="bg-[#f3f4f6] p-4 rounded-lg shadow-lg border border-gray-300 relative overflow-x-hidden"
    >
      {/* Encabezado */}
      <div
        className="flex justify-center items-center mb-2 cursor-pointer"
        onClick={toggleOpen}
      >
        <h2 className="text-lg font-semibold text-[#333333] flex items-center gap-2">
          Información del proyecto:
        </h2>
        <div className="flex items-center gap-2 ml-2">
          {isEditingName ? (
            <input
              type="text"
              value={localProjectName}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue.length <= 14) {
                  setLocalProjectName(newValue);
                }
              }}
              onBlur={handleNameBlur}
              onKeyDown={handleNameKeyDown}
              className="text-lg font-semibold text-[#333333] border-b border-gray-400 focus:outline-none"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <h2
              className="text-lg font-semibold text-black cursor-pointer"
              onClick={handleProjectNameClick}
            >
              {localProjectName}
            </h2>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleProjectNameClick(e);
            }}
            className="text-gray-600 hover:text-gray-800"
          >
            <FaEdit />
          </button>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleOpen();
          }}
          className="ml-2 text-gray-600 hover:text-gray-800"
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
              <div className="flex flex-col w-1/3 pr-4 border-r border-gray-300">
                <div className="flex mb-4 gap-0">
                  <button
                    onClick={() => handleModeSwitch('automatic')}
                    className={`flex-1 px-6 py-3 rounded-l-lg ${
                      inputMode === 'automatic'
                        ? 'bg-[#344e6f] text-white'
                        : 'bg-gray-200 text-gray-700 border border-gray-400'
                    } hover:bg-blue-800 transition-all duration-300 text-sm`}
                  >
                    Automático
                  </button>
                  <button
                    onClick={() => handleModeSwitch('manual')}
                    className={`flex-1 px-6 py-3 rounded-r-lg ${
                      inputMode === 'manual'
                        ? 'bg-[#344e6f] text-white'
                        : 'bg-gray-200 text-gray-700 border border-gray-400'
                    } hover:bg-blue-800 transition-all duration-300 text-sm`}
                  >
                    Manual
                  </button>
                </div>

                <div
                  className="flex flex-col items-center gap-2 mt-2"
                  style={{ minHeight: '140px' }}
                >
                  {inputMode === 'manual' && (
                    <>
                      <input
                        type="text"
                        placeholder="Nombre de la etiqueta"
                        className="w-full p-1 border border-gray-300 rounded-lg bg-gray-50"
                        value={newTag.name}
                        onChange={(e) =>
                          handleCustomTagChange('name', e.target.value)
                        }
                      />
                      <input
                        type="text"
                        placeholder="Valor de la etiqueta"
                        className="w-full p-1 border border-gray-300 rounded-lg bg-gray-50"
                        value={newTag.value}
                        onChange={(e) =>
                          handleCustomTagChange('value', e.target.value)
                        }
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
                        className="w-full p-1 border border-gray-300 rounded-lg bg-gray-50 relative"
                        style={{ height: '100px' }}
                        value={automaticText}
                        onChange={handleTextChange}
                      />
                      <div className="text-sm text-gray-500 text-right">
                        {characterCount}/{MAX_CHARACTERS} caracteres
                      </div>
                      <button
                        onClick={() =>
                          onGenerateAutomaticTags(automaticText)
                        }
                        className="button-common-style mt-2"
                        disabled={isGenerating}
                      >
                        {isGenerating ? 'Cargando...' : 'Generar Etiquetas'}
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div
                ref={tagsContainerRef}
                className="overflow-y-auto max-h-[160px] grid grid-cols-4 gap-2 w-2/3 custom-scrollbar ml-2 mb-4"
              >
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

      {showAlertModal && (
        <AlertModal
          message={alertMessage}
          onClose={() => setShowAlertModal(false)}
        />
      )}

      <style jsx>{`
        .button-common-style {
          width: 140px;
          height: 40px;
          font-size: 0.9rem;
          padding: 0.5rem;
          background-color: #344e6f;
          color: white;
          border-radius: 12px;
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
          background-color: #1A3D7C;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #123456;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background-color: #f0f0f0;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
});

export default ProjectInfo;
