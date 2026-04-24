import React from 'react';
import clsx from 'clsx';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className,
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-fla-primary text-black hover:bg-fla-primaryDark disabled:opacity-50 disabled:cursor-not-allowed focus:ring-fla-primary',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-red-600',
    ghost: 'text-fla-secondary hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-fla-secondary'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Cargando...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
