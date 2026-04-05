// PdfUploadModal.js

import React, { useState, useRef } from 'react';
import { auth } from '../../../firebase-credentials';
import SuccessNotification from './SuccessNotification'; // Asegúrate de que la ruta sea correcta

export default function PdfUploadModal({ onClose, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSuccessNotificationOpen, setIsSuccessNotificationOpen] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
  const fileInputRef = useRef(null);

  // Obtener la URL correcta según el entorno
  const currentOrigin = window.location.origin;
  const productionURL = 'https://uploadpdf-kvebfg6w3q-uc.a.run.app';
  const localURL = 'http://localhost:5001/archcode-5ad81/us-central1/uploadPdf';
  const apiURL = currentOrigin.includes('localhost') ? localURL : productionURL;

  // Función para abrir la notificación de éxito
  const handleUploadSuccess = () => {
    setIsSuccessNotificationOpen(true);
    if (typeof onUploadSuccess === 'function') {
      onUploadSuccess(); // Notifica a HomePage
    }
  };
  
  

  // Manejo de eventos de arrastrar y soltar
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const file = e.dataTransfer.files[0];
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (file && isPdf) {
      setSelectedFile(file);
    } else {
      alert('Por favor, selecciona un archivo PDF.');
    }
  };

  // Manejo de clic para seleccionar archivo
  const handleClick = () => {
    fileInputRef.current.click();
  };

  // Manejo de cambio en el input de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (file && isPdf) {
      setSelectedFile(file);
    } else {
      alert('Por favor, selecciona un archivo PDF.');
    }
  };

  // Manejo de envío del formulario
  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (selectedFile) {
      if (!user) {
        alert('Usuario no autenticado');
        return;
      }

      setIsLoading(true); // Iniciar la animación de carga

      try {
        const token = await user.getIdToken();

        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await fetch(apiURL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Archivo PDF subido:', data);

          // Mostrar la notificación de éxito
          handleUploadSuccess();
        } else {
          const errorText = await response.text();
          console.error('Error al subir el archivo PDF:', errorText);
          alert('Hubo un error al subir el archivo. Por favor, intenta de nuevo.');
        }
      } catch (error) {
        console.error('Error al subir el archivo PDF:', error);
        alert('Hubo un error al subir el archivo. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false); // Detener la animación de carga
      }
    } else {
      alert('Por favor, selecciona un archivo PDF.');
    }
  };

  return (
    <>
      {/* Renderizar SuccessNotification si está abierta */}
      {isSuccessNotificationOpen ? (
        <SuccessNotification
          message="¡Pdf subido correctamente!"
          onClose={() => {
            setIsSuccessNotificationOpen(false);
            onClose(); // Cerrar el modal principal cuando el usuario acepta la notificación
          }}
        />
      ) : (
        // Renderizar el modal principal si la notificación no está abierta
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#344e6f] p-6 rounded-lg shadow-lg text-center w-[800px] border border-white relative">
            <h2 className="text-lg font-semibold mb-4 text-white">
              Subir PDF
            </h2>
            <p className="mb-6 text-gray-200">
              Sube tu archivo PDF arrastrándolo aquí o haciendo clic para seleccionarlo. ¡Tu información nos ayuda a crecer!
            </p>
            <div
              className={`dropzone w-full p-6 border-2 border-dashed rounded-lg text-gray-200 cursor-pointer ${
                isDragActive ? 'border-blue-500' : 'border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
            >
              {isLoading ? (
                // Animación de carga (spinner)
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-20 w-20 mb-4"></div>
                  <p className="mt-4 text-white">Subiendo...</p>
                </div>
              ) : selectedFile ? (
                <p className="text-white">{selectedFile.name}</p>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <img
                    src="/images/upload.webp"
                    alt="Subir archivo"
                    className="w-20 h-20 object-cover"
                  />
                  <p className="mt-4 text-white">
                    Arrastra y suelta tu archivo PDF aquí o haz clic para seleccionarlo
                  </p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <div className="flex justify-between mt-6">
              <button
                onClick={onClose}
                className="button-common-style"
                disabled={isLoading} // Desactivar el botón mientras se carga
              >
                Volver
              </button>
              <button
                onClick={handleSubmit}
                className="button-common-style"
                disabled={isLoading || !selectedFile} // Desactivar si está cargando o no hay archivo seleccionado
              >
                {isLoading ? 'Subiendo...' : 'Subir'}
              </button>
            </div>

            {/* Estilos específicos para PdfUploadModal */}
            <style jsx>{`
              .button-common-style {
                width: 150px;
                height: 40px;
                font-size: 0.9rem;
                padding: 0.5rem;
                background-color: #2563eb;
                color: white;
                border: none;
                border-radius: 9999px;
                text-align: center;
                display: inline-block;
                transition: opacity 0.3s;
                cursor: pointer;
              }
              .button-common-style:hover {
                opacity: 0.9;
              }
              .button-common-style:disabled {
                background-color: #a5b4fc;
                cursor: not-allowed;
              }
              .dropzone {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 200px;
              }
              /* Estilos para el spinner de carga */
              .loader {
                border-top-color: #2563eb; /* Color azul coherente */
                animation: spin 1s ease-in-out infinite;
              }
              @keyframes spin {
                to {
                  transform: rotate(360deg);
                }
              }
            `}</style>
          </div>
        </div>
      )}
    </>
  );
}
