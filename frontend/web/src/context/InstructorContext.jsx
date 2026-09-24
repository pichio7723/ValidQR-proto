import { createContext, useContext, useState, useEffect } from 'react';

const InstructorContext = createContext();

export function InstructorProvider({ children }) {
  // Estado para el QR activo (persiste entre navegaciones)
  const [activeQR, setActiveQR] = useState(null);
  
  // Estado "trigger" para forzar la recarga de asistencias
  const [refreshKey, setRefreshKey] = useState(0);

  // Función para avisar a VerAsistencia que debe recargar los datos
  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  // Efecto global para manejar la expiración del QR (incluso si cambias de pestaña)
  useEffect(() => {
    if (!activeQR) return;

    const interval = setInterval(() => {
      const expiracion = new Date(activeQR.expiracion).getTime();
      const remaining = Math.floor((expiracion - Date.now()) / 1000);
      
      if (remaining <= 0) {
        setActiveQR(null); // El QR expiró, lo limpiamos globalmente
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeQR]);

  return (
    <InstructorContext.Provider value={{ activeQR, setActiveQR, refreshKey, triggerRefresh }}>
      {children}
    </InstructorContext.Provider>
  );
}

export const useInstructor = () => useContext(InstructorContext);