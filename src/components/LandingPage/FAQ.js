'use client';

import { useState } from 'react';
import { db, auth } from '../../../firebase-credentials'; // Importa tu configuración de Firebase
import { addDoc, collection } from 'firebase/firestore';

export default function FAQ() {
  const [userQuestion, setUserQuestion] = useState('');
  const [submittedQuestion, setSubmittedQuestion] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!userQuestion.trim()) {
      setErrorMessage('Por favor, ingresa una pregunta.');
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setErrorMessage('Por favor, inicia sesión para enviar una pregunta.');
      return;
    }

    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

    try {
      await addDoc(collection(db, 'Reviews'), {
        type: `question-${formattedDate}`,
        userId: currentUser.uid,
        content: userQuestion.trim(),
      });

      setSubmittedQuestion(userQuestion);
      setUserQuestion(''); // Limpiar el input después de enviar
      setSuccessMessage('Tu pregunta ha sido enviada con éxito.');
      setErrorMessage(null); // Limpiar cualquier error
    } catch (error) {
      setErrorMessage('Hubo un error al enviar tu pregunta. Intenta de nuevo.');
      console.error('Error al enviar la pregunta:', error);
    }
  };

  return (
    <section className="bg-[#1e3047] text-white py-16 text-center">
      {/* El título se muestra en un tamaño menor en móviles (text-2xl) y en escritorio se incrementa a text-4xl */}
      <h2 className="text-2xl md:text-4xl font-bold mb-8">
        ¿Todavía tienes preguntas?
      </h2>

      {/* Formulario centrado */}
      <form onSubmit={handleQuestionSubmit} className="flex flex-col items-center">
        <input
          type="text"
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
          placeholder="Haznos una pregunta"
          className="w-full max-w-md p-2 mb-4 rounded-lg text-gray-800"
        />
        <button
          type="submit"
          className="bg-[#2563eb] text-white py-2 px-6 rounded-full shadow-md hover:bg-blue-600 transition mx-auto block text-center"
        >
          Enviar Pregunta
        </button>
      </form>

      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}

      {submittedQuestion && (
        <div className="mt-8">
          {/* El subtítulo "Tu pregunta:" se muestra en text-xl en móviles y text-2xl en escritorio */}
          <h3 className="text-xl md:text-2xl font-semibold">Tu pregunta:</h3>
          <p className="text-lg mt-2">{submittedQuestion}</p>
        </div>
      )}
    </section>
  );
}
