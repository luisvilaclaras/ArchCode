import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash } from 'react-icons/fa';

export default function ProjectSelector({
  projects = [],
  onSelect,
  onNewProject,
  selectedProject,
  onDeleteProject,
  isWaitingForResponse, // Nuevo prop
}) {
  const handleProjectClick = (projectId) => {
    if (!isWaitingForResponse) {
      onSelect(projectId);
    }
  };

  const handleNewProjectClick = () => {
    if (!isWaitingForResponse) {
      onNewProject();
    }
  };

  return (
    <div className="relative p-4 bg-[#f3f4f6] h-full border-r-2 border-white">
      {/* Botón para crear un nuevo proyecto */}
      <button
        onClick={handleNewProjectClick}
        disabled={isWaitingForResponse}
        className={`mb-4 w-full py-2 px-6 bg-[#344e6f] text-white rounded-md hover:opacity-90 transition-opacity duration-300 text-sm font-medium whitespace-nowrap ${
          isWaitingForResponse ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        + Nuevo Proyecto
      </button>

      {/* Listado de proyectos */}
      <div className="space-y-2">
        <AnimatePresence>
          {projects.map((project) => {
            const { projectId, name } = project;
            const isSelected =
              selectedProject && selectedProject.projectId === projectId;

            return (
              <motion.div
                key={projectId}
                className={`flex items-center w-full py-2 px-6 rounded-md border border-gray-400 
                  ${
                    isSelected
                      ? 'bg-[#344e6f] text-white'
                      : 'bg-[#FFFFFF] text-black'
                  } 
                  hover:opacity-90 transition-opacity duration-300 text-sm font-medium whitespace-nowrap cursor-pointer ${
                    isWaitingForResponse ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                onClick={() => handleProjectClick(projectId)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Nombre del proyecto */}
                <span className="flex-grow text-left">{name}</span>

                {/* Icono de papelera con funcionalidad de borrado */}
                <FaTrash
                  className={`ml-2 transition-colors duration-200 ${
                    isSelected ? 'text-white' : 'text-[#344e6f]'
                  } ${isWaitingForResponse ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:text-red-600'}`}
                  size={12}
                  onClick={(e) => {
                    e.stopPropagation(); // Evita que el clic se propague al seleccionar el proyecto
                    if (!isWaitingForResponse) {
                      onDeleteProject(projectId);
                    }
                  }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Overlay cuando isWaitingForResponse es true */}
      {isWaitingForResponse && (
        <div className="absolute inset-0 bg-white bg-opacity-50 cursor-not-allowed"></div>
      )}
    </div>
  );
}
