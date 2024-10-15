// SuccessNotification.js

import React from 'react';

export default function SuccessNotification({ message, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-60">
      <div className="bg-green-500 p-6 rounded-lg shadow-lg text-center w-[400px] border border-white">
        <h2 className="text-lg font-semibold mb-4 text-white">Éxito</h2>
        <p className="mb-6 text-gray-200">{message}</p>
        <button onClick={onClose} className="button-common-style">
          Cerrar
        </button>

        {/* Estilos comunes para los botones */}
        <style jsx>{`
          .button-common-style {
            width: 120px;
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
