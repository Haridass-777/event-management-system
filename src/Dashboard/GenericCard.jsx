import React from 'react';

function GenericCard({ children, className = '', onClick, ...props }) {
  return (
    <div
      className={`generic-card ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export default GenericCard;
