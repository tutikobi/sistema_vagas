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
    
    // Estado para saber se estamos criando ou editando uma vaga
    const [editingJobId, setEditingJobId] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/api/jobs/').then(res => {
            const filteredJobs = res.data.filter(job => job.company === user.id);
            setMyJobs(filteredJobs);
        });
        
        axios.get('http://localhost:8000/api/applications/').then(res => {
            const filteredApps = res.data.filter(app => app.job_company_id === user.id);
            setApplications(filteredApps);
        });
    }, [user.id, refresh]);

    const handleSubmitJob = async (e) => {
        e.preventDefault();
        const payload = { company: user.id, title, salary_range: salaryRange, min_education: minEducation, requirements };
        
        try {
            if (editingJobId) {
                // Se estiver editando, faz um PUT (Atualizar)
                await axios.put(`http://localhost:8000/api/jobs/${editingJobId}/`, payload);
                alert('Vaga atualizada com sucesso! ✏️');
            } else {
                // Se não, faz um POST (Criar Nova)
                await axios.post('http://localhost:8000/api/jobs/', payload);
                alert('Vaga publicada com sucesso! 🏢');
            }
            
            // Limpa o formulário
            setTitle(''); setRequirements(''); setEditingJobId(null);
            setRefresh(prev => prev + 1);
        } catch (err) { 
            alert('Erro ao salvar vaga.'); 
        }
    };

    const handleDeleteJob = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir esta vaga permanentemente?")) {
            try {
                await axios.delete(`http://localhost:8000/api/jobs/${id}/`);
                alert('Vaga excluída com sucesso! 🗑️');
                setRefresh(prev => prev + 1);
            } catch (err) {
                alert('Erro ao excluir a vaga.');
            }
        }
    };

    const handleEditClick = (job) => {
        // Preenche o formulário lá em cima com os dados da vaga clicada
        setTitle(job.title);
        setSalaryRange(job.salary_range);
        setMinEducation(job.min_education);
        setRequirements(job.requirements);
        setEditingJobId(job.id);
        window.scrollTo(0, 0); // Rola a tela para o topo
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
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

            <div style={{ backgroundColor: editingJobId ? '#fff8e1' : 'white', padding: '25px', borderRadius: '8px', border: editingJobId ? '2px solid #f1c40f' : '1px solid #e2e8f0', transition: '0.3s' }}>
                <h2 style={{ marginTop: 0, color: editingJobId ? '#d35400' : '#2c3e50' }}>
                    {editingJobId ? '✏️ Modo de Edição de Vaga' : 'Publicar Nova Vaga'}
                </h2>
                <form onSubmit={handleSubmitJob} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <input type="text" placeholder="Título da Vaga" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />
                    <select value={salaryRange} onChange={e => setSalaryRange(e.target.value)} style={inputStyle}>
                        <option value="ate_1000">Até R$ 1.000</option>
                        <option value="1000_2000">R$ 1.000 a R$ 2.000</option>
                        <option value="2000_3000">R$ 2.000 a R$ 3.000</option>
                        <option value="acima_3000">Acima de R$ 3.000</option>
                    </select>
                    <select value={minEducation} onChange={e => setMinEducation(e.target.value)} style={inputStyle}>
                        <option value="fundamental">Ensino Fundamental</option>
                        <option value="medio">Ensino Médio</option>
                        <option value="tecnologo">Tecnólogo</option>
                        <option value="superior">Ensino Superior</option>
                        <option value="pos_mba_mestrado">Pós / MBA / Mestrado</option>
                        <option value="doutorado">Doutorado</option>
                    </select>
                    <textarea placeholder="Requisitos da vaga" value={requirements} onChange={e => setRequirements(e.target.value)} required style={{...inputStyle, height: '80px', resize:'none'}} />
                    
                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
                        <button type="submit" style={{ flex: 1, backgroundColor: editingJobId ? '#e67e22' : '#34495e', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                            {editingJobId ? 'Salvar Alterações' : 'Publicar Vaga'}
                        </button>
                        {editingJobId && (
                            <button type="button" onClick={() => { setEditingJobId(null); setTitle(''); setRequirements(''); }} style={{ padding: '12px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                                Cancelar Edição
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h2 style={{ marginTop: 0 }}>Análise de Candidatos (Suas Vagas)</h2>
                {myJobs.map(job => {
                    const jobApps = applications.filter(app => app.job === job.id);
                    return (
                        <div key={job.id} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '6px' }}>
                            
                            {/* Cabeçalho da Vaga com Botões de Ação */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                                <h3 style={{ color: '#2980b9', margin: 0 }}>
                                    {job.title} <span style={{fontSize: '0.8rem', color: '#7f8c8d'}}>({jobApps.length} inscritos)</span>
                                </h3>
                                <div>
                                    <button onClick={() => handleEditClick(job)} style={{ padding: '5px 10px', backgroundColor: '#f1c40f', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginRight: '10px' }}>Editar</button>
                                    <button onClick={() => handleDeleteJob(job.id)} style={{ padding: '5px 10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Excluir</button>
                                </div>
                            </div>
                            
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