"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { auth, db } from '../../../firebase-credentials';
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import ProjectSelector from '@/components/ChatPage/ProjectSelector';
import DocumentSelector from '@/components/ChatPage/DocumentSelector';
import ProjectInfo, { initialMandatoryTags } from '@/components/ChatPage/ProjectInfo';
import Chat from '@/components/ChatPage/Chat';
import UserMenu from '@/components/ChatPage/UserMenu';
import { v4 as uuidv4 } from 'uuid'; 

export default function HomePage() {
  const [userData, setUserData] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState([]); // Cambiado a array
  const [availablePDFs, setAvailablePDFs] = useState({});
  const [selectedRegion, setSelectedRegion] = useState('Nacionales');
  const [projectInfo, setProjectInfo] = useState([]);
  const [localProjectData, setLocalProjectData] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectInfoUpdated, setIsProjectInfoUpdated] = useState(false);
  const [isCreatingNewProject, setIsCreatingNewProject] = useState(false);
  const [pendingProjectInfo, setPendingProjectInfo] = useState([]);
  const [threadId, setThreadId] = useState(null); // Nuevo estado para el ID del thread
  const [isGeneratingTags, setIsGeneratingTags] = useState(false); // Nuevo estado para la generación de etiquetas
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
    setSelectedProject(projectId);
    setIsProjectInfoUpdated(false);
    setIsCreatingNewProject(false);
    setPendingProjectInfo([]);
    setThreadId(null); // Reiniciar threadId al cambiar de proyecto

    if (!projectId) {
        setProjectInfo([]);
        return;
    }

    // Si los datos del proyecto ya están en memoria local, se usan esos datos
    if (localProjectData[projectId]) {
        const storedData = localProjectData[projectId];
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
      setSelectedProject(null);
      setProjectInfo([]);
      setIsProjectInfoUpdated(false);
      setIsCreatingNewProject(true);
      setPendingProjectInfo([]);
      setThreadId(null); // Reiniciar threadId al crear nuevo proyecto
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setSelectedDocuments([]); // Resetea los documentos seleccionados al cambiar la región
  };

  const handleDocumentSelect = (docs) => {
    setSelectedDocuments(docs);
  };

  const createNewProject = async (info) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.error("No user logged in!");
            return null;
        }

        // Filtrar solo las etiquetas que tienen valores definidos y no vacíos
        const filteredInfo = info.filter(tag => tag.value !== undefined && tag.value.trim() !== '');

        const projectName = `Proyecto-${uuidv4()}`;
        const projectRef = await addDoc(collection(db, 'Projects'), {
            name: projectName,
            content: filteredInfo,
        });

        // Actualizar la lista de proyectos del usuario
        const userRef = doc(db, "Users", user.uid);
        const updatedProjects = userData.projects ? [...userData.projects, projectRef.id] : [projectRef.id];
        await updateDoc(userRef, {
            projects: updatedProjects,
        });

        setUserData(prevData => ({
            ...prevData,
            projects: updatedProjects,
        }));

        setLocalProjectData(prevData => ({ ...prevData, [projectRef.id]: filteredInfo }));
        setSelectedProject(projectRef.id);

        return projectRef.id;
    } catch (error) {
        console.error('Error al crear el proyecto:', error);
        alert('Error al crear el proyecto.');
        return null;
    }
  };

  const handleSaveProject = async (projectContent) => {
      try {
          const user = auth.currentUser;
          if (!user) {
              console.error("No user logged in!");
              return;
          }

          if (selectedProject) {
              // Si hay un proyecto seleccionado, lo actualizamos
              const projectRef = doc(db, "Projects", selectedProject);
              await updateDoc(projectRef, { content: projectContent });

              setLocalProjectData(prevData => ({ ...prevData, [selectedProject]: projectContent }));
              alert(`Proyecto actualizado con éxito.`);
          } else {
              // Si no hay un proyecto seleccionado, se crea uno nuevo
              const newProjectId = await createNewProject(projectContent);
              if (newProjectId) {
                  alert(`Proyecto creado con éxito.`);
              }
          }

          setIsProjectInfoUpdated(false);

      } catch (error) {
          console.error('Error al guardar el proyecto:', error);
          alert('Error al guardar el proyecto.');
      }
  };

  const handleUpdateProjectInfo = async (newInfo) => {
    if (!selectedProject && !isCreatingNewProject) {
      const newProjectId = await createNewProject(newInfo);
      if (newProjectId) {
        setProjectInfo(newInfo);
        setIsCreatingNewProject(false);
        setIsProjectInfoUpdated(true);
      }
    } else {
      if (isCreatingNewProject) {
        setPendingProjectInfo(newInfo);
      } else {
        setProjectInfo(newInfo);
      }
      setIsProjectInfoUpdated(true);
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

    try {
        const response = await fetch('http://localhost:5001/arquitest-8ecf6/us-central1/generateAdditionalTags', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                etiquetasActuales: projectInfo, // Enviamos las etiquetas actuales
                textoProyecto: automaticText
            })
        });

        if (!response.ok) {
            throw new Error('Error al generar etiquetas adicionales.');
        }

        const data = await response.json();
        const etiquetasAdicionales = data.etiquetasAdicionales;

        // Mapear etiquetas por defecto
        const defaultTagNames = initialMandatoryTags.map(tag => tag.name);

        // Actualizar etiquetas por defecto si están vacías
        const updatedProjectInfo = projectInfo.map(tag => {
            if (defaultTagNames.includes(tag.name) && (!tag.value || tag.value.trim() === '')) {
                const generatedTag = etiquetasAdicionales.find(gTag => gTag.name.toLowerCase() === tag.name.toLowerCase());
                if (generatedTag) {
                    return { ...tag, value: generatedTag.value };
                }
            }
            return tag;
        });

        // Añadir las etiquetas generadas que no son de las etiquetas por defecto
        const customGeneratedTags = etiquetasAdicionales.filter(tag => !defaultTagNames.includes(tag.name));
        const updatedTags = [...updatedProjectInfo, ...customGeneratedTags];

        setProjectInfo(updatedTags);
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
            projects={userData.projects} 
            onSelect={handleProjectSelect} 
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
                onGenerateAutomaticTags={handleGenerateAutomaticTags} // Pasamos la nueva prop
                isGenerating={isGeneratingTags} // Pasamos el estado de carga
            />
            <Chat 
                projectInfo={projectInfo} 
                selectedDocuments={selectedDocuments} // Cambiado a selectedDocuments
                onUpdateProjectInfo={handleUpdateProjectInfo} 
                onSendMessage={handleSendMessage} // Prop para manejar el envío de mensajes
            />
        </div>

        <div className="absolute top-4 right-4">
            <UserMenu />
        </div>
    </div>
  );
}
