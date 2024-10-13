import React, { useState, useEffect } from 'react';

export default function ProjectSelector({ projects = [], onSelect, onNewProject, selectedProject }) {
  const [localSelectedProject, setLocalSelectedProject] = useState(selectedProject);

  useEffect(() => {
    setLocalSelectedProject(selectedProject);
  }, [selectedProject]);

  const handleProjectClick = (projectId) => {
    setLocalSelectedProject(projectId);
    onSelect(projectId);
  };

  const handleNewProjectClick = () => {
    setLocalSelectedProject(null);
    onNewProject();
  };

  return (
    <div className="p-4 bg-[#0B1A2A] h-full border-r-2 border-white">
      {/* Botón para crear un nuevo proyecto con el mismo estilo que "Crear Etiqueta" */}
      <button 
        onClick={handleNewProjectClick} 
        className="mb-4 w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full hover:opacity-90 transition-opacity duration-300 text-xs font-medium">
        + Nuevo Proyecto
      </button>

      {/* Listado de proyectos */}
      <div className="space-y-2">
        {Array.isArray(projects) && projects.map((projectName) => {
          if (typeof projectName === 'string') {
            const displayName = projectName.split('-')[0];
            return (
              <button 
                key={projectName} 
                onClick={() => handleProjectClick(projectName)} 
                className={`w-full py-2 px-6 text-left rounded-full border border-gray-400 
                  ${localSelectedProject === projectName ? 'bg-gradient-to-r from-blue-700 to-blue-900' : 'bg-[#132F4C]'} 
                  text-white hover:bg-blue-500 transition-all duration-300 text-xs`}>
                {displayName}
              </button>
            );
          } else {
            console.warn('El nombre del proyecto no es una cadena:', projectName);
            return null;
          }
        })}
      </div>
    </div>
  );
}
