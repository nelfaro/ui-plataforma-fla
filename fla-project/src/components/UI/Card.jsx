import React from 'react';
import clsx from 'clsx';

export const Card = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  const variants = {
    default: 'bg-white border border-gray-200 rounded-lg shadow-sm',
    elevated: 'bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow',
    bordered: 'bg-white border-2 border-fla-primary rounded-lg'
  };

  return (
    <div
      className={clsx(
        'p-6',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
