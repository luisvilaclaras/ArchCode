'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Importamos framer-motion
import { auth, db } from "../../../firebase-credentials";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; // Importamos serverTimestamp
import { useRouter } from 'next/navigation';

export default function SignUpPopup({ closePopup }) {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState('+34'); // Default country code
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // Estado para manejar el pop-up de éxito
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (email !== confirmEmail) {
      setError("Los correos electrónicos no coinciden.");
      return;
    }

    try {
      // Crear la cuenta de usuario con Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Enviar verificación de correo electrónico
      await sendEmailVerification(user);

      // Guardar datos del usuario en Firestore, incluyendo la fecha actual
      await setDoc(doc(db, "Users", user.uid), {
        gmail: email,
        phone: `${countryCode}${phoneNumber}`,
        plan: "basic",
        lastOpinionModalShown: serverTimestamp(), // Agregamos este campo
      });

      // Mostrar mensaje de éxito
      setSuccess(true);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Este correo electrónico ya está registrado. Intenta iniciar sesión.');
      } else {
        setError('Error al crear la cuenta. Por favor, inténtalo de nuevo más tarde.');
      }
      console.error("Error en la creación de cuenta:", error);
    }
  };

  const handleSuccessPopupClose = () => {
    // Cerrar ambos popups y volver al menú principal
    setSuccess(false);
    closePopup();
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 ${success ? 'hidden' : ''}`}>
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
          <h2 className="text-2xl font-semibold text-center mb-6">Regístrate</h2>

          {/* Botón de Inicio de Sesión con Google */}
          <button className="bg-white text-gray-700 border border-gray-300 rounded-full flex items-center justify-center py-2 px-4 shadow-md w-full hover:shadow-lg transition mb-4 focus:outline-none focus:ring-4 focus:ring-blue-300">
            <img src="/images/google.png" alt="Google icon" className="h-5 mr-2" />
            <span>Continuar con Google</span>
          </button>

          <div className="text-center text-gray-300 my-4">O</div>

          {/* Formulario de registro */}
          <form onSubmit={handleSignUp}>
            <div className="mb-4">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico*"
                className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:border-lightBlue focus:ring-lightBlue sm:text-sm p-3 text-black placeholder-gray-500"
                required
              />
            </div>

            <div className="mb-4">
              <input
                type="email"
                id="confirmEmail"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder="Confirma tu correo electrónico*"
                className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:border-lightBlue focus:ring-lightBlue sm:text-sm p-3 text-black placeholder-gray-500"
                required
              />
            </div>

            {/* Número de teléfono con código de país */}
            <div className="mb-4">
              <div className="flex">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-white text-black border border-gray-300 p-3 rounded-l-md focus:outline-none focus:border-lightBlue"
                >
                  <option value="+34">+34</option>
                  <option value="+44">+44</option>
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  {/* Agrega más códigos de país según sea necesario */}
                </select>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Número de teléfono*"
                  className="bg-white text-black border border-gray-300 p-3 rounded-r-md flex-1 focus:outline-none focus:border-lightBlue placeholder-gray-500"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña*"
                  className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:border-lightBlue focus:ring-lightBlue sm:text-sm p-3 text-black placeholder-gray-500"
                  required
                />
                <span
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <img src="/images/eye.png" alt="Mostrar" className="h-5 w-5" />
                  ) : (
                    <img src="/images/eye-off.png" alt="Ocultar" className="h-5 w-5" />
                  )}
                </span>
              </div>
            </div>

            {/* Mostrar errores si existen */}
            {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

            {/* Botón de submit */}
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-2 px-4 rounded-full w-full mt-4 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Continuar
            </button>

            {/* Texto adicional */}
            <div className="text-center mt-4 text-sm text-gray-300">
              Al continuar, aceptas los{' '}
              <a href="#" className="text-lightBlue hover:underline">
                Términos de Servicio
              </a>{' '}
              y la{' '}
              <a href="#" className="text-lightBlue hover:underline">
                Política de Privacidad
              </a>
              .
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-300">
                ¿Ya tienes una cuenta?{' '}
                <button
                  className="text-lightBlue hover:underline focus:outline-none"
                  onClick={() => {
                    closePopup();
                    // Aquí puedes abrir el popup de inicio de sesión si lo deseas
                  }}
                >
                  Inicia Sesión
                </button>
              </p>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Mostrar pop-up de éxito si la cuenta se crea */}
      {success && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.3 }}
            className="bg-[#1e3047] p-6 rounded-lg shadow-lg w-full max-w-md text-center text-white relative"
          >
            <button
              className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl focus:outline-none"
              onClick={handleSuccessPopupClose}
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4">¡Cuenta creada!</h2>
            <p>Verifica tu correo electrónico para comenzar a usar tu nueva cuenta.</p>
            <button
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-2 px-4 rounded-full w-full mt-6 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
              onClick={handleSuccessPopupClose}
            >
              OK
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}
