import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={inputId}
          className={`block w-full rounded-lg bg-slate-900/90 border ${
            error ? 'border-loss focus:ring-loss focus:border-loss' : 'border-slate-800 focus:ring-brand-500 focus:border-brand-500'
          } ${Icon ? 'pl-9' : 'pl-3.5'} pr-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-loss">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};
