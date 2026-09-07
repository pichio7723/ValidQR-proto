// web/src/pages/dashboard/AdminDashboard.jsx
import { useState } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import SedeForm from '../../components/admin/forms/SedeForm';
import SalonForm from '../../components/admin/forms/SalonForm';
import FranjaForm from '../../components/admin/forms/FranjaForm';
import TrimestreForm from '../../components/admin/forms/TrimestreForm';
import FichaForm from '../../components/admin/forms/FichaForm';
import HorarioForm from '../../components/admin/forms/HorarioForm';
import '../../styles/pages/dashboard/dashboard.css';
import '../../styles/pages/dashboard/admin.css';

export default function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showForm, setShowForm] = useState(null);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '' },
    { id: 'sedes', label: 'Sedes', icon: '' },
    { id: 'salones', label: 'Salones', icon: '' },
    { id: 'franjas', label: 'Franjas Horarias', icon: '' },
    { id: 'trimestres', label: 'Trimestres', icon: '' },
    { id: 'fichas', label: 'Fichas', icon: '' },
    { id: 'horarios', label: 'Horarios', icon: '' },
  ];

  const handleFormSuccess = () => {
    setShowForm(null);
    // Aquí recargarías la lista
  };

  const renderContent = () => {
    if (showForm) {
      return (
        <div className="form-modal">
          <div className="form-container">
            <h2>{getFormTitle(showForm)}</h2>
            {showForm === 'sedes' && <SedeForm onSuccess={handleFormSuccess} onCancel={() => setShowForm(null)} />}
            {showForm === 'salones' && <SalonForm onSuccess={handleFormSuccess} onCancel={() => setShowForm(null)} />}
            {showForm === 'franjas' && <FranjaForm onSuccess={handleFormSuccess} onCancel={() => setShowForm(null)} />}
            {showForm === 'trimestres' && <TrimestreForm onSuccess={handleFormSuccess} onCancel={() => setShowForm(null)} />}
            {showForm === 'fichas' && <FichaForm onSuccess={handleFormSuccess} onCancel={() => setShowForm(null)} />}
            {showForm === 'horarios' && <HorarioForm onSuccess={handleFormSuccess} onCancel={() => setShowForm(null)} />}
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'sedes':
        return <SectionContent title="Sedes" onAdd={() => setShowForm('sedes')} />;
      case 'salones':
        return <SectionContent title="Salones" onAdd={() => setShowForm('salones')} />;
      case 'franjas':
        return <SectionContent title="Franjas Horarias" onAdd={() => setShowForm('franjas')} />;
      case 'trimestres':
        return <SectionContent title="Trimestres" onAdd={() => setShowForm('trimestres')} />;
      case 'fichas':
        return <SectionContent title="Fichas" onAdd={() => setShowForm('fichas')} />;
      case 'horarios':
        return <SectionContent title="Horarios" onAdd={() => setShowForm('horarios')} />;
      default:
        return <DashboardContent />;
    }
  };

  const getFormTitle = (form) => {
    const titles = {
      sedes: 'Crear Nueva Sede',
      salones: 'Crear Nuevo Salón',
      franjas: 'Crear Nueva Franja Horaria',
      trimestres: 'Crear Nuevo Trimestre',
      fichas: 'Crear Nueva Ficha',
      horarios: 'Crear Nuevo Horario',
    };
    return titles[form] || 'Crear';
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
        user={user} 
        menuItems={menuItems} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <main className="main-content">
        <Header user={user} />
        
        <div className="content-area">
          <div className="content-header">
            <h1 className="page-title">Panel de Administrador</h1>
            <p className="page-subtitle">Gestión completa del sistema ValidQR</p>
          </div>

          {renderContent()}
        </div>
      </main>
    </div>
  );
}

// Componente de contenido del Dashboard
function DashboardContent() {
  return (
    <div className="admin-welcome">
      <h2>Bienvenido, Administrador</h2>
      <p>Tienes control total sobre el sistema. Selecciona una opción del menú para comenzar.</p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon gradient-magenta">🏢</div>
          <div className="stat-info">
            <div className="stat-value">0</div>
            <div className="stat-label">Sedes</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon gradient-cyan">🏫</div>
          <div className="stat-info">
            <div className="stat-value">0</div>
            <div className="stat-label">Salones</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon gradient-timber">📋</div>
          <div className="stat-info">
            <div className="stat-value">0</div>
            <div className="stat-label">Fichas</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de sección genérico
function SectionContent({ title, onAdd }) {
  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>{title}</h2>
        <button className="btn-primary" onClick={onAdd}>
          + Crear {title.slice(0, -1)}
        </button>
      </div>
      <p>Aquí se mostrará la lista de {title.toLowerCase()}. (Implementar tabla próximamente)</p>
    </div>
  );
}