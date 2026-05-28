import React, { useState } from 'react';
import axios from 'axios';

export default function Auth({ onAuthSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [isCompany, setIsCompany] = useState(false);
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    
    // Campos do Candidato
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
                setMessage('E-mail ou senha incorretos.');
            }
        } else {
            try {
                const userRes = await axios.post('http://localhost:8000/api/users/', {
                    email, password, name, cpf, is_company: isCompany
                });
                
                if (!isCompany) {
                    await axios.post('http://localhost:8000/api/candidateprofiles/', {
                        user: userRes.data.id,
                        desired_salary: parseFloat(desiredSalary),
                        experience,
                        education
                    });
                }
                setMessage('Conta criada com sucesso! Você já pode fazer login.');
                setIsLogin(true);
            } catch (err) {
                
                const erroReal = err.response?.data ? JSON.stringify(err.response.data) : 'Erro de conexão com o servidor.';
                setMessage(`Erro do Backend: ${erroReal}`);
            }
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
            <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '500px' }}>
                <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '30px' }}>Portal de Vagas</h2>
                
                <div style={{ display: 'flex', marginBottom: '25px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e0e6ed' }}>
                    <button onClick={() => setIsLogin(true)} style={{ flex: 1, padding: '12px', border: 'none', backgroundColor: isLogin ? '#3498db' : '#f8f9fa', color: isLogin ? 'white' : '#7f8c8d', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>Entrar</button>
                    <button onClick={() => setIsLogin(false)} style={{ flex: 1, padding: '12px', border: 'none', backgroundColor: !isLogin ? '#3498db' : '#f8f9fa', color: !isLogin ? 'white' : '#7f8c8d', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>Cadastrar-se</button>
                </div>

                {message && <div style={{ padding: '12px', backgroundColor: message.includes('sucesso') ? '#d4edda' : '#f8d7da', color: message.includes('sucesso') ? '#155724' : '#721c24', borderRadius: '6px', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>{message}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    {!isLogin && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '10px' }}>
                            <label style={{ cursor: 'pointer', fontWeight: 'bold', color: !isCompany ? '#2980b9' : '#95a5a6' }}>
                                <input type="radio" checked={!isCompany} onChange={() => setIsCompany(false)} style={{ marginRight: '5px' }}/> Sou Candidato
                            </label>
                            <label style={{ cursor: 'pointer', fontWeight: 'bold', color: isCompany ? '#2980b9' : '#95a5a6' }}>
                                <input type="radio" checked={isCompany} onChange={() => setIsCompany(true)} style={{ marginRight: '5px' }}/> Sou Empresa
                            </label>
                        </div>
                    )}

                    {!isLogin && <input type="text" placeholder={isCompany ? "Nome da Empresa" : "Nome Completo"} value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />}
                    {!isLogin && <input type="text" placeholder={isCompany ? "CNPJ" : "CPF"} value={cpf} onChange={(e) => setCpf(e.target.value)} required style={inputStyle} />}
                    
                    <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
                    <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />

                    {!isLogin && !isCompany && (
                        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #e9ecef', marginTop: '10px' }}>
                            <h4 style={{ margin: '0 0 15px 0', color: '#34495e' }}>Perfil Profissional</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <input type="number" placeholder="Pretensão Salarial (R$)" value={desiredSalary} onChange={(e) => setDesiredSalary(e.target.value)} required style={inputStyle} />
                                <select value={education} onChange={(e) => setEducation(e.target.value)} style={inputStyle}>
                                    <option value="fundamental">Ensino Fundamental</option>
                                    <option value="medio">Ensino Médio</option>
                                    <option value="tecnologo">Tecnólogo</option>
                                    <option value="superior">Ensino Superior</option>
                                    <option value="pos_mba_mestrado">Pós / MBA / Mestrado</option>
                                    <option value="doutorado">Doutorado</option>
                                </select>
                                <textarea placeholder="Resumo das suas Experiências" value={experience} onChange={(e) => setExperience(e.target.value)} required style={{...inputStyle, height: '80px', resize: 'none'}} />
                            </div>
                        </div>
                    )}

                    <button type="submit" style={{ backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '10px', boxShadow: '0 4px 6px rgba(46, 204, 113, 0.2)' }}>
                        {isLogin ? 'Entrar na Plataforma' : 'Criar Minha Conta'}
                    </button>
                </form>
            </div>
        </div>
    );
}

const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '15px', outline: 'none' };