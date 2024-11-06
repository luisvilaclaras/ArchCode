import React, { useState, useRef, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import DOMPurify from 'dompurify';

const processText = (text) => {
  let boldText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  boldText = boldText.replace(/:\s*/g, ':\n');
  boldText = boldText.replace(/(<strong>.*?<\/strong>)/g, '\n$1\n');
  return boldText;
};

export const UserMessage = ({ text }) => {
  const textRef = useRef(null);
  const [isSingleLine, setIsSingleLine] = useState(true);

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(window.getComputedStyle(textRef.current).lineHeight, 10);
      const lines = Math.round(textRef.current.scrollHeight / lineHeight);
      setIsSingleLine(lines === 1);
    }
  }, [text]);

  return (
    <div className="flex justify-center mb-1 mt-4 w-full">
      <div className="flex items-start bg-[#f3f4f6] py-2 px-4 rounded-lg shadow-sm max-w-2xl w-full ml-8">
        <div className="flex justify-between items-center w-full">
          <div
            ref={textRef}
            className="text-[#333333] flex-1 mr-4"
            style={{
              wordBreak: 'break-word',
              whiteSpace: 'pre-line',
              textAlign: isSingleLine ? 'right' : 'left',
            }}
          >
            <span
              className="text-base"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(processText(text)) }}
            ></span>
          </div>
          <FaUserCircle className="text-xl text-gray-500" aria-label="Usuario" />
        </div>
      </div>
    </div>
  );
};
