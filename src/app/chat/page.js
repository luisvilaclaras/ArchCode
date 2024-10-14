"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { auth, db } from '../../../firebase-credentials';
import { doc, setDoc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import ProjectSelector from '@/components/ChatPage/ProjectSelector';
import DocumentSelector from '@/components/ChatPage/DocumentSelector';
import ProjectInfo, { initialMandatoryTags } from '@/components/ChatPage/ProjectInfo';
import Chat from '@/components/ChatPage/Chat';
import UserMenu from '@/components/ChatPage/UserMenu';
import { v4 as uuidv4 } from 'uuid'; 
import ConfirmationModal from '@/components/Modals/ConfirmationModal';


export default function HomePage() {
  const [userData, setUserData] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState([]); // Cambiado a array
  const [availablePDFs, setAvailablePDFs] = useState({});
  const [selectedRegion, setSelectedRegion] = useState('Nacionales');
  const [projectInfo, setProjectInfo] = useState(initialMandatoryTags);
  const [localProjectData, setLocalProjectData] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectInfoUpdated, setIsProjectInfoUpdated] = useState(false);
  const [isCreatingNewProject, setIsCreatingNewProject] = useState(false);
  const [pendingProjectInfo, setPendingProjectInfo] = useState([]);
  const [threadId, setThreadId] = useState(null); // Nuevo estado para el ID del thread
  const [isGeneratingTags, setIsGeneratingTags] = useState(false); // Nuevo estado para la generación de etiquetas
  const [showConfirmation, setShowConfirmation] = useState(false);  // Nuevo estado para mostrar el modal
  const [resetTagsTrigger, setResetTagsTrigger] = useState(false);
  const [pendingProjectId, setPendingProjectId] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);


  const router = useRouter(); 

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      } else {
        router.push("/login");
      }
    };

    fetchUserData();
  }, [router]);

  useEffect(() => {
    const fetchPDFs = async () => {
      try {
        const docRef = doc(db, "AvailablePDF", "Spain");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAvailablePDFs(docSnap.data().pdfArray);
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching PDFs: ", error);
      }
    };

    fetchPDFs();
  }, []);

  // Función para manejar la llamada a la función de Firebase y recuperar la respuesta
  const handleUserQuery = async (question) => {
    if (selectedDocuments.length === 0) {
        console.error("No se han seleccionado documentos.");
        return;
    }

    if (!selectedProject) {
        console.error("Proyecto no seleccionado.");
        return;
    }

    // Verificación de variables antes de construir el body
    console.log('selectedDocuments:', selectedDocuments);
    console.log('projectInfo:', projectInfo);
    console.log('threadId:', threadId);
    console.log('selectedProject:', selectedProject);

    // Construir el cuerpo de la solicitud con las claves correctas
    const body = {
        pregunta: question,
        etiquetas: projectInfo.map(tag => ({ clave: tag.name, contenido: tag.value })),
        nombreDocumentos: selectedDocuments, // Ahora es un array de documentos
        threadId: threadId,
        projectId: selectedProject // Añadir el projectId aquí
    };

    console.log('Cuerpo de la solicitud (pre-JSON.stringify):', body);

    try {
        const response = await fetch('http://localhost:5001/arquitest-8ecf6/us-central1/handleUserQuery', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body) // Convertir el cuerpo a JSON
        });

        if (!response.ok) {
            throw new Error('Error al obtener la respuesta del servidor.');
        }

        const data = await response.json();
        // Actualizar el threadId si es un nuevo hilo creado
        if (data.threadId && !threadId) {
            setThreadId(data.threadId);
        }
        return data.respuesta;

    } catch (error) {
        console.error('Error al enviar la consulta:', error);
        return 'Error al obtener la respuesta.';
    }
  };

  const handleProjectSelect = async (projectId) => {
    setIsProjectInfoUpdated(false);
    setIsCreatingNewProject(false);
    setPendingProjectInfo([]);
    setThreadId(null); // Reiniciar threadId al cambiar de proyecto
  
    if (!projectId) {
      setProjectInfo([]);
      return;
    }
  
    // Obtener el nombre del proyecto
    const project = userData.projects.find(proj => proj.projectId === projectId);
    const projectName = project ? project.name : 'Sin nombre';
  
    // Establecer el proyecto seleccionado
    setSelectedProject({ projectId, name: projectName });
  
    // Si los datos del proyecto ya están en memoria local, se usan esos datos
    if (localProjectData[projectId]) {
      const storedData = localProjectData[projectId];
      // Procesar storedData para setProjectInfo
      const updatedInfo = initialMandatoryTags.map(tag => ({
        ...tag,
        value: storedData.find(t => t.name === tag.name)?.value || tag.value,
      }));
      const customTagsOnly = storedData.filter(tag => !initialMandatoryTags.some(mt => mt.name === tag.name));
      setProjectInfo([...updatedInfo, ...customTagsOnly]);
    } else {
      // Si no, se cargan los datos desde Firestore
      try {
        const projectRef = doc(db, "Projects", projectId);
        const projectSnap = await getDoc(projectRef);
        if (projectSnap.exists()) {
          const projectContent = projectSnap.data().content || [];
          const updatedInfo = initialMandatoryTags.map(tag => ({
            ...tag,
            value: projectContent.find(t => t.name === tag.name)?.value || tag.value,
          }));
          const customTagsOnly = projectContent.filter(tag => !initialMandatoryTags.some(mt => mt.name === tag.name));
          setProjectInfo([...updatedInfo, ...customTagsOnly]);
          setLocalProjectData(prevData => ({ ...prevData, [projectId]: projectContent }));
  
          // Establecer el threadId si existe en Firestore
          const existingThreadId = projectSnap.data().threadId;
          if (existingThreadId) {
            setThreadId(existingThreadId);
          } else {
            setThreadId(null);
          }
        } else {
          setProjectInfo([]);
        }
      } catch (error) {
        console.error("Error al obtener la información del proyecto: ", error);
        setProjectInfo([]);
      }
    }
  };
  

  const handleNewProject = () => {
    if (isProjectInfoUpdated) {
      // Si hay cambios no guardados, mostrar el modal de confirmación
      setShowConfirmation(true);
    } else {
      // Crear un nuevo proyecto sin necesidad de confirmar
      clearProjectInfo();
    }
  };

  const handleConfirmNewProject = (confirmed) => {
    if (confirmed) {
      clearProjectInfo();
    }
    setShowConfirmation(false); // Ocultar el modal después de la confirmación
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setSelectedDocuments([]); // Resetea los documentos seleccionados al cambiar la región
  };

  const handleDocumentSelect = (docs) => {
    setSelectedDocuments(docs);
  };

  const createNewProject = async (projectContent) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user logged in!");
        return null;
      }
  
      // Obtener el número de proyectos del usuario
      const projectCount = userData.projects ? userData.projects.length : 0;
      const projectDisplayName = `Proyecto ${projectCount + 1}`;
  
      // Generar un ID único para el proyecto
      const projectId = uuidv4();
  
      // Crear el documento del proyecto
      await setDoc(doc(db, 'Projects', projectId), {
        name: projectDisplayName,
        content: projectContent,
        userId: user.uid,
      });
  
      // Actualizar la lista de proyectos del usuario
      const updatedProjects = userData.projects ? [...userData.projects, { projectId, name: projectDisplayName }] : [{ projectId, name: projectDisplayName }];
      await updateDoc(doc(db, "Users", user.uid), {
        projects: updatedProjects,
      });
  
      setUserData(prevData => ({
        ...prevData,
        projects: updatedProjects,
      }));
  
      // Guardar los datos del proyecto en caché local
      setLocalProjectData(prevData => ({ ...prevData, [projectId]: projectContent }));
  
      return projectId;
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
      alert('Error al crear el proyecto.');
      return null;
    }
  };
  

  const clearProjectInfo = () => {
    setSelectedProject(null);
  
    // Establecer projectInfo como una lista vacía
    setProjectInfo([]);
  
    // Alternar el estado para indicar que se deben reiniciar las etiquetas en ProjectInfo
    setResetTagsTrigger(prev => !prev);
  
    setIsProjectInfoUpdated(false);
    setIsCreatingNewProject(true);
    setPendingProjectInfo([]);
    setLocalProjectData({});
    setThreadId(null); // Reiniciar threadId al crear nuevo proyecto
  };

  const handleSelectProject = (projectId) => {
    if (isProjectInfoUpdated) {
      // Si hay cambios no guardados, mostrar el modal de confirmación
      setPendingProjectId(projectId);
      setShowConfirmationModal(true);
    } else {
      // Si no hay cambios, cambiar de proyecto inmediatamente
      handleProjectSelect(projectId);
    }
  };

  const handleConfirmChangeProject = (confirm) => {
    setShowConfirmationModal(false);
    if (confirm) {
      // Si el usuario confirma, cambiar al proyecto pendiente
      handleProjectSelect(pendingProjectId);
      setIsProjectInfoUpdated(false); // Reiniciar el indicador de cambios no guardados
    }
    // Limpiar el proyecto pendiente
    setPendingProjectId(null);
  };
  
  
  
  
  

  const handleSaveProject = async (projectContent) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user logged in!");
        return;
      }
  
      if (selectedProject) {
        // Actualizar proyecto existente
        const projectRef = doc(db, "Projects", selectedProject.projectId);
        await updateDoc(projectRef, { content: projectContent });
  
        setLocalProjectData(prevData => ({ ...prevData, [selectedProject.projectId]: projectContent }));
        alert('Proyecto actualizado con éxito.');
      } else {
        // Crear nuevo proyecto
        const newProjectId = await createNewProject(projectContent);
        if (newProjectId) {
          alert('Proyecto creado con éxito.');
          // Establecer el proyecto recién creado como seleccionado
          const projectDisplayName = `Proyecto ${userData.projects.length + 1}`;
          setSelectedProject({ projectId: newProjectId, name: projectDisplayName });
        }
      }
  
      setIsProjectInfoUpdated(false);
  
    } catch (error) {
      console.error('Error al guardar el proyecto:', error);
      alert('Error al guardar el proyecto.');
    }
  };
  

  const handleUpdateProjectInfo = (newInfo) => {
    setProjectInfo(newInfo);
    setIsProjectInfoUpdated(true);
  };
  

  const handleProjectNameChange = async (newName) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user logged in!");
        return;
      }
  
      if (selectedProject) {
        const projectId = selectedProject.projectId;
  
        // Actualiza el nombre del proyecto en Firestore
        const projectRef = doc(db, "Projects", projectId);
        await updateDoc(projectRef, { name: newName });
  
        // Actualiza la lista de proyectos del usuario en Firestore
        const userRef = doc(db, "Users", user.uid);
        const updatedProjects = userData.projects.map(project =>
          project.projectId === projectId ? { ...project, name: newName } : project
        );
  
        await updateDoc(userRef, {
          projects: updatedProjects,
        });
  
        // Actualiza el estado local del nombre del proyecto
        setLocalProjectData(prevData => ({
          ...prevData,
          [projectId]: prevData[projectId],
        }));
        setSelectedProject({ projectId, name: newName });
        setUserData(prevData => ({
          ...prevData,
          projects: updatedProjects,
        }));
      }
    } catch (error) {
      console.error('Error al actualizar el nombre del proyecto:', error);
      alert('Hubo un error al actualizar el nombre del proyecto.');
    }
  };
  

  const handleManualEdit = () => {
    setIsProjectInfoUpdated(true);
  };

  const handleSendMessage = async (question) => {
    // Llamar a la función que interactúa con Firebase Functions
    const respuesta = await handleUserQuery(question);
    // Devuelve la respuesta para que el componente `Chat` la maneje
    return respuesta;
  };

  // Nueva función para manejar la generación automática de etiquetas
  const handleGenerateAutomaticTags = async (automaticText) => {
    if (!automaticText.trim()) {
      alert('Por favor, ingresa un texto descriptivo del proyecto.');
      return;
    }
  
    setIsGeneratingTags(true);
  
    // Combinar projectInfo con initialMandatoryTags para asegurarnos de que tenemos todas las etiquetas obligatorias
    const combinedProjectInfo = initialMandatoryTags.map(tag => {
      const existingTag = projectInfo.find(t => t.name === tag.name);
      return existingTag ? existingTag : tag;
    });
  
    // Añadir etiquetas personalizadas existentes
    const existingCustomTags = projectInfo.filter(
      tag => !initialMandatoryTags.some(mTag => mTag.name === tag.name)
    );
  
    combinedProjectInfo.push(...existingCustomTags);
  
    try {
      const response = await fetch(
        'http://localhost:5001/arquitest-8ecf6/us-central1/generateAdditionalTags',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            etiquetasActuales: combinedProjectInfo,
            textoProyecto: automaticText,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error('Error al generar etiquetas adicionales.');
      }
  
      const data = await response.json();
      const etiquetasAdicionales = data.etiquetasAdicionales;
  
      // Actualizar etiquetas obligatorias con los valores generados
      const updatedMandatoryTags = combinedProjectInfo.map(tag => {
        if (initialMandatoryTags.some(mTag => mTag.name === tag.name)) {
          const generatedTag = etiquetasAdicionales.find(
            gTag => gTag.name.toLowerCase() === tag.name.toLowerCase()
          );
          if (generatedTag && (!tag.value || tag.value.trim() === '')) {
            return { ...tag, value: generatedTag.value };
          }
        }
        return tag;
      });
  
      // Filtrar etiquetas personalizadas que ya existen y tienen valor
      const maintainedCustomTags = existingCustomTags.filter(
        tag => tag.value && tag.value.trim() !== ''
      );
      const existingTagIds = projectInfo.map(tag => tag.id);

      // Añadir nuevas etiquetas personalizadas generadas que no existen ya
      const newCustomTags = etiquetasAdicionales
        .filter(gTag => {
          const isDefaultTag = initialMandatoryTags.some(
            mTag => mTag.name === gTag.name
          );
          const isExistingTag = projectInfo.some(
            pTag => pTag.name === gTag.name
          );
          return !isDefaultTag && !isExistingTag;
        })
        .map(tag => ({
          ...tag,
          id: uuidv4(), // Asignar un id único
          type: 'input',
      }));
      // Actualizar maintainedCustomTags con ids si falta
      const updatedMaintainedCustomTags = maintainedCustomTags.map(tag => ({
        ...tag,
        id: tag.id || uuidv4(),
      }));
  
      // Fusionar todas las etiquetas personalizadas
      const updatedCustomTags = [...updatedMaintainedCustomTags, ...newCustomTags];
  
      // Fusionar todas las etiquetas (obligatorias y personalizadas)
      const updatedProjectInfo = [...updatedMandatoryTags, ...updatedCustomTags];
  
      setProjectInfo(updatedProjectInfo);
      setIsProjectInfoUpdated(true);
    } catch (error) {
      console.error('Error al generar etiquetas automáticas:', error);
      alert('Hubo un error al generar etiquetas automáticas.');
    } finally {
      setIsGeneratingTags(false);
    }
  };
  
  

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <div className="flex flex-col w-48 bg-[#F4EDE4]">
      <ProjectSelector 
        projects={userData?.projects || []} 
        onSelect={handleSelectProject} 
        onNewProject={handleNewProject} 
        selectedProject={selectedProject}
      />
      </div>
      <div className="flex flex-1 flex-col p-6 bg-[#001F54] overflow-y-auto">
        <div className="mb-4">
          <DocumentSelector 
            availablePDFs={availablePDFs} 
            selectedRegion={selectedRegion}
            onRegionSelect={handleRegionSelect}
            onSelect={handleDocumentSelect}
          />
        </div>
        <ProjectInfo 
          info={projectInfo} 
          onUpdateInfo={handleUpdateProjectInfo} 
          onManualEdit={handleManualEdit} 
          onSave={handleSaveProject}
          setIsProjectInfoUpdated={setIsProjectInfoUpdated} 
          onGenerateAutomaticTags={handleGenerateAutomaticTags}
          isGenerating={isGeneratingTags}
          projectName={selectedProject ? selectedProject.name : null} 
          onProjectNameChange={handleProjectNameChange} 
          resetTags={resetTagsTrigger}
        />
        <Chat 
          projectInfo={projectInfo} 
          selectedDocuments={selectedDocuments}
          onUpdateProjectInfo={handleUpdateProjectInfo} 
          onSendMessage={handleSendMessage}
        />
      </div>

      <div className="absolute top-4 right-4">
        <UserMenu />
      </div>

      {/* Modal de confirmación nuevo proyecto sin guardar*/}
      {showConfirmation && (
        <ConfirmationModal 
          message="¿Estás seguro de que quieres crear un nuevo proyecto sin guardar el actual? Se podría perder información."
          onConfirm={handleConfirmNewProject}
        />
      )}
      {/* Modal de confirmación cambio de proyecto sin guardar */}
      {showConfirmationModal && (
        <ConfirmationModal 
          message="Tienes cambios sin guardar en el proyecto actual. ¿Deseas continuar sin guardar?"
          onConfirm={handleConfirmChangeProject}
        />
      )}

      
    </div>
  );
}