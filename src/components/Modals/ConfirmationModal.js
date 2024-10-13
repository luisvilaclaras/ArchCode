import React from 'react';

export default function ConfirmationModal({ message, onConfirm }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Confirmación</h2>
        <p className="mb-6 text-gray-600">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => onConfirm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sí
          </button>
          <button
            onClick={() => onConfirm(false)}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
