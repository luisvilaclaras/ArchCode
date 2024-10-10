import React, { useState, useEffect } from 'react';

export default function ProjectSelector({ projects, onSelect, onNewProject, selectedProject }) {
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
    <div className="flex flex-col flex-grow p-2">
      <button 
        onClick={handleNewProjectClick} 
        className="w-full bg-[#001F54] text-white py-2 rounded-lg font-semibold text-xs hover:bg-yellow-600 transition-colors duration-300 mb-4"
      >
        + Nuevo Proyecto
      </button>
      <div className="flex-1 flex flex-col space-y-2 overflow-auto">
        {projects && projects.length > 0 ? (
          projects.map((project, index) => (
            <div 
              key={index} 
              onClick={() => handleProjectClick(project)} 
              className={`py-2 px-3 rounded-lg text-xs text-center cursor-pointer transition-colors duration-200 
                          ${localSelectedProject === project ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {project}
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-xs">No hay proyectos disponibles</div>
        )}
      </div>
    </div>
  );
}
