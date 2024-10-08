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
        setError('Email is not verified. Please verify your email before logging in.');
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
        setError('User not found. Please check your email and try again.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        {/* Animación de aparición/desaparición con framer-motion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm"
        >
          <button
            className="text-gray-400 hover:text-gray-600 float-right text-2xl"
            onClick={closePopup}
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold text-center mb-6 text-black">Log In</h2>

          {/* Formulario de login */}
          <form onSubmit={handleLogIn}>
            <div className="mb-4">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email*"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 text-black"
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
                  placeholder="Password*"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 text-black"
                  required
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                  <img src="/images/eye-off.png" alt="Hide" className="h-5 w-5" />
                </span>
              </div>
            </div>

            {/* Mostrar errores si existen */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Botón de submit */}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md w-full mt-4"
            >
              Log In
            </button>
          </form>

          {/* Enlace a registro */}
          <div className="text-center mt-4">
            <p className="text-sm text-black">
              Don't have an account?{' '}
              <a href="#" className="text-blue-500 hover:text-blue-600" onClick={() => {
                closePopup();
                // Abrir popup de registro si existe la lógica
              }}>
                Sign Up
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
