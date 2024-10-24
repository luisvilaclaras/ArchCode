"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'; 
import { auth, db } from '../../../firebase-credentials';
import { doc, setDoc, getDoc, updateDoc, addDoc, collection, arrayUnion, deleteDoc } from "firebase/firestore";
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
import AlertModal from '@/components/Modals/AlertModal';


export default function HomePage() {
  const [userData, setUserData] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState([]); // Cambiado a array
  const [availablePDFs, setAvailablePDFs] = useState({});
  const [selectedRegion, setSelectedRegion] = useState('Normativas nacionales');
  const [projectInfo, setProjectInfo] = useState(
    initialMandatoryTags.map(tag => ({ ...tag, value: '' }))
  );
  
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
  const [projectToDelete, setProjectToDelete] = useState(null);



  // Estados para el cambio de proyecto
  const [pendingProjectId, setPendingProjectId] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Variables y estados para manejar los modales de advertencia

  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [warningType, setWarningType] = useState(null);
  const [pendingQuestion, setPendingQuestion] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Estados para el modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [initialMessages, setInitialMessages] = useState([]);

  // HomePage.js
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);



  let warningButtons = [];

  const router = useRouter(); 

  const handleChatClick = () => {
    setIsProjectInfoOpen(false); // Cerrar ProjectInfo
  };

  useEffect(() => {
    setProjectInfo(initialMandatoryTags.map(tag => ({ ...tag, value: '' })));
  }, [resetTagsTrigger]);
  

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
  
            // Verificar si es momento de mostrar el modal
            checkAndShowOpinionModal(data);
  
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
  const checkAndShowOpinionModal = (data) => {
    const lastShown = data.lastOpinionModalShown;
    const currentDate = new Date();
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
  
    if (!lastShown) {
      // Si nunca se ha mostrado, lo mostramos ahora
      setIsOpinionModalOpen(true);
    } else {
      const lastShownDate = new Date(lastShown.toDate()); // Convertir Timestamp a Date
      if (currentDate - lastShownDate >= threeDaysInMs) {
        // Han pasado 3 días o más, mostramos el modal
        setIsOpinionModalOpen(true);
      }
    }
  };

  const handleDeleteProject = (projectId) => {
    // Buscar el proyecto por su ID para obtener el nombre
    const project = userData.projects.find((p) => p.projectId === projectId);
    setProjectToDelete(project);
    setWarningMessage(
      `¿Estás seguro de que quieres borrar el proyecto "${project.name}"? Esta acción no se puede deshacer.`
    );
    setWarningType('deleteProject');
    setShowWarningModal(true);
  };
  

  const closeOpinionModal = async () => {
    setIsOpinionModalOpen(false);
    // Actualizar la fecha en Firestore
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "Users", user.uid);
        await updateDoc(userRef, {
          lastOpinionModalShown: serverTimestamp(),
        });
        // Actualizar el estado local
        setUserData((prevData) => ({
          ...prevData,
          lastOpinionModalShown: new Date(),
        }));
      }
    } catch (error) {
      console.error("Error al actualizar lastOpinionModalShown:", error);
    }
  };

  // Función para manejar la llamada a la función de Firebase y recuperar la respuesta
  const handleUserQuery = async (question, projectIdParam) => {
    if (selectedDocuments.length === 0) {
      console.error("No se han seleccionado documentos.");
      return { error: true, responseText: 'No se han seleccionado documentos.' };
    }
  
    const projectIdToUse = projectIdParam || (selectedProject ? selectedProject.projectId : null);
  
    if (!projectIdToUse) {
      console.error("Proyecto no seleccionado.");
      return { error: true, responseText: 'Proyecto no seleccionado.' };
    }
  
    // Construir el cuerpo de la solicitud con las claves correctas
    const body = {
      pregunta: question,
      etiquetas: projectInfo.map(tag => ({ clave: tag.name, contenido: tag.value })),
      nombreDocumentos: selectedDocuments,
      threadId: threadId,
      projectId: projectIdToUse // Utiliza el projectId proporcionado o el del estado
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
    // Limpiar los mensajes actuales
    setInitialMessages([]);
  
    // Verificar si el proyecto está en la caché local
    if (localProjectData[projectId]) {
      const projectData = localProjectData[projectId];
      setSelectedProject({ projectId, name: projectData.name });
      setProjectInfo(projectData.content || []);
      setIsProjectInfoUpdated(false);
  
      // Cargar la conversación desde localProjectData
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


  const openPdfRequestModal = () => {
    setIsPdfRequestModalOpen(true);
  };

  const closePdfRequestModal = () => {
    setIsPdfRequestModalOpen(false);
  };

  const handleNewProject = () => {
    if (userData.projects && userData.projects.length >= 10) {
      // Mostrar el AlertModal
      setAlertMessage('Has alcanzado el límite de 10 proyectos en la beta. Por favor, borra algún proyecto para poder crear uno nuevo.');
      setShowAlertModal(true);
      return;
    }

    if (isProjectInfoUpdated) {
      // Si hay cambios no guardados, mostrar el modal de confirmación
      setShowConfirmation(true);
    } else {
      // Crear un nuevo proyecto sin necesidad de confirmar
      clearProjectInfo();
    }
  };

  const handleConfirmNewProject = (confirmed) => {
    setShowConfirmation(false); // Ocultar el modal después de la confirmación

    if (confirmed) {
      if (userData.projects && userData.projects.length >= 10) {
        // Mostrar el AlertModal
        setAlertMessage('Has alcanzado el límite de 10 proyectos en la beta. Por favor, borra algún proyecto para poder crear uno nuevo.');
        setShowAlertModal(true);
        return;
      }

      clearProjectInfo();
    }
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
  
      // Crear el documento del proyecto, incluyendo 'conversation: []'
      await setDoc(doc(db, 'Projects', projectId), {
        name: projectDisplayName,
        content: projectContent,
        userId: user.uid,
        conversation: [], // Inicializar la conversación como un array vacío
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
      setLocalProjectData(prevData => ({
        ...prevData,
        [projectId]: {
          name: projectDisplayName,
          content: projectContent,
          conversation: [], // Inicializar la conversación en localProjectData
        },
      }));
  
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
  
    // Restablecer la información del proyecto con las etiquetas obligatorias
    setProjectInfo(initialMandatoryTags.map(tag => ({ ...tag, value: '' })));
  
    // Alternar el estado para reiniciar las etiquetas en ProjectInfo
    setResetTagsTrigger(prev => !prev);
  
    setIsProjectInfoUpdated(false);
    setIsCreatingNewProject(true);
    setPendingProjectInfo([]);
    setThreadId(null); // Reiniciar threadId al crear nuevo proyecto
  
    // Limpiar los mensajes del chat
    setInitialMessages([]);
  };
  
  const handleConfirmDeleteProject = async () => {
    setShowWarningModal(false);
    if (!projectToDelete) return;
  
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user logged in!");
        return;
      }
  
      // Eliminar el proyecto de Firestore
      await deleteDoc(doc(db, 'Projects', projectToDelete.projectId));
  
      // Actualizar la lista de proyectos del usuario
      const updatedProjects = userData.projects.filter(
        (p) => p.projectId !== projectToDelete.projectId
      );
      await updateDoc(doc(db, "Users", user.uid), {
        projects: updatedProjects,
      });
  
      setUserData((prevData) => ({
        ...prevData,
        projects: updatedProjects,
      }));
  
      // Si el proyecto eliminado estaba seleccionado, limpiar la selección
      if (
        selectedProject &&
        selectedProject.projectId === projectToDelete.projectId
      ) {
        setSelectedProject(null);
        setProjectInfo([]);
        setInitialMessages([]);
      }
  
      // Eliminar el proyecto de la caché local
      setLocalProjectData((prevData) => {
        const newData = { ...prevData };
        delete newData[projectToDelete.projectId];
        return newData;
      });
  
      setSuccessMessage('Proyecto borrado con éxito.');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error al borrar el proyecto:', error);
      alert('Error al borrar el proyecto.');
    } finally {
      setProjectToDelete(null);
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
  
      if (selectedProject && selectedProject.projectId) {
        // Actualizar proyecto existente
        const projectRef = doc(db, "Projects", selectedProject.projectId);
        await updateDoc(projectRef, { content: projectContent });
  
        // Actualizar localProjectData con todos los detalles
        setLocalProjectData(prevData => ({
          ...prevData,
          [selectedProject.projectId]: {
            name: selectedProject.name,
            content: projectContent,
            conversation: prevData[selectedProject.projectId]?.conversation || [],
          },
        }));
  
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
  
          // Actualizar localProjectData para el nuevo proyecto
          setLocalProjectData(prevData => ({
            ...prevData,
            [projectId]: {
              name: projectDisplayName,
              content: projectContent,
              conversation: [],
            },
          }));
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

  // Verificar si la información del proyecto está vacía o no hay proyecto seleccionado
  const hasProjectInfo = projectInfo.some(tag => tag.value && tag.value.trim() !== '');
  if (!hasProjectInfo || !selectedProject || !selectedProject.projectId) {
      // Mostrar modal de advertencia antes de crear un nuevo proyecto
      return new Promise((resolve) => {
          handleSendMessageResolveRef.current = resolve;
          setWarningMessage('¿Seguro que quieres enviar una pregunta sin dar información sobre el proyecto? ¡Cuanta más información proporciones, más concreta será la respuesta!');
          setWarningType('noProjectInfo');
          setPendingQuestion(question); // Guardar la pregunta
          setShowWarningModal(true); // Mostrar el modal de advertencia
      });
  }

  // Verificar que el projectId está disponible
  if (!selectedProject.projectId) {
      console.error("No se ha establecido un projectId válido antes de enviar la pregunta.");
      return { sent: false, responseText: "Error: No se ha establecido un projectId válido." };
  }

  // Si ya tenemos un proyecto seleccionado y guardado, proceder directamente con el envío de la pregunta
  try {
      const respuesta = await handleUserQuery(question);

      // Guardar la conversación en la base de datos
      await handleSaveConversation(question, respuesta.responseText);

      return { sent: true, responseText: respuesta.responseText };
  } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      return { sent: true, responseText: 'Error al obtener la respuesta.', error: true };
  }
};



    // Función para manejar el feedback
  const handleFeedback = async (type, content) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No user logged in!");
      return;
    }
    const userId = user.uid;

    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

    // Mapear el tipo de feedback a 'thums_up' o 'thums_down'
    const feedbackType = type === 'positive' ? 'thumbs_up' : 'thumbs_down';

    const reviewData = {
      type: `${feedbackType}-${formattedDate}`,
      userId: userId,
      content: content,
    };

    try {
      const reviewRef = await addDoc(collection(db, 'Reviews'), reviewData);
      console.log("Review saved with ID: ", reviewRef.id);
    } catch (error) {
      console.error('Error saving review:', error);
    }
  };




  const handleSaveConversation = async (question, answer) => {
    if (!selectedProject || !selectedProject.projectId) {
      console.error('No hay un proyecto seleccionado.');
      return;
    }
  
    try {
      const projectRef = doc(db, 'Projects', selectedProject.projectId);
  
      // Obtener la conversación actual del proyecto desde localProjectData
      let currentConversation = localProjectData[selectedProject.projectId]?.conversation || [];
  
      // Añadir la nueva conversación sin mutar el array original
      const newConversation = [...currentConversation, { question, answer }];
  
      // Actualizar el campo 'conversation' en el documento del proyecto
      await updateDoc(projectRef, {
        conversation: newConversation,
      });
  
      // Actualizar la conversación en localProjectData sin mutar el estado directamente
      setLocalProjectData((prevData) => ({
        ...prevData,
        [selectedProject.projectId]: {
          ...prevData[selectedProject.projectId],
          conversation: newConversation,
        },
      }));
    } catch (error) {
      console.error('Error al guardar la conversación:', error);
    }
  };
  
  
  

  
  
  
  const handleWarningConfirm = async () => {
    setShowWarningModal(false);

    if (warningType === 'noDocuments') {
        handleSendMessageResolveRef.current({ sent: false });
        return;
    }

    if (warningType === 'noProjectInfo') {
        let projectId;

        if (!selectedProject || !selectedProject.projectId) {
            try {
                const user = auth.currentUser;
                if (!user) {
                    handleSendMessageResolveRef.current({ sent: true, responseText: 'Error: No hay usuario autenticado.' });
                    return;
                }

                const projectCount = userData.projects ? userData.projects.length : 0;
                const projectDisplayName = `Proyecto ${projectCount + 1}`;
                projectId = uuidv4(); // Generar un nuevo `projectId`

                // Crear el documento del proyecto en Firestore
                await setDoc(doc(db, 'Projects', projectId), {
                    name: projectDisplayName,
                    content: projectInfo,
                    userId: user.uid,
                });

                // Actualizar la lista de proyectos del usuario
                const updatedProjects = userData.projects
                    ? [{ projectId, name: projectDisplayName }, ...userData.projects]
                    : [{ projectId, name: projectDisplayName }];

                await updateDoc(doc(db, "Users", user.uid), {
                    projects: updatedProjects,
                });

                // Actualizamos el estado del proyecto pero sin esperar a `setSelectedProject`
                setUserData(prevData => ({
                    ...prevData,
                    projects: updatedProjects,
                }));
                setSelectedProject({ projectId, name: projectDisplayName });

                // Guardar la información del proyecto antes de hacer la pregunta
                await handleSaveProject(projectInfo);

            } catch (error) {
                console.error('Error al crear el proyecto:', error);
                handleSendMessageResolveRef.current({ sent: true, responseText: 'Error al crear el proyecto.' });
                return;
            }
        } else {
            // Si ya hay un `selectedProject`, usamos el `projectId` existente
            projectId = selectedProject.projectId;
        }

        // Asegurarnos de que tenemos el `projectId` antes de proceder
        if (projectId) {
          const response = await handleUserQuery(pendingQuestion, projectId);
          setPendingQuestion('');
          handleSendMessageResolveRef.current({ sent: true, responseText: response.responseText, error: response.error });
        } else {
          handleSendMessageResolveRef.current({ sent: true, responseText: 'Error: No se ha establecido un projectId válido.' });
        }
    }
};



  
  
  
  
  
  // Manejador para "Actualizar Información y Hacer la Pregunta"
  const handleWarningSaveAndProceed = async () => {
    setShowWarningModal(false);
  
    let projectIdToUse;
  
    // Si no hay un proyecto seleccionado, creamos uno nuevo
    if (!selectedProject || !selectedProject.projectId) {
      const newProject = await createNewProject(projectInfo);
      if (newProject) {
        const { projectId, projectDisplayName } = newProject;
        setSelectedProject({ projectId, name: projectDisplayName });
        projectIdToUse = projectId; // Almacenamos el projectId
      } else {
        handleSendMessageResolveRef.current({ sent: true, responseText: 'Error al crear el proyecto.' });
        return;
      }
    } else {
      projectIdToUse = selectedProject.projectId;
    }
  
    // Guardar la información del proyecto
    await handleSaveProject(projectInfo);
  
    // Proceder a enviar la pregunta
    setIsProjectInfoUpdated(false);
    const response = await handleUserQuery(pendingQuestion, projectIdToUse); // Pasamos el projectId explícitamente
    setPendingQuestion('');
    handleSendMessageResolveRef.current({ sent: true, responseText: response.responseText, error: response.error });
  };
  
  
  
  // Manejador para cancelar la acción
  const handleWarningCancel = () => {
    setShowWarningModal(false);
    setPendingQuestion('');
  
    // Solo llamar a handleSendMessageResolveRef.current si es una función
    if (typeof handleSendMessageResolveRef.current === 'function') {
      handleSendMessageResolveRef.current({ sent: false });
      handleSendMessageResolveRef.current = null; // Restablecer después de usar
    }
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
  
    try {
      const response = await fetch(
        'http://localhost:5001/arquitest-8ecf6/us-central1/generateAdditionalTags',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            etiquetasActuales: projectInfo,
            textoProyecto: automaticText,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error('Error al generar etiquetas adicionales.');
      }
  
      const data = await response.json();
      const etiquetasAdicionales = data.etiquetasAdicionales;
  
      // Función para normalizar nombres de etiquetas
      const normalizeTagName = (tagName) => {
        let normalized = tagName.toLowerCase();
        normalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Eliminar acentos
        normalized = normalized.replace(/[^\w\s]/gi, ''); // Eliminar puntuación
        normalized = normalized.trim();
  
        // Mapear variaciones conocidas a nombres estándar
        const nameMapping = {
          'numero de plantas': 'num plantas',
          'número de plantas': 'num plantas',
          'num plantas': 'num plantas',
          'num. plantas': 'num plantas',
          'superficie del edificio': 'superficie del edificio',
          'superficie edificio': 'superficie del edificio',
          'uso de edificio': 'uso de edificio',
          'uso edificio': 'uso de edificio',
          'zona climatica': 'zona climatica',
          'altura': 'altura',
          // Agrega otros mapeos según sea necesario
        };
  
        if (nameMapping[normalized]) {
          normalized = nameMapping[normalized];
        }
        return normalized;
      };
  
      // Crear un mapa de las etiquetas existentes por nombre normalizado
      const existingTagsMap = {};
      projectInfo.forEach(tag => {
        const normalizedTagName = normalizeTagName(tag.name);
        existingTagsMap[normalizedTagName] = tag;
      });
  
      // Crear un conjunto de nombres de etiquetas obligatorias normalizadas
      const mandatoryTagNamesSet = new Set(
        initialMandatoryTags.map(tag => normalizeTagName(tag.name))
      );
  
      // Procesar las etiquetas generadas
      etiquetasAdicionales.forEach(generatedTag => {
        const normalizedTagName = normalizeTagName(generatedTag.name);
        if (existingTagsMap[normalizedTagName]) {
          // Si la etiqueta ya existe, actualizamos su valor
          const existingTag = existingTagsMap[normalizedTagName];
          existingTag.value = generatedTag.value;
        } else {
          // Si la etiqueta no existe, la añadimos
          const newTag = {
            ...generatedTag,
            id: uuidv4(),
            type: 'input',
          };
          existingTagsMap[normalizedTagName] = newTag;
        }
      });
  
      // Convertir el mapa de vuelta a un array
      let updatedProjectInfo = Object.values(existingTagsMap);
  
      // Ordenar las etiquetas para que las obligatorias aparezcan primero en el orden correcto
      updatedProjectInfo.sort((a, b) => {
        const aIsMandatory = mandatoryTagNamesSet.has(normalizeTagName(a.name));
        const bIsMandatory = mandatoryTagNamesSet.has(normalizeTagName(b.name));
  
        if (aIsMandatory && bIsMandatory) {
          // Si ambos son obligatorios, mantener el orden de initialMandatoryTags
          const aIndex = initialMandatoryTags.findIndex(
            tag => normalizeTagName(tag.name) === normalizeTagName(a.name)
          );
          const bIndex = initialMandatoryTags.findIndex(
            tag => normalizeTagName(tag.name) === normalizeTagName(b.name)
          );
          return aIndex - bIndex;
        } else if (aIsMandatory) {
          return -1;
        } else if (bIsMandatory) {
          return 1;
        } else {
          return 0;
        }
      });
  
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
  } else if (warningType === 'deleteProject') {
    warningButtons = [
      {
        label: 'Borrar',
        onClick: handleConfirmDeleteProject,
        className: 'bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600',
      },
      {
        label: 'Cancelar',
        onClick: handleWarningCancel,
        className: 'bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400',
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
          onDeleteProject={handleDeleteProject} // Nueva prop
          isWaitingForResponse={isWaitingForResponse}

        />
      </div>
  
      <div className="flex flex-1 flex-col p-6 bg-[#FFFFFF] overflow-y-auto">
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
              className="py-2 px-4 bg-[#344e6f] text-white rounded-lg text-sm shadow-md hover:bg-gray-700"
            >
              ¿No encuentras el pdf que necesitas?
            </button>
  
            {/* Botón para abrir el modal de opinión */}
            <button
              onClick={openOpinionModal}
              className="py-2 px-4 bg-[#344e6f] text-white rounded-lg text-sm shadow-md hover:bg-gray-700"
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
          onFeedback={handleFeedback} // Pasamos la función al componente Chat
          isWaitingForResponse={isWaitingForResponse}
          onStartWaitingResponse={() => setIsWaitingForResponse(true)}
          onEndWaitingResponse={() => setIsWaitingForResponse(false)}
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
      {showAlertModal && (
        <AlertModal
          message={alertMessage}
          onClose={() => setShowAlertModal(false)}
        />
      )}
    </div>
  );
  
  
  
  
}