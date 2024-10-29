import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../../../firebase-credentials';

export default function OpinionModal({ onClose }) {
  const [opinion, setOpinion] = useState('');

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (opinion.trim()) {
      if (!user) {
        alert('Usuario no autenticado');
        return;
      }

      // Obtener la fecha actual
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

      try {
        await addDoc(collection(db, 'Reviews'), {
          type: `opinion-${formattedDate}`,
          userId: user.uid,
          content: opinion.trim(),
        });

        console.log('Opinión enviada: ', opinion);

        // Llamar a onClose para actualizar la fecha en Firestore
        onClose();

      } catch (error) {
        console.error('Error al enviar la opinión: ', error);
        alert('Hubo un error al enviar la opinión. Por favor, intenta de nuevo.');
      }
    } else {
      alert('Por favor, ingresa tu opinión.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#344e6f] p-6 rounded-lg shadow-lg text-center w-[800px] border border-white">
        <h2 className="text-lg font-semibold mb-4 text-white">
          Dejar una Opinión
        </h2>
        <p className="mb-6 text-gray-200">
          Dinos qué podemos mejorar o qué cosas no funcionan. ¡Tu opinión nos ayuda a crecer!
        </p>
        <textarea
          className="w-full p-2 text-gray-800 rounded-lg"
          placeholder="Escribe aquí tu opinión"
          style={{ height: '200px' }}
          value={opinion}
          onChange={(e) => setOpinion(e.target.value)}
        />
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="button-common-style bg-[#2563eb]"
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
  );
}
