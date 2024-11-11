import React from 'react';

const TooltipButton = ({ tooltipText, children, className }) => {
  return (
    <div className="relative group">
      <button className={`relative ${className}`}>
        {children}
      </button>
      <div className="absolute top-full left-full transform -translate-x-1/2 z-50 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded py-1 px-2">
        {tooltipText}
      </div>
    </div>
  );
};

export default TooltipButton;