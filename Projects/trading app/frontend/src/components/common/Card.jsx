import React from 'react';

export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`glass-card rounded-2xl p-5 ${hover ? 'glass-card-hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    brand: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
    profit: 'bg-profit/10 text-profit border-profit/20',
    loss: 'bg-loss/10 text-loss border-loss/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variants[variant] || variants.default} ${sizes[size] || sizes.sm} ${className}`}
    >
      {children}
    </span>
  );
};

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <svg
        className={`animate-spin text-brand-500 ${sizes[size] || sizes.md}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
};

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
