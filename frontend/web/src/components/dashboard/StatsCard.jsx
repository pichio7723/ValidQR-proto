// web/src/components/dashboard/StatsCard.jsx
export default function StatsCard({ icon, value, label, gradient = 'gradient-timber' }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${gradient}`}>{icon}</div>
      <div className="stat-info">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}