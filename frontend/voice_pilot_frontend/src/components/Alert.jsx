import React from 'react';

const Alert = ({ type = 'info', message, onClose }) => {
  const colors = {
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
  };

  return (
    <div className={`rounded p-4 mb-4 ${colors[type] || colors.info} relative`}>
      <p>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-1 right-2 text-sm text-black"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
