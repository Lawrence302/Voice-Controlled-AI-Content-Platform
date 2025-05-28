import React from "react";

const LoadingSpinner = ({ size = 'md', message }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4" role="status" aria-live="polite">
      <div
        className={`animate-spin rounded-full border-4 border-t-4 border-slate-200 border-t-sky-600 ${sizeClasses[size]}`}
        aria-label={message ? undefined : "Loading"}
      ></div>
      {message && <p className="mt-3 text-sm text-slate-600" aria-label="Loading message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
