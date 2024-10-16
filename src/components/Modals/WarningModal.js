// WarningModal.js

import React from 'react';

export default function WarningModal({ message, buttons }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#001F54] p-6 rounded-lg shadow-lg text-center w-96 border border-white">
        <h2 className="text-lg font-semibold mb-4 text-white">Advertencia</h2>
        <p className="mb-6 text-gray-200">{message}</p>
        <div className="flex flex-col space-y-2">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={button.onClick}
              className={button.className}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

      {/* Estilos comunes para los botones */}
      <style jsx>{`
        .button-common-style {
          width: 100%;
          height: 40px;
          font-size: 0.875rem;
          padding: 0.5rem;
          background: linear-gradient(to right, #1e3a8a, #2563eb);
          color: white;
          border-radius: 0.375rem;
          text-align: center;
          display: inline-block;
          transition: opacity 0.3s;
        }
        .button-common-style:hover {
          opacity: 0.9;
        }

        .button-muted-style {
          width: 100%;
          height: 40px;
          font-size: 0.875rem;
          padding: 0.5rem;
          background-color: #64748b;
          color: white;
          border-radius: 0.375rem;
          text-align: center;
          display: inline-block;
          transition: background-color 0.3s;
        }
        .button-muted-style:hover {
          background-color: #4b5563;
        }
      `}</style>
    </div>
  );
}
