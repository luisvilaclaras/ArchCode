// PdfRequestModal.js

import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../../../firebase-credentials';
import SuccessNotification from './SuccessNotification';

export default function PdfRequestModal({ onClose }) {
  const [pdfRequest, setPdfRequest] = useState('');
  const [isSuccessNotificationOpen, setIsSuccessNotificationOpen] = useState(false); // Estado para el modal de éxito

  const handleSubmit = async () => {
    const user = auth.currentUser; // Usa auth.currentUser directamente
    if (pdfRequest.trim()) {
      if (!user) {
        alert('Usuario no autenticado');
        return;
      }

      try {
        // Crear el documento en la colección 'Reviews' con los campos necesarios
        await addDoc(collection(db, 'Reviews'), {
          type: 'pdf_needed',
          userId: user.uid, // Usa el userId del usuario autenticado
          content: pdfRequest.trim(), // El contenido del textarea
        });

        console.log('Solicitud de PDF enviada: ', pdfRequest);

        // Cierra el modal de solicitud de PDF ANTES de abrir el de éxito
        onClose(); // Cierra el modal de solicitud

        // Mostrar notificación de éxito después de que el modal de solicitud se haya cerrado
        setTimeout(() => {
          setIsSuccessNotificationOpen(true); // Abre el modal de éxito después de un pequeño retraso
        }, 100); // Se añade un retraso de 100ms para evitar conflictos

      } catch (error) {
        console.error('Error al crear la solicitud de PDF: ', error);
        alert('Hubo un error al enviar la solicitud. Por favor, intenta de nuevo.');
      }
    } else {
      alert('Por favor, ingresa una descripción o URL.');
    }
  };

  return (
    <>
      {isSuccessNotificationOpen && (
        <SuccessNotification
          message="¡Tu solicitud de PDF ha sido enviada correctamente!"
          onClose={() => {
            setIsSuccessNotificationOpen(false); // Cierra el modal de éxito cuando se cierra la notificación
          }}
        />
      )}

      {/* No se muestra el modal de solicitud de PDF si el modal de éxito está abierto */}
      {!isSuccessNotificationOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#001F54] p-6 rounded-lg shadow-lg text-center w-[800px] border border-white">
            <h2 className="text-lg font-semibold mb-4 text-white">
              Solicitud de PDF
            </h2>
            <p className="mb-6 text-gray-200">
              Dinos qué PDF te hace falta, adjuntando la URL o diciéndonos cómo encontrarlo. ¡Tu información nos ayuda a crecer!
            </p>
            <textarea
              className="w-full p-2 text-gray-800 rounded-lg"
              placeholder="Escribe aquí la URL o la descripción"
              style={{ height: '200px' }} // Ajusta el tamaño del textarea
              value={pdfRequest}
              onChange={(e) => setPdfRequest(e.target.value)}
            />
            <div className="flex justify-between mt-6">
              <button
                onClick={onClose}
                className="button-common-style bg-gray-500"
              >
                Volver
              </button>
              <button
                onClick={handleSubmit}
                className="button-common-style"
              >
                Enviar
              </button>
            </div>

            {/* Estilos comunes para los botones */}
            <style jsx>{`
              .button-common-style {
                width: 150px;
                height: 40px;
                font-size: 0.9rem;
                padding: 0.5rem;
                background: linear-gradient(to right, #1e3a8a, #2563eb);
                color: white;
                border-radius: 9999px;
                text-align: center;
                display: inline-block;
                transition: opacity 0.3s;
              }
              .button-common-style:hover {
                opacity: 0.9;
              }
            `}</style>
          </div>
        </div>
      )}
    </>
  );
}
