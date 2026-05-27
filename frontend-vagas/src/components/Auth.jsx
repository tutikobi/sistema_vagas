import React, { useState } from 'react';
import axios from 'axios';

export default function Auth({ onAuthSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isCompany, setIsCompany] = useState(false);
    
    const [desiredSalary, setDesiredSalary] = useState('');
    const [experience, setExperience] = useState('');
    const [education, setEducation] = useState('superior');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (isLogin) {
            try {
                const response = await axios.post('http://localhost:8000/api/login/', { email, password });
                localStorage.setItem('loggedUser', JSON.stringify(response.data));
                onAuthSuccess(response.data);
            } catch (err) {
                setMessage(err.response?.data?.error || 'Falha na autenticação.');
            }
        } else {
            try {
                const userRes = await axios.post('http://localhost:8000/api/users/', {
                    email, password, is_company: isCompany
                });
                
                if (!isCompany) {
                    await axios.post('http://localhost:8000/api/candidateprofiles/', {
                        user: userRes.data.id,
                        desired_salary: parseFloat(desiredSalary),
                        experience,
                        education
                    });
                }
                
                setMessage('Conta criada com sucesso! Faça login.');
                setIsLogin(true);
            } catch (err) {
                setMessage('Erro ao registrar conta. Verifique os dados.');
            }
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
            <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', width: '100%', maxWidth: '450px' }}>
                <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '2px solid #e2e8f0' }}>
                    <button onClick={() => setIsLogin(true)} style={{ flex: 1, padding: '10px', border: 'none', background: 'none', fontWeight: 'bold', color: isLogin ? '#3b82f6' : '#64748b', borderBottom: isLogin ? '2px solid #3b82f6' : 'none', cursor: 'pointer' }}>Login</button>
                    <button onClick={() => setIsLogin(false)} style={{ flex: 1, padding: '10px', border: 'none', background: 'none', fontWeight: 'bold', color: !isLogin ? '#3b82f6' : '#64748b', borderBottom: !isLogin ? '2px solid #3b82f6' : 'none', cursor: 'pointer' }}>Cadastrar-se</button>
                </div>

                {message && <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px', marginBottom: '20px', fontWeight: '500', fontSize: '0.9rem' }}>{message}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                    <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />

                    {!isLogin && (
                        <>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem' }}>
                                <input type="checkbox" checked={isCompany} onChange={(e) => setIsCompany(e.target.checked)} />
                                Perfil corporativo (Empresa)
                            </label>

                            {!isCompany && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px', paddingLeft: '5px', borderLeft: '3px solid #3b82f6' }}>
                                    <input type="number" placeholder="Pretensão Salarial (R$)" value={desiredSalary} onChange={(e) => setDesiredSalary(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                                    <textarea placeholder="Resumo de Experiências Profissionais" value={experience} onChange={(e) => setExperience(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', height: '80px', resize: 'none' }} />
                                    <select value={education} onChange={(e) => setEducation(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                                        <option value="fundamental">Fundamental</option>
                                        <option value="medio">Médio</option>
                                        <option value="tecnologo">Tecnólogo</option>
                                        <option value="superior">Superior</option>
                                        <option value="pos_mba_mestrado">Pós / MBA / Mestrado</option>
                                        <option value="doutorado">Doutorado</option>
                                    </select>
                                </div>
                            )}
                        </>
                    )}

                    <button type="submit" style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                        {isLogin ? 'Entrar' : 'Registrar Conta'}
                    </button>
                </form>
            </div>
        </div>
    );
}