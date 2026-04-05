// src/components/Tooltip.jsx

'use client';

import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';

const Tooltip = ({ message, targetNode }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef(null);

  useEffect(() => {
    const handlePosition = () => {
      if (targetNode && tooltipRef.current) {
        const targetRect = targetNode.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();

        let top = targetRect.top - tooltipRect.height - 8; // 8px de margen
        let left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);

        // Ajustar para evitar que el tooltip salga de la ventana
        if (top < 0) {
          top = targetRect.bottom + 8; // Mostrar debajo si no hay espacio arriba
        }
        if (left < 8) {
          left = 8; // Evitar que salga por la izquierda
        } else if (left + tooltipRect.width > window.innerWidth - 8) {
          left = window.innerWidth - tooltipRect.width - 8; // Evitar que salga por la derecha
        }

        setPosition({
          top: top + window.scrollY,
          left: left + window.scrollX,
        });
      }
    };

    handlePosition();
    window.addEventListener('resize', handlePosition);
    window.addEventListener('scroll', handlePosition);

    return () => {
      window.removeEventListener('resize', handlePosition);
      window.removeEventListener('scroll', handlePosition);
    };
  }, [targetNode, message]);

  if (!targetNode) return null;

  return ReactDOM.createPortal(
    <div
      ref={tooltipRef}
      className="absolute bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-50 shadow-lg"
      style={{ top: position.top, left: position.left }}
    >
      {message}
      {/* Flecha del tooltip */}
      <svg
        className="absolute w-2 h-2 text-gray-800"
        style={{
          top: position.top < targetNode.getBoundingClientRect().top
            ? '100%'
            : '-8px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 8 8"
      >
        <path fill="currentColor" d="M0 0 L4 4 L8 0 Z" />
      </svg>
    </div>,
    document.body
  );
};

export default Tooltip;
