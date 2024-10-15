// OpinionModal.js

import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../../../firebase-credentials'; // Asegúrate de importar las credenciales

export default function OpinionModal({ onClose }) {
  const [opinion, setOpinion] = useState('');

  const handleSubmit = async () => {
    const user = auth.currentUser; // Usa auth.currentUser directamente
    if (opinion.trim()) {
      if (!user) {
        alert('Usuario no autenticado');
        return;
      }

      try {
        // Crear el documento en la colección 'Reviews' con el tipo 'opinion'
        await addDoc(collection(db, 'Reviews'), {
          type: 'opinion',
          userId: user.uid, // Usa el userId del usuario autenticado
          content: opinion.trim(), // El contenido del textarea
        });

        console.log('Opinión enviada: ', opinion);
        onClose(); // Cerrar el modal después de enviar

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
      <div className="bg-[#001F54] p-6 rounded-lg shadow-lg text-center w-[800px] border border-white">
        <h2 className="text-lg font-semibold mb-4 text-white">
          Dejar una Opinión
        </h2>
        <p className="mb-6 text-gray-200">
          Dinos qué podemos mejorar o qué cosas no funcionan. ¡Tu opinión nos ayuda a crecer!
        </p>
        <textarea
          className="w-full p-2 text-gray-800 rounded-lg"
          placeholder="Escribe aquí tu opinión"
          style={{ height: '200px' }} // Ajusta el tamaño del textarea
          value={opinion}
          onChange={(e) => setOpinion(e.target.value)}
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
  );
}
