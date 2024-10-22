import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

function TagItem({ tag, initialMandatoryTags, handleDeleteTag, handleTagEdit }) {
  return (
    <motion.div
      key={tag.id} // Utilizar id único
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.6 }}
      className="relative flex flex-col p-2 border border-gray-300 rounded-lg bg-gray-200 text-black shadow-md"
      style={{ fontSize: '0.75rem' }}
    >
      {!initialMandatoryTags.some(mTag => mTag.name === tag.name) && (
        <button
          onClick={() => handleDeleteTag(tag.name)}
          className="absolute top-1 right-1 text-red-200 hover:text-red-800"
        >
          <FaTimes />
        </button>
      )}
      <label className="block mb-1 text-xs font-normal">{tag.name}</label>
      {tag.type === 'select' ? (
        <select
          value={tag.value}
          onChange={(e) => handleTagEdit(tag.name, 'value', e.target.value)}
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
          onChange={(e) => handleTagEdit(tag.name, 'value', e.target.value)}
          className="p-1 mt-1 border border-gray-300 rounded-md text-xs bg-white text-black"
        />
      )}
    </motion.div>
  );
}

export default TagItem;
