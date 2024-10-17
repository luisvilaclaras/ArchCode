"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'; 
import { auth, db } from '../../../firebase-credentials';
import { doc, setDoc, getDoc, updateDoc, addDoc, collection, arrayUnion } from "firebase/firestore";
import ProjectSelector from '@/components/ChatPage/ProjectSelector';
import DocumentSelector from '@/components/ChatPage/DocumentSelector';
import ProjectInfo, { initialMandatoryTags } from '@/components/ChatPage/ProjectInfo';
import Chat from '@/components/ChatPage/Chat';
import UserMenu from '@/components/ChatPage/UserMenu';
import { v4 as uuidv4 } from 'uuid'; 
import ConfirmationModal from '@/components/Modals/ConfirmationModal';
import SuccessModal from '@/components/Modals/SuccessModal';
import WarningModal from '@/components/Modals/WarningModal';
import PdfRequestModal from '@/components/Modals/PdfRequestModal';
import OpinionModal from '@/components/Modals/OpinionModal';


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
  const handleSendMessageResolveRef = useRef(null);
  const [isPdfRequestModalOpen, setIsPdfRequestModalOpen] = useState(false);
  const [isOpinionModalOpen, setIsOpinionModalOpen] = useState(false); // Estado para el modal de opinión
  const [isProjectInfoOpen, setIsProjectInfoOpen] = useState(true);


  // Estados para el cambio de proyecto
  const [pendingProjectId, setPendingProjectId] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Variables y estados para manejar los modales de advertencia

  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [warningType, setWarningType] = useState(null);
  const [pendingQuestion, setPendingQuestion] = useState('');

  // Estados para el modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [initialMessages, setInitialMessages] = useState([]);


  let warningButtons = [];

  const router = useRouter(); 

  const handleChatClick = () => {
    setIsProjectInfoOpen(false); // Cerrar ProjectInfo
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
  
            // Seleccionar el primer proyecto si no hay uno seleccionado
            if (data.projects && data.projects.length > 0 && !selectedProject) {
              setSelectedProject(data.projects[0]);
              // Cargar el proyecto seleccionado
              handleProjectSelect(data.projects[0].projectId);
            }
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      } else {
        router.push("/");
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
      return { error: true, responseText: 'No se han seleccionado documentos.' };
    }
  
    if (!selectedProject) {
      console.error("Proyecto no seleccionado.");
      return { error: true, responseText: 'Proyecto no seleccionado.' };
    }
  
    // Construir el cuerpo de la solicitud con las claves correctas
    const body = {
      pregunta: question,
      etiquetas: projectInfo.map(tag => ({ clave: tag.name, contenido: tag.value })),
      nombreDocumentos: selectedDocuments,
      threadId: threadId,
      projectId: selectedProject.projectId // Asegúrate de que selectedProject tiene la estructura correcta
    };
  
    try {
      const response = await fetch('http://localhost:5001/arquitest-8ecf6/us-central1/handleUserQuery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener la respuesta del servidor.');
      }
  
      const data = await response.json();
      // Actualizar el threadId si es un nuevo hilo creado
      if (data.threadId && !threadId) {
        setThreadId(data.threadId);
      }
      return { error: false, responseText: data.respuesta };
  
    } catch (error) {
      console.error('Error al enviar la consulta:', error);
      return { error: true, responseText: 'Error al obtener la respuesta.' };
    }
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
  
  const handleProjectSelect = async (projectId) => {
    // Verificar si el proyecto está en la caché local
    if (localProjectData[projectId]) {
      const projectData = localProjectData[projectId];
      setSelectedProject({ projectId, name: projectData.name });
      setProjectInfo(projectData.content || []);
      setIsProjectInfoUpdated(false);
  
      // Cargar la conversación desde la caché local
      const conversation = projectData.conversation || [];
  
      // Formatear los mensajes para el chat
      const chatMessages = conversation.flatMap((conv) => [
        { sender: 'user', text: conv.question },
        { sender: 'gpt', text: conv.answer },
      ]);
  
      setInitialMessages(chatMessages);
    } else {
      // Si no está en la caché, cargar desde la base de datos
      try {
        const projectRef = doc(db, 'Projects', projectId);
        const projectSnap = await getDoc(projectRef);
  
        if (projectSnap.exists()) {
          const projectData = projectSnap.data();
          setSelectedProject({ projectId, name: projectData.name });
          setProjectInfo(projectData.content || []);
          setIsProjectInfoUpdated(false);
  
          // Cargar la conversación
          const conversation = projectData.conversation || [];
  
          // Actualizar la caché local
          setLocalProjectData((prevData) => ({
            ...prevData,
            [projectId]: {
              ...projectData,
              conversation,
            },
          }));
  
          // Formatear los mensajes para el chat
          const chatMessages = conversation.flatMap((conv) => [
            { sender: 'user', text: conv.question },
            { sender: 'gpt', text: conv.answer },
          ]);
  
          setInitialMessages(chatMessages);
        } else {
          console.error('El proyecto no existe en la base de datos.');
        }
      } catch (error) {
        console.error('Error al cargar el proyecto:', error);
      }
    }
  };

  


  const openOpinionModal = () => {
    setIsOpinionModalOpen(true);
  };

  const closeOpinionModal = () => {
    setIsOpinionModalOpen(false);
  };

  const openPdfRequestModal = () => {
    setIsPdfRequestModalOpen(true);
  };

  const closePdfRequestModal = () => {
    setIsPdfRequestModalOpen(false);
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

  // Dentro de createNewProject
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
      const updatedProjects = userData.projects
        ? [{ projectId, name: projectDisplayName }, ...userData.projects]
        : [{ projectId, name: projectDisplayName }];
      await updateDoc(doc(db, "Users", user.uid), {
        projects: updatedProjects,
      });

      setUserData(prevData => ({
        ...prevData,
        projects: updatedProjects,
      }));

      // Guardar los datos del proyecto en caché local
      setLocalProjectData(prevData => ({ ...prevData, [projectId]: projectContent }));

      // Establecer el nuevo proyecto como seleccionado
      setSelectedProject({ projectId, name: projectDisplayName });

      // Retornar tanto el ID como el nombre del proyecto
      return { projectId, projectDisplayName };
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
      alert('Error al crear el proyecto.');
      return null;
    }
  };

  
  

  const clearProjectInfo = () => {
    // Generar nombre temporal para el proyecto
    const projectCount = userData.projects ? userData.projects.length : 0;
    const projectDisplayName = `Proyecto ${projectCount + 1}`;
  
    setSelectedProject({ projectId: null, name: projectDisplayName });
  
    // Restablecer la información del proyecto
    setProjectInfo([]);
  
    // Alternar el estado para reiniciar las etiquetas en ProjectInfo
    setResetTagsTrigger(prev => !prev);
  
    setIsProjectInfoUpdated(false);
    setIsCreatingNewProject(true);
    setPendingProjectInfo([]);
    setThreadId(null); // Reiniciar threadId al crear nuevo proyecto
  
    // Limpiar los mensajes del chat
    setInitialMessages([]);
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
  
      if (selectedProject && selectedProject.projectId) {
        // Actualizar proyecto existente
        const projectRef = doc(db, "Projects", selectedProject.projectId);
        await updateDoc(projectRef, { content: projectContent });
  
        setLocalProjectData(prevData => ({ ...prevData, [selectedProject.projectId]: projectContent }));
        // Mostrar el modal de éxito
        setSuccessMessage('Proyecto actualizado con éxito.');
        setShowSuccessModal(true);
      } else {
        // Crear nuevo proyecto
        const newProject = await createNewProject(projectContent);
        if (newProject) {
          const { projectId, projectDisplayName } = newProject;
          // Mostrar el modal de éxito
          setSuccessMessage('Proyecto creado con éxito.');
          setShowSuccessModal(true);
          // Establecer el proyecto recién creado como seleccionado
          setSelectedProject({ projectId, name: projectDisplayName });
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



// En tu componente HomePage.js

  const handleSendMessage = async (question) => {
    // Verificar si hay documentos seleccionados
    if (selectedDocuments.length === 0) {
      return new Promise((resolve) => {
        handleSendMessageResolveRef.current = resolve;
        setWarningMessage('Es necesario seleccionar como mínimo un documento para poder realizar una pregunta.');
        setWarningType('noDocuments');
        setShowWarningModal(true);
      });
    }

    // Verificar si hay cambios no guardados en el proyecto
    if (isProjectInfoUpdated) {
      return new Promise((resolve) => {
        handleSendMessageResolveRef.current = resolve;
        setWarningMessage('La información del proyecto ha sido actualizada pero no guardada. ¿Deseas actualizar la información y hacer la pregunta?');
        setWarningType('unsavedChanges');
        setPendingQuestion(question);
        setShowWarningModal(true);
      });
    }

    // Verificar si la información del proyecto está vacía
    const hasProjectInfo = projectInfo.some(tag => tag.value && tag.value.trim() !== '');
    if (!hasProjectInfo) {
      return new Promise((resolve) => {
        handleSendMessageResolveRef.current = resolve;
        setWarningMessage('¿Seguro que quieres enviar una pregunta sin dar información sobre el proyecto? ¡Cuanta más información proporciones, más concreta será la respuesta!');
        setWarningType('noProjectInfo');
        setPendingQuestion(question);
        setShowWarningModal(true);
      });
    }

    // Si todo está bien, enviar la pregunta
    try {
      const respuesta = await handleUserQuery(question);

      // Guardar la conversación en la base de datos
      //await saveConversation(question, respuesta.responseText);

      return { sent: true, responseText: respuesta.responseText };
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      return { sent: true, responseText: 'Error al obtener la respuesta.', error: true };
    }
  };



  const handleSaveConversation = async (question, answer) => {
    if (!selectedProject || !selectedProject.projectId) {
      console.error('No hay un proyecto seleccionado.');
      return;
    }
  
    try {
      const projectRef = doc(db, 'Projects', selectedProject.projectId);
  
      // Actualizar el campo 'conversation' en el documento del proyecto
      await updateDoc(projectRef, {
        conversation: arrayUnion({ question, answer }),
      });
  
      // Actualizar la conversación en localProjectData
      setLocalProjectData((prevData) => {
        const updatedProject = { ...prevData[selectedProject.projectId] };
        if (!updatedProject.conversation) {
          updatedProject.conversation = [];
        }
        updatedProject.conversation.push({ question, answer });
        return {
          ...prevData,
          [selectedProject.projectId]: updatedProject,
        };
      });
    } catch (error) {
      console.error('Error al guardar la conversación:', error);
    }
  };
  

  
  
  
  const handleWarningConfirm = async () => {
    setShowWarningModal(false);
  
    if (warningType === 'noDocuments') {
      // Solo cerramos el modal; no permitimos enviar el mensaje
      handleSendMessageResolveRef.current({ sent: false });
      return;
    }
  
    if (warningType === 'noProjectInfo') {
      // Proceder sin información del proyecto
      if (!selectedProject) {
        const newProjectId = await createNewProject(projectInfo);
        if (newProjectId) {
          const projectDisplayName = `Proyecto ${(userData.projects && userData.projects.length + 1) || 1}`;
          setSelectedProject({ projectId: newProjectId, name: projectDisplayName });
        } else {
          handleSendMessageResolveRef.current({ sent: true, responseText: 'Error al crear el proyecto.' });
          return;
        }
      }
  
      const response = await handleUserQuery(pendingQuestion);
      setPendingQuestion('');
      handleSendMessageResolveRef.current({ sent: true, responseText: response.responseText, error: response.error });
    }
  };
  
  // Manejador para "Actualizar Información y Hacer la Pregunta"
  const handleWarningSaveAndProceed = async () => {
    setShowWarningModal(false);
  
    // Si no hay un proyecto seleccionado, creamos uno nuevo
    if (!selectedProject) {
      const newProjectId = await createNewProject(projectInfo);
      if (newProjectId) {
        const projectDisplayName = `Proyecto ${(userData.projects && userData.projects.length + 1) || 1}`;
        setSelectedProject({ projectId: newProjectId, name: projectDisplayName });
      } else {
        handleSendMessageResolveRef.current({ sent: true, responseText: 'Error al crear el proyecto.' });
        return;
      }
    }
  
    // Guardar la información del proyecto
    await handleSaveProject(projectInfo);
  
    // Asegurarnos de que el threadId esté actualizado
    // Si no existe, se establecerá al enviar la pregunta
  
    // Proceder a enviar la pregunta
    setIsProjectInfoUpdated(false);
    const response = await handleUserQuery(pendingQuestion);
    setPendingQuestion('');
    handleSendMessageResolveRef.current({ sent: true, responseText: response.responseText, error: response.error });
  };
  
  // Manejador para cancelar la acción
  const handleWarningCancel = () => {
    setShowWarningModal(false);
    setPendingQuestion('');
    handleSendMessageResolveRef.current({ sent: false });
  };
  
  
  
  
  
  
  const sendMessage = async (question) => {
    // Llamar a la función que interactúa con Firebase Functions
    const respuesta = await handleUserQuery(question);
    // Puedes manejar el resultado aquí si es necesario
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
  
  if (warningType === 'unsavedChanges') {
    warningButtons = [
      {
        label: 'Actualizar Información y Hacer la Pregunta',
        onClick: handleWarningSaveAndProceed,
        className: 'button-common-style',
      },
      {
        label: 'Cancelar',
        onClick: handleWarningCancel,
        className: 'button-muted-style',
      },
    ];
  } else if (warningType === 'noProjectInfo') {
    warningButtons = [
      {
        label: 'Sí',
        onClick: handleWarningConfirm,
        className: 'button-common-style',
      },
      {
        label: 'Cancelar',
        onClick: handleWarningCancel,
        className: 'button-muted-style',
      },
    ];
  } else if (warningType === 'noDocuments') {
    warningButtons = [
      {
        label: 'Vale',
        onClick: handleWarningConfirm,
        className: 'button-common-style',
      },
    ];
  }
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
        {/* Contenedor para los botones y el UserMenu */}
        <div className="flex items-center justify-between mb-4">
          {/* Selector de Documentos */}
          <div className="flex">
            <DocumentSelector 
              availablePDFs={availablePDFs} 
              selectedRegion={selectedRegion}
              onRegionSelect={handleRegionSelect}
              onSelect={handleDocumentSelect}
            />
          </div>
  
          {/* Contenedor flex para los botones y el UserMenu */}
          <div className="flex items-center space-x-4">
            {/* Botón para abrir el modal de solicitud de PDF */}
            <button
              onClick={openPdfRequestModal}
              className="py-2 px-4 bg-gray-800 text-white rounded-lg text-sm shadow-md hover:bg-gray-700"
            >
              ¿No encuentras el pdf que necesitas?
            </button>
  
            {/* Botón para abrir el modal de opinión */}
            <button
              onClick={openOpinionModal}
              className="py-2 px-4 bg-gray-800 text-white rounded-lg text-sm shadow-md hover:bg-gray-700"
            >
              Dejar una opinión
            </button>
  
            {/* UserMenu */}
            <div className="ml-auto">
              <UserMenu />
            </div>
          </div>
        </div>
        <ProjectInfo 
          isOpen={isProjectInfoOpen}
          setIsOpen={setIsProjectInfoOpen}
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
          isProjectSaved={selectedProject && selectedProject.projectId !== null} // Nueva prop
        />

        {/* Pasa chatRef al componente Chat */}
        <Chat
          onSendMessage={handleSendMessage}
          onChatClick={handleChatClick}
          projectInfo={projectInfo}
          selectedDocuments={selectedDocuments}
          onUpdateProjectInfo={handleUpdateProjectInfo}
          onSaveConversation={handleSaveConversation}
          initialMessages={initialMessages}

        />
      

      </div>
  
      {/* Modales */}
      {showConfirmation && (
        <ConfirmationModal 
          message="¿Estás seguro de que quieres crear un nuevo proyecto sin guardar el actual? Se podría perder información."
          onConfirm={handleConfirmNewProject}
        />
      )}
      {showConfirmationModal && (
        <ConfirmationModal 
          message="Tienes cambios sin guardar en el proyecto actual. ¿Deseas continuar sin guardar?"
          onConfirm={handleConfirmChangeProject}
        />
      )}
      {showSuccessModal && (
        <SuccessModal
          message={successMessage}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
      {showWarningModal && (
        <WarningModal
          message={warningMessage}
          buttons={warningButtons}
        />
      )}
      {isPdfRequestModalOpen && (
        <PdfRequestModal onClose={closePdfRequestModal} />
      )}
      {isOpinionModalOpen && (
        <OpinionModal onClose={closeOpinionModal} />
      )}
    </div>
  );
  
  
  
  
}