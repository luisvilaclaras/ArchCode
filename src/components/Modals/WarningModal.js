// WarningModal.js

import React from 'react';

export default function WarningModal({ message, onConfirm, onCancel, onlyConfirm = false }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#001F54] p-6 rounded-lg shadow-lg text-center w-96 border border-white">
        <h2 className="text-lg font-semibold mb-4 text-white">Advertencia</h2>
        <p className="mb-6 text-gray-200">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="button-common-style"
          >
            {onlyConfirm ? 'Vale' : 'Sí'}
          </button>
          {!onlyConfirm && (
            <button
              onClick={onCancel}
              className="button-muted-style"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Estilos comunes para los botones */}
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

        .button-muted-style {
          width: 120px;
          height: 32px;
          font-size: 0.75rem;
          padding: 0.25rem;
          background-color: #64748b;
          color: white;
          border-radius: 9999px;
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
