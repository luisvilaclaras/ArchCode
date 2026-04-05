// src/components/TooltipIcon.jsx

'use client';

import React, { useRef, useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/solid'; // Asegúrate de tener la ruta correcta
import Tooltip from '@/components/Tooltip/Tooltip';

const TooltipIcon = ({ message }) => {
  const iconRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <InformationCircleIcon
        ref={iconRef}
        className="h-5 w-5 cursor-pointer"
      />
      {showTooltip && iconRef.current && (
        <Tooltip
          message={message}
          targetNode={iconRef.current}
        />
      )}
    </div>
  );
};

export default TooltipIcon;
