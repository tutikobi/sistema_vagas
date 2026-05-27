import React, { useEffect, useState } from 'react';
import axios from 'axios'

export default function CandidatePortal({ user }) {
    const [jobs, setJobs] = useState([]);
    const [myApplications, setMyApplications] = useState([]);
    const [feedback, setFeedback] = useState('');

    const fetchPortalData = () => {
        axios.get('http://localhost:8000/api/jobs/').then(res => setJobs(res.data));
        axios.get('http://localhost:8000/api/applications/').then(res => {
            const filtered = res.data.filter(app => app.candidate.id === user.candidate_profile_id || app.candidate === user.candidate_profile_id);
            setMyApplications(filtered.map(app => app.job));
        });
    };

    useEffect(() => {
        fetchPortalData();
    }, [user]);

    const handleApply = async (jobId) => {
        try {
            await axios.post('http://localhost:8000/api/applications/', {
                job: jobId,
                candidate: user.candidate_profile_id
            });
            setFeedback('Sua candidatura foi registrada com sucesso! 🚀');
            fetchPortalData();
        } catch (err) {
            setFeedback('Você já está inscrito nesta oportunidade.');
        }
        setTimeout(() => setFeedback(''), 4000);
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {feedback && <div style={{ padding: '12px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '6px', marginBottom: '20px', fontWeight: 'bold' }}>{feedback}</div>}
            
            <h2 style={{ color: '#1e293b', marginBottom: '20px' }}>Mural de Oportunidades</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {jobs.map(job => {
                    const isApplied = myApplications.includes(job.id);
                    return (
                        <div key={job.id} style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ margin: '0 0 10px 0', color: '#1e40af' }}>{job.title}</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '15px' }}>
                                💰 Faixa Salarial: {job.salary_range} | 🎓 Requisito Mínimo: {job.min_education}
                            </p>
                            <p style={{ color: '#334155', lineHeight: '1.6' }}>{job.requirements}</p>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #f1f5f9' }}>
                                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>👥 {job.candidates_count} candidato(s) no processo</span>
                                <button
                                    onClick={() => handleApply(job.id)}
                                    disabled={isApplied}
                                    style={{ backgroundColor: isApplied ? '#94a3b8' : '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', cursor: isApplied ? 'not-allowed' : 'pointer' }}
                                >
                                    {isApplied ? 'Já Candidatado' : 'Quero esta Vaga'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}