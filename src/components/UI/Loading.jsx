import React from 'react';

export const Loading = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-fla-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    </div>
  );
};

export const SkeletonCard = ({ className }) => {
  return (
    <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} />
  );
};

export const SkeletonLine = ({ className }) => {
  return (
    <div className={`h-4 bg-gray-200 rounded animate-pulse ${className}`} />
  );
};

export default Loading;
