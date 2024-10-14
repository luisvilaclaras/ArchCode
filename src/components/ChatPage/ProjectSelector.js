import React from 'react';

export default function ProjectSelector({ projects = [], onSelect, onNewProject, selectedProject }) {
  const handleProjectClick = (projectId) => {
    onSelect(projectId);
  };

  const handleNewProjectClick = () => {
    onNewProject();
  };

  return (
    <div className="p-4 bg-[#0B1A2A] h-full border-r-2 border-white">
      {/* Botón para crear un nuevo proyecto */}
      <button 
        onClick={handleNewProjectClick} 
        className="mb-4 w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full hover:opacity-90 transition-opacity duration-300 text-xs font-medium">
        + Nuevo Proyecto
      </button>

      {/* Listado de proyectos */}
      <div className="space-y-2">
        {Array.isArray(projects) && projects.map((project) => {
          const { projectId, name } = project;
          return (
            <button 
              key={projectId} 
              onClick={() => handleProjectClick(projectId)} 
              className={`w-full py-2 px-6 text-left rounded-full border border-gray-400 
                ${selectedProject && selectedProject.projectId === projectId ? 'bg-gradient-to-r from-blue-700 to-blue-900' : 'bg-[#132F4C]'} 
                text-white hover:bg-blue-500 transition-all duration-300 text-xs`}>
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
