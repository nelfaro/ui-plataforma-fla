import React from 'react';
import clsx from 'clsx';
import { getStateColor } from '../../config/colors';

export const Badge = ({
  children,
  state,
  variant = 'default',
  className,
  ...props
}) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';

  if (state && Object.keys(getStateColor(state)).length > 0) {
    const stateColor = getStateColor(state);
    bgColor = stateColor.bg === '#D4EDDA' ? 'bg-green-100' :
              stateColor.bg === '#FFF3CD' ? 'bg-yellow-100' :
              stateColor.bg === '#CCE5FF' ? 'bg-blue-100' :
              'bg-gray-100';
    textColor = stateColor.text === '#155724' ? 'text-green-800' :
               stateColor.text === '#856404' ? 'text-yellow-800' :
               stateColor.text === '#004085' ? 'text-blue-800' :
               'text-gray-800';
  }

  const baseStyles = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium';

  return (
    <span
      className={clsx(
        baseStyles,
        bgColor,
        textColor,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
