// components/News/NewsItem.js

'uses client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function NewsItem({ slug, title, image, date }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/blog/${slug}`);
  };

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={handleClick}
    >
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2 text-[#1e3047]">{title}</h2>
        <p className="text-sm text-gray-600">{date}</p>
      </div>
    </div>
  );
}
