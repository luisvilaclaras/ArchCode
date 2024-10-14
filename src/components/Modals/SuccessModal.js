// SuccessModal.js

import React from 'react';

export default function SuccessModal({ message, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#001F54] p-6 rounded-lg shadow-lg text-center w-96 border border-white">
        <h2 className="text-lg font-semibold mb-4 text-white">¡Éxito!</h2>
        <p className="mb-6 text-gray-200">{message}</p>
        <button
          onClick={onClose}
          className="button-common-style"
        >
          Vale
        </button>
      </div>

      {/* Estilos comunes para el botón */}
      <style jsx>{`
        .button-common-style {
          width: 120px;
          height: 32px;
          font-size: 0.75rem;
          padding: 0.25rem;
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
  );
}
