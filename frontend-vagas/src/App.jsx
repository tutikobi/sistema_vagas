import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import CompanyPortal from './components/CompanyPortal';
import CandidatePortal from './components/CandidatePortal';

export default function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('loggedUser');
        setUser(null);
    };

    if (!user) {
        return <Auth onAuthSuccess={(userData) => setUser(userData)} />;
    }

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
            <nav style={{ backgroundColor: '#1e293b', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {user.is_company ? '🏢 Painel Corporativo (RH)' : '👤 Portal do Candidato'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>{user.email}</span>
                    <button 
                        onClick={handleLogout}
                        style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Sair
                    </button>
                </div>
            </nav>
            <main style={{ padding: '30px' }}>
                {user.is_company ? <CompanyPortal user={user} /> : <CandidatePortal user={user} />}
            </main>
        </div>
    );
}