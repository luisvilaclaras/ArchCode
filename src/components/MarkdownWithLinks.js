// components/MarkdownWithLinks.js

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownWithLinks = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ node, ...props }) => (
          <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {props.children}
          </a>
        ),
        strong: ({ children }) => (
          <span className="font-bold text-black">{children}</span>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-bold text-black mt-6 mb-4">{children}</h2>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-6 mb-4">{children}</ol>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-6 mb-4">{children}</ul>
        ),
        li: ({ children }) => (
          <li className="mb-2">{children}</li>
        ),
      }}
    >
      {content || 'Contenido no disponible.'}
    </ReactMarkdown>
  );
};

export default MarkdownWithLinks;
