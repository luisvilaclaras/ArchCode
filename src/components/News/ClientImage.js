'use client';

import React, { useState } from 'react';

export default function ClientImage({ src, alt, className }) {
  const [imageSrc, setImageSrc] = useState(src);

  const handleError = () => {
    setImageSrc('/images/news/default.webp'); // Imagen por defecto
  };

  return <img src={imageSrc} alt={alt} className={className} onError={handleError} />;
}
