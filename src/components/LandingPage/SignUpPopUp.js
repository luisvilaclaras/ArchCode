'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Importamos framer-motion
import { auth, db } from "../../../firebase-credentials";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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
      setError("Emails do not match");
      return;
    }

    try {
      // Crear la cuenta de usuario con Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Enviar verificación de correo electrónico
      await sendEmailVerification(user);

      // Guardar datos del usuario en Firestore
      await setDoc(doc(db, "Users", user.uid), {
        gmail: email,
        phone: `${countryCode}${phoneNumber}`,
        plan: "basic",
      });

      // Mostrar mensaje de éxito
      setSuccess(true);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try logging in.');
      } else {
        setError(error.message);
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
      <div className={`fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 ${success ? 'hidden' : ''}`}>
        {/* Animación de aparición/desaparición con framer-motion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-black"
        >
          <button
            className="text-gray-400 hover:text-gray-600 float-right text-2xl"
            onClick={closePopup}
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold text-center mb-6">Sign Up</h2>

          {/* Google Sign-In Button */}
          <button className="bg-white text-gray-700 border border-gray-300 rounded-md flex items-center justify-center py-2 px-4 shadow-md w-full hover:shadow-lg transition">
            <img src="/images/google.png" alt="Google icon" className="h-5 mr-2" />
            <span>Continue with Google</span>
          </button>

          <div className="text-center text-gray-500 my-4">OR</div>

          {/* Sign Up Form */}
          <form onSubmit={handleSignUp}>
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
              <input
                type="email"
                id="confirmEmail"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder="Confirm email*"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 text-black"
                required
              />
            </div>

            {/* Phone Number Input with Country Code Selector */}
            <div className="mb-4">
              <div className="flex">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-white text-gray-700 border border-gray-300 p-2 rounded-l-md"
                >
                  <option value="+34">+34</option>
                  <option value="+44">+44</option>
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                </select>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone number*"
                  className="bg-white text-gray-700 border border-gray-300 p-3 rounded-r-md flex-1"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password*"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 text-black"
                  required
                />
                <span
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <img src="/images/eye.png" alt="Show" className="h-5 w-5" />
                  ) : (
                    <img src="/images/eye-off.png" alt="Hide" className="h-5 w-5" />
                  )}
                </span>
              </div>
            </div>

            {/* Mostrar errores si existen */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md w-full mt-4"
            >
              Continue
            </button>

            {/* Agregamos la frase */}
            <div className="text-center mt-4 text-sm text-gray-500">
              By proceeding, you agree to the <a href="#" className="text-blue-500 hover:text-blue-600">Terms of Service</a> and <a href="#" className="text-blue-500 hover:text-blue-600">Privacy Policy</a>.
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                Already have an account? <a href="/login" className="text-blue-500 hover:text-blue-600">Log in</a>
              </p>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Mostrar pop-up de éxito si la cuenta se crea */}
      {success && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center"
          >
            <h2 className="text-xl font-semibold mb-4 text-black">Account created!</h2>
            <p className="text-black">Verify your email to start using your new account.</p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md w-full mt-4"
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
