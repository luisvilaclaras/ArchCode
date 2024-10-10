import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export const initialMandatoryTags = [
  { name: 'Tipo de edificio', value: '', type: 'select', options: ['Vivienda unifamiliar', 'Edificio de viviendas', 'Edificio de oficinas', 'Centro comercial', 'Industrial', 'Patrimonio histórico', 'Equipamiento público', 'Otro'] },
  { name: 'Comunidad Autónoma', value: '', type: 'input' },
  { name: 'Zona climática', value: '', type: 'select', options: ['A', 'B', 'C', 'D', 'E'] },
  { name: 'Altura/núm plantas', value: '', type: 'input' },
  { name: 'Superficie del edificio', value: '', type: 'input' },
];

export default function ProjectInfo({ info, onUpdateInfo, onManualEdit, onSave, setIsProjectInfoUpdated }) {
  const [isOpen, setIsOpen] = useState(true);
  const [customTags, setCustomTags] = useState(initialMandatoryTags);
  const [inputMode, setInputMode] = useState('manual');
  const [newTag, setNewTag] = useState({ name: '', value: '' });

  useEffect(() => {
    const updatedMandatoryTags = initialMandatoryTags.map(tag => ({
      ...tag,
      value: info.find(t => t.name === tag.name)?.value || tag.value,
    }));
    const customTagsOnly = info ? info.filter(tag => !initialMandatoryTags.some(mandatoryTag => mandatoryTag.name === tag.name)) : [];
    setCustomTags([...updatedMandatoryTags, ...customTagsOnly]);
  }, [info]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleAddTag = () => {
    if (newTag.name.trim() && newTag.value.trim()) {
      const isMandatoryTag = initialMandatoryTags.some(tag => tag.name === newTag.name);
      if (isMandatoryTag) {
        alert('No puedes añadir una etiqueta que ya es obligatoria.');
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
    if (updatedTags[index].type === 'select') {
      updatedTags[index].value = value;
    } else {
      updatedTags[index][field] = value;
    }

    setCustomTags(updatedTags);

    const mandatoryTags = updatedTags.slice(0, initialMandatoryTags.length);
    const customTagsOnly = updatedTags.slice(initialMandatoryTags.length).filter(tag => tag.value.trim() !== '');
    onUpdateInfo([...mandatoryTags, ...customTagsOnly]);
    setIsProjectInfoUpdated(true);
  };

  const handleDeleteTag = (index) => {
    if (index >= initialMandatoryTags.length) {
      const updatedTags = customTags.filter((_, i) => i !== index);
      setCustomTags(updatedTags);
      onUpdateInfo(updatedTags);
      setIsProjectInfoUpdated(true);
      onManualEdit();
    }
  };

  const handleModeSwitch = (mode) => {
    setInputMode(mode);
  };

  const handleSave = () => {
    const mandatoryTagsWithValues = initialMandatoryTags.map(tag => ({
      name: tag.name,
      value: customTags.find(t => t.name === tag.name)?.value || '',
      type: tag.type
    }));

    const customTagsOnly = customTags.filter((tag, index) => index >= initialMandatoryTags.length && tag.value.trim() !== '');
    const projectData = [...mandatoryTagsWithValues, ...customTagsOnly];

    onSave(projectData);
  };

  // Variables que deben ser definidas antes del return

  // Número total de etiquetas con valor
  const totalTags = customTags.filter((tag) => tag.value).length;

  // Limitamos las etiquetas mostradas a 6
  const displayedTags = customTags.filter((tag) => tag.value).slice(0, 4);

  return (
    <div className="bg-[#001F54] p-4 rounded-lg shadow-lg border-b-2 border-white">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-white">Información del Proyecto</h2>
          {!isOpen && (
            <>
              <span className="mx-2 h-6 border-r border-white"></span>
              <div
                className={`text-gray-200 flex flex-wrap ${
                  displayedTags.length <= 2
                    ? 'text-sm'
                    : displayedTags.length <= 4
                    ? 'text-xs'
                    : 'text-[10px]'
                }`}
              >
                {displayedTags.map((tag, index) => (
                  <span key={tag.name} className="mr-1">
                    <strong>{tag.name}:</strong> {tag.value}
                    {index < displayedTags.length - 1 && ' / '}
                  </span>
                ))}
                {totalTags > 6 && <span> ...</span>}
              </div>
            </>
          )}
        </div>
        <button
          onClick={toggleOpen}
          className="text-gray-200 hover:text-gray-400"
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
            <div className="flex mt-4 gap-8">
              {/* Columna Izquierda */}
              <div className="flex flex-col w-1/3 pr-4 border-r border-gray-300">
                {/* Botones de Modo */}
                <div className="flex flex-col mb-4 gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleModeSwitch('automatic')}
                      className={`flex-1 px-4 py-2 rounded ${
                        inputMode === 'automatic'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      } hover:bg-blue-700`}
                    >
                      Automático
                    </button>
                    <button
                      onClick={() => handleModeSwitch('manual')}
                      className={`flex-1 px-4 py-2 rounded ${
                        inputMode === 'manual'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      } hover:bg-blue-700`}
                    >
                      Manual
                    </button>
                  </div>

                  {/* Campos de Entrada */}
                  {inputMode === 'manual' && (
                    <div className="flex flex-col items-center gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Nombre de la etiqueta"
                        className="w-full p-2 border border-gray-300 rounded-lg bg-[#F4EDE4]"
                        value={newTag.name}
                        onChange={(e) => handleCustomTagChange('name', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Valor de la etiqueta"
                        className="w-full p-2 border border-gray-300 rounded-lg bg-[#F4EDE4]"
                        value={newTag.value}
                        onChange={(e) => handleCustomTagChange('value', e.target.value)}
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={handleAddTag}
                          className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full shadow hover:bg-blue-700 transition-colors duration-300"
                        >
                          <FaPlus />
                        </button>
                        <button
                          className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-700 transition-colors duration-300"
                          onClick={handleSave}
                        >
                          Guardar Proyecto
                        </button>
                      </div>
                    </div>
                  )}

                  {inputMode === 'automatic' && (
                    <div className="flex flex-col items-center gap-2 mt-2">
                      <textarea
                        placeholder="Crea nuevas etiquetas a partir de texto"
                        className="w-full p-2 border border-gray-300 rounded-lg h-[108px] bg-[#F4EDE4]"
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full shadow hover:bg-blue-700 transition-colors duration-300"
                        >
                          <FaPlus />
                        </button>
                        <button
                          className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-700 transition-colors duration-300"
                          onClick={handleSave}
                        >
                          Guardar Proyecto
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Columna Derecha */}
              <div className="grid grid-cols-3 gap-4 w-2/3">
                {customTags.map((tag, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="relative flex flex-col p-2 border border-gray-300 rounded-lg bg-[#F4EDE4]"
                  >
                    {index >= initialMandatoryTags.length && (
                      <button
                        onClick={() => handleDeleteTag(index)}
                        className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    )}
                    <label className="block mb-1 text-sm font-medium">{tag.name}</label>
                    {tag.type === 'select' ? (
                      <select
                        value={tag.value}
                        onChange={(e) => handleTagEdit(index, 'value', e.target.value)}
                        className="p-1 border border-gray-300 rounded-lg text-sm bg-[#F4EDE4]"
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
                        onChange={(e) => handleTagEdit(index, 'value', e.target.value)}
                        className="p-1 border border-gray-300 rounded-lg text-sm bg-[#F4EDE4]"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
