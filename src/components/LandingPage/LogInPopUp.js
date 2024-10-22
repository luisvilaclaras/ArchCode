'use client';

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase-credentials';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LogInPopup({ closePopup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const { setCurrentUser } = useAuth(); // Utilizamos el contexto para actualizar el usuario actual
  const router = useRouter();

  const handleLogIn = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos

    try {
      // Intentar iniciar sesión con Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError('El correo electrónico no está verificado. Por favor, verifica tu email antes de iniciar sesión.');
        return;
      }

      // Actualizamos el estado global del usuario en el contexto
      setCurrentUser(user);

      // Redirigir al usuario al dashboard
      closePopup(); // Cerrar el popup
      router.push('/chat'); // Cambiar la ruta según la página de destino

    } catch (error) {
      // Manejar errores comunes de autenticación
      if (error.code === 'auth/user-not-found') {
        setError('Usuario no encontrado. Por favor, verifica tu email y vuelve a intentarlo.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Contraseña incorrecta. Por favor, inténtalo de nuevo.');
      } else {
        setError('Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
        {/* Animación de aparición/desaparición con framer-motion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ duration: 0.3 }}
          className="bg-[#1e3047] p-6 rounded-lg shadow-lg w-full max-w-md relative text-white"
        >
          <button
            className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl focus:outline-none"
            onClick={closePopup}
          >
            &times;
          </button>
          <h2 className="text-2xl font-semibold text-center mb-6">Iniciar Sesión</h2>

          {/* Formulario de login */}
          <form onSubmit={handleLogIn}>
            <div className="mb-4">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico*"
                className="mt-1 block w-full bg-[#003275] border border-gray-600 rounded-md shadow-sm focus:border-lightBlue focus:ring-lightBlue sm:text-sm p-3 text-white placeholder-gray-300"
                required
              />
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña*"
                  className="mt-1 block w-full bg-[#003275] border border-gray-600 rounded-md shadow-sm focus:border-lightBlue focus:ring-lightBlue sm:text-sm p-3 text-white placeholder-gray-300"
                  required
                />
                {/* Puedes agregar funcionalidad para mostrar/ocultar contraseña si lo deseas */}
              </div>
            </div>

            {/* Mostrar errores si existen */}
            {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

            {/* Botón de submit */}
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-2 px-4 rounded-full w-full mt-4 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Enlace a registro */}
          <div className="text-center mt-4">
            <p className="text-sm">
              ¿No tienes una cuenta?{' '}
              <button
                className="text-lightBlue hover:underline focus:outline-none"
                onClick={() => {
                  closePopup();
                  // Aquí puedes abrir el popup de registro si lo deseas
                }}
              >
                Regístrate
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
