/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        fla: {
          primary: '#FFEB00',      // Amarillo neón
          dark: '#FF1493',         // Magenta/Rosa
          light: '#FFE135',        // Amarillo más claro
          bg: '#FFFFFF',
          text: '#1a1a1a',
          border: '#f0f0f0',
          gold: '#D4AF37'          // Gold alternativo
        },
        status: {
          registrado: '#d4edda',
          pendiente: '#fff3cd',
          calificado: '#cce5ff',
          frio: '#e2e3e5'
        }
      },
      fontFamily: {
        sans: ['Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif']
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      },
      borderRadius: {
        xs: '0.25rem',
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        full: '9999px'
      }
    }
  },
  plugins: []
}
