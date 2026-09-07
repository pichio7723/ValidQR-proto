// web/src/pages/dashboard/InstructorDashboard.jsx
import { useState } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import QRGenerator from '../../components/instructor/QRGenerator';
import QRList from '../../components/instructor/QRList';
import VerAsistencia from './VerAsistencia';
import MisFichas from './MisFichas';
import '../../styles/pages/dashboard/dashboard.css';
import '../../styles/pages/dashboard/instructor.css';

export default function InstructorDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'generar-qr', label: 'Generar QR', icon: '📱' },
    { id: 'mis-qr', label: 'Mis Códigos QR', icon: '🔢' },
    { id: 'mis-fichas', label: 'Mis Fichas', icon: '📋' },
    { id: 'asistencia', label: 'Ver Asistencia', icon: '✅' },
    { id: 'mis-horarios', label: 'Mis Horarios', icon: '🕒' },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar user={user} menuItems={menuItems} activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">
        <Header user={user} />

        <div className="content-area">
          <div className="content-header">
            <h1 className="page-title">Panel de Instructor</h1>
            <p className="page-subtitle">
              Bienvenido, {user.nombre} — Gestiona tus fichas y genera códigos QR
            </p>
          </div>

          {/* ✅ Cada sección siempre está montada, solo se oculta/visualiza con CSS */}
          
          <div style={{ display: activeTab === 'dashboard' ? 'block' : 'none' }}>
            <DashboardHome user={user} />
          </div>

          <div style={{ display: activeTab === 'generar-qr' ? 'block' : 'none' }}>
            <QRGenerator user={user} />
          </div>

          <div style={{ display: activeTab === 'mis-qr' ? 'block' : 'none' }}>
            <QRList user={user} />
          </div>

          <div style={{ display: activeTab === 'mis-fichas' ? 'block' : 'none' }}>
            <MisFichas user={user} />
          </div>

          <div style={{ display: activeTab === 'asistencia' ? 'block' : 'none' }}>
            <VerAsistencia user={user} />
          </div>

          <div style={{ display: activeTab === 'mis-horarios' ? 'block' : 'none' }}>
            <PlaceholderSection title="Mis Horarios" description="Tus horarios de clase" user={user} />
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardHome({ user }) {
  return (
    <div className="instructor-welcome">
      <div className="welcome-card">
        <h2>Hola, {user.nombre}</h2>
        <p>Genera códigos QR para que tus aprendices registren asistencia.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon gradient-magenta">📱</div>
          <div className="stat-info">
            <div className="stat-value">—</div>
            <div className="stat-label">QR Activos</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon gradient-cyan">📋</div>
          <div className="stat-info">
            <div className="stat-value">—</div>
            <div className="stat-label">Fichas Asignadas</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon gradient-timber">✅</div>
          <div className="stat-info">
            <div className="stat-value">—</div>
            <div className="stat-label">Asistencias Hoy</div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Acciones Rápidas</h3>
        <div className="quick-actions-grid">
          <div className="quick-action-card">
            <span className="quick-action-icon">📱</span>
            <span className="quick-action-label">Generar QR</span>
          </div>
          <div className="quick-action-card">
            <span className="quick-action-icon">📋</span>
            <span className="quick-action-label">Ver Fichas</span>
          </div>
          <div className="quick-action-card">
            <span className="quick-action-icon">✅</span>
            <span className="quick-action-label">Asistencia</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderSection({ title, description, user }) {
  return (
    <div className="placeholder-section">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}