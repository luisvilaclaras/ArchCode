import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectSelector({ projects = [], onSelect, onNewProject, selectedProject }) {
  const handleProjectClick = (projectId) => {
    onSelect(projectId);
  };

  const handleNewProjectClick = () => {
    onNewProject();
  };

  return (
    <div className="p-4 bg-[#f3f4f6] h-full border-r-2 border-white">
      {/* Botón para crear un nuevo proyecto */}
      <button 
        onClick={handleNewProjectClick} 
        className="mb-4 w-full py-2 px-6 bg-[#344e6f] text-white rounded-md hover:opacity-90 transition-opacity duration-300 text-sm font-medium whitespace-nowrap">
        + Nuevo Proyecto
      </button>




      {/* Listado de proyectos */}
      <div className="space-y-2">
        <AnimatePresence>
          {projects.map((project) => {
            const { projectId, name } = project;
            const isSelected = selectedProject && selectedProject.projectId === projectId;

            return (
              <motion.button 
                key={projectId} 
                onClick={() => handleProjectClick(projectId)} 
                className={`w-full py-2 px-6 text-left rounded-full border border-gray-400 
                  ${isSelected ? 'bg-[#344e6f] text-white' : 'bg-[#FDF9F4] text-black'} 
                  hover:bg-blue-500 hover:text-white transition-all duration-300 text-xs`}
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  height: '40px', // Fijamos una altura uniforme para todos los botones
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {name}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
