import React, { useState } from 'react';
import Dashboard from './Dashboard';
import axios from 'axios';

export default function CompanyPortal({ user }) {
    const [title, setTitle] = useState('');
    const [salaryRange, setSalaryRange] = useState('2000_3000');
    const [minEducation, setMinEducation] = useState('superior');
    const [requirements, setRequirements] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleCreateJob = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/jobs/', {
                company: user.id,
                title,
                salary_range: salaryRange,
                min_education: minEducation,
                requirements
            });
            setTitle('');
            setRequirements('');
            setRefreshTrigger(prev => prev + 1); // Força a atualização do gráfico automaticamente
            alert('Nova vaga publicada com sucesso! 🏢');
        } catch (err) {
            alert('Erro ao publicar a vaga.');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
                <h2 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>Publicar Nova Oportunidade</h2>
                <form onSubmit={handleCreateJob} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input type="text" placeholder="Título da Vaga" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                        <select value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                            <option value="ate_1000">Até R$ 1.000</option>
                            <option value="1000_2000">R$ 1.000 a R$ 2.000</option>
                            <option value="2000_3000">R$ 2.000 a R$ 3.000</option>
                            <option value="acima_3000">Acima de R$ 3.000</option>
                        </select>
                        <select value={minEducation} onChange={(e) => setMinEducation(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                            <option value="fundamental">Fundamental</option>
                            <option value="medio">Médio</option>
                            <option value="tecnologo">Tecnólogo</option>
                            <option value="superior">Superior</option>
                            <option value="pos_mba_mestrado">Pós / MBA / Mestrado</option>
                            <option value="doutorado">Doutorado</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <textarea placeholder="Descrição dos Requisitos da Vaga" value={requirements} onChange={(e) => setRequirements(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', height: '105px', resize: 'none' }} />
                        <button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Divulgar Vaga</button>
                    </div>
                </form>
            </div>
            <Dashboard key={refreshTrigger} />
        </div>
    );
}