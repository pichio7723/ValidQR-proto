// web/src/pages/dashboard/DashboardRouter.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext.jsx';
import AdminDashboard from './AdminDashboard';
import InstructorDashboard from './InstructorDashboard';
//import AprendizDashboard from './AprendizDashboard';

export default function DashboardRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Normalizar el rol (puede venir en mayúsculas o minúsculas)
  const rol = user.rol?.toLowerCase();

  switch (rol) {
    case 'admin':
      return <AdminDashboard user={user} />;
    case 'instructor':
      return <InstructorDashboard user={user} />;
    case 'aprendiz':
      return <AprendizDashboard user={user} />;
    default:
      console.warn(`Rol no reconocido: ${rol}`);
      return <Navigate to="/login" />;
  }
}