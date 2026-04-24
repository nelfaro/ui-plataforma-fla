import React from 'react';
import clsx from 'clsx';

export const Input = React.forwardRef(({
  label,
  error,
  type = 'text',
  className,
  disabled = false,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={clsx(
          'w-full px-4 py-2 border rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-fla-primary focus:border-transparent',
          'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
          error ? 'border-red-500' : 'border-gray-300',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
