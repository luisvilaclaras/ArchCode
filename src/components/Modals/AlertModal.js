import React from 'react';

export default function AlertModal({ message, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-6 rounded-lg z-10">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="button-common-style"
          >
            Vale
          </button>
        </div>
      </div>
      {/* Estilos comunes para los botones */}
      <style jsx>{`
        .button-common-style {
          width: 80px;
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
