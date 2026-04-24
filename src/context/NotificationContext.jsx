import React, { createContext, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const notify = {
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
    loading: (message) => toast.loading(message),
    promise: (promise, messages) => toast.promise(promise, messages),
    custom: (component) => toast.custom(component),
    dismiss: (toastId) => toast.dismiss(toastId)
  };

  return (
    <NotificationContext.Provider value={notify}>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1a1a1a',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#2ecc71',
              secondary: '#fff'
            }
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#e74c3c',
              secondary: '#fff'
            }
          }
        }}
      />
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe ser usado dentro de NotificationProvider');
  }
  return context;
};

export default NotificationContext;
