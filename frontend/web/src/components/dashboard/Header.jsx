// web/src/components/dashboard/Header.jsx
import { useState } from 'react';
import '../../styles/components/header.css';

export default function Header({ user }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="top-header">
      
      <div className="header-actions">
        <button className="header-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>
      </div>
    </header>
  );
}