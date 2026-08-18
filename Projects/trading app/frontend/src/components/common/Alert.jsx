import React from 'react';

export const Alert = ({ type = 'info', message, title, className = '' }) => {
  if (!message) return null;

  const styles = {
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
    success: 'bg-profit/10 border-profit/20 text-profit',
    error: 'bg-loss/10 border-loss/20 text-loss',
    warning: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
  };

  return (
    <div className={`p-4 rounded-xl border ${styles[type] || styles.info} ${className}`}>
      {title && <h5 className="font-semibold text-sm mb-1">{title}</h5>}
      <p className="text-xs leading-relaxed">{message}</p>
    </div>
  );
};

export default Alert;
