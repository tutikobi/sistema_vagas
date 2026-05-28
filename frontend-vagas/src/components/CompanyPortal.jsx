import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';

export default function CompanyPortal({ user }) {
    const [title, setTitle] = useState('');
    const [salaryRange, setSalaryRange] = useState('2000_3000');
    const [minEducation, setMinEducation] = useState('superior');
    const [requirements, setRequirements] = useState('');
    
    const [myJobs, setMyJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        // Busca apenas as vagas desta empresa
        axios.get('http://localhost:8000/api/jobs/').then(res => {
            const filteredJobs = res.data.filter(job => job.company === user.id);
            setMyJobs(filteredJobs);
        });
        
        // Busca os candidatos que aplicaram nas vagas desta empresa
        axios.get('http://localhost:8000/api/applications/').then(res => {
            const filteredApps = res.data.filter(app => app.job_company_id === user.id);
            setApplications(filteredApps);
        });
    }, [user.id, refresh]);

    const handleCreateJob = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/jobs/', {
                company: user.id, title, salary_range: salaryRange, min_education: minEducation, requirements
            });
            setTitle(''); setRequirements('');
            setRefresh(prev => prev + 1);
            alert('Vaga publicada com sucesso!');
        } catch (err) { alert('Erro ao publicar vaga.'); }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Cards de Métrica */}
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1, backgroundColor: '#3498db', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '2rem' }}>{myJobs.length}</h3>
                    <p style={{ margin: '5px 0 0 0' }}>Vagas Abertas</p>
                </div>
                <div style={{ flex: 1, backgroundColor: '#2ecc71', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '2rem' }}>{applications.length}</h3>
                    <p style={{ margin: '5px 0 0 0' }}>Candidaturas Recebidas</p>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h2 style={{ marginTop: 0 }}>Publicar Nova Vaga</h2>
                <form onSubmit={handleCreateJob} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <input type="text" placeholder="Título da Vaga" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />
                    <select value={salaryRange} onChange={e => setSalaryRange(e.target.value)} style={inputStyle}>
                        <option value="ate_1000">Até R$ 1.000</option>
                        <option value="1000_2000">R$ 1.000 a R$ 2.000</option>
                        <option value="2000_3000">R$ 2.000 a R$ 3.000</option>
                        <option value="acima_3000">Acima de R$ 3.000</option>
                    </select>
                    <select value={minEducation} onChange={e => setMinEducation(e.target.value)} style={inputStyle}>
                        <option value="fundamental">Fundamental</option>
                        <option value="medio">Médio</option>
                        <option value="superior">Superior</option>
                    </select>
                    <textarea placeholder="Requisitos" value={requirements} onChange={e => setRequirements(e.target.value)} required style={{...inputStyle, height: '80px'}} />
                    <button type="submit" style={{ gridColumn: 'span 2', backgroundColor: '#34495e', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Publicar Vaga</button>
                </form>
            </div>

            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h2 style={{ marginTop: 0 }}>Análise de Candidatos (Suas Vagas)</h2>
                {myJobs.map(job => {
                    const jobApps = applications.filter(app => app.job === job.id);
                    return (
                        <div key={job.id} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '6px' }}>
                            <h3 style={{ color: '#2980b9', margin: '0 0 10px 0' }}>{job.title} <span style={{fontSize: '0.8rem', color: '#7f8c8d'}}>({jobApps.length} inscritos)</span></h3>
                            
                            {jobApps.length === 0 ? <p style={{color: '#95a5a6'}}>Nenhum candidato ainda.</p> : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                                            <th style={thStyle}>Nome</th>
                                            <th style={thStyle}>CPF</th>
                                            <th style={thStyle}>Match Score</th>
                                            <th style={thStyle}>Pretensão</th>
                                            <th style={thStyle}>Escolaridade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {jobApps.map(app => (
                                            <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={tdStyle}><strong>{app.candidate_details.name}</strong><br/><small>{app.candidate_details.email}</small></td>
                                                <td style={tdStyle}>{app.candidate_details.cpf}</td>
                                                <td style={tdStyle}>⭐ {app.score} pts</td>
                                                <td style={tdStyle}>R$ {app.candidate_details.desired_salary}</td>
                                                <td style={tdStyle}>{app.candidate_details.education}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )
                })}
            </div>
            
            <Dashboard key={refresh} />
        </div>
    );
}

const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ccc' };
const thStyle = { padding: '10px', borderBottom: '2px solid #ddd', color: '#2c3e50' };
const tdStyle = { padding: '10px', verticalAlign: 'top' };