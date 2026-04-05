'use client';

import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../../firebase-credentials';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LogInPopup({ closePopup, switchToSignUpPopup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showResendButton, setShowResendButton] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [unverifiedUser, setUnverifiedUser] = useState(null);

  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  const handleLogIn = async (e) => {
    e.preventDefault();
    setError('');
    setShowResendButton(false);
    setUnverifiedUser(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError('El correo electrónico no está verificado. Por favor, verifica tu email antes de iniciar sesión.');
        setShowResendButton(true);
        setUnverifiedUser(user);
        return;
      }

      closePopup();
      router.push('/herramienta');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setError('Usuario no encontrado. Por favor, verifica tu email y vuelve a intentarlo.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Contraseña incorrecta. Por favor, inténtalo de nuevo.');
      } else {
        setError('Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
      }
    }
  };

  const handleResendVerificationEmail = async () => {
    if (isResendDisabled) return;

    try {
      if (unverifiedUser) {
        await sendEmailVerification(unverifiedUser);
        alert('Correo de verificación enviado. Por favor, revisa tu bandeja de entrada.');
        setIsResendDisabled(true);
        setTimeout(() => {
          setIsResendDisabled(false);
        }, 30000);
      } else {
        setError('Error al reenviar el correo de verificación. Por favor, inténtalo de nuevo más tarde.');
      }
    } catch (error) {
      console.error('Error al reenviar el correo de verificación:', error);
      setError('Error al reenviar el correo de verificación. Por favor, inténtalo de nuevo más tarde.');
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
          className="bg-[#344e6f] p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md relative text-white"
        >
          <button
            className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl focus:outline-none"
            onClick={closePopup}
          >
            &times;
          </button>
          {/* Título: en móvil se muestra más pequeño (text-xl) y en escritorio (md) se restablece a text-2xl */}
          <h2 className="text-xl md:text-2xl font-semibold text-center mb-6">
            Inicia Sesión
          </h2>

          {/* Formulario de login */}
          <form onSubmit={handleLogIn} className="flex flex-col items-center">
            <div className="mb-4 w-full">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico*"
                className="mt-1 block w-full bg-white border border-gray-600 rounded-md shadow-sm focus:border-lightBlue focus:ring-lightBlue sm:text-sm p-3 text-black placeholder-gray-500"
                required
              />
            </div>

            <div className="mb-4 w-full">
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña*"
                  className="mt-1 block w-full bg-white border border-gray-600 rounded-md shadow-sm focus:border-lightBlue focus:ring-lightBlue sm:text-sm p-3 text-black placeholder-gray-500"
                  required
                />
              </div>
            </div>

            {/* Mostrar errores si existen */}
            {error && (
              <div className="w-full">
                <p className="text-red-400 text-sm mb-2 text-center">{error}</p>
                {showResendButton && (
                  <button
                    type="button"
                    onClick={handleResendVerificationEmail}
                    disabled={isResendDisabled}
                    className={`bg-white text-gray-700 font-semibold py-2 px-4 rounded-full w-full mt-2 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                      isResendDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                    }`}
                  >
                    {isResendDisabled ? 'Espera 30 segundos para reenviar otro...' : 'Reenviar correo de verificación'}
                  </button>
                )}
              </div>
            )}

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
                  switchToSignUpPopup();
                  closePopup();
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
