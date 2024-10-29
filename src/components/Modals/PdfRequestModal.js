import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../../../firebase-credentials';
import SuccessNotification from './SuccessNotification';

export default function PdfRequestModal({ onClose }) {
  const [pdfRequest, setPdfRequest] = useState('');
  const [isSuccessNotificationOpen, setIsSuccessNotificationOpen] = useState(false);

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (pdfRequest.trim()) {
      if (!user) {
        alert('Usuario no autenticado');
        return;
      }

      // Obtener la fecha actual
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

      try {
        await addDoc(collection(db, 'Reviews'), {
          type: `pdf_needed-${formattedDate}`, // Incluye la fecha en el campo type
          userId: user.uid,
          content: pdfRequest.trim(),
        });

        console.log('Solicitud de PDF enviada: ', pdfRequest);

        onClose();
        setTimeout(() => {
          setIsSuccessNotificationOpen(true);
        }, 100);
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
            setIsSuccessNotificationOpen(false);
          }}
        />
      )}

      {!isSuccessNotificationOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#344e6f] p-6 rounded-lg shadow-lg text-center w-[800px] border border-white">
            <h2 className="text-lg font-semibold mb-4 text-white">
              Solicitud de PDF
            </h2>
            <p className="mb-6 text-gray-200">
              Dinos qué PDF te hace falta, adjuntando la URL o diciéndonos cómo encontrarlo. En menos de 24H, lo tendrás operativo. ¡Tu información nos ayuda a crecer!
            </p>
            <textarea
              className="w-full p-2 text-gray-800 rounded-lg"
              placeholder="Escribe aquí la URL o la descripción"
              style={{ height: '200px' }}
              value={pdfRequest}
              onChange={(e) => setPdfRequest(e.target.value)}
            />
            <div className="flex justify-between mt-6">
              <button
                onClick={onClose}
                className="button-common-style "
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

            <style jsx>{`
              .button-common-style {
                width: 150px;
                height: 40px;
                font-size: 0.9rem;
                padding: 0.5rem;
                background-color: #2563eb;
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
