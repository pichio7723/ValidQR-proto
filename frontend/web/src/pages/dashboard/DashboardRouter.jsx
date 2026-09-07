import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext.jsx';
import AdminDashboard from './AdminDashboard';
import InstructorDashboard from './InstructorDashboard';
import AprendizDashboard from './AprendizDashboard';


export default function DashboardRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#09090b',
        color: 'white'
      }}>
        Cargando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const rol = user.rol?.toLowerCase();

  switch (rol) {
    case 'admin':
      return <AdminDashboard user={user} />;
    case 'instructor':
      return <InstructorDashboard user={user} />;
    case 'aprendiz':
      return <AprendizDashboard user={user} />;
    default:
      return <Navigate to="/login" />;
  }
}